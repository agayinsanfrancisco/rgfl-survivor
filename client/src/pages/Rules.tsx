import React from "react";

const Rules: React.FC = () => {
  return (
    <div className="rg-page">
      <section className="rg-hero">
        <span className="rg-pill">League Rules</span>
        <h1>Play fair. Stay strategic. Have fun.</h1>
        <p>
          The Reality Games Fantasy League is designed to amplify every blindside. Our rules keep the competition sharp
          without drowning you in spreadsheets.
        </p>
      </section>

      <section className="rg-section" style={{ marginTop: "3rem" }}>
        <ol style={{ paddingLeft: "1.2rem", margin: 0, display: "grid", gap: "1rem" }}>
          <li className="rg-card">
            <strong>Single league, unlimited players.</strong> Everyone joins the flagship league. No divisions, no
            conferences, just a crowded beach of super fans.
          </li>
          <li className="rg-card">
            <strong>Rankings lock before draft night.</strong> Submit a full 1–18 ordering of castaways. The admin hits
            “Run Draft” to assign two castaways per player in snake order.
          </li>
          <li className="rg-card">
            <strong>Weekly active picks.</strong> Choose one of your castaways before the episode. Miss the deadline and
            the system picks for you with a penalty.
          </li>
          <li className="rg-card">
            <strong>Scoring.</strong> Admins enter episode points once the dust settles. Your active castaway earns you
            their total for the week.
          </li>
          <li className="rg-card">
            <strong>Trades &amp; waivers.</strong> Coming in a future update. For now, your drafted castaways are yours for
            the season.
          </li>
          <li className="rg-card">
            <strong>The Sole Survivor of Fantasy.</strong> Leaderboards freeze after the finale. Victory includes bragging
            rights, digital confetti, and a permanent spot in the Hall of Flame.
          </li>
        </ol>
      </section>
    </div>
  );
};

export default Rules;
