import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "@/context/AuthContext";
import { routes } from "@/shared/routes";
import { Link } from "react-router-dom";
const adminLinks = [
    { label: "Weekly Score Entry", to: routes.admin.scoring },
    { label: "Castaway Management", to: routes.admin.castaways },
    { label: "User Management", to: routes.admin.users },
    { label: "League Management", to: routes.admin.league },
    { label: "Draft Manager", to: routes.admin.picks },
    { label: "Season Controls", to: routes.admin.season },
    { label: "System Stats", to: routes.admin.stats }
];
const AdminDashboard = () => {
    const { user } = useAuth();
    return (_jsxs("div", { className: "rg-page", children: [_jsxs("section", { className: "rg-hero", children: [_jsx("span", { className: "rg-pill", children: "League Command Center" }), _jsxs("h1", { children: ["Welcome, ", user?.name ?? "Admin"] }), _jsx("p", { children: "Here's where you run the show. Lock rankings, launch the draft, input weekly scores, and keep the Survivor faithful organized." })] }), _jsxs("section", { className: "rg-section", style: { marginTop: "3rem" }, children: [_jsx("h2", { children: "Quick Actions" }), _jsx("div", { className: "rg-grid rg-grid--two", children: adminLinks.map((link) => (_jsxs(Link, { to: link.to, className: "rg-card", children: [_jsx("h3", { children: link.label }), _jsxs("p", { style: { color: "var(--text-muted)" }, children: ["Manage ", link.label.toLowerCase(), "."] })] }, link.to))) })] })] }));
};
export default AdminDashboard;
