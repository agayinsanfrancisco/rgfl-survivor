import React from "react";

const Contact: React.FC = () => {
  return (
    <div className="rg-page">
      <section className="rg-hero">
        <span className="rg-pill">Contact</span>
        <h1>We&apos;re here to help your tribe survive.</h1>
        <p>
          Questions about rankings, draft day, or weekly scoring? Drop us a note and our game masters will get back to
          you faster than Jeff can extinguish a torch.
        </p>
      </section>

      <section className="rg-section" style={{ marginTop: "3rem" }}>
        <div className="rg-grid rg-grid--two">
          <article className="rg-card">
            <h3>Email Support</h3>
            <p>
              <a href="mailto:support@realitygamesfantasyleague.com">support@realitygamesfantasyleague.com</a>
            </p>
            <p>Average response time: under 24 hours during the season.</p>
          </article>
          <article className="rg-card">
            <h3>Community Slack</h3>
            <p>
              Join the Survivor strategy chat for waiver-wire gossip, twist predictions, and draft-night live threads.
              Coming soon — request an invite once you&apos;re in the league.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Contact;
