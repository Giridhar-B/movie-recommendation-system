import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getRecommendations } from "../services/api";

export default function Results() {
  const location = useLocation();
  const items = location.state?.items || [];

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!items || items.length < 3) {
          setError("Select at least 3 movies");
          setLoading(false);
          return;
        }

        const res = await getRecommendations(items);

        if (res.data.error) {
          setError(res.data.error);
          setLoading(false);
          return;
        }

        const raw = res.data.results || [];

        if (raw.length === 0) {
          setResults([]);
          setLoading(false);
          return;
        }

        const scores = raw.map((m) => m.score);

        const max = Math.max(...scores);
        const min = Math.min(...scores);

        const normalized = raw.map((movie) => {
          let match;

          if (max === min) {
            match = 90;
          } else {
            // scale to 70–100 range
            match =
              70 +
              ((movie.score - min) / (max - min)) * 30;
          }

          return {
            ...movie,
            match: Math.min(100, Math.max(0, match)),
          };
        });

        setResults(normalized);
      } catch (err) {
        setError("Failed to fetch recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [items]);

  // Loading State
  if (loading) {
    return (
      <div className="p-6 text-center text-lg font-medium">
        ⏳ Loading recommendations...
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-6 text-center text-red-500 font-medium">
         {error}
      </div>
    );
  }

  // Empty State
  if (results.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No recommendations found
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">
        Top Recommendations
      </h1>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((movie, index) => {
          const genres = movie.genres
            ? movie.genres.split("|")
            : [];

          return (
            <div
              key={movie.id}
              className="bg-white border rounded-2xl p-4 shadow hover:shadow-lg transition"
            >
              {/* Rank */}
              <div className="text-sm text-gray-400 mb-1">
                #{index + 1}
              </div>

              {/* Title */}
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {movie.title}
              </h2>

              {/* Genres */}
              <div className="flex flex-wrap gap-1 mb-3 text-xs text-gray-700">
                {genres.map((g, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 px-2 py-1 rounded-full"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* MATCH PERCENTAGE */}
              <div className="text-sm font-medium text-blue-600">
                {Math.round(movie.match)}% Match
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}