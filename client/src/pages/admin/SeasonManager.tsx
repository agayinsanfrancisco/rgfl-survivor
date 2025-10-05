import React, { useState, useEffect } from "react";
import api from "@/lib/api";

interface Week {
  id: string;
  weekNumber: number;
  isActive: boolean;
  lockAt: string | null;
  createdAt: string;
}

const SeasonManager = () => {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [weekNumber, setWeekNumber] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [loading, setLoading] = useState(true);

  const loadWeeks = async () => {
    setLoading(true);
    try {
      // We need to create a new endpoint to fetch all weeks
      const res = await api.get("/api/admin/weeks");
      setWeeks(res.data);
    } catch (error) {
      console.error("Failed to load weeks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeeks();
  }, []);

  const createWeek = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    try {
      await api.post("/api/admin/week", {
        weekNumber: Number(weekNumber),
        isActive
      });
      setStatus("success");
      setWeekNumber("");
      setIsActive(false);
      await loadWeeks();
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      console.error("Failed to create week:", error);
      setStatus("error");
    }
  };

  const activateWeek = async (weekNum: number) => {
    try {
      await api.post("/api/admin/week", {
        weekNumber: weekNum,
        isActive: true
      });
      await loadWeeks();
    } catch (error) {
      console.error("Failed to activate week:", error);
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

      <div className="rg-flex" style={{ marginTop: "3rem", gap: "2rem" }}>
        {/* Create Week Form */}
        <section className="rg-section" style={{ maxWidth: 420, flex: 1 }}>
          <h3>Create or Update Week</h3>
          <form onSubmit={createWeek} style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
            <label htmlFor="season-week">Week number</label>
            <input
              id="season-week"
              type="number"
              placeholder="Week number"
              value={weekNumber}
              onChange={(e) => setWeekNumber(e.target.value)}
              required
              min={1}
              max={20}
            />
            <label style={{ display: "flex", gap: "0.65rem", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              Set as active week
            </label>
            <button type="submit" disabled={status === "saving"}>
              {status === "saving" ? "Saving..." : "Save week"}
            </button>
          </form>
          {status === "success" && <p style={{ color: "green", marginTop: "0.75rem" }}>Week saved!</p>}
          {status === "error" && <p className="error">Failed to save week.</p>}
        </section>

        {/* Weeks List */}
        <section className="rg-section" style={{ flex: 1 }}>
          <h3>All Weeks</h3>
          {loading ? (
            <p>Loading weeks...</p>
          ) : weeks.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No weeks created yet.</p>
          ) : (
            <div style={{ marginTop: "1rem", display: "grid", gap: "0.75rem" }}>
              {weeks.map((week) => (
                <div
                  key={week.id}
                  className="rg-card"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem",
                    backgroundColor: week.isActive ? "var(--primary-light)" : undefined
                  }}
                >
                  <div>
                    <strong>Week {week.weekNumber}</strong>
                    {week.isActive && (
                      <span style={{
                        marginLeft: "0.5rem",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        backgroundColor: "var(--primary)",
                        color: "white",
                        fontSize: "0.75rem"
                      }}>
                        ACTIVE
                      </span>
                    )}
                    {week.lockAt && (
                      <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                        Locks: {new Date(week.lockAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  {!week.isActive && (
                    <button
                      onClick={() => activateWeek(week.weekNumber)}
                      style={{ fontSize: "0.875rem", padding: "0.35rem 0.75rem" }}
                    >
                      Activate
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SeasonManager;
