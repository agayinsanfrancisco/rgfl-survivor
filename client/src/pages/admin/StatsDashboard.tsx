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
    return <div className="rg-page" style={{ color: "crimson" }}>{error}</div>;
  }

  if (!stats) return <div className="rg-page">Loading stats…</div>;

  return (
    <div className="rg-page">
      <section className="rg-hero">
        <span className="rg-pill">System Stats</span>
        <h1>League health at a glance.</h1>
      </section>

      <section className="rg-section" style={{ marginTop: "3rem" }}>
        <div className="rg-grid rg-grid--two">
          <article className="rg-stat-card">
            <span>Total users</span>
            <strong>{stats.users}</strong>
          </article>
          <article className="rg-stat-card">
            <span>Total picks submitted</span>
            <strong>{stats.picks}</strong>
          </article>
          <article className="rg-stat-card">
            <span>Castaways in system</span>
            <strong>{stats.castaways}</strong>
          </article>
          <article className="rg-stat-card">
            <span>Weeks configured</span>
            <strong>{stats.weeks}</strong>
          </article>
        </div>
      </section>
    </div>
  );
};

export default StatsDashboard;
