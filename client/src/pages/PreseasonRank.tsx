import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Castaway } from "../shared/types";

const STORAGE_KEY = "rgfl_preseason_rankings";

const PreseasonRank: React.FC = () => {
  const [castaways, setCastaways] = useState<Castaway[]>([]);
  const [rankings, setRankings] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "saved">("idle");

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/api/castaways");
        const ids = res.data.map((c: Castaway) => c.id);
        setCastaways(res.data);

        if (typeof window !== "undefined") {
          const stored = window.localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored) as string[];
            setRankings(parsed.filter(id => ids.includes(id)));
            return;
          }
        }
        setRankings(ids);
      } catch (error) {
        console.error("Failed to load castaways:", error);
      }
    }

    load();
  }, []);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= rankings.length) return;
    const updated = [...rankings];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setRankings(updated);
    setStatus("idle");
  };

  const save = () => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rankings));
    setStatus("saved");
  };

  return (
    <div className="container">
      <h2>Preseason Rankings</h2>
      <ol>
        {rankings.map((id, index) => {
          const castaway = castaways.find(c => c.id === id);
          if (!castaway) return null;
          return (
            <li key={id}>
              {castaway.name}
              <button onClick={() => move(index, index - 1)} disabled={index === 0}>↑</button>
              <button onClick={() => move(index, index + 1)} disabled={index === rankings.length - 1}>↓</button>
            </li>
          );
        })}
      </ol>
      <button onClick={save}>Save Rankings</button>
      {status === "saved" && <p style={{ color: "green" }}>Rankings saved to this browser.</p>}
    </div>
  );
};

export default PreseasonRank;
