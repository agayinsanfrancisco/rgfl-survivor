import React, { useEffect, useState } from "react";
import api from "@/lib/api";

interface PickWithRelations {
  id: string;
  user?: { name: string };
  castaway?: { name: string };
}

const PicksManager = () => {
  const [picks, setPicks] = useState<PickWithRelations[]>([]);
  const [weekNumber, setWeekNumber] = useState("1");
  const [error, setError] = useState<string | null>(null);

  const loadPicks = async (week: string) => {
    try {
      const res = await api.get(`/api/picks/week/${week}`);
      setPicks(res.data);
      setError(null);
    } catch (err) {
      console.error("Failed to load picks:", err);
      setPicks([]);
      setError("Unable to load picks for that week.");
    }
  };

  useEffect(() => {
    loadPicks(weekNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weekNumber) return;
    loadPicks(weekNumber);
  };

  return (
    <div>
      <h2>Picks This Week</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <input
          placeholder="Week Number"
          value={weekNumber}
          onChange={e => setWeekNumber(e.target.value)}
          style={{ width: 120, marginRight: 8 }}
        />
        <button type="submit">Load Picks</button>
      </form>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <ul>
        {picks.map(p => (
          <li key={p.id}>
            {p.user?.name ?? "Unknown"} picked {p.castaway?.name ?? "Unknown"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PicksManager;
