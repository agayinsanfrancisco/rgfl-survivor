import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "../context/AuthContext";
const WeeklyPicks = () => {
    const { user } = useAuth();
    const [castaways, setCastaways] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [status, setStatus] = useState("idle");
    useEffect(() => {
        api.get("/api/castaways")
            .then((res) => setCastaways(res.data))
            .catch(() => setCastaways([]));
    }, []);
    const handleSubmit = async () => {
        if (!selectedId || !user)
            return;
        setStatus("saving");
        try {
            await api.post("/api/picks", {
                userId: user.id,
                castawayId: selectedId,
            });
            setStatus("success");
        }
        catch {
            setStatus("error");
        }
    };
    return (_jsxs("div", { className: "container", children: [_jsx("h2", { children: "Weekly Pick" }), _jsx("p", { children: "Select one castaway to represent you this week:" }), _jsx("div", { className: "castaway-grid", children: castaways.map((c) => (_jsxs("div", { className: `castaway-card ${selectedId === c.id ? "selected" : ""}`, onClick: () => setSelectedId(c.id), children: [_jsx("img", { src: c.imageUrl || "/default-avatar.png", alt: c.name, className: "avatar" }), _jsx("h4", { children: c.name }), _jsx("p", { children: c.tribe })] }, c.id))) }), _jsx("button", { className: "button", onClick: handleSubmit, disabled: !selectedId || status === "saving", style: { marginTop: 24 }, children: status === "saving" ? "Submitting..." : "Submit Pick" }), status === "success" && _jsx("p", { style: { color: "green" }, children: "Pick submitted successfully!" }), status === "error" && _jsx("p", { style: { color: "crimson" }, children: "Submission failed. Try again." }), _jsx("style", { children: `
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
