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
        return _jsx("div", { style: { color: "crimson" }, children: error });
    }
    if (!stats)
        return _jsx("div", { children: "Loading stats\u2026" });
    return (_jsxs("div", { children: [_jsx("h2", { children: "System Stats" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Total Users: ", stats.users] }), _jsxs("li", { children: ["Total Picks: ", stats.picks] }), _jsxs("li", { children: ["Total Castaways: ", stats.castaways] }), _jsxs("li", { children: ["Total Weeks: ", stats.weeks] })] })] }));
};
export default StatsDashboard;
