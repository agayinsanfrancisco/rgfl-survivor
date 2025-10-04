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
    return (_jsxs("div", { children: [_jsx("h2", { children: "Season Manager" }), _jsxs("form", { onSubmit: createWeek, children: [_jsx("input", { placeholder: "Week Number", value: weekNumber, onChange: e => setWeekNumber(e.target.value), required: true }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: isActive, onChange: e => setIsActive(e.target.checked) }), "Active Week"] }), _jsx("button", { type: "submit", disabled: status === "saving", children: status === "saving" ? "Saving..." : "Save Week" })] }), status === "success" && _jsx("p", { style: { color: "green" }, children: "Week saved!" }), status === "error" && _jsx("p", { style: { color: "crimson" }, children: "Failed to save week." })] }));
};
export default SeasonManager;
