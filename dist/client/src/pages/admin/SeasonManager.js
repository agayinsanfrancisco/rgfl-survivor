import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import api from "@/lib/api";
const SeasonManager = () => {
    const [weekNumber, setWeekNumber] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [status, setStatus] = useState("idle");
    const createWeek = async (e) => {
        e.preventDefault();
        setStatus("saving");
        try {
            await api.post("/api/admin/week", {
                weekNumber: Number(weekNumber),
                isActive
            });
            setStatus("success");
        }
        catch (error) {
            console.error("Failed to create week:", error);
            setStatus("error");
        }
    };
    return (_jsxs("div", { className: "rg-page", children: [_jsxs("section", { className: "rg-hero", children: [_jsx("span", { className: "rg-pill", children: "Season Controls" }), _jsx("h1", { children: "Warm up the torches." }), _jsx("p", { children: "Activate the current week or schedule future lock dates. Weeks created here drive weekly picks and scoring." })] }), _jsxs("section", { className: "rg-section", style: { marginTop: "3rem", maxWidth: 420 }, children: [_jsxs("form", { onSubmit: createWeek, style: { display: "grid", gap: "0.75rem" }, children: [_jsx("label", { htmlFor: "season-week", children: "Week number" }), _jsx("input", { id: "season-week", placeholder: "Week number", value: weekNumber, onChange: (e) => setWeekNumber(e.target.value), required: true }), _jsxs("label", { style: { display: "flex", gap: "0.65rem", alignItems: "center" }, children: [_jsx("input", { type: "checkbox", checked: isActive, onChange: (e) => setIsActive(e.target.checked) }), "Active week"] }), _jsx("button", { type: "submit", disabled: status === "saving", children: status === "saving" ? "Saving..." : "Save week" })] }), status === "success" && _jsx("p", { style: { color: "green", marginTop: "0.75rem" }, children: "Week saved!" }), status === "error" && _jsx("p", { className: "error", children: "Failed to save week." })] })] }));
};
export default SeasonManager;
