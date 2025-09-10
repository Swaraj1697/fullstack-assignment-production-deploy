import { useState } from "react";
import { addOrUpdateRating } from "../api";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MovieCard({ movie, userId }) {
  const [rating, setRating] = useState("");
  const { user } = useAuth();

  const handleRate = async () => {
    try {
      await addOrUpdateRating(user.id, movie.id, parseInt(rating));
      alert("Rating saved!");
    } catch (err) {
      console.error("Error saving rating:", err.message);
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: "10px", width: "200px" }}>
      <Link state={{ userId }} to={`/movie/${movie.id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <img
          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
          alt={movie.title}
          style={{ width: "100%" }}
        />
        <h4>{movie.title}</h4>
      </Link>

      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        placeholder="Rate (1-5)"
        style={{ width: "100%", marginBottom: "5px" }}
      />
      <button onClick={handleRate} style={{ width: "100%" }}>
        Submit Rating
      </button>
    </div>
  );
}
