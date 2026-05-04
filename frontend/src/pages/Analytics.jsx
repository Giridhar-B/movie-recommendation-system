import { useEffect, useState } from "react";
import { getAnalytics } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { formatDate } from "../utils/time";

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getAnalytics().then((res) => {
      setData(res.data);
    });
  }, []);

  if (!data) {
    return <div className="p-6">⏳ Loading analytics...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Total Recommendations</p>
          <h2 className="text-2xl font-bold text-blue-600">
            {data.totalRecommendations}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Unique Movies</p>
          <h2 className="text-2xl font-bold text-green-600">
            {data.uniqueMovies}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Total Users (approx)</p>
          <h2 className="text-2xl font-bold text-purple-600">
            {data.totalUsers || 1}
          </h2>
        </div>
      </div>

      {/* BAR CHART */}
      <div className="bg-white p-5 rounded-2xl shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Top Recommended Movies
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.topMovies}>
            <XAxis dataKey="title" hide />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value} selections`, "Popularity"]}
            />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* LINE CHART */}
      <div className="bg-white p-5 rounded-2xl shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Recommendations Over Time
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.timeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#10b981"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}