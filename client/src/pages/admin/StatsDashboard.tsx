import React, { useEffect, useState } from "react";
import api from "@/lib/api";

interface AdminStats {
  users: number;
  picks: number;
  castaways: number;
  weeks: number;
}

const StatsDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/api/admin/stats")
      .then(res => {
        setStats(res.data);
        setError(null);
      })
      .catch(err => {
        console.error("Failed to load stats:", err);
        setError("Unable to load stats.");
      });
  }, []);

  if (error) {
    return <div style={{ color: "crimson" }}>{error}</div>;
  }

  if (!stats) return <div>Loading stats…</div>;

  return (
    <div>
      <h2>System Stats</h2>
      <ul>
        <li>Total Users: {stats.users}</li>
        <li>Total Picks: {stats.picks}</li>
        <li>Total Castaways: {stats.castaways}</li>
        <li>Total Weeks: {stats.weeks}</li>
      </ul>
    </div>
  );
};

export default StatsDashboard;
