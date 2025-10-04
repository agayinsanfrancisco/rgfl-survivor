import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import api from "@/lib/api";
const LeagueManager = () => {
    const [league, setLeague] = useState(null);
    useEffect(() => {
        api.get("/api/league").then(setLeague);
    }, []);
    if (!league)
        return _jsx("div", { children: "Loading..." });
    return (_jsxs("div", { children: [_jsx("h2", { children: "League Settings" }), _jsxs("p", { children: ["Name: ", league.name] }), _jsxs("p", { children: ["Members: ", league.members?.length] })] }));
};
export default LeagueManager;
