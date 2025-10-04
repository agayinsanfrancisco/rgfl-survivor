import React, { createContext, useContext, useEffect, useState } from "react";
import { User, AuthContextType } from "../shared/types";
import api from "@/lib/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
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

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      setUser(res.data.user);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    api.post("/api/auth/logout")
      .catch((error) => console.error("Logout error:", error))
      .finally(() => setUser(null));
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