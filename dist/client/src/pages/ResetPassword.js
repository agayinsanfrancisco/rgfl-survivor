import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";
const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);
    const onSubmit = async (e) => {
        e.preventDefault();
        if (!token)
            return;
        setStatus("saving");
        setError(null);
        try {
            await api.post("/api/auth/reset-password", { token, password });
            setStatus("success");
            navigate("/login");
        }
        catch {
            setStatus("error");
            setError("Password reset is not yet available. Please contact an admin.");
        }
    };
    return (_jsxs("div", { className: "container", children: [_jsx("h2", { children: "Reset Password" }), _jsxs("form", { onSubmit: onSubmit, children: [_jsx("input", { type: "password", value: password, onChange: e => setPassword(e.target.value), placeholder: "New Password", required: true, minLength: 6, style: { display: "block", marginBottom: 12, width: "100%" } }), _jsx("button", { type: "submit", children: "Reset Password" })] }), status === "success" && _jsx("p", { children: "Password reset successfully!" }), status === "error" && _jsx("p", { style: { color: "crimson" }, children: error })] }));
};
export default ResetPassword;
