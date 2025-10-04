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
    return (_jsx("div", { className: "rg-page", style: { display: "grid", placeItems: "center" }, children: _jsxs("div", { className: "rg-section", style: { maxWidth: 420 }, children: [_jsx("h2", { style: { textAlign: "center", marginTop: 0 }, children: "Set a new password" }), _jsx("p", { style: { textAlign: "center", color: "var(--text-muted)" }, children: "Enter a new password for your Reality Games account." }), _jsxs("form", { onSubmit: onSubmit, style: { marginTop: "1.5rem", display: "grid", gap: "0.75rem" }, children: [_jsx("label", { htmlFor: "new-password", children: "New password" }), _jsx("input", { id: "new-password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Create a secure password", required: true, minLength: 6 }), _jsx("button", { type: "submit", disabled: status === "saving", children: status === "saving" ? "Saving..." : "Reset password" })] }), status === "success" && _jsx("p", { style: { color: "green", marginTop: "0.75rem" }, children: "Password reset successfully." }), status === "error" && _jsx("p", { className: "error", children: error })] }) }));
};
export default ResetPassword;
