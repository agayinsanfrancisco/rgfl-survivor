import React, { useState } from "react";
import api from "@/lib/api";

const PointsManager = () => {
  const [userId, setUserId] = useState("");
  const [weekId, setWeekId] = useState("");
  const [points, setPoints] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/api/admin/score", { userId, weekId, points: Number(points) });
    alert("Points updated!");
  };

  return (
    <div>
      <h2>Points/Scoring</h2>
      <form onSubmit={submit}>
        <input
          placeholder="User ID"
          value={userId}
          onChange={e => setUserId(e.target.value)}
          required
        />
        <input
          placeholder="Week ID"
          value={weekId}
          onChange={e => setWeekId(e.target.value)}
          required
        />
        <input
          placeholder="Points"
          type="number"
          value={points}
          onChange={e => setPoints(e.target.value)}
          required
        />
        <button type="submit">Update Points</button>
      </form>
    </div>
  );
};

export default PointsManager;