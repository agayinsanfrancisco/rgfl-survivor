import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { routes } from "@/shared/routes";
const Navigation = () => {
    return (_jsx("nav", { children: _jsxs("ul", { children: [_jsx("li", { children: _jsx(Link, { to: routes.dashboard, children: "Dashboard" }) }), _jsx("li", { children: _jsx(Link, { to: routes.profile, children: "Profile" }) }), _jsx("li", { children: _jsx(Link, { to: routes.weeklyPicks, children: "Weekly Picks" }) }), _jsx("li", { children: _jsx(Link, { to: routes.weeklyResults, children: "Weekly Results" }) }), _jsx("li", { children: _jsx(Link, { to: routes.preseasonRank, children: "Preseason Rank" }) }), _jsx("li", { children: _jsx(Link, { to: routes.leaderboard, children: "Leaderboard" }) })] }) }));
};
export default Navigation;
