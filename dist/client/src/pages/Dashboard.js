import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { routes } from "@/shared/routes";
const Dashboard = () => {
    return (_jsxs("div", { className: "container", children: [_jsx("h2", { children: "Welcome to Your Dashboard" }), _jsx("p", { children: "Select an option below to begin:" }), _jsxs("ul", { children: [_jsx("li", { children: _jsx(Link, { to: routes.weeklyPicks, children: "Weekly Picks" }) }), _jsx("li", { children: _jsx(Link, { to: routes.preseasonRank, children: "Preseason Rank" }) }), _jsx("li", { children: _jsx(Link, { to: routes.leaderboard, children: "Leaderboard" }) }), _jsx("li", { children: _jsx(Link, { to: routes.profile, children: "Your Profile" }) })] })] }));
};
export default Dashboard;
