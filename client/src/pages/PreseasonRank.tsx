import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Castaway } from "../shared/types";

const PreseasonRank: React.FC = () => {
  const [castaways, setCastaways] = useState<Castaway[]>([]);
  const [rankings, setRankings] = useState<string[]>([]);

  useEffect(() => {
    api.get("/api/castaways").then(res => {
      setCastaways(res.data);
      setRankings(res.data.map((c: Castaway) => c.id));
    });
  }, []);

  const move = (from: number, to: number) => {
    const updated = [...rankings];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setRankings(updated);
  };

  const save = async () => {
    await api.post("/api/rankings", { rankings });
    alert("Rankings saved!");
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
    </div>
  );
};

export default PreseasonRank;