import { useEffect, useState } from "react";
import { getMovies, searchMovies } from "../services/api";
import MovieCard from "../components/MovieCard";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  // 🔹 Load initial movies
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await getMovies();
      setMovies(res.data);
    } catch (err) {
      console.error("Error fetching movies:", err);
    }
  };

  // 🔹 Search movies
  const handleSearch = async (e) => {
    const q = e.target.value;

    try {
      if (q.trim().length > 0) {
        const res = await searchMovies(q);
        setMovies(res.data);
      } else {
        fetchMovies();
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // 🔹 Select / Deselect movie
  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  // 🔹 Navigate to results
  const handleRecommend = () => {
    if (selected.length < 3) {
      alert("Select at least 3 movies");
      return;
    }

    navigate("/results", { state: { items: selected } });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Search */}
      <input
        type="text"
        placeholder="Search by title or genre (e.g. action, comedy...)"
        className="border p-3 w-full mb-6 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        onChange={handleSearch}
      />

      {/* Selected Count */}
      <p className="mb-4 text-gray-600">
        Selected Movies:{" "}
        <span className="font-semibold text-blue-600">
          {selected.length}
        </span>
      </p>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {movies.length > 0 ? (
          movies.map((m) => (
            <MovieCard
              key={m.movie}
              movie={m}
              onClick={handleSelect}
              isSelected={selected.includes(m.movie)}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No movies found
          </p>
        )}
      </div>

      {/* Recommend Button */}
      <div className="flex justify-center">
        <button
          onClick={handleRecommend}
          disabled={selected.length < 3}
          className={`mt-6 px-6 py-3 rounded-lg font-medium transition ${
            selected.length < 3
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Get Recommendations ({selected.length})
        </button>
      </div>
    </div>
  );
}