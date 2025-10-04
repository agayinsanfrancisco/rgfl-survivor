import React, { createContext, useContext, useEffect, useState } from "react";
import { User, AuthContextType } from "../shared/types";
import api from "@/lib/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api.get("/api/auth/me")
      .then((res) => setUser(res.data))
      .catch((error) => {
        console.log("Auth check failed:", error);
        setUser(null);
      });
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/api/auth/login", { email, password });
    setUser(res.data.user);
  };

  const logout = () => {
    api.post("/api/auth/logout").finally(() => setUser(null));
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