import React, { useState } from "react";
import api from "@/lib/api";

const PointsManager = () => {
  const [userId, setUserId] = useState("");
  const [weekId, setWeekId] = useState("");
  const [points, setPoints] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      await api.post("/api/admin/score", { userId, weekId, points: Number(points) });
      setStatus("success");
    } catch (error) {
      console.error("Failed to update points:", error);
      setStatus("error");
    }
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
        <button type="submit" disabled={status === "saving"}>
          {status === "saving" ? "Updating..." : "Update Points"}
        </button>
      </form>
      {status === "success" && <p style={{ color: "green" }}>Points updated!</p>}
      {status === "error" && <p style={{ color: "crimson" }}>Failed to update points.</p>}
    </div>
  );
};

export default PointsManager;
