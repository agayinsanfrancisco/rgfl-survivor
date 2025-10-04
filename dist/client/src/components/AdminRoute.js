import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { routes } from "@/shared/routes";
const AdminRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return _jsx(Navigate, { to: routes.login, replace: true });
    }
    if (!user.isAdmin) {
        return _jsx(Navigate, { to: routes.dashboard, replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
export default AdminRoute;
