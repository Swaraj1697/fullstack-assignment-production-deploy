import { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { getReviews, addReview } from "../api"; // ✅ make sure addReview is defined

export default function MovieDetails() {
    
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState("");

  const location = useLocation();
  const userId = location.state?.userId;
  console.log("User ID from state:", userId);
  

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${
          import.meta.env.VITE_TMDB_KEY
        }&language=en-US`;

        const res = await axios.get(url);
        setMovie(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovie();
      getReviews(movieId).then((res) => setReviews(res.data));
    }
  }, [movieId]);

  const handleReviewSubmit = async () => {
    if (!newReview.trim()) return alert("Review cannot be empty!");

    try {
      await addReview(userId, movieId, newReview);
      alert("Review added!");
      setNewReview("");

      // Refresh reviews
      const res = await getReviews(movieId);
      setReviews(res.data);
    } catch (err) {
      console.error("Error adding review:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!movie) return <p>No movie found</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{movie.title}</h2>
      <img
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={movie.title}
      />
      <p>{movie.overview}</p>
      <p><b>Release Date:</b> {movie.release_date}</p>
      <p><b>Rating:</b> {movie.vote_average}</p>

      <h3>Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul>
          {reviews.map((r) => (
            <li key={r._id}>{r.userId.name} : {r.review}</li>
          ))}
        </ul>
      )}

      <h4>Add Your Review</h4>
      <textarea
        value={newReview}
        onChange={(e) => setNewReview(e.target.value)}
        placeholder="Write your review..."
        rows="3"
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <button onClick={handleReviewSubmit}>Submit Review</button>
    </div>
  );
}
