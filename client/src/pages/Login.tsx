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
    <div className="container" style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{ display: "block", marginBottom: 12, width: "100%" }}
        />
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={{ display: "block", marginBottom: 12, width: "100%" }}
        />
        {err && <div style={{ color: "crimson", marginBottom: 8 }}>{err}</div>}
        <button type="submit" style={{ marginRight: 12 }}>Login</button>
        <Link to={routes.forgotPassword}>Forgot password?</Link>
      </form>
    </div>
  );
};

export default Login;
