import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import api from "@/lib/api";
const UserManager = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        api.get("/api/users").then(res => setUsers(res.data));
    }, []);
    return (_jsxs("div", { children: [_jsx("h2", { children: "All Users" }), _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Name" }), _jsx("th", { children: "Email" }), _jsx("th", { children: "Role" }), _jsx("th", { children: "Joined" })] }) }), _jsx("tbody", { children: users.map(u => (_jsxs("tr", { children: [_jsx("td", { children: u.name }), _jsx("td", { children: u.email }), _jsx("td", { children: u.role }), _jsx("td", { children: u.createdAt?.slice(0, 10) })] }, u.id))) })] })] }));
};
export default UserManager;
