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
    <div>
      <h2>Draft Manager</h2>
      <p>Draft status: {status}</p>
      <button onClick={runDraft} disabled={loading || status === "COMPLETED"} style={{ marginBottom: 16 }}>
        {loading ? "Processing..." : status === "COMPLETED" ? "Draft Completed" : "Run Draft"}
      </button>
      <button onClick={loadStatus} disabled={loading} style={{ marginLeft: 8 }}>
        Refresh
      </button>
      {message && <p style={{ marginTop: 12 }}>{message}</p>}
      <table style={{ width: "100%", marginTop: 16 }}>
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
    </div>
  );
};

export default PicksManager;
