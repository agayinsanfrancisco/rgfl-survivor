import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import api from "@/lib/api";
const Leaderboard = () => {
    const [entries, setEntries] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        api
            .get("/api/league/standings")
            .then(res => {
            setEntries(res.data);
            setError(null);
        })
            .catch(() => {
            setEntries([]);
            setError("Unable to load leaderboard right now.");
        });
    }, []);
    return (_jsxs("div", { className: "container", children: [_jsx("h2", { children: "Leaderboard" }), error && _jsx("p", { style: { color: "crimson" }, children: error }), entries.length === 0 && !error && _jsx("p", { children: "No leaderboard data available." }), entries.length > 0 && (_jsx("ol", { children: entries.map((entry) => (_jsxs("li", { children: [entry.name, " \u2014 ", entry.totalPoints, " pts"] }, entry.id))) }))] }));
};
export default Leaderboard;
