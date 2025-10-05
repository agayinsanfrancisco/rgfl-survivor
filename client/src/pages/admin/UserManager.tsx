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
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/users");
      setUsers(res.data);
      setError(null);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError("Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleAdmin = async (userId: string, currentAdmin: boolean) => {
    if (!window.confirm(`${currentAdmin ? "Remove" : "Grant"} admin privileges for this user?`)) {
      return;
    }

    try {
      await api.put(`/api/users/${userId}/admin`, { isAdmin: !currentAdmin });
      await loadUsers();
    } catch (err) {
      console.error("Failed to toggle admin:", err);
      setError("Failed to update user role.");
    }
  };

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
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      backgroundColor: u.isAdmin ? "var(--primary)" : "var(--text-muted)",
                      color: "white",
                      fontSize: "0.875rem"
                    }}>
                      {u.isAdmin ? "Admin" : "Player"}
                    </span>
                  </td>
                  <td>{u.createdAt?.slice(0, 10)}</td>
                  <td>
                    <button
                      onClick={() => toggleAdmin(u.id, u.isAdmin)}
                      style={{ fontSize: "0.875rem", padding: "0.35rem 0.75rem" }}
                    >
                      {u.isAdmin ? "Remove Admin" : "Make Admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default UserManager;
