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
    return (_jsxs("div", { className: "container", children: [_jsx("h2", { children: "Sign Up" }), _jsxs("form", { onSubmit: onSubmit, children: [_jsx("input", { type: "text", value: name, onChange: e => setName(e.target.value), placeholder: "Name", required: true, style: { display: "block", marginBottom: 12, width: "100%" } }), _jsx("input", { type: "email", autoComplete: "email", value: email, onChange: e => setEmail(e.target.value), placeholder: "Email", required: true, style: { display: "block", marginBottom: 12, width: "100%" } }), _jsx("input", { type: "password", autoComplete: "new-password", value: password, onChange: e => setPassword(e.target.value), placeholder: "Password", required: true, minLength: 6, style: { display: "block", marginBottom: 12, width: "100%" } }), err && _jsx("div", { style: { color: "crimson", marginBottom: 8 }, children: err }), _jsx("button", { type: "submit", children: "Sign Up" })] })] }));
};
export default Signup;
