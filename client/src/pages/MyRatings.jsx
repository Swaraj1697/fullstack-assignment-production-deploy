import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import API from "../api";

export default function MyRatings() {
  const { user } = useAuth();
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    if (!user) return;

    API.get(`/ratings/${user.id}`)
  .then((res) => setRatings(res.data))
  .catch((err) => console.error("Error fetching ratings", err));
  
  }, [user]);

  if (!user) return <p>Please login to see your ratings.</p>;

  return (
    <div>
      <h2>{user.name}'s Ratings</h2>
      {ratings.map((r) => (
        <div key={r._id}>
          <p>
            Movie ID: {r.movieId} — Rating: {r.rating}
          </p>
        </div>
      ))}
    </div>
  );
}
