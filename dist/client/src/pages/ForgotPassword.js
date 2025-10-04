import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import api from "@/lib/api";
const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);
    const onSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        setError(null);
        try {
            await api.post("/api/auth/forgot-password", { email });
            setStatus("sent");
        }
        catch {
            setStatus("error");
            setError("Password reset is not yet available. Please contact an admin.");
        }
    };
    return (_jsx("div", { className: "rg-page", style: { display: "grid", placeItems: "center" }, children: _jsxs("div", { className: "rg-section", style: { maxWidth: 420 }, children: [_jsx("h2", { style: { textAlign: "center", marginTop: 0 }, children: "Forgot your password?" }), _jsx("p", { style: { textAlign: "center", color: "var(--text-muted)" }, children: "Enter your email and we'll send you reset instructions." }), _jsxs("form", { onSubmit: onSubmit, style: { marginTop: "1.5rem", display: "grid", gap: "0.75rem" }, children: [_jsx("label", { htmlFor: "reset-email", children: "Email address" }), _jsx("input", { id: "reset-email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "you@example.com", required: true }), _jsx("button", { type: "submit", disabled: status === "loading", children: status === "loading" ? "Sending..." : "Send reset link" })] }), status === "sent" && _jsx("p", { style: { color: "green", marginTop: "0.75rem" }, children: "Check your inbox!" }), status === "error" && _jsx("p", { className: "error", children: error })] }) }));
};
export default ForgotPassword;
