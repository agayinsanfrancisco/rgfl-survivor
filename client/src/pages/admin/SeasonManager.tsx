import React, { useState } from "react";
import api from "@/lib/api";

const SeasonManager = () => {
  const [weekNumber, setWeekNumber] = useState("");
  const [isActive, setIsActive] = useState(false);

  const createWeek = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/api/admin/week", {
      number: Number(weekNumber),
      isActive
    });
    alert("New week created!");
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
        <button type="submit">Create Week</button>
      </form>
    </div>
  );
};

export default SeasonManager;