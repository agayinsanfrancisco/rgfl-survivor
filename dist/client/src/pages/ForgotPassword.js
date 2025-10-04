import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import api from "@/lib/api";
const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle");
    const onSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        try {
            await api.post("/api/auth/forgot-password", { email });
            setStatus("sent");
        }
        catch {
            setStatus("error");
        }
    };
    return (_jsxs("div", { className: "container", children: [_jsx("h2", { children: "Forgot Password" }), _jsxs("form", { onSubmit: onSubmit, children: [_jsx("input", { type: "email", value: email, onChange: e => setEmail(e.target.value), placeholder: "Enter your email", required: true, style: { display: "block", marginBottom: 12, width: "100%" } }), _jsx("button", { type: "submit", children: "Send Reset Link" })] }), status === "sent" && _jsx("p", { style: { color: "green" }, children: "Check your inbox!" }), status === "error" && _jsx("p", { style: { color: "crimson" }, children: "Couldn\u2019t send link." })] }));
};
export default ForgotPassword;
