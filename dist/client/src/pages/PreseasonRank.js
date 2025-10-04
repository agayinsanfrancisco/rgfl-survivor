import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import api from "@/lib/api";
const PreseasonRank = () => {
    const [castaways, setCastaways] = useState([]);
    const [rankings, setRankings] = useState([]);
    useEffect(() => {
        api.get("/api/castaways").then(res => {
            setCastaways(res.data);
            setRankings(res.data.map((c) => c.id));
        });
    }, []);
    const move = (from, to) => {
        const updated = [...rankings];
        const [moved] = updated.splice(from, 1);
        updated.splice(to, 0, moved);
        setRankings(updated);
    };
    const save = async () => {
        await api.post("/api/rankings", { rankings });
        alert("Rankings saved!");
    };
    return (_jsxs("div", { className: "container", children: [_jsx("h2", { children: "Preseason Rankings" }), _jsx("ol", { children: rankings.map((id, index) => {
                    const castaway = castaways.find(c => c.id === id);
                    if (!castaway)
                        return null;
                    return (_jsxs("li", { children: [castaway.name, _jsx("button", { onClick: () => move(index, index - 1), disabled: index === 0, children: "\u2191" }), _jsx("button", { onClick: () => move(index, index + 1), disabled: index === rankings.length - 1, children: "\u2193" })] }, id));
                }) }), _jsx("button", { onClick: save, children: "Save Rankings" })] }));
};
export default PreseasonRank;
