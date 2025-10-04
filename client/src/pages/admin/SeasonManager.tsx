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
    <div className="rg-page">
      <section className="rg-hero">
        <span className="rg-pill">Season Controls</span>
        <h1>Warm up the torches.</h1>
        <p>
          Activate the current week or schedule future lock dates. Weeks created here drive weekly picks and scoring.
        </p>
      </section>

      <section className="rg-section" style={{ marginTop: "3rem", maxWidth: 420 }}>
        <form onSubmit={createWeek} style={{ display: "grid", gap: "0.75rem" }}>
          <label htmlFor="season-week">Week number</label>
          <input
            id="season-week"
            placeholder="Week number"
            value={weekNumber}
            onChange={(e) => setWeekNumber(e.target.value)}
            required
          />
          <label style={{ display: "flex", gap: "0.65rem", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Active week
          </label>
          <button type="submit" disabled={status === "saving"}>
            {status === "saving" ? "Saving..." : "Save week"}
          </button>
        </form>
        {status === "success" && <p style={{ color: "green", marginTop: "0.75rem" }}>Week saved!</p>}
        {status === "error" && <p className="error">Failed to save week.</p>}
      </section>
    </div>
  );
};

export default SeasonManager;
