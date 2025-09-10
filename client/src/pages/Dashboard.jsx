import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import API from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const { user } = useAuth();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get(`/users/${user.id}/stats`);
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err.message);
      }
    };

    fetchStats();
  }, [user.id]);

  if (!stats) return <p>Loading stats...</p>;

  console.log(stats);
  

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Your Dashboard Analytics</h2>
      <p>Total Movies Rated: {stats.total}</p>
      <p>Average Rating: {stats.avg}</p>
      <p>Most Watched Genre: {stats.genre}</p>
    </div>
  );
}
