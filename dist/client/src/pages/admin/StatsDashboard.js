import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import api from "@/lib/api";
const StatsDashboard = () => {
    const [stats, setStats] = useState(null);
    useEffect(() => {
        api.get("/api/admin/stats").then(setStats);
    }, []);
    if (!stats)
        return _jsx("div", { children: "Loading stats\u2026" });
    return (_jsxs("div", { children: [_jsx("h2", { children: "System Stats" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Total Users: ", stats.users] }), _jsxs("li", { children: ["Total Picks: ", stats.picks] }), _jsxs("li", { children: ["Total Castaways: ", stats.castaways] })] })] }));
};
export default StatsDashboard;
