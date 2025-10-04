import React from "react";
import { Link } from "react-router-dom";
import { routes } from "@/shared/routes";
import { useAuth } from "@/context/AuthContext";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="rg-page">
      <section className="rg-hero" style={{ alignItems: "center", textAlign: "center" }}>
        <span className="rg-pill">Welcome back</span>
        <h1>{user?.name ?? "Player"}, let&apos;s set up your next move.</h1>
        <p>
          Choose your weekly active castaway, review your preseason rankings, and scout the leaderboard. Everything you
          need to outscore the tribe is right here.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1rem" }}>
          <Link to={routes.weeklyPicks}>
            <button>Weekly Picks</button>
          </Link>
          <Link to={routes.preseasonRank}>
            <button style={{ background: "rgba(45, 32, 24, 0.08)", color: "var(--text-dark)" }}>Edit Rankings</button>
          </Link>
        </div>
      </section>

      <section className="rg-section" style={{ marginTop: "3rem" }}>
        <h2>Quick Actions</h2>
        <div className="rg-grid rg-grid--two">
          <article className="rg-card">
            <h3>Set Picks</h3>
            <p>Lock your active player before the episode airs.</p>
            <Link to={routes.weeklyPicks}>Go to Weekly Picks →</Link>
          </article>
          <article className="rg-card">
            <h3>Check Leaderboard</h3>
            <p>See who&apos;s climbing and who&apos;s sliding before tribal council.</p>
            <Link to={routes.leaderboard}>View Leaderboard →</Link>
          </article>
          <article className="rg-card">
            <h3>Update Profile</h3>
            <p>Add an avatar, tweak your team name, and manage notifications.</p>
            <Link to={routes.profile}>Edit Profile →</Link>
          </article>
          <article className="rg-card">
            <h3>Rules &amp; FAQ</h3>
            <p>Need a refresher on scoring or deadlines? Get the full breakdown.</p>
            <Link to={routes.rules}>League Rules →</Link>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
