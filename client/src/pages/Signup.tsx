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
      setErr(e?.response?.data?.message ?? "Signup failed");
    }
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
      <form onSubmit={onSubmit}>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required style={{ display: "block", marginBottom: 12, width: "100%" }} />
        <input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required style={{ display: "block", marginBottom: 12, width: "100%" }} />
        <input type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required minLength={6} style={{ display: "block", marginBottom: 12, width: "100%" }} />
        {err && <div style={{ color: "crimson", marginBottom: 8 }}>{err}</div>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;