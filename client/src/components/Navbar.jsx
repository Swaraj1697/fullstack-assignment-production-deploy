import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { isAuthenticated, setIsAuthenticated, setUser, isLoading, user } = useAuth();
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
    <nav
      style={{
        padding: "12px 24px",
        background: "linear-gradient(90deg, #1e3c72, #2a5298)", // nice blue gradient
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "center",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
      }}
    >
      {/* Left: links + logout button */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {[
          { to: "/", label: "Home" },
          { to: "/my-ratings", label: "My Ratings" },
          { to: "/recommendations", label: "For You" },
          { to: "/dashboard", label: "Dashboard" },
        ].map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              color: "#fff",
              textDecoration: "none",
              fontWeight: 500,
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#ffd369")}
            onMouseLeave={(e) => (e.target.style.color = "#fff")}
          >
            {link.label}
          </Link>
        ))}

        <button
          onClick={handleLogout}
          style={{
            padding: "6px 14px",
            cursor: "pointer",
            borderRadius: "20px",
            border: "none",
            background: "#ff4d4d",
            color: "#fff",
            fontWeight: "bold",
            transition: "background 0.2s ease",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#e63946")}
          onMouseLeave={(e) => (e.target.style.background = "#ff4d4d")}
        >
          Logout
        </button>
      </div>

      {/* Center: logged-in text */}
      <h2
        style={{
          margin: 0,
          fontSize: "16px",
          fontWeight: "normal",
          justifySelf: "center",
          color: "#f1f1f1",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          minWidth: 0,
        }}
      >
        Logged In as: <span style={{ fontWeight: "600", color: "#ffd369" }}>{user.name}</span>
      </h2>

      {/* Right spacer */}
      <div />
    </nav>
  );
}
