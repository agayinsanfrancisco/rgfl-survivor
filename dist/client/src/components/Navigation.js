import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { routes } from "@/shared/routes";
const Navigation = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate(routes.login);
    };
    return (_jsxs("nav", { children: [_jsx(Link, { to: routes.splash, children: "Home" }), user ? (_jsxs(_Fragment, { children: [_jsx(Link, { to: routes.dashboard, children: "Dashboard" }), _jsx(Link, { to: routes.weeklyPicks, children: "Weekly Picks" }), _jsx(Link, { to: routes.preseasonRank, children: "Preseason Rank" }), _jsx(Link, { to: routes.leaderboard, children: "Leaderboard" }), _jsx(Link, { to: routes.profile, children: "Profile" }), user.isAdmin && _jsx(Link, { to: routes.admin.index, children: "Admin" }), _jsx("button", { onClick: handleLogout, style: { marginLeft: 16 }, children: "Logout" })] })) : (_jsxs(_Fragment, { children: [_jsx(Link, { to: routes.login, children: "Login" }), _jsx(Link, { to: routes.signup, children: "Sign Up" })] }))] }));
};
export default Navigation;
