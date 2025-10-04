import React from "react";

const HowToPlay: React.FC = () => {
  return (
    <div className="rg-page">
      <section className="rg-hero">
        <span className="rg-pill">How to Play</span>
        <h1>Outwit. Outplay. Outscore.</h1>
        <p>
          Survivor Fantasy League blends the drama of the island with a weekly dose of strategy. Recruit your favorite
          castaways, set your roster, and climb the leaderboard as the season unfolds.
        </p>
      </section>

      <section className="rg-section" style={{ marginTop: "3rem" }}>
        <div className="rg-grid rg-grid--two">
          <article className="rg-card">
            <h3>Game Overview</h3>
            <p>
              Survivor Fantasy League operates like fantasy football. Players draft castaways, set active contestants
              weekly, and earn points based on real episode events.
            </p>
          </article>
          <article className="rg-card">
            <h3>Snake Draft System</h3>
            <p>
              Rankings lock in before the season. The admin launches a live snake draft that honors every ranking list
              and delivers two castaways per player.
            </p>
          </article>
          <article className="rg-card">
            <h3>Weekly Picks</h3>
            <p>
              Each week you choose one of your drafted castaways to go active. Picks lock 12 hours before the episode so
              plan your moves carefully.
            </p>
          </article>
          <article className="rg-card">
            <h3>Season End</h3>
            <p>
              Leaderboards reset when the Sole Survivor is crowned. Bragging rights are eternal — cash payouts are not.
            </p>
          </article>
        </div>
      </section>

      <section className="rg-section" style={{ marginTop: "3rem" }}>
        <h2>Help &amp; Contact</h2>
        <div className="rg-grid rg-grid--two">
          <article className="rg-card">
            <h3>How does the draft work?</h3>
            <p>
              After everyone submits rankings, the admin hits “Run Draft”. The snake draft assigns two castaways per
              player using those rankings. Results post instantly.
            </p>
          </article>
          <article className="rg-card">
            <h3>What if I forgot to pick?</h3>
            <p>
              Missing a pick triggers an auto-selection and a light penalty. You&apos;ll never be left without an active
              contestant, but don&apos;t make it a habit.
            </p>
          </article>
        </div>
        <p style={{ marginTop: "2rem" }}>
          Need more help? Contact <a href="mailto:support@realitygamesfantasyleague.com">support@realitygamesfantasyleague.com</a>
        </p>
      </section>
    </div>
  );
};

export default HowToPlay;
