import React, { useState } from "react";
import api from "@/lib/api";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      await api.post("/api/auth/forgot-password", { email });
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("Password reset is not yet available. Please contact an admin.");
    }
  };

  return (
    <div className="rg-page" style={{ display: "grid", placeItems: "center" }}>
      <div className="rg-section" style={{ maxWidth: 420 }}>
        <h2 style={{ textAlign: "center", marginTop: 0 }}>Forgot your password?</h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
          Enter your email and we&apos;ll send you reset instructions.
        </p>
        <form onSubmit={onSubmit} style={{ marginTop: "1.5rem", display: "grid", gap: "0.75rem" }}>
          <label htmlFor="reset-email">Email address</label>
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Sending..." : "Send reset link"}
          </button>
        </form>
        {status === "sent" && <p style={{ color: "green", marginTop: "0.75rem" }}>Check your inbox!</p>}
        {status === "error" && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
