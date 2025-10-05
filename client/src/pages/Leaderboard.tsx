import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { DraftPick } from "@/shared/types";
import { socket } from "@/lib/socket";

interface LeaderboardEntry {
  id: string;
  name: string;
  email: string;
  totalPoints: number;
  rawPoints: number;
  draftPicks?: DraftPick[];
  rank?: number;
}

type LeaderboardTab = "live" | "weekly" | "members";

const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<LeaderboardTab>("live");
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // Initial data fetch
    api
      .get("/api/league/standings")
      .then((res) => {
        setEntries(res.data);
        setError(null);
      })
      .catch(() => {
        setEntries([]);
        setError("Unable to load leaderboard right now.");
      });

    // Socket.io listeners for real-time updates
    const handleConnect = () => {
      setIsLive(true);
      console.log("Leaderboard connected to real-time updates");
    };

    const handleDisconnect = () => {
      setIsLive(false);
      console.log("Leaderboard disconnected from real-time updates");
    };

    const handleLeaderboardUpdate = (newStandings: LeaderboardEntry[]) => {
      console.log("Received real-time leaderboard update:", newStandings);
      setEntries(newStandings);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("leaderboard:updated", handleLeaderboardUpdate);

    // Set initial connection state
    if (socket.connected) {
      setIsLive(true);
    }

    // Cleanup listeners on unmount
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("leaderboard:updated", handleLeaderboardUpdate);
    };
  }, []);

  return (
    <div className="rg-page">
      <section className="rg-hero">
        <div className="flex gap-2 mb-2">
          <span className="rg-pill">Leaderboard</span>
          {isLive && (
            <span className="badge-live">
              <span className="pulse"></span>
              LIVE
            </span>
          )}
        </div>
        <h1>Live rankings updated after every Tribal Council.</h1>
        <p>
          Track momentum week by week. Dive into active picks, rival totals, and trends for the entire league in one
          place.
        </p>
      </section>

      <section className="rg-section">
        {error && <p className="error">{error}</p>}
        <div className="rg-tabs">
          <button
            type="button"
            className={`rg-tab ${tab === "live" ? "active" : ""}`}
            onClick={() => setTab("live")}
          >
            Live Rankings
          </button>
          <button
            type="button"
            className={`rg-tab ${tab === "weekly" ? "active" : ""}`}
            onClick={() => setTab("weekly")}
          >
            Weekly Picks
          </button>
          <button
            type="button"
            className={`rg-tab ${tab === "members" ? "active" : ""}`}
            onClick={() => setTab("members")}
          >
            Members List
          </button>
        </div>

        {entries.length === 0 && !error && <p>No leaderboard data available yet.</p>}

        {tab === "live" && entries.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Total Points</th>
                <th>Roster</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry.id}>
                  <td>{index + 1}</td>
                  <td>{entry.name}</td>
                  <td>{entry.totalPoints}</td>
                  <td>{(entry.draftPicks ?? []).map((pick) => pick.castaway.name).join(", ") || "--"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "weekly" && (
          <div className="rg-grid">
            {entries.map((entry) => (
              <article key={entry.id} className="rg-card">
                <h3>{entry.name}</h3>
                <p className="text-muted">{entry.email}</p>
                <p className="mt-2" style={{ fontWeight: 600 }}>Weekly Picks (latest first)</p>
                <ul style={{ paddingLeft: "1.1rem", margin: 0 }}>
                  {(entry.draftPicks ?? []).map((pick) => (
                    <li key={pick.id}>{pick.castaway.name}</li>
                  ))}
                  {(entry.draftPicks ?? []).length === 0 && <li>No picks assigned yet.</li>}
                </ul>
              </article>
            ))}
          </div>
        )}

        {tab === "members" && (
          <div className="rg-grid rg-grid--two">
            {entries.map((entry, index) => (
              <article key={entry.id} className="rg-card">
                <h3>{entry.name}</h3>
                <p className="text-muted mb-2">{entry.email}</p>
                <p>Joined: 2025</p>
                <p>Rank: {index + 1}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Leaderboard;
