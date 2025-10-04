import React, { createContext, useContext, useEffect, useState } from "react";
import { User, AuthContextType } from "../shared/types";
import api from "@/lib/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Add a small delay to ensure the app is fully loaded
    const timer = setTimeout(() => {
      api.get("/api/auth/me")
        .then((res) => {
          console.log("Auth check successful:", res.data);
          setUser(res.data);
        })
        .catch((error) => {
          console.log("Auth check failed (this is normal for unauthenticated users):", error);
          setUser(null);
        });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      setUser(res.data.user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    api.post("/api/auth/logout")
      .catch((error) => console.error("Logout failed:", error))
      .finally(() => setUser(null));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};