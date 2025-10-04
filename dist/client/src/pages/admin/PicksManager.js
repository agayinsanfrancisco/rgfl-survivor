import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import api from "@/lib/api";
const PicksManager = () => {
    const [status, setStatus] = useState("UNKNOWN");
    const [picks, setPicks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const loadStatus = async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/draft/status");
            setStatus(res.data.draftStatus ?? "UNKNOWN");
            setPicks(res.data.picks ?? []);
            setMessage(null);
        }
        catch (error) {
            console.error("Failed to load draft status:", error);
            setMessage("Unable to load draft data");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadStatus();
    }, []);
    const runDraft = async () => {
        setMessage(null);
        setLoading(true);
        try {
            const res = await api.post("/api/draft/run");
            setStatus("COMPLETED");
            setPicks(res.data.picks ?? []);
            setMessage("Draft completed successfully");
        }
        catch (error) {
            console.error("Failed to run draft:", error);
            setMessage(error?.response?.data?.error ?? "Unable to run draft");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { children: [_jsx("h2", { children: "Draft Manager" }), _jsxs("p", { children: ["Draft status: ", status] }), _jsx("button", { onClick: runDraft, disabled: loading || status === "COMPLETED", style: { marginBottom: 16 }, children: loading ? "Processing..." : status === "COMPLETED" ? "Draft Completed" : "Run Draft" }), _jsx("button", { onClick: loadStatus, disabled: loading, style: { marginLeft: 8 }, children: "Refresh" }), message && _jsx("p", { style: { marginTop: 12 }, children: message }), _jsxs("table", { style: { width: "100%", marginTop: 16 }, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Pick #" }), _jsx("th", { children: "User" }), _jsx("th", { children: "Castaway" }), _jsx("th", { children: "Round" })] }) }), _jsx("tbody", { children: picks.map((pick) => (_jsxs("tr", { children: [_jsx("td", { children: pick.pickNumber }), _jsx("td", { children: pick.user?.name ?? pick.user?.email }), _jsx("td", { children: pick.castaway?.name }), _jsx("td", { children: pick.round })] }, pick.id))) })] })] }));
};
export default PicksManager;
