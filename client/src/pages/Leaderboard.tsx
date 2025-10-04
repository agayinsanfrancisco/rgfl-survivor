import React, { useEffect, useState } from "react";
import api from "@/lib/api";

interface LeaderboardEntry {
  id: string;
  name: string;
  email: string;
  totalPoints: number;
}

const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/api/league/standings")
      .then(res => {
        setEntries(res.data);
        setError(null);
      })
      .catch(() => {
        setEntries([]);
        setError("Unable to load leaderboard right now.");
      });
  }, []);

  return (
    <div className="container">
      <h2>Leaderboard</h2>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {entries.length === 0 && !error && <p>No leaderboard data available.</p>}
      {entries.length > 0 && (
        <ol>
          {entries.map((entry) => (
            <li key={entry.id}>
              {entry.name} — {entry.totalPoints} pts
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default Leaderboard;
