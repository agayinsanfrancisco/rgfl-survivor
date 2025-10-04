import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Castaway } from "@/shared/types";

type Entry = { castawayId: string; points: number };

const PointsManager = () => {
  const [weekNumber, setWeekNumber] = useState("1");
  const [castaways, setCastaways] = useState<Castaway[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const castawaysRes = await api.get("/api/castaways");
        setCastaways(castawaysRes.data);
        setEntries(castawaysRes.data.map((c: Castaway) => ({ castawayId: c.id, points: 0 })));
      } catch (error) {
        console.error("Failed to load scoring data", error);
        setMessage("Unable to load castaways");
      }
    }

    load();
  }, []);

  const updateEntry = (castawayId: string, value: number) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.castawayId === castawayId ? { ...entry, points: value } : entry))
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    setMessage(null);
    try {
      await api.post(`/api/admin/scoring/week/${weekNumber}`, {
        entries: entries.filter((entry) => entry.points !== 0)
      });
      setStatus("success");
      setMessage("Scores saved and leaderboard updated.");
    } catch (error: any) {
      console.error("Failed to save scores:", error);
      setStatus("error");
      setMessage(error?.response?.data?.error ?? "Unable to save scores");
    }
  };

  return (
    <div className="rg-page">
      <section className="rg-hero">
        <span className="rg-pill">Weekly Score Entry</span>
        <h1>Enter episode results and update the leaderboard.</h1>
      </section>

      <section className="rg-section" style={{ marginTop: "3rem" }}>
        <form onSubmit={submit} style={{ display: "grid", gap: "1.25rem" }}>
          <label htmlFor="scoring-week" style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            Week number
            <input
              id="scoring-week"
              value={weekNumber}
              onChange={(e) => setWeekNumber(e.target.value)}
              style={{ maxWidth: 120 }}
            />
          </label>

          <div style={{ maxHeight: 380, overflowY: "auto", border: "1px solid var(--border-soft)", borderRadius: "var(--radius-md)", padding: "1rem" }}>
            {castaways.map((castaway) => (
              <div key={castaway.id} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                <span style={{ flex: 1 }}>{castaway.name}</span>
                <input
                  type="number"
                  value={entries.find((e) => e.castawayId === castaway.id)?.points ?? 0}
                  onChange={(e) => updateEntry(castaway.id, Number(e.target.value))}
                  style={{ width: 96 }}
                />
              </div>
            ))}
          </div>

          <button type="submit" disabled={status === "saving"}>
            {status === "saving" ? "Saving..." : "Save Scores"}
          </button>
          {status === "success" && <p style={{ color: "green" }}>{message}</p>}
          {status === "error" && <p className="error">{message}</p>}
        </form>
      </section>
    </div>
  );
};

export default PointsManager;
