import React, { useEffect, useState } from "react";
import api from "@/lib/api";

interface LeagueWithUsers {
  id: string;
  name: string;
  code: string;
  users: Array<{ id: string; name: string; email: string; isAdmin: boolean }>;
}

const LeagueManager = () => {
  const [league, setLeague] = useState<LeagueWithUsers | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/api/league")
      .then((res) => {
        setLeague(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to load league:", err);
        setError("Unable to load league settings.");
      });
  }, []);

  if (error) {
    return <div className="rg-page" style={{ color: "crimson" }}>{error}</div>;
  }

  if (!league) return <div className="rg-page">Loading...</div>;

  return (
    <div className="rg-page">
      <section className="rg-hero">
        <span className="rg-pill">League Settings</span>
        <h1>{league.name}</h1>
        <p>League code: {league.code} · Total members: {league.users.length}</p>
      </section>

      <section className="rg-section" style={{ marginTop: "3rem" }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {league.users.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.isAdmin ? "Admin" : "Player"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default LeagueManager;
