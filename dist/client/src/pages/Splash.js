import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const Splash = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    React.useEffect(() => {
        if (user) {
            if (user.isAdmin) {
                navigate("/admin");
            }
            else {
                navigate("/dashboard");
            }
        }
    }, [user, navigate]);
    return (_jsxs("div", { className: "container", children: [_jsx("h1", { children: "Reality Games: Survivor Fantasy League" }), _jsx("p", { children: "Draft, rank, and play along with every episode of Survivor 49." }), _jsxs("p", { children: [_jsx("strong", { children: "Sign up" }), " to join the game and make your picks. If you're already registered, just log in to start playing!"] })] }));
};
export default Splash;
