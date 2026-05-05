from fastapi import FastAPI, Query, HTTPException
import pandas as pd
import psycopg2
from psycopg2 import OperationalError
import json
from fastapi.middleware.cors import CORSMiddleware
from collections import Counter
from datetime import datetime, timedelta
import pytz
import torch
import torch.nn.functional as F
import os
import random
from dotenv import load_dotenv
from upstash_redis import Redis

load_dotenv()

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB CONNECTION (Supabase - Render safe)
conn = None
cursor = None

try:
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        port=os.getenv("DB_PORT"),
        sslmode="require",
        connect_timeout=5
    )
    cursor = conn.cursor()
    print("DB connected")

except Exception as e:
    print("DB not connected:", str(e))
    conn = None
    cursor = None


# REDIS (Upstash REST - recommended)

redis_client = None

try:
    redis_client = Redis(
        url=os.getenv("UPSTASH_REDIS_REST_URL"),
        token=os.getenv("UPSTASH_REDIS_REST_TOKEN")
    )
    print("Upstash Redis connected")

except Exception as e:
    print("Redis not connected:", str(e))
    redis_client = None


# BASE PATH
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


# LOAD DATA
movies_path = os.path.join(BASE_DIR, "data", "movies.csv")
movies_df = pd.read_csv(movies_path)

movie_dict = movies_df.to_dict(orient="index")


# LOAD EMBEDDINGS
user_emb_path = os.path.join(BASE_DIR, "embeddings", "user.pt")
item_emb_path = os.path.join(BASE_DIR, "embeddings", "item.pt")

user_emb = torch.load(user_emb_path, map_location=torch.device("cpu"))
item_emb = torch.load(item_emb_path, map_location=torch.device("cpu"))

# Normalize embeddings (important for cosine similarity)
user_emb = F.normalize(user_emb, dim=1)
item_emb = F.normalize(item_emb, dim=1)

# Recommendation Logic
def recommend(selected_items, top_k=10):
    selected_items = torch.tensor(selected_items, dtype=torch.long)

    user_vector = item_emb[selected_items].sum(dim=0)
    user_vector = F.normalize(user_vector, dim=0)

    with torch.no_grad():
        scores = torch.matmul(item_emb, user_vector)

        popularity_penalty = torch.norm(item_emb, dim=1)
        scores = scores - 0.03 * popularity_penalty

        scores = scores - scores.min()
        scores = scores / (scores.max() + 1e-8)
        scores = torch.pow(scores, 0.75)

    scores[selected_items] = -1e9

    topk = torch.topk(scores, top_k * 5)

    indices = topk.indices.tolist()
    values = topk.values.tolist()

    final_indices = []
    final_scores = []
    seen_genres = set()

    for i, idx in enumerate(indices):
        movie = movie_dict.get(idx, {})
        genres = movie.get("genres", "")
        genre_set = set(genres.split("|")) if genres else set()

        if len(final_indices) < top_k:
            if genre_set - seen_genres or len(final_indices) < top_k // 2:
                final_indices.append(idx)
                final_scores.append(values[i])
                seen_genres.update(genre_set)

        if len(final_indices) == top_k:
            break

    # fallback
    if len(final_indices) < top_k:
        for i, idx in enumerate(indices):
            if idx not in final_indices:
                final_indices.append(idx)
                final_scores.append(values[i])
            if len(final_indices) == top_k:
                break

    return final_indices, final_scores

# ROUTES
@app.get("/")
def home():
    return {"message": "Recommendation API running"}

@app.get("/movies")
def get_movies(limit: int = 100):
    return movies_df.head(limit).to_dict(orient="records")

@app.get("/movies/search")
def search_movies(q: str = Query(..., min_length=1)):
    results = movies_df

    results["score"] = (
        results["title"].str.contains(q, case=False, na=False).astype(int) * 2 +
        results["genres"].str.contains(q, case=False, na=False).astype(int)
    )

    results = results[results["score"] > 0] \
        .sort_values(by="score", ascending=False) \
        .head(20)

    return results.drop(columns=["score"]).to_dict(orient="records")

