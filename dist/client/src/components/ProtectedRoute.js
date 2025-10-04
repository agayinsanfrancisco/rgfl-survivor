import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { routes } from "@/shared/routes";
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) {
        return _jsx("div", { className: "container", children: "Loading..." });
    }
    if (!user) {
        return _jsx(Navigate, { to: routes.login, replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
export default ProtectedRoute;
