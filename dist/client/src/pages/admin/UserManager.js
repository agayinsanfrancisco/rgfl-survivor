import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import api from "@/lib/api";
const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        api
            .get("/api/users")
            .then((res) => {
            setUsers(res.data);
            setError(null);
        })
            .catch((err) => {
            console.error("Failed to load users:", err);
            setError("Unable to load users.");
        });
    }, []);
    return (_jsxs("div", { className: "rg-page", children: [_jsxs("section", { className: "rg-hero", children: [_jsx("span", { className: "rg-pill", children: "User Management" }), _jsx("h1", { children: "See every Survivor fan in the league." }), _jsx("p", { children: "Manage player accounts, confirm admin access, and keep contact info tidy before big announcements or draft day." })] }), _jsxs("section", { className: "rg-section", style: { marginTop: "3rem" }, children: [error && _jsx("p", { className: "error", children: error }), _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Name" }), _jsx("th", { children: "Email" }), _jsx("th", { children: "Role" }), _jsx("th", { children: "Joined" })] }) }), _jsx("tbody", { children: users.map((u) => (_jsxs("tr", { children: [_jsx("td", { children: u.name }), _jsx("td", { children: u.email }), _jsx("td", { children: u.isAdmin ? "Admin" : "Player" }), _jsx("td", { children: u.createdAt?.slice(0, 10) })] }, u.id))) })] })] })] }));
};
export default UserManager;
