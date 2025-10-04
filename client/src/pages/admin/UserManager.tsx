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
      .then(res => {
        setUsers(res.data);
        setError(null);
      })
      .catch(err => {
        console.error("Failed to load users:", err);
        setError("Unable to load users.");
      });
  }, []);

  return (
    <div>
      <h2>All Users</h2>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
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
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.isAdmin ? "Admin" : "Player"}</td>
              <td>{u.createdAt?.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManager;
