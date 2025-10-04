import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import api from "@/lib/api";
const StatsDashboard = () => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        api
            .get("/api/admin/stats")
            .then(res => {
            setStats(res.data);
            setError(null);
        })
            .catch(err => {
            console.error("Failed to load stats:", err);
            setError("Unable to load stats.");
        });
    }, []);
    if (error) {
        return _jsx("div", { className: "rg-page", style: { color: "crimson" }, children: error });
    }
    if (!stats)
        return _jsx("div", { className: "rg-page", children: "Loading stats\u2026" });
    return (_jsxs("div", { className: "rg-page", children: [_jsxs("section", { className: "rg-hero", children: [_jsx("span", { className: "rg-pill", children: "System Stats" }), _jsx("h1", { children: "League health at a glance." })] }), _jsx("section", { className: "rg-section", style: { marginTop: "3rem" }, children: _jsxs("div", { className: "rg-grid rg-grid--two", children: [_jsxs("article", { className: "rg-stat-card", children: [_jsx("span", { children: "Total users" }), _jsx("strong", { children: stats.users })] }), _jsxs("article", { className: "rg-stat-card", children: [_jsx("span", { children: "Total picks submitted" }), _jsx("strong", { children: stats.picks })] }), _jsxs("article", { className: "rg-stat-card", children: [_jsx("span", { children: "Castaways in system" }), _jsx("strong", { children: stats.castaways })] }), _jsxs("article", { className: "rg-stat-card", children: [_jsx("span", { children: "Weeks configured" }), _jsx("strong", { children: stats.weeks })] })] }) })] }));
};
export default StatsDashboard;
