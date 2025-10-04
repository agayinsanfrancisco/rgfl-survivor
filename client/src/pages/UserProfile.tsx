import React from "react";
import { useAuth } from "../context/AuthContext";

const UserProfile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return <div className="container">You are not logged in.</div>;

  return (
    <div className="container">
      <h2>User Profile</h2>
      <table>
        <tbody>
          <tr>
            <th>Name:</th>
            <td>{user.name}</td>
          </tr>
          <tr>
            <th>Email:</th>
            <td>{user.email}</td>
          </tr>
          <tr>
            <th>Admin:</th>
            <td>{user.isAdmin ? "Yes" : "No"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UserProfile;