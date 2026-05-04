export default function About() {
  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-4">
        🎬 Movie Recommendation System
      </h1>

      {/* Overview */}
      <p className="text-gray-700 mb-6">
        This is a full-stack Movie Recommendation System that generates
        personalized recommendations based on user-selected movies using
        <span className="font-semibold"> LightGCN-trained embeddings</span>.
        The system performs real-time inference using embedding similarity
        rather than retraining the model online.
      </p>

      {/* How it works */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          ⚙️ How It Works
        </h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>User selects at least 3 movies</li>
          <li>System builds a user profile vector by aggregating item embeddings</li>
          <li>Computes cosine similarity between user vector and all movie embeddings</li>
          <li>Applies ranking + filtering (diversity + popularity adjustment)</li>
          <li>Returns top-N recommended movies</li>
        </ul>
      </div>

      {/* Model */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          🧠 Model Architecture
        </h2>

        <p className="text-gray-700">
          The system uses embeddings learned from a LightGCN-based collaborative
          filtering model (trained offline). During inference, we compute
          recommendations using vector similarity over learned latent embeddings.
          This avoids heavy computation and enables fast real-time recommendations.
        </p>
      </div>

      {/* Metrics */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          📊 Model Performance
        </h2>

        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-gray-800 font-medium">
            Recall@20: <span className="text-blue-600">0.1077</span>
          </p>
          <p className="text-gray-800 font-medium">
            NDCG@20: <span className="text-blue-600">0.3788</span>
          </p>
        </div>

        <p className="text-sm text-gray-500 mt-2">
          These metrics evaluate ranking quality and how effectively relevant
          movies are retrieved in top-N recommendations.
        </p>
      </div>

      {/* Tech Stack */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          🏗️ Tech Stack
        </h2>

        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Frontend: React + Tailwind CSS</li>
          <li>Backend: FastAPI</li>
          <li>ML Model: PyTorch (LightGCN-trained embeddings)</li>
          <li>Database: PostgreSQL (Supabase)</li>
          <li>Caching: Redis</li>
        </ul>
      </div>

      {/* Key Features */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          🚀 Key Features
        </h2>

        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Real-time personalized recommendations</li>
          <li>Embedding-based similarity ranking</li>
          <li>Genre-aware diversity filtering</li>
          <li>Popularity bias reduction</li>
          <li>Redis caching for fast responses</li>
        </ul>
      </div>

      {/* GitHub */}
      <div>
        <h2 className="text-xl font-semibold mb-2">
          🔗 Source Code
        </h2>

        <a
          href="https://github.com/your-username/movie-recommender"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          View on GitHub
        </a>
      </div>

    </div>
  );
}