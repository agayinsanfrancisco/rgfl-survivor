import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { routes } from "@/shared/routes";
const navLinks = [
    { label: "Home", to: routes.root },
    { label: "About", to: routes.about },
    { label: "Weekly Picks", to: routes.weeklyPicks },
    { label: "Global leaderboard", to: routes.leaderboard },
    { label: "League", to: routes.league },
    { label: "Contact", to: routes.contact },
    { label: "Rules", to: routes.rules }
];
const Navigation = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const handleLogout = () => {
        logout();
        navigate(routes.login);
    };
    return (_jsxs("header", { className: "rg-nav", children: [_jsxs("div", { className: "rg-nav__brand", onClick: () => navigate(routes.root), onKeyDown: (e) => {
                    if (e.key === "Enter" || e.key === " ")
                        navigate(routes.root);
                }, role: "button", tabIndex: 0, children: [_jsx("span", { className: "rg-nav__logo", children: "Reality Games" }), _jsx("span", { className: "rg-nav__subtitle", children: "Fantasy League" })] }), _jsx("nav", { className: "rg-nav__links", children: navLinks.map((link) => {
                    const active = location.pathname === link.to || location.pathname.startsWith(`${link.to}/`);
                    return (_jsx(Link, { to: link.to, className: active ? "active" : undefined, children: link.label }, link.to));
                }) }), _jsx("div", { className: "rg-nav__actions", children: user ? (_jsxs(_Fragment, { children: [_jsx("button", { className: "rg-nav__bell", "aria-label": "Notifications", children: "\uD83D\uDD14" }), user.isAdmin && (_jsx(Link, { to: routes.admin.index, className: "rg-nav__admin", children: "Admin" })), _jsx("div", { className: "rg-nav__avatar", title: user.name, children: user.name.slice(0, 1).toUpperCase() }), _jsx("button", { className: "rg-nav__auth", onClick: handleLogout, children: "Logout" })] })) : (_jsxs(_Fragment, { children: [_jsx("button", { className: "rg-nav__auth", onClick: () => navigate(routes.login), children: "Login" }), _jsx("button", { className: "rg-nav__cta", onClick: () => navigate(routes.signup), children: "Join the League" })] })) })] }));
};
export default Navigation;
