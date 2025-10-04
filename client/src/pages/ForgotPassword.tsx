import React, { useState } from "react";
import api from "@/lib/api";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await api.post("/api/auth/forgot-password", { email });
      setStatus("sent");
    } catch {
      setStatus("error");
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
      {status === "error" && <p style={{ color: "crimson" }}>Couldn’t send link.</p>}
    </div>
  );
};

export default ForgotPassword;