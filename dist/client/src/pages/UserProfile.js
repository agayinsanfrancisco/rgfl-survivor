import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "../context/AuthContext";
const UserProfile = () => {
    const { user } = useAuth();
    if (!user)
        return _jsx("div", { className: "rg-page", children: "You are not logged in." });
    return (_jsxs("div", { className: "rg-page", children: [_jsxs("section", { className: "rg-hero", style: { maxWidth: 640 }, children: [_jsx("span", { className: "rg-pill", children: "Profile" }), _jsxs("h1", { children: ["Welcome, ", user.name] }), _jsx("p", { children: "Keep your contact info up to date and review your league credentials. Profile editing is coming in a future release." })] }), _jsx("section", { className: "rg-section", style: { marginTop: "3rem", maxWidth: 640 }, children: _jsxs("div", { className: "rg-grid", children: [_jsxs("article", { className: "rg-card", children: [_jsx("h3", { children: "Name" }), _jsx("p", { children: user.name })] }), _jsxs("article", { className: "rg-card", children: [_jsx("h3", { children: "Email" }), _jsx("p", { children: user.email })] }), _jsxs("article", { className: "rg-card", children: [_jsx("h3", { children: "Role" }), _jsx("p", { children: user.isAdmin ? "League Admin" : "Player" })] })] }) })] }));
};
export default UserProfile;
