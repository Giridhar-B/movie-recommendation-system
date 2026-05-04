# 🎬 Movie Recommendation System (Full Stack + ML)

A full-stack movie recommendation system built using **FastAPI (backend), React (frontend), and PyTorch (LightGCN model)**.
It generates personalized movie recommendations based on user-selected movies using embedding-based similarity scoring.

---

## 🚀 Features

* 🎯 Personalized movie recommendations
* 🧠 LightGCN-based embedding model (Graph Neural Network)
* ⚡ FastAPI backend (high performance)
* 💻 React (Vite) frontend UI
* 📊 Analytics dashboard (top movies, trends)
* 💾 Redis caching
* 🗄️ PostgreSQL analytics storage
* 🔥 Real-time recommendation API

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Axios

### Backend

* FastAPI
* PyTorch
* Pandas
* Uvicorn
* Redis (optional)
* PostgreSQL (optional)

### Machine Learning

* LightGCN (Graph Neural Network)
* Embedding-based recommendation system
* Cosine similarity ranking

---

## 🧠 System Architecture

User → React Frontend → FastAPI Backend →
LightGCN Model → Recommendation Engine → Response

Optional:

* Redis → caching recommendations
* PostgreSQL → analytics storage

---

## 📁 Project Structure

```
Recommendation_System/
│
├── backend/
│   ├── data/
│   ├── embeddings/
│   ├── models/
│   ├── main.py
│   ├── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│
├── README.md
```

---

## ⚙️ Setup Instructions

### 🔹 Backend Setup

```bash
cd backend
python -m venv venv
source venv/Scripts/activate   # Git Bash (Windows)
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

Backend runs at:

```
http://localhost:8000
```

---

### 🔹 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🔗 API Endpoints

### Base URL

```
http://localhost:8000
```

### 📌 Get Movies

```
GET /movies
```

### 📌 Search Movies

```
GET /movies/search?q=batman
```

### 📌 Get Recommendations

```
POST /recommend
```

Request Body:

```json
{
  "items": [1, 2, 3]
}
```

### 📌 Analytics

```
GET /analytics
```

### 📌 Health Check

```
GET /health
```

---

## 🧠 ML Model Details

* Model: LightGCN (Graph-based recommendation)
* Input: User–Item interaction graph
* Output: Embeddings for users and movies
* Ranking: Cosine similarity + scoring adjustments
* Enhancements:

  * Genre diversity
  * Popularity penalty

---

## 📌 Environment Variables

### Frontend (`frontend/.env`)

```
VITE_API_URL=http://localhost:8000
```

> Do not commit `.env` files. Use environment variables in production (e.g., Vercel dashboard).

---

## 🚀 Deployment (Planned)

* Backend → Render
* Frontend → Vercel

---

## 📊 Status

* ✅ Backend: Ready
* ✅ Frontend: Ready
* ✅ ML Model: Integrated
* ✅ API: Functional
* 🚧 Deployment: In progress

---

## 👨‍💻 Author
**Giridhar B**  
🔗 [GitHub Profile](https://github.com/Giridhar-B)  
