import React, { useState } from "react";
import api from "@/lib/api";

const SeasonManager = () => {
  const [weekNumber, setWeekNumber] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  const createWeek = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      await api.post("/api/admin/week", {
        weekNumber: Number(weekNumber),
        isActive
      });
      setStatus("success");
    } catch (error) {
      console.error("Failed to create week:", error);
      setStatus("error");
    }
  };

  return (
    <div>
      <h2>Season Manager</h2>
      <form onSubmit={createWeek}>
        <input
          placeholder="Week Number"
          value={weekNumber}
          onChange={e => setWeekNumber(e.target.value)}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={e => setIsActive(e.target.checked)}
          />
          Active Week
        </label>
        <button type="submit" disabled={status === "saving"}>
          {status === "saving" ? "Saving..." : "Save Week"}
        </button>
      </form>
      {status === "success" && <p style={{ color: "green" }}>Week saved!</p>}
      {status === "error" && <p style={{ color: "crimson" }}>Failed to save week.</p>}
    </div>
  );
};

export default SeasonManager;
