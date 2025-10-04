import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { routes } from "@/shared/routes";
const Splash = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    React.useEffect(() => {
        if (user) {
            navigate(user.isAdmin ? routes.admin.index : routes.dashboard);
        }
    }, [user, navigate]);
    return (_jsx("main", { className: "rg-page", children: _jsxs("section", { className: "rg-hero", style: { textAlign: "center", alignItems: "center" }, children: [_jsx("span", { className: "rg-pill", children: "Reality Games Fantasy League" }), _jsx("h1", { children: "Outwit. Outplay. Outscore." }), _jsx("p", { style: { maxWidth: 580 }, children: "Welcome to the Ultimate Survivor Fantasy League. Rank every castaway, conquer the snake draft, and ride your weekly picks to the top of the leaderboard." }), _jsxs("div", { style: { display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1rem" }, children: [_jsx("button", { onClick: () => navigate(routes.signup), children: "Join the League" }), _jsx("button", { style: { background: "rgba(45, 32, 24, 0.08)", color: "var(--text-dark)" }, onClick: () => navigate(routes.howToPlay), children: "Learn How It Works" })] }), _jsx("div", { style: { fontSize: "2rem", marginTop: "2rem" }, "aria-hidden": "true", children: "\uD83D\uDD25" })] }) }));
};
export default Splash;
