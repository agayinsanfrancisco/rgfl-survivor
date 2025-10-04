import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import api from "@/lib/api";
const STORAGE_KEY = "rgfl_preseason_rankings";
const PreseasonRank = () => {
    const [castaways, setCastaways] = useState([]);
    const [rankings, setRankings] = useState([]);
    const [status, setStatus] = useState("idle");
    useEffect(() => {
        async function load() {
            try {
                const res = await api.get("/api/castaways");
                const ids = res.data.map((c) => c.id);
                setCastaways(res.data);
                if (typeof window !== "undefined") {
                    const stored = window.localStorage.getItem(STORAGE_KEY);
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        setRankings(parsed.filter(id => ids.includes(id)));
                        return;
                    }
                }
                setRankings(ids);
            }
            catch (error) {
                console.error("Failed to load castaways:", error);
            }
        }
        load();
    }, []);
    const move = (from, to) => {
        if (to < 0 || to >= rankings.length)
            return;
        const updated = [...rankings];
        const [moved] = updated.splice(from, 1);
        updated.splice(to, 0, moved);
        setRankings(updated);
        setStatus("idle");
    };
    const save = () => {
        if (typeof window === "undefined")
            return;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rankings));
        setStatus("saved");
    };
    return (_jsxs("div", { className: "container", children: [_jsx("h2", { children: "Preseason Rankings" }), _jsx("ol", { children: rankings.map((id, index) => {
                    const castaway = castaways.find(c => c.id === id);
                    if (!castaway)
                        return null;
                    return (_jsxs("li", { children: [castaway.name, _jsx("button", { onClick: () => move(index, index - 1), disabled: index === 0, children: "\u2191" }), _jsx("button", { onClick: () => move(index, index + 1), disabled: index === rankings.length - 1, children: "\u2193" })] }, id));
                }) }), _jsx("button", { onClick: save, children: "Save Rankings" }), status === "saved" && _jsx("p", { style: { color: "green" }, children: "Rankings saved to this browser." })] }));
};
export default PreseasonRank;
