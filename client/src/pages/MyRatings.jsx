import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function MyRatings() {
  const { user } = useAuth();
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    if (!user) return;
    axios
      .get(`http://localhost:5000/ratings/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setRatings(res.data);
      })
      .catch((err) => console.error("Error fetching ratings", err));
  }, [user]);

  if (!user) return <p>Please login to see your ratings.</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>
        {user.name}'s Ratings
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {ratings.map((r) => (
          <div
            key={r._id}
            style={{
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              backgroundColor: "#fdfdfd",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <p style={{ margin: 0, fontSize: "18px", fontWeight: "bold", color: "#222" }}>
              {r.movieTitle}
            </p>
            <p style={{ margin: "5px 0 0 0", fontSize: "16px", color: "#555" }}>
              Rating: <span style={{ fontWeight: "bold", color: "#ff9900" }}>{r.rating}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
