import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "../context/AuthContext";
const WeeklyPicks = () => {
    const { user } = useAuth();
    const [castaways, setCastaways] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [status, setStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState(null);
    useEffect(() => {
        async function load() {
            try {
                const [castawaysRes, pickRes] = await Promise.all([
                    api.get("/api/castaways"),
                    api.get("/api/picks/me").catch(err => {
                        if (err?.response?.status === 404) {
                            setErrorMessage("No active week is available yet.");
                            return { data: null };
                        }
                        throw err;
                    })
                ]);
                setCastaways(castawaysRes.data);
                if (pickRes.data?.castawayId) {
                    setSelectedId(pickRes.data.castawayId);
                }
            }
            catch (error) {
                console.error("Failed to load weekly picks data:", error);
                setCastaways([]);
                setErrorMessage("Unable to load weekly picks right now.");
            }
        }
        if (user) {
            load();
        }
    }, [user]);
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
            setErrorMessage("Submission failed. Try again.");
        }
    };
    return (_jsxs("div", { className: "container", children: [_jsx("h2", { children: "Weekly Pick" }), _jsx("p", { children: "Select one castaway to represent you this week:" }), _jsx("div", { className: "castaway-grid", children: castaways.map((c) => (_jsxs("div", { className: `castaway-card ${selectedId === c.id ? "selected" : ""}`, onClick: () => setSelectedId(c.id), children: [_jsx("img", { src: c.imageUrl || "/default-avatar.png", alt: c.name, className: "avatar" }), _jsx("h4", { children: c.name }), _jsx("p", { children: c.tribe })] }, c.id))) }), _jsx("button", { className: "button", onClick: handleSubmit, disabled: !selectedId || status === "saving", style: { marginTop: 24 }, children: status === "saving" ? "Submitting..." : "Submit Pick" }), status === "success" && _jsx("p", { style: { color: "green" }, children: "Pick submitted successfully!" }), errorMessage && _jsx("p", { style: { color: "crimson" }, children: errorMessage }), _jsx("style", { children: `
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
