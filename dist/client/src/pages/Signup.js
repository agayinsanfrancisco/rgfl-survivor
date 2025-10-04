import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { routes } from "@/shared/routes";
const Signup = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState(null);
    const navigate = useNavigate();
    const onSubmit = async (e) => {
        e.preventDefault();
        setErr(null);
        try {
            await api.post("/api/auth/signup", { email, name, password });
            await login(email, password);
            navigate(routes.dashboard);
        }
        catch (e) {
            setErr(e?.response?.data?.error ?? "Signup failed");
        }
    };
    return (_jsx("div", { className: "rg-page", style: { display: "grid", placeItems: "center" }, children: _jsxs("div", { className: "rg-section", style: { maxWidth: 420 }, children: [_jsx("h2", { style: { textAlign: "center", marginTop: 0 }, children: "Sign up" }), _jsx("p", { style: { textAlign: "center", color: "var(--text-muted)" }, children: "Free, fast, and just a minute away from the draft board." }), _jsxs("form", { onSubmit: onSubmit, style: { marginTop: "1.5rem", display: "grid", gap: "0.75rem" }, children: [_jsx("label", { htmlFor: "name", children: "Display name" }), _jsx("input", { id: "name", type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "Your name", required: true }), _jsx("label", { htmlFor: "signup-email", children: "Email address" }), _jsx("input", { id: "signup-email", type: "email", autoComplete: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "you@example.com", required: true }), _jsx("label", { htmlFor: "signup-password", children: "Password" }), _jsx("input", { id: "signup-password", type: "password", autoComplete: "new-password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Create a password", required: true, minLength: 6 }), err && _jsx("div", { className: "error", children: err }), _jsx("button", { type: "submit", children: "Create account" }), _jsxs("div", { style: { textAlign: "center", fontSize: "0.9rem" }, children: ["Already have an account? ", _jsx("a", { onClick: () => navigate(routes.login), children: "Login" })] })] })] }) }));
};
export default Signup;
