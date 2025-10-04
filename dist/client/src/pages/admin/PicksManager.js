import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import api from "@/lib/api";
const PicksManager = () => {
    const [picks, setPicks] = useState([]);
    const [weekNumber, setWeekNumber] = useState("1");
    const [error, setError] = useState(null);
    const loadPicks = async (week) => {
        try {
            const res = await api.get(`/api/picks/week/${week}`);
            setPicks(res.data);
            setError(null);
        }
        catch (err) {
            console.error("Failed to load picks:", err);
            setPicks([]);
            setError("Unable to load picks for that week.");
        }
    };
    useEffect(() => {
        loadPicks(weekNumber);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!weekNumber)
            return;
        loadPicks(weekNumber);
    };
    return (_jsxs("div", { children: [_jsx("h2", { children: "Picks This Week" }), _jsxs("form", { onSubmit: handleSubmit, style: { marginBottom: 16 }, children: [_jsx("input", { placeholder: "Week Number", value: weekNumber, onChange: e => setWeekNumber(e.target.value), style: { width: 120, marginRight: 8 } }), _jsx("button", { type: "submit", children: "Load Picks" })] }), error && _jsx("p", { style: { color: "crimson" }, children: error }), _jsx("ul", { children: picks.map(p => (_jsxs("li", { children: [p.user?.name ?? "Unknown", " picked ", p.castaway?.name ?? "Unknown"] }, p.id))) })] }));
};
export default PicksManager;
