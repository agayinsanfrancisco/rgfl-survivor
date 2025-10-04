import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Castaway } from "../shared/types";

type RankingRow = {
  castawayId: string;
  castaway: Castaway;
  position?: number;
};

const PreseasonRank: React.FC = () => {
  const [rows, setRows] = useState<RankingRow[]>([]);
  const [locked, setLocked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/api/rankings/me");
        setLocked(res.data.locked ?? false);
        const order = res.data.order as RankingRow[];
        setRows(order);
      } catch (error) {
        console.error("Failed to load rankings:", error);
      }
    }

    load();
  }, []);

  const move = (from: number, to: number) => {
    if (locked || to < 0 || to >= rows.length) return;
    const updated = [...rows];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setRows(updated);
    setMessage(null);
  };

  const save = async () => {
    if (locked) return;
    setSaving(true);
    setMessage(null);
    try {
      await api.post("/api/rankings/me", {
        order: rows.map((row) => row.castawayId)
      });
      setMessage("Rankings saved! Once the draft runs, they will be locked.");
    } catch (error: any) {
      console.error("Failed to save rankings:", error);
      setMessage(error?.response?.data?.error ?? "Unable to save rankings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rg-page">
      <section className="rg-hero" style={{ maxWidth: 720 }}>
        <span className="rg-pill">Preseason Rankings</span>
        <h1>Drag and drop your castaway big board.</h1>
        <p>
          Your ranking determines draft order once the admin launches the snake draft. Make sure every castaway is
          ordered before the deadline.
        </p>
        {locked && <p style={{ color: "crimson" }}>Rankings are locked. Await draft results.</p>}
      </section>

      <section className="rg-section" style={{ marginTop: "3rem", maxWidth: 720 }}>
        <ol style={{ paddingLeft: "1.25rem", display: "grid", gap: "0.75rem" }}>
          {rows.map((row, index) => (
            <li key={row.castawayId} className="rg-card" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontWeight: 700 }}>{index + 1}</span>
              <span style={{ flex: 1 }}>{row.castaway.name}</span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => move(index, index - 1)} disabled={locked || index === 0}>
                  ↑
                </button>
                <button onClick={() => move(index, index + 1)} disabled={locked || index === rows.length - 1}>
                  ↓
                </button>
              </div>
            </li>
          ))}
        </ol>
        <div style={{ marginTop: "1.5rem" }}>
          <button onClick={save} disabled={locked || saving}>
            {saving ? "Saving..." : "Save Rankings"}
          </button>
          {message && <p style={{ marginTop: 12 }}>{message}</p>}
        </div>
      </section>
    </div>
  );
};

export default PreseasonRank;
