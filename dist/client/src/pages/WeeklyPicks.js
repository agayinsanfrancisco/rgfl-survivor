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
    return (_jsxs("div", { className: "container", children: [_jsx("h2", { children: "Weekly Pick" }), weekInfo && _jsxs("p", { children: ["Week ", weekInfo.weekNumber] }), lockMessage && _jsx("p", { children: lockMessage }), _jsx("p", { children: "Select one of your drafted castaways to be active this week:" }), _jsx("div", { className: "castaway-grid", children: assigned.map((assignment) => (_jsxs("div", { className: `castaway-card ${selectedId === assignment.castawayId ? "selected" : ""}`, onClick: () => setSelectedId(assignment.castawayId), children: [_jsx("img", { src: assignment.castaway.imageUrl || "/default-avatar.png", alt: assignment.castaway.name, className: "avatar" }), _jsx("h4", { children: assignment.castaway.name }), _jsx("p", { children: assignment.castaway.tribe }), _jsxs("p", { children: ["Round ", assignment.round] })] }, assignment.castawayId))) }), _jsx("button", { className: "button", onClick: handleSubmit, disabled: !selectedId || status === "saving", style: { marginTop: 24 }, children: status === "saving" ? "Submitting..." : "Submit Pick" }), status === "success" && _jsx("p", { style: { color: "green" }, children: "Pick submitted successfully!" }), errorMessage && _jsx("p", { style: { color: "crimson" }, children: errorMessage }), _jsx("style", { children: `
        .castaway-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 16px;
          margin-top: 20px;
        }
        .castaway-card {
          cursor: pointer;
          border: 2px solid #ccc;
          border-radius: 12px;
          padding: 12px;
          text-align: center;
          transition: 0.2s ease;
        }
        .castaway-card.selected {
          border-color: #007bff;
          background-color: #eaf3ff;
        }
        .avatar {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 50%;
          margin-bottom: 8px;
        }
      ` })] }));
};
export default WeeklyPicks;
