import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import api from "@/lib/api";
const Leaderboard = () => {
    const [entries, setEntries] = useState([]);
    useEffect(() => {
        api.get("/api/leaderboard")
            .then(res => setEntries(res.data))
            .catch(() => setEntries([]));
    }, []);
    return (_jsxs("div", { className: "container", children: [_jsx("h2", { children: "Leaderboard" }), entries.length === 0 ? (_jsx("p", { children: "No leaderboard data available." })) : (_jsx("ol", { children: entries.map((entry, i) => (_jsxs("li", { children: [entry.name, " \u2014 ", entry.score, " pts"] }, i))) }))] }));
};
export default Leaderboard;
