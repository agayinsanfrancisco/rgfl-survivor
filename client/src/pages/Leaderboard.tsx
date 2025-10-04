import React, { useEffect, useState } from "react";
import api from "@/lib/api";

interface LeaderboardEntry {
  name: string;
  score: number;
}

const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    api.get("/api/leaderboard")
      .then(res => setEntries(res.data))
      .catch(() => setEntries([]));
  }, []);

  return (
    <div className="container">
      <h2>Leaderboard</h2>
      {entries.length === 0 ? (
        <p>No leaderboard data available.</p>
      ) : (
        <ol>
          {entries.map((entry, i) => (
            <li key={i}>
              {entry.name} — {entry.score} pts
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default Leaderboard;