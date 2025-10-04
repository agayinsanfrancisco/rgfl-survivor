import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import api from "@/lib/api";
const WeeklyResults = () => {
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        api
            .get("/api/results")
            .then(res => {
            setResults(res.data);
            setError(null);
        })
            .catch(() => {
            setResults([]);
            setError("Unable to load weekly results.");
        });
    }, []);
    return (_jsxs("div", { className: "container", children: [_jsx("h2", { children: "Weekly Results" }), error && _jsx("p", { style: { color: "crimson" }, children: error }), results.length === 0 && !error ? (_jsx("p", { children: "No results posted yet." })) : null, results.length > 0 && (_jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Week" }), _jsx("th", { children: "Castaway" }), _jsx("th", { children: "Points" })] }) }), _jsx("tbody", { children: results.map(result => (_jsxs("tr", { children: [_jsx("td", { children: result.weekNumber }), _jsx("td", { children: result.castaway.name }), _jsx("td", { children: result.points })] }, result.id))) })] }))] }));
};
export default WeeklyResults;
