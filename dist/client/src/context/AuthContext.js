import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        api.get("/api/auth/me")
            .then((res) => setUser(res.data))
            .catch(() => setUser(null));
    }, []);
    const login = async (email, password) => {
        const res = await api.post("/api/auth/login", { email, password });
        setUser(res.data.user);
    };
    const logout = () => {
        api.post("/api/auth/logout").finally(() => setUser(null));
    };
    return (_jsx(AuthContext.Provider, { value: { user, login, logout }, children: children }));
};
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
