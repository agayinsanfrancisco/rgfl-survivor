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
            setErr(e?.response?.data?.message ?? "Login failed");
        }
    };
    return (_jsxs("div", { className: "container", style: { maxWidth: 400, margin: "0 auto" }, children: [_jsx("h2", { children: "Login" }), _jsxs("form", { onSubmit: onSubmit, children: [_jsx("input", { type: "email", autoComplete: "email", value: email, onChange: e => setEmail(e.target.value), placeholder: "Email", required: true, style: { display: "block", marginBottom: 12, width: "100%" } }), _jsx("input", { type: "password", autoComplete: "current-password", value: password, onChange: e => setPassword(e.target.value), placeholder: "Password", required: true, style: { display: "block", marginBottom: 12, width: "100%" } }), err && _jsx("div", { style: { color: "crimson", marginBottom: 8 }, children: err }), _jsx("button", { type: "submit", style: { marginRight: 12 }, children: "Login" }), _jsx(Link, { to: routes.forgotPassword, children: "Forgot password?" })] })] }));
};
export default Login;
