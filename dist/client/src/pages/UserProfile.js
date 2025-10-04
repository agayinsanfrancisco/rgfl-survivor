import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "../context/AuthContext";
const UserProfile = () => {
    const { user } = useAuth();
    if (!user)
        return _jsx("div", { className: "container", children: "You are not logged in." });
    return (_jsxs("div", { className: "container", children: [_jsx("h2", { children: "User Profile" }), _jsx("table", { children: _jsxs("tbody", { children: [_jsxs("tr", { children: [_jsx("th", { children: "Name:" }), _jsx("td", { children: user.name })] }), _jsxs("tr", { children: [_jsx("th", { children: "Email:" }), _jsx("td", { children: user.email })] }), _jsxs("tr", { children: [_jsx("th", { children: "Admin:" }), _jsx("td", { children: user.isAdmin ? "Yes" : "No" })] })] }) })] }));
};
export default UserProfile;
