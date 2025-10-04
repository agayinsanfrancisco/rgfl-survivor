import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import api from "@/lib/api";
const PreseasonRank = () => {
    const [rows, setRows] = useState([]);
    const [locked, setLocked] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    useEffect(() => {
        async function load() {
            try {
                const res = await api.get("/api/rankings/me");
                setLocked(res.data.locked ?? false);
                const order = res.data.order;
                setRows(order);
            }
            catch (error) {
                console.error("Failed to load rankings:", error);
            }
        }
        load();
    }, []);
    const move = (from, to) => {
        if (locked || to < 0 || to >= rows.length)
            return;
        const updated = [...rows];
        const [moved] = updated.splice(from, 1);
        updated.splice(to, 0, moved);
        setRows(updated);
        setMessage(null);
    };
    const save = async () => {
        if (locked)
            return;
        setSaving(true);
        setMessage(null);
        try {
            await api.post("/api/rankings/me", {
                order: rows.map((row) => row.castawayId)
            });
            setMessage("Rankings saved! Once the draft runs, they will be locked.");
        }
        catch (error) {
            console.error("Failed to save rankings:", error);
            setMessage(error?.response?.data?.error ?? "Unable to save rankings");
        }
        finally {
            setSaving(false);
        }
    };
    return (_jsxs("div", { className: "rg-page", children: [_jsxs("section", { className: "rg-hero", style: { maxWidth: 720 }, children: [_jsx("span", { className: "rg-pill", children: "Preseason Rankings" }), _jsx("h1", { children: "Drag and drop your castaway big board." }), _jsx("p", { children: "Your ranking determines draft order once the admin launches the snake draft. Make sure every castaway is ordered before the deadline." }), locked && _jsx("p", { style: { color: "crimson" }, children: "Rankings are locked. Await draft results." })] }), _jsxs("section", { className: "rg-section", style: { marginTop: "3rem", maxWidth: 720 }, children: [_jsx("ol", { style: { paddingLeft: "1.25rem", display: "grid", gap: "0.75rem" }, children: rows.map((row, index) => (_jsxs("li", { className: "rg-card", style: { display: "flex", alignItems: "center", gap: "1rem" }, children: [_jsx("span", { style: { fontWeight: 700 }, children: index + 1 }), _jsx("span", { style: { flex: 1 }, children: row.castaway.name }), _jsxs("div", { style: { display: "flex", gap: "0.5rem" }, children: [_jsx("button", { onClick: () => move(index, index - 1), disabled: locked || index === 0, children: "\u2191" }), _jsx("button", { onClick: () => move(index, index + 1), disabled: locked || index === rows.length - 1, children: "\u2193" })] })] }, row.castawayId))) }), _jsxs("div", { style: { marginTop: "1.5rem" }, children: [_jsx("button", { onClick: save, disabled: locked || saving, children: saving ? "Saving..." : "Save Rankings" }), message && _jsx("p", { style: { marginTop: 12 }, children: message })] })] })] }));
};
export default PreseasonRank;
