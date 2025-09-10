import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";


export default function Navbar() {
  const { isAuthenticated , setIsAuthenticated, setUser , isLoading } = useAuth();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query}`);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);

    localStorage.removeItem("token"); 
    localStorage.removeItem("user");
  
    navigate("/login", { replace: true });
  };

  if (isLoading) return null; 
  if (!isAuthenticated) return null;

  return (
    <nav style={{ padding: "10px", background: "#f5f5f5" }}>
      <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
      <Link to="/my-ratings" style={{ marginRight: "10px" }}>My Ratings</Link>
      <Link to="/recommendations" style={{ marginRight: "10px" }}>For You</Link>
      <Link to="/dashboard" style={{ marginRight: "10px" }}>Dashboard</Link>

      <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
        Logout
      </button>
    </nav>
  );
}
