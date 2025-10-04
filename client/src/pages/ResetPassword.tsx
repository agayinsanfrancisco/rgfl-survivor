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
    <div className="rg-page" style={{ display: "grid", placeItems: "center" }}>
      <div className="rg-section" style={{ maxWidth: 420 }}>
        <h2 style={{ textAlign: "center", marginTop: 0 }}>Set a new password</h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
          Enter a new password for your Reality Games account.
        </p>
        <form onSubmit={onSubmit} style={{ marginTop: "1.5rem", display: "grid", gap: "0.75rem" }}>
          <label htmlFor="new-password">New password</label>
          <input
            id="new-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a secure password"
            required
            minLength={6}
          />
          <button type="submit" disabled={status === "saving"}>
            {status === "saving" ? "Saving..." : "Reset password"}
          </button>
        </form>
        {status === "success" && <p style={{ color: "green", marginTop: "0.75rem" }}>Password reset successfully.</p>}
        {status === "error" && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
