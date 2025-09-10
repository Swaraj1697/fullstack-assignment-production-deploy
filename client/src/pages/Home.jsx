import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import Search from "./Search";
import { useAuth } from "../context/AuthContext";

function Home() {
  const [movies, setMovies] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { user } = useAuth();

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

  useEffect(() => {
    fetchPopularMovies();
  }, []);

  const handleSearchResults = (results) => {
    setMovies(results);
    setIsSearchActive(true);
  };

  return (
    <div>
      {/* Page title */}
      <h1 style={{ marginBottom: "20px", textAlign: "center" }}>🎬 Movies</h1>

      {/* Search section */}
      <div style={{ marginBottom: "30px", textAlign: "center" }}>
        {isSearchActive && (
          <button
            onClick={fetchPopularMovies}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#ff4500",
              color: "white",
              marginBottom: "15px",
            }}
          >
            Back to Home Page
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
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          justifyItems: "center",
        }}
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} userId={user?.id} />
        ))}
      </div>
    </div>
  );
}

export default Home;
