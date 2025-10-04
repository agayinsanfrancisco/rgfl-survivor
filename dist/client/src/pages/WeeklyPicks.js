import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import api from "@/lib/api";
const WeeklyPicks = () => {
    const [assigned, setAssigned] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [status, setStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState(null);
    const [weekInfo, setWeekInfo] = useState(null);
    useEffect(() => {
        async function load() {
            try {
                const res = await api.get("/api/picks/me");
                if (!res.data) {
                    setErrorMessage("No active week is available yet.");
                    return;
                }
                setAssigned(res.data.assigned ?? []);
                if (res.data.pick?.castawayId) {
                    setSelectedId(res.data.pick.castawayId);
                }
                if (res.data.week) {
                    setWeekInfo({
                        weekNumber: res.data.week.weekNumber,
                        lockAt: res.data.week.lockAt
                    });
                }
            }
            catch (error) {
                if (error?.response?.status === 404) {
                    setErrorMessage("No active week is available yet.");
                    return;
                }
                console.error("Failed to load weekly picks data:", error);
                setErrorMessage("Unable to load weekly picks right now.");
            }
        }
        load();
    }, []);
    const handleSubmit = async () => {
        if (!selectedId)
            return;
        setStatus("saving");
        setErrorMessage(null);
        try {
            await api.post("/api/picks/me", {
                castawayId: selectedId
            });
            setStatus("success");
        }
        catch (error) {
            console.error("Failed to save pick:", error);
            setStatus("error");
            setErrorMessage(error?.response?.data?.error ?? "Submission failed. Try again.");
        }
    };
    const lockMessage = weekInfo?.lockAt
        ? `Picks lock at ${new Date(weekInfo.lockAt).toLocaleString()}`
        : undefined;
    return (_jsxs("div", { className: "rg-page", children: [_jsxs("section", { className: "rg-hero", children: [_jsx("span", { className: "rg-pill", children: "Weekly Picks" }), _jsxs("h1", { children: ["Week ", weekInfo?.weekNumber ?? "--", " \u2014 Choose your active castaway"] }), _jsx("p", { children: "Make your selection before the lock deadline. Only drafted castaways are eligible each week, and once the episode airs, your points are locked in." }), lockMessage && _jsx("p", { style: { color: "var(--text-muted)" }, children: lockMessage })] }), _jsxs("section", { className: "rg-section", style: { marginTop: "3rem" }, children: [errorMessage && _jsx("p", { className: "error", children: errorMessage }), _jsxs("div", { className: "rg-grid rg-grid--two", style: { gap: "1.5rem" }, children: [assigned.map((assignment) => {
                                const active = selectedId === assignment.castawayId;
                                return (_jsxs("article", { className: "rg-card", style: {
                                        border: active ? `2px solid var(--brand-red)` : undefined,
                                        cursor: "pointer"
                                    }, onClick: () => setSelectedId(assignment.castawayId), children: [_jsx("h3", { children: assignment.castaway.name }), _jsx("p", { style: { color: "var(--text-muted)", marginBottom: "0.75rem" }, children: assignment.castaway.tribe ?? "" }), _jsxs("p", { children: ["Round ", assignment.round] })] }, assignment.castawayId));
                            }), assigned.length === 0 && (_jsx("p", { children: "No draft picks assigned yet. The draft will run as soon as rankings are locked." }))] }), _jsxs("div", { style: { marginTop: "2rem" }, children: [_jsx("button", { onClick: handleSubmit, disabled: !selectedId || status === "saving", children: status === "saving" ? "Submitting..." : "Submit Pick" }), status === "success" && _jsx("p", { style: { color: "green", marginTop: "0.75rem" }, children: "Pick submitted successfully!" })] })] })] }));
};
export default WeeklyPicks;
