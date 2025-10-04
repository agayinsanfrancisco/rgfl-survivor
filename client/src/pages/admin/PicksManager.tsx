import React, { useEffect, useState } from "react";
import api from "@/lib/api";

interface DraftPickRow {
  id: string;
  round: number;
  pickNumber: number;
  user: { id: string; name: string; email: string };
  castaway: { id: string; name: string; tribe?: string | null };
}

const PicksManager = () => {
  const [status, setStatus] = useState<"PENDING" | "IN_PROGRESS" | "COMPLETED" | "UNKNOWN">("UNKNOWN");
  const [picks, setPicks] = useState<DraftPickRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/draft/status");
      setStatus(res.data.draftStatus ?? "UNKNOWN");
      setPicks(res.data.picks ?? []);
      setMessage(null);
    } catch (error) {
      console.error("Failed to load draft status:", error);
      setMessage("Unable to load draft data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const runDraft = async () => {
    setMessage(null);
    setLoading(true);
    try {
      const res = await api.post("/api/draft/run");
      setStatus("COMPLETED");
      setPicks(res.data.picks ?? []);
      setMessage("Draft completed successfully");
    } catch (error: any) {
      console.error("Failed to run draft:", error);
      setMessage(error?.response?.data?.error ?? "Unable to run draft");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rg-page">
      <section className="rg-hero">
        <span className="rg-pill">Draft Manager</span>
        <h1>Launch the snake draft when rankings lock.</h1>
        <p>Current status: {status}</p>
      </section>

      <section className="rg-section" style={{ marginTop: "3rem" }}>
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <button onClick={runDraft} disabled={loading || status === "COMPLETED"}>
            {loading ? "Processing..." : status === "COMPLETED" ? "Draft Completed" : "Run Draft"}
          </button>
          <button onClick={loadStatus} disabled={loading} className="rg-nav__auth">
            Refresh
          </button>
        </div>
        {message && <p style={{ marginBottom: "1rem" }}>{message}</p>}
        <table>
          <thead>
            <tr>
              <th>Pick #</th>
              <th>User</th>
              <th>Castaway</th>
              <th>Round</th>
            </tr>
          </thead>
          <tbody>
            {picks.map((pick) => (
              <tr key={pick.id}>
                <td>{pick.pickNumber}</td>
                <td>{pick.user?.name ?? pick.user?.email}</td>
                <td>{pick.castaway?.name}</td>
                <td>{pick.round}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default PicksManager;
