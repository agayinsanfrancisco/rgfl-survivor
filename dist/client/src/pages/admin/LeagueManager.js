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
        return _jsx("div", { className: "rg-page", style: { color: "crimson" }, children: error });
    }
    if (!league)
        return _jsx("div", { className: "rg-page", children: "Loading..." });
    return (_jsxs("div", { className: "rg-page", children: [_jsxs("section", { className: "rg-hero", children: [_jsx("span", { className: "rg-pill", children: "League Settings" }), _jsx("h1", { children: league.name }), _jsxs("p", { children: ["League code: ", league.code, " \u00B7 Total members: ", league.users.length] })] }), _jsx("section", { className: "rg-section", style: { marginTop: "3rem" }, children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Name" }), _jsx("th", { children: "Email" }), _jsx("th", { children: "Role" })] }) }), _jsx("tbody", { children: league.users.map((member) => (_jsxs("tr", { children: [_jsx("td", { children: member.name }), _jsx("td", { children: member.email }), _jsx("td", { children: member.isAdmin ? "Admin" : "Player" })] }, member.id))) })] }) })] }));
};
export default LeagueManager;
