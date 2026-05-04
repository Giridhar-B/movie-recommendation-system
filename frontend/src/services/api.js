import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

// Movies
export const getMovies = () => API.get("/movies");

// Search
export const searchMovies = (q) =>
  API.get(`/movies/search?q=${q}`);

// Recommendations
export const getRecommendations = (items) =>
  API.post("/recommend", { items });

// Analytics
export const getAnalytics = () =>
  API.get("/analytics");

export default API;