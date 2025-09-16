import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import Search from "./Search";
import { useAuth } from "../context/AuthContext";
import API from "../api";

function Home() {
  const [movies, setMovies] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { user } = useAuth();
  const [ratings, setRatings] = useState([]);

  const fetchPopularMovies = async () => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${
          import.meta.env.VITE_TMDB_KEY
        }&language=en-US&page=1`
      );
      setMovies(res.data.results);
      setIsSearchActive(false);
    } catch (err) {
      console.error("Error fetching movies:", err);
    }
  };

  const fetchRatings = async () => {
    if (!user) return;
    const res = await API.get(`/ratings/${user.id}`);
    setRatings(res.data); // [{movieId, liked, rating}, ...]
  };

  useEffect(() => {
    fetchPopularMovies();
    fetchRatings();
  }, []);

  const handleSearchResults = (results) => {
    setMovies(results);
    setIsSearchActive(true);
  };

  return (
    <div
      style={{
        padding: "30px",
        background: "#f4f6f9",
        minHeight: "100vh",
      }}
    >
      {/* Page title */}
      <h1
        style={{
          marginBottom: "20px",
          textAlign: "center",
          fontSize: "2.5rem",
          color: "#333",
          fontWeight: "bold",
        }}
      >
        🎬 Discover Movies
      </h1>

      {/* Search section */}
      <div style={{ marginBottom: "30px", textAlign: "center" }}>
        {isSearchActive && (
          <button
            onClick={fetchPopularMovies}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#ff4500",
              color: "white",
              marginBottom: "15px",
              boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
              transition: "0.3s",
            }}
          >
            ⬅ Back to Popular
          </button>
        )}

        <div style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}>
          <Search onSearchResults={handleSearchResults} />
        </div>
      </div>

      {/* Movies grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "25px",
        }}
      >
        {movies.map((movie) => {
          const userRating = ratings.find((r) => r.movieId === movie.id);

          return (
            <MovieCard
              key={movie.id}
              movie={movie}
              userId={user?.id}
              initialLiked={userRating?.liked ?? null}
              initialRating={userRating?.rating ?? ""}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Home;
