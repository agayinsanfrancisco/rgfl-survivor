import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
const WeeklyResults = () => {
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        api
            .get("/api/results")
            .then((res) => {
            setResults(res.data);
            setError(null);
        })
            .catch(() => {
            setResults([]);
            setError("Unable to load weekly results.");
        });
    }, []);
    const grouped = useMemo(() => {
        const map = new Map();
        for (const result of results) {
            const list = map.get(result.weekNumber) ?? [];
            list.push(result);
            map.set(result.weekNumber, list);
        }
        const sortedWeeks = Array.from(map.keys()).sort((a, b) => b - a);
        return { map, sortedWeeks };
    }, [results]);
    const [selectedWeek, setSelectedWeek] = useState(null);
    useEffect(() => {
        if (grouped.sortedWeeks.length > 0 && !selectedWeek) {
            setSelectedWeek(grouped.sortedWeeks[0]);
        }
    }, [grouped, selectedWeek]);
    const weekResults = selectedWeek ? grouped.map.get(selectedWeek) ?? [] : [];
    return (_jsxs("div", { className: "rg-page", children: [_jsxs("section", { className: "rg-hero", children: [_jsx("span", { className: "rg-pill", children: "Weekly Results" }), _jsxs("h1", { children: ["Week ", selectedWeek ?? "--", " scoreboard"] }), _jsx("p", { children: "See how active selections performed this week. Scores update minutes after the episode airs, so you can watch the leaderboard shuffle in real time." })] }), _jsxs("section", { className: "rg-section", style: { marginTop: "3rem" }, children: [error && _jsx("p", { className: "error", children: error }), grouped.sortedWeeks.length > 0 && (_jsx("div", { className: "rg-tabs", children: grouped.sortedWeeks.map((week) => (_jsxs("button", { type: "button", className: `rg-tab ${selectedWeek === week ? "active" : ""}`, onClick: () => setSelectedWeek(week), children: ["Week ", week] }, week))) })), weekResults.length === 0 && !error ? (_jsx("p", { children: "No results posted yet." })) : null, weekResults.length > 0 && (_jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Castaway" }), _jsx("th", { children: "Tribe" }), _jsx("th", { children: "Points" })] }) }), _jsx("tbody", { children: weekResults
                                    .slice()
                                    .sort((a, b) => b.points - a.points)
                                    .map((result) => (_jsxs("tr", { children: [_jsx("td", { children: result.castaway.name }), _jsx("td", { children: result.castaway.tribe }), _jsx("td", { children: result.points })] }, result.id))) })] }))] })] }));
};
export default WeeklyResults;
