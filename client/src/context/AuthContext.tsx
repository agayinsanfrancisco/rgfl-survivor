import React, { createContext, useContext, useEffect, useState } from "react";
import { User, AuthContextType } from "../shared/types";
import api, { AUTH_STORAGE_KEY, setAuthToken } from "@/lib/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? window.localStorage.getItem(AUTH_STORAGE_KEY) : null;
    if (storedToken) {
      setAuthToken(storedToken);
    }

    api
      .get("/api/auth/me")
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => {
        console.log("Auth check failed (normal for unauthenticated users):", error);
        setAuthToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      setUser(res.data.user);
      setAuthToken(res.data.token ?? null);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    api
      .post("/api/auth/logout")
      .catch((error) => console.error("Logout error:", error))
      .finally(() => {
        setAuthToken(null);
        setUser(null);
      });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    console.error("useAuth must be used within AuthProvider");
    // Return a default context to prevent crashes
    return {
      user: null,
      loading: true,
      login: async () => {},
      logout: () => {}
    };
  }
  return ctx;
};
