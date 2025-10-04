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
    return (_jsxs("div", { className: "container", children: [_jsx("h2", { children: "Preseason Rankings" }), locked && _jsx("p", { style: { color: "crimson" }, children: "Rankings are locked. Await draft results." }), _jsx("ol", { children: rows.map((row, index) => (_jsxs("li", { style: { marginBottom: 8 }, children: [_jsxs("strong", { children: [index + 1, "."] }), " ", row.castaway.name, _jsx("button", { onClick: () => move(index, index - 1), disabled: locked || index === 0, style: { marginLeft: 8 }, children: "\u2191" }), _jsx("button", { onClick: () => move(index, index + 1), disabled: locked || index === rows.length - 1, style: { marginLeft: 4 }, children: "\u2193" })] }, row.castawayId))) }), _jsx("button", { onClick: save, disabled: locked || saving, children: saving ? "Saving..." : "Save Rankings" }), message && _jsx("p", { style: { marginTop: 12 }, children: message })] }));
};
export default PreseasonRank;
