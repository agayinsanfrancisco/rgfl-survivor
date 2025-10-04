import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { routes } from "@/shared/routes";
const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState(null);
    const navigate = useNavigate();
    const onSubmit = async (e) => {
        e.preventDefault();
        setErr(null);
        try {
            await login(email, password);
            navigate(routes.dashboard); // now using alias
        }
        catch (e) {
            setErr(e?.response?.data?.error ?? "Login failed");
        }
    };
    return (_jsx("div", { className: "rg-page", style: { display: "grid", placeItems: "center" }, children: _jsxs("div", { className: "rg-section", style: { maxWidth: 420 }, children: [_jsx("h2", { style: { textAlign: "center", marginTop: 0 }, children: "Login" }), _jsx("p", { style: { textAlign: "center", color: "var(--text-muted)" }, children: "Log in to set your weekly picks and track the leaderboard." }), _jsxs("form", { onSubmit: onSubmit, style: { marginTop: "1.5rem", display: "grid", gap: "0.75rem" }, children: [_jsx("label", { htmlFor: "email", children: "Email address" }), _jsx("input", { id: "email", type: "email", autoComplete: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "you@example.com", required: true }), _jsx("label", { htmlFor: "password", children: "Password" }), _jsx("input", { id: "password", type: "password", autoComplete: "current-password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true }), err && _jsx("div", { className: "error", children: err }), _jsx("button", { type: "submit", disabled: !email || !password, children: "Login" }), _jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }, children: [_jsxs("span", { children: ["Don't have an account? ", _jsx(Link, { to: routes.signup, children: "Sign up" })] }), _jsx(Link, { to: routes.forgotPassword, children: "Forgot password?" })] })] })] }) }));
};
export default Login;
