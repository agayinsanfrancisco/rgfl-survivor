import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { routes } from "@/shared/routes";

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      await login(email, password);
      navigate(routes.dashboard); // now using alias
    } catch (e: any) {
      setErr(e?.response?.data?.error ?? "Login failed");
    }
  };

  return (
    <div className="rg-page" style={{ display: "grid", placeItems: "center" }}>
      <div className="rg-section" style={{ maxWidth: 420 }}>
        <h2 style={{ textAlign: "center", marginTop: 0 }}>Login</h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
          Log in to set your weekly picks and track the leaderboard.
        </p>
        <form onSubmit={onSubmit} style={{ marginTop: "1.5rem", display: "grid", gap: "0.75rem" }}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          {err && <div className="error">{err}</div>}
          <button type="submit" disabled={!email || !password}>
            Login
          </button>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
            <span>
              Don&apos;t have an account? <Link to={routes.signup}>Sign up</Link>
            </span>
            <Link to={routes.forgotPassword}>Forgot password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
