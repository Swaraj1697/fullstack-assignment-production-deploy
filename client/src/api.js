import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000", // backend URL
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add or update rating
export const addOrUpdateRating = async (userId, movieId, rating) => {
    return API.post("/ratings/add", { userId, movieId, rating });
};

// Optional: delete rating
export const deleteRating = async (userId, movieId) => {
    return API.delete(`/ratings/${userId}/${movieId}`);
};

// Reviews API
export const addReview = (userId, movieId, review) =>
    API.post("/reviews", { userId, movieId, review });

export const getReviews = (movieId) =>
    API.get(`/reviews/${movieId}`);

// Fetch recommendations
export const getRecommendations = (userId) =>
    API.get(`/recommendations/daily/${userId}`);

export default API;
