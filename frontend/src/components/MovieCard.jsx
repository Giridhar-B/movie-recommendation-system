import { useState } from "react";

export default function MovieCard({ movie, onClick, isSelected }) {
  const [pressed, setPressed] = useState(false);

  // Split genres
  const genres = movie.genres ? movie.genres.split("|") : [];

  return (
    <div
      onClick={() => onClick(movie.movie)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      className={`
        cursor-pointer rounded-2xl p-4 border transition-all duration-200
        transform hover:scale-105 hover:shadow-xl
        ${pressed ? "scale-95" : ""}
        ${
          isSelected
            ? "bg-blue-50 border-blue-500 shadow-md"
            : "bg-white border-gray-200"
        }
      `}
    >
      {/* Title */}
      <h3 className="text-lg font-semibold mb-2 text-gray-800">
        {movie.title}
      </h3>

      {/* Genres */}
      <div className="flex flex-wrap gap-1">
        {genres.map((g, idx) => (
          <span
            key={idx}
            className={`
              text-xs px-2 py-1 rounded-full
              ${
                isSelected
                  ? "bg-blue-200 text-blue-800"
                  : "bg-gray-100 text-gray-700"
              }
            `}
          >
            {g}
          </span>
        ))}
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="mt-3 text-sm text-blue-600 font-medium">
          ✓ Selected
        </div>
      )}
    </div>
  );
}