import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "@/context/AuthContext";
import { routes } from "@/shared/routes";
import { Link } from "react-router-dom";
const AdminDashboard = () => {
    const { user } = useAuth();
    return (_jsxs("div", { className: "admin-dashboard", children: [_jsx("h1", { children: "Admin Dashboard" }), _jsxs("p", { children: ["Welcome, ", user?.name, "!"] }), _jsxs("ul", { children: [_jsx("li", { children: _jsx(Link, { to: routes.admin.castaways, children: "Manage Castaways" }) }), _jsx("li", { children: _jsx(Link, { to: routes.admin.users, children: "Manage Users" }) }), _jsx("li", { children: _jsx(Link, { to: routes.admin.league, children: "League Settings" }) }), _jsx("li", { children: _jsx(Link, { to: routes.admin.picks, children: "Manage Picks" }) }), _jsx("li", { children: _jsx(Link, { to: routes.admin.points, children: "Points/Scoring" }) }), _jsx("li", { children: _jsx(Link, { to: routes.admin.season, children: "Season Controls" }) }), _jsx("li", { children: _jsx(Link, { to: routes.admin.stats, children: "System Stats" }) })] })] }));
};
export default AdminDashboard;
