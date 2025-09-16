import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const { user } = useAuth();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/users/${user.id}/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err.message);
      }
    };

    fetchStats();
  }, [user.id]);

  if (!stats) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading stats...</p>;

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "20px",
          textAlign: "center",
          color: "#2c3e50",
        }}
      >
        📊 Your Dashboard Analytics
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Total Movies Rated */}
        <div
          style={{
            backgroundColor: "#f1f8ff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <h3 style={{ fontSize: "18px", color: "#007bff" }}>🎬 Total Movies Rated</h3>
          <p style={{ fontSize: "26px", fontWeight: "bold", marginTop: "10px" }}>{stats.total}</p>
        </div>

        {/* Average Rating */}
        <div
          style={{
            backgroundColor: "#fff5f5",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <h3 style={{ fontSize: "18px", color: "#e74c3c" }}>⭐ Average Rating</h3>
          <p style={{ fontSize: "26px", fontWeight: "bold", marginTop: "10px" }}>
           {stats?.avg != null ? Number(stats.avg).toFixed(2) : "-"}
          </p>
        </div>

        {/* Most Watched Genre */}
        <div
          style={{
            backgroundColor: "#f9fff3",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <h3 style={{ fontSize: "18px", color: "#27ae60" }}>🎭 Most Watched Genre</h3>
          <p style={{ fontSize: "22px", fontWeight: "600", marginTop: "10px" }}>{stats.genre}</p>
        </div>
      </div>
    </div>
  );
}
