import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setStatus("saving");
    setError(null);
    try {
      await api.post("/api/auth/reset-password", { token, password });
      setStatus("success");
      navigate("/login");
    } catch {
      setStatus("error");
      setError("Password reset is not yet available. Please contact an admin.");
    }
  };

  return (
    <div className="container">
      <h2>Reset Password</h2>
      <form onSubmit={onSubmit}>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="New Password"
          required
          minLength={6}
          style={{ display: "block", marginBottom: 12, width: "100%" }}
        />
        <button type="submit">Reset Password</button>
      </form>
      {status === "success" && <p>Password reset successfully!</p>}
      {status === "error" && <p style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
};

export default ResetPassword;