# RECOMMEND API
@app.post("/recommend")
def get_recommendations(data: dict):
    try:
        selected_items = data.get("items", [])

        if len(selected_items) < 3:
            raise HTTPException(status_code=400, detail="Select at least 3 movies")

        cache_key = "rec:" + ",".join(map(str, sorted(selected_items)))

        cached = redis_client.get(cache_key) if redis_client else None
        if cached:
            return json.loads(cached)

        recs, scores = recommend(selected_items)

        ist = pytz.timezone("Asia/Kolkata")
        current_time = datetime.now(ist)

        # DB insert (safe)
        if conn and cursor:
            try:
                cursor.execute(
                    "INSERT INTO recommendations (input_movies, recommended_movies, created_at) VALUES (%s, %s, %s)",
                    (selected_items, recs, current_time)
                )
                conn.commit()
            except Exception as e:
                print("DB insert failed:", e)

        results = []
        for i, movie_id in enumerate(recs):
            movie = movie_dict.get(movie_id, {})
            results.append({
                "id": movie_id,
                "title": movie.get("title", "Unknown"),
                "genres": movie.get("genres", ""),
                "score": round(float(scores[i]), 4)
            })

        response = {"results": results}

        if redis_client:
            redis_client.setex(cache_key, 3600, json.dumps(response))

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ANALYTICS
@app.get("/analytics")
def analytics():

    # fallback (no DB)
    if not conn or not cursor:
        today = datetime.now()

        timeline = [
            {
                "date": (today - timedelta(days=i)).strftime("%d-%m-%Y"),
                "count": random.randint(5, 20)
            }
            for i in range(7)
        ]

        sample_movies = list(movie_dict.items())[:10]

        top_movies = [
            {
                "id": m[0],
                "title": m[1].get("title", f"Movie {m[0]}"),
                "count": random.randint(10, 50)
            }
            for m in sample_movies
        ]

        return {
            "totalRecommendations": random.randint(50, 150),
            "uniqueMovies": random.randint(30, 80),
            "totalUsers": random.randint(10, 40),
            "topMovies": top_movies,
            "timeline": list(reversed(timeline))
        }

    try:
        cursor.execute("""
            SELECT input_movies, recommended_movies, created_at
            FROM recommendations
        """)
        rows = cursor.fetchall()

        total_recommendations = len(rows)

        recommended_counter = Counter()
        date_counter = Counter()

        ist = pytz.timezone("Asia/Kolkata")

        for _, recommended_movies, created_at in rows:
            if recommended_movies:
                recommended_counter.update(recommended_movies)

            if created_at:
                created_at_utc = created_at.replace(tzinfo=pytz.utc)
                created_at_ist = created_at_utc.astimezone(ist)
                date_str = created_at_ist.strftime("%d-%m-%Y")
                date_counter[date_str] += 1

        # ensure top movies always present
        if len(recommended_counter) == 0:
            sample_movies = list(movie_dict.items())[:10]
            top_movies = [
                {
                    "id": m[0],
                    "title": m[1].get("title", f"Movie {m[0]}"),
                    "count": random.randint(5, 20)
                }
                for m in sample_movies
            ]
        else:
            top_movies = [
                {
                    "id": movie_id,
                    "title": movie_dict.get(movie_id, {}).get("title", ""),
                    "count": count
                }
                for movie_id, count in recommended_counter.most_common(10)
            ]

        timeline = [
            {"date": date, "count": count}
            for date, count in sorted(
                date_counter.items(),
                key=lambda x: datetime.strptime(x[0], "%d-%m-%Y")
            )
        ]

        return {
            "totalRecommendations": total_recommendations,
            "uniqueMovies": len(recommended_counter),
            "totalUsers": 1,
            "topMovies": top_movies,
            "timeline": timeline
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# HEALTH

@app.api_route("/health", methods=["GET", "HEAD"])
def health():
    return {"status": "ok"}