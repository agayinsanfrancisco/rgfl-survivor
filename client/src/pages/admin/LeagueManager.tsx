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
    return <div style={{ color: "crimson" }}>{error}</div>;
  }

  if (!league) return <div>Loading...</div>;

  return (
    <div>
      <h2>League Settings</h2>
      <p><strong>Name:</strong> {league.name}</p>
      <p><strong>Code:</strong> {league.code}</p>
      <p><strong>Members:</strong> {league.users.length}</p>
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
    </div>
  );
};

export default LeagueManager;
