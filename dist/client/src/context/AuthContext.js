import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Add a small delay to ensure the app is fully mounted
        const timer = setTimeout(() => {
            api.get("/api/auth/me")
                .then((res) => {
                setUser(res.data);
                setLoading(false);
            })
                .catch((error) => {
                console.log("Auth check failed (normal for unauthenticated users):", error);
                setUser(null);
                setLoading(false);
            });
        }, 100);
        return () => clearTimeout(timer);
    }, []);
    const login = async (email, password) => {
        try {
            const res = await api.post("/api/auth/login", { email, password });
            setUser(res.data.user);
        }
        catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };
    const logout = () => {
        api.post("/api/auth/logout")
            .catch((error) => console.error("Logout error:", error))
            .finally(() => setUser(null));
    };
    return (_jsx(AuthContext.Provider, { value: { user, loading, login, logout }, children: children }));
};
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        console.error("useAuth must be used within AuthProvider");
        // Return a default context to prevent crashes
        return {
            user: null,
            loading: true,
            login: async () => { },
            logout: () => { }
        };
    }
    return ctx;
};
