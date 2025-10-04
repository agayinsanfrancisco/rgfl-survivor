import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import api from "@/lib/api";
const PointsManager = () => {
    const [userId, setUserId] = useState("");
    const [weekId, setWeekId] = useState("");
    const [points, setPoints] = useState("");
    const submit = async (e) => {
        e.preventDefault();
        await api.post("/api/admin/score", { userId, weekId, points: Number(points) });
        alert("Points updated!");
    };
    return (_jsxs("div", { children: [_jsx("h2", { children: "Points/Scoring" }), _jsxs("form", { onSubmit: submit, children: [_jsx("input", { placeholder: "User ID", value: userId, onChange: e => setUserId(e.target.value), required: true }), _jsx("input", { placeholder: "Week ID", value: weekId, onChange: e => setWeekId(e.target.value), required: true }), _jsx("input", { placeholder: "Points", type: "number", value: points, onChange: e => setPoints(e.target.value), required: true }), _jsx("button", { type: "submit", children: "Update Points" })] })] }));
};
export default PointsManager;
