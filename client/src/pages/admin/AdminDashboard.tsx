import React from "react";
import { useAuth } from "@/context/AuthContext";
import { routes } from "@/shared/routes";
import { Link } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
      <ul>
        <li><Link to={routes.admin.castaways}>Manage Castaways</Link></li>
        <li><Link to={routes.admin.users}>Manage Users</Link></li>
        <li><Link to={routes.admin.league}>League Settings</Link></li>
        <li><Link to={routes.admin.picks}>Manage Picks</Link></li>
        <li><Link to={routes.admin.points}>Points/Scoring</Link></li>
        <li><Link to={routes.admin.season}>Season Controls</Link></li>
        <li><Link to={routes.admin.stats}>System Stats</Link></li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
