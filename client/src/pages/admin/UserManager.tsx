import React, { useEffect, useState } from "react";
import api from "@/lib/api";

interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

const UserManager = () => {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/api/users")
      .then((res) => {
        setUsers(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to load users:", err);
        setError("Unable to load users.");
      });
  }, []);

  return (
    <div className="rg-page">
      <section className="rg-hero">
        <span className="rg-pill">User Management</span>
        <h1>See every Survivor fan in the league.</h1>
        <p>
          Manage player accounts, confirm admin access, and keep contact info tidy before big announcements or draft day.
        </p>
      </section>

      <section className="rg-section" style={{ marginTop: "3rem" }}>
        {error && <p className="error">{error}</p>}
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.isAdmin ? "Admin" : "Player"}</td>
                <td>{u.createdAt?.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default UserManager;
