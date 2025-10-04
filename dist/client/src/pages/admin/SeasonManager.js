import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import api from "@/lib/api";
const SeasonManager = () => {
    const [weekNumber, setWeekNumber] = useState("");
    const [isActive, setIsActive] = useState(false);
    const createWeek = async (e) => {
        e.preventDefault();
        await api.post("/api/admin/week", {
            number: Number(weekNumber),
            isActive
        });
        alert("New week created!");
    };
    return (_jsxs("div", { children: [_jsx("h2", { children: "Season Manager" }), _jsxs("form", { onSubmit: createWeek, children: [_jsx("input", { placeholder: "Week Number", value: weekNumber, onChange: e => setWeekNumber(e.target.value), required: true }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: isActive, onChange: e => setIsActive(e.target.checked) }), "Active Week"] }), _jsx("button", { type: "submit", children: "Create Week" })] })] }));
};
export default SeasonManager;
