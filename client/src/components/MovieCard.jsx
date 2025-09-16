import { useState } from "react";
import { addOrUpdateRating } from "../api";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MovieCard({ movie, userId  , initialLiked , initialRating}) {
  const [rating, setRating] = useState(initialRating !== null ? initialRating : "");
  console.log(movie);
  console.log("Initial rating: " +initialRating);
  console.log("initialLiked: " +initialLiked);
  
  const { user } = useAuth();
  const [liked, setLiked] = useState(initialLiked);
  

  const handleRate = async () => {
    try {
      console.log("Sending rating:", {
        userId: user.id,
        movieId: movie.id,
        movieTitle: movie.title,   // 👈 check if undefined
        rating: parseInt(rating)
      });
      
      await addOrUpdateRating(user.id, movie.id, movie.title , parseInt(rating));
      alert("Rating saved!");
      setRating("");
    } catch (err) {
      console.error("Error saving rating:", err.message);
    }
  };

  const handleReact = async (reaction) => {
    try {
      await addOrUpdateRating(user.id, movie.id, movie.title, rating ? parseInt(rating) : null, reaction);
      setLiked(reaction);
    } catch (err) {
      console.error("Error saving reaction:", err.message);
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
            {/* 👍👎 Like / Dislike */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          style={{
            flex: 1,
            marginRight: "5px",
            background: liked === true ? "green" : "lightgray",
            color: "white",
          }}
          onClick={() => handleReact(true)}
        >
          👍 Like
        </button>
        <button
          style={{
            flex: 1,
            background: liked === false ? "red" : "lightgray",
            color: "white",
          }}
          onClick={() => handleReact(false)}
        >
          👎 Dislike
        </button>
      </div>
    </div>
  );
}
