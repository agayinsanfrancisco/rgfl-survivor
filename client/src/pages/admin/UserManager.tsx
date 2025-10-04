import React, { useEffect, useState } from "react";
import api from "@/lib/api";

const UserManager = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    api.get("/api/users").then(res => setUsers(res.data));
  }, []);

  return (
    <div>
      <h2>All Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.createdAt?.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManager;