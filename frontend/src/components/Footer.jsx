export default function Footer() {
  return (
    <footer className="mt-10 border-t bg-gray-50 py-6 text-center text-sm text-gray-600">

      <p className="font-medium text-gray-700">
        🎬 Movie Recommendation System
      </p>

      <p className="mt-1">
        Built using React • FastAPI • PyTorch (LightGCN Embeddings)
      </p>

      <p className="mt-2 text-xs text-gray-500">
        © {new Date().getFullYear()} Movie Recommendation System. All rights reserved.
      </p>

      <a
        href="https://github.com/your-username/movie-recommender"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline mt-2 inline-block"
      >
        View Source Code
      </a>

    </footer>
  );
}