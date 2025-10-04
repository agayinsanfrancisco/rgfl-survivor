import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { routes } from "@/shared/routes";

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(routes.login);
  };

  return (
    <nav>
      <Link to={routes.splash}>Home</Link>
      {user ? (
        <>
          <Link to={routes.dashboard}>Dashboard</Link>
          <Link to={routes.weeklyPicks}>Weekly Picks</Link>
          <Link to={routes.preseasonRank}>Preseason Rank</Link>
          <Link to={routes.leaderboard}>Leaderboard</Link>
          <Link to={routes.profile}>Profile</Link>
          {user.isAdmin && <Link to={routes.admin.index}>Admin</Link>}
          <button onClick={handleLogout} style={{ marginLeft: 16 }}>Logout</button>
        </>
      ) : (
        <>
          <Link to={routes.login}>Login</Link>
          <Link to={routes.signup}>Sign Up</Link>
        </>
      )}
    </nav>
  );
};

export default Navigation;

