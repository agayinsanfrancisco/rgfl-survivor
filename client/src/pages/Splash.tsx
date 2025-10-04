import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { routes } from "@/shared/routes";

const Splash: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate(user.isAdmin ? routes.admin.index : routes.dashboard);
    }
  }, [user, navigate]);

  return (
    <main className="rg-page">
      <section className="rg-hero" style={{ textAlign: "center", alignItems: "center" }}>
        <span className="rg-pill">Reality Games Fantasy League</span>
        <h1>Outwit. Outplay. Outscore.</h1>
        <p style={{ maxWidth: 580 }}>
          Welcome to the Ultimate Survivor Fantasy League. Rank every castaway, conquer the snake draft, and ride your
          weekly picks to the top of the leaderboard.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1rem" }}>
          <button onClick={() => navigate(routes.signup)}>Join the League</button>
          <button style={{ background: "rgba(45, 32, 24, 0.08)", color: "var(--text-dark)" }} onClick={() => navigate(routes.howToPlay)}>
            Learn How It Works
          </button>
        </div>
        <div style={{ fontSize: "2rem", marginTop: "2rem" }} aria-hidden="true">
          🔥
        </div>
      </section>
    </main>
  );
};

export default Splash;
