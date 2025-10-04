import React from "react";
import { Link } from "react-router-dom";
import { routes } from "@/shared/routes";

const Dashboard: React.FC = () => {
  return (
    <div className="container">
      <h2>Welcome to Your Dashboard</h2>
      <p>Select an option below to begin:</p>
      <ul>
        <li><Link to={routes.weeklyPicks}>Weekly Picks</Link></li>
        <li><Link to={routes.preseasonRank}>Preseason Rank</Link></li>
        <li><Link to={routes.leaderboard}>Leaderboard</Link></li>
        <li><Link to={routes.profile}>Your Profile</Link></li>
      </ul>
    </div>
  );
};

export default Dashboard;
