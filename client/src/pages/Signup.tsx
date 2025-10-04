import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { routes } from "@/shared/routes";

const Signup: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      await api.post("/api/auth/signup", { email, name, password });
      await login(email, password);
      navigate(routes.dashboard);
    } catch (e: any) {
      setErr(e?.response?.data?.error ?? "Signup failed");
    }
  };

  return (
    <div className="rg-page" style={{ display: "grid", placeItems: "center" }}>
      <div className="rg-section" style={{ maxWidth: 420 }}>
        <h2 style={{ textAlign: "center", marginTop: 0 }}>Sign up</h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
          Free, fast, and just a minute away from the draft board.
        </p>
        <form onSubmit={onSubmit} style={{ marginTop: "1.5rem", display: "grid", gap: "0.75rem" }}>
          <label htmlFor="name">Display name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
          <label htmlFor="signup-email">Email address</label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
            minLength={6}
          />
          {err && <div className="error">{err}</div>}
          <button type="submit">Create account</button>
          <div style={{ textAlign: "center", fontSize: "0.9rem" }}>
            Already have an account? <a onClick={() => navigate(routes.login)}>Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
