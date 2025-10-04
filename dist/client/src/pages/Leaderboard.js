import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import api from "@/lib/api";
const Leaderboard = () => {
    const [entries, setEntries] = useState([]);
    const [error, setError] = useState(null);
    const [tab, setTab] = useState("live");
    useEffect(() => {
        api
            .get("/api/league/standings")
            .then((res) => {
            setEntries(res.data);
            setError(null);
        })
            .catch(() => {
            setEntries([]);
            setError("Unable to load leaderboard right now.");
        });
    }, []);
    return (_jsxs("div", { className: "rg-page", children: [_jsxs("section", { className: "rg-hero", children: [_jsx("span", { className: "rg-pill", children: "Leaderboard" }), _jsx("h1", { children: "Live rankings updated after every Tribal Council." }), _jsx("p", { children: "Track momentum week by week. Dive into active picks, rival totals, and trends for the entire league in one place." })] }), _jsxs("section", { className: "rg-section", style: { marginTop: "3rem" }, children: [error && _jsx("p", { className: "error", children: error }), _jsxs("div", { className: "rg-tabs", children: [_jsx("button", { type: "button", className: `rg-tab ${tab === "live" ? "active" : ""}`, onClick: () => setTab("live"), children: "Live Rankings" }), _jsx("button", { type: "button", className: `rg-tab ${tab === "weekly" ? "active" : ""}`, onClick: () => setTab("weekly"), children: "Weekly Picks" }), _jsx("button", { type: "button", className: `rg-tab ${tab === "members" ? "active" : ""}`, onClick: () => setTab("members"), children: "Members List" })] }), entries.length === 0 && !error && _jsx("p", { children: "No leaderboard data available yet." }), tab === "live" && entries.length > 0 && (_jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Rank" }), _jsx("th", { children: "Player" }), _jsx("th", { children: "Total Points" }), _jsx("th", { children: "Roster" })] }) }), _jsx("tbody", { children: entries.map((entry, index) => (_jsxs("tr", { children: [_jsx("td", { children: index + 1 }), _jsx("td", { children: entry.name }), _jsx("td", { children: entry.totalPoints }), _jsx("td", { children: (entry.draftPicks ?? []).map((pick) => pick.castaway.name).join(", ") || "--" })] }, entry.id))) })] })), tab === "weekly" && (_jsx("div", { className: "rg-grid", style: { gap: "1.25rem" }, children: entries.map((entry) => (_jsxs("article", { className: "rg-card", children: [_jsx("h3", { children: entry.name }), _jsx("p", { style: { color: "var(--text-muted)" }, children: entry.email }), _jsx("p", { style: { marginTop: "1rem", fontWeight: 600 }, children: "Weekly Picks (latest first)" }), _jsxs("ul", { style: { paddingLeft: "1.1rem", margin: 0 }, children: [(entry.draftPicks ?? []).map((pick) => (_jsx("li", { children: pick.castaway.name }, pick.id))), (entry.draftPicks ?? []).length === 0 && _jsx("li", { children: "No picks assigned yet." })] })] }, entry.id))) })), tab === "members" && (_jsx("div", { className: "rg-grid rg-grid--two", children: entries.map((entry, index) => (_jsxs("article", { className: "rg-card", children: [_jsx("h3", { children: entry.name }), _jsx("p", { style: { color: "var(--text-muted)", marginBottom: "0.75rem" }, children: entry.email }), _jsx("p", { children: "Joined: 2025" }), _jsxs("p", { children: ["Rank: ", index + 1] })] }, entry.id))) }))] })] }));
};
export default Leaderboard;
