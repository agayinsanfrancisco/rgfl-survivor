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
    <div className="container">
      <h2>Forgot Password</h2>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          style={{ display: "block", marginBottom: 12, width: "100%" }}
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {status === "sent" && <p style={{ color: "green" }}>Check your inbox!</p>}
      {status === "error" && <p style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
};

export default ForgotPassword;
