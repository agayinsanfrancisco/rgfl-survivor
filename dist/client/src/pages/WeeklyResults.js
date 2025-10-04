import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import api from "@/lib/api";
const WeeklyResults = () => {
    const [results, setResults] = useState([]);
    useEffect(() => {
        api.get("/api/results")
            .then(res => setResults(res.data))
            .catch(() => setResults([]));
    }, []);
    return (_jsxs("div", { className: "container", children: [_jsx("h2", { children: "Weekly Results" }), results.length === 0 ? (_jsx("p", { children: "No results posted yet." })) : (_jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Week" }), _jsx("th", { children: "Castaway" }), _jsx("th", { children: "Points" })] }) }), _jsx("tbody", { children: results.map(result => (_jsxs("tr", { children: [_jsx("td", { children: result.weekNumber }), _jsx("td", { children: result.castaway.name }), _jsx("td", { children: result.points })] }, result.id))) })] }))] }));
};
export default WeeklyResults;
