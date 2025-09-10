import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getRecommendations } from "../api";

export default function Recommendations() {
  const { user } = useAuth();
  const [recs, setRecs] = useState(null);

  useEffect(() => {
    if (user?.id) {
      getRecommendations(user.id).then((res) => setRecs(res.data));
    }
  }, [user]);

  if (!recs) return <p>Loading recommendations...</p>;

  return (
    <div>
      <h2>For You</h2>
      <p>{recs.blurb}</p>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {recs.recommendations.map((m) => (
          <div key={m.id} style={{ margin: "10px" }}>
            <img
              src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
              alt={m.title}
            />
            <p>{m.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
