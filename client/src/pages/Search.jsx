// Search.jsx
import React, { useState } from "react";
import axios from "axios";
import API from "../api";

function Search({ onSearchResults }) { 
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const response = await API.get(`/movies/search?query=${searchQuery}`);
      onSearchResults(response.data); // send results to Home
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  return (
    <div style={{ margin: "20px 0" }}>
      <input
        type="text"
        placeholder="Search for a movie"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ padding: "8px", width: "200px", marginRight: "10px" }}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default Search;
