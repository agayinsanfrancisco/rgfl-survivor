import React from "react";

const About: React.FC = () => {
  return (
    <div className="rg-page">
      <section className="rg-hero">
        <span className="rg-pill">About Survivor Fantasy League</span>
        <h1>A fantasy game built for Survivor superfans.</h1>
        <p>
          Our mission is to create the ultimate Survivor companion experience that deepens fan engagement
          through strategic gameplay, community building, and celebrating the show we all love.
        </p>
      </section>

      <section className="rg-section" style={{ marginTop: "3rem" }}>
        <h2>What We Do</h2>
        <div className="rg-grid rg-grid--two">
          <article className="rg-card">
            <h3>True Snake Draft</h3>
            <p>Build your team through an authentic snake draft system, just like the pros.</p>
          </article>
          <article className="rg-card">
            <h3>Weekly Active Picks</h3>
            <p>Make strategic decisions each week as alliances shift and gameplay intensifies.</p>
          </article>
          <article className="rg-card">
            <h3>Performance Scoring</h3>
            <p>Earn points for real Survivor moments: challenges, tribal councils, twists, and clutch moves.</p>
          </article>
          <article className="rg-card">
            <h3>Ad-Supported</h3>
            <p>Completely free to play with minimal, non-intrusive advertising to keep the servers running.</p>
          </article>
        </div>
      </section>

      <section className="rg-section" style={{ marginTop: "3rem" }}>
        <h2>Our Team</h2>
        <p>
          We&apos;re a small crew of Survivor superfans who have run a rules-heavy fantasy league for over a decade.
          Our backgrounds span software development, game design, and of course untold hours analyzing Survivor strategy.
          We wanted to share the experience with the broader community — the spreadsheets, the heated debates, the
          late-night power rankings.
        </p>
      </section>

      <section className="rg-section" style={{ marginTop: "3rem" }}>
        <h2>Monetization</h2>
        <p>
          Survivor Fantasy League is free to play and does not offer cash payouts. We keep the lights on with minimal,
          tasteful ads that help pay for hosting and ongoing development so the league can evolve season after season.
        </p>
        <div style={{ marginTop: "2rem" }}>
          <button>Join the League</button>
          <button style={{ marginLeft: "0.75rem" }}>Learn the Rules</button>
        </div>
      </section>
    </div>
  );
};

export default About;
