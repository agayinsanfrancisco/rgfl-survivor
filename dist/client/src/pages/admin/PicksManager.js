import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import api from "@/lib/api";
const PicksManager = () => {
    const [picks, setPicks] = useState([]);
    useEffect(() => {
        api.get("/api/picks/week/1").then(res => setPicks(res.data)); // TODO: dynamic week
    }, []);
    return (_jsxs("div", { children: [_jsx("h2", { children: "Picks This Week" }), _jsx("ul", { children: picks.map(p => (_jsxs("li", { children: [p.user?.name, " picked ", p.castaway?.name] }, p.id))) })] }));
};
export default PicksManager;
