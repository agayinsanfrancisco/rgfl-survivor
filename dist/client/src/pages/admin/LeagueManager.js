import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import api from "@/lib/api";
const LeagueManager = () => {
    const [league, setLeague] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        api
            .get("/api/league")
            .then((res) => {
            setLeague(res.data);
            setError(null);
        })
            .catch((err) => {
            console.error("Failed to load league:", err);
            setError("Unable to load league settings.");
        });
    }, []);
    if (error) {
        return _jsx("div", { style: { color: "crimson" }, children: error });
    }
    if (!league)
        return _jsx("div", { children: "Loading..." });
    return (_jsxs("div", { children: [_jsx("h2", { children: "League Settings" }), _jsxs("p", { children: [_jsx("strong", { children: "Name:" }), " ", league.name] }), _jsxs("p", { children: [_jsx("strong", { children: "Code:" }), " ", league.code] }), _jsxs("p", { children: [_jsx("strong", { children: "Members:" }), " ", league.users.length] }), _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Name" }), _jsx("th", { children: "Email" }), _jsx("th", { children: "Role" })] }) }), _jsx("tbody", { children: league.users.map((member) => (_jsxs("tr", { children: [_jsx("td", { children: member.name }), _jsx("td", { children: member.email }), _jsx("td", { children: member.isAdmin ? "Admin" : "Player" })] }, member.id))) })] })] }));
};
export default LeagueManager;
