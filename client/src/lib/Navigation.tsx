import { Link } from "react-router-dom";
import { routes } from "@/shared/routes";

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li><Link to={routes.dashboard}>Dashboard</Link></li>
        <li><Link to={routes.profile}>Profile</Link></li>
        <li><Link to={routes.weeklyPicks}>Weekly Picks</Link></li>
        <li><Link to={routes.weeklyResults}>Weekly Results</Link></li>
        <li><Link to={routes.preseasonRank}>Preseason Rank</Link></li>
        <li><Link to={routes.leaderboard}>Leaderboard</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;