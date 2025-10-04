import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { Castaway } from "../shared/types";

type AssignedPick = {
  castawayId: string;
  castaway: Castaway;
  round: number;
};

const WeeklyPicks: React.FC = () => {
  const [assigned, setAssigned] = useState<AssignedPick[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [weekInfo, setWeekInfo] = useState<{ weekNumber: number; lockAt?: string | null } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/api/picks/me");
        if (!res.data) {
          setErrorMessage("No active week is available yet.");
          return;
        }
        setAssigned(res.data.assigned ?? []);
        if (res.data.pick?.castawayId) {
          setSelectedId(res.data.pick.castawayId);
        }
        if (res.data.week) {
          setWeekInfo({
            weekNumber: res.data.week.weekNumber,
            lockAt: res.data.week.lockAt
          });
        }
      } catch (error: any) {
        if (error?.response?.status === 404) {
          setErrorMessage("No active week is available yet.");
          return;
        }
        console.error("Failed to load weekly picks data:", error);
        setErrorMessage("Unable to load weekly picks right now.");
      }
    }

    load();
  }, []);

  const handleSubmit = async () => {
    if (!selectedId) return;
    setStatus("saving");
    setErrorMessage(null);
    try {
      await api.post("/api/picks/me", {
        castawayId: selectedId
      });
      setStatus("success");
    } catch (error: any) {
      console.error("Failed to save pick:", error);
      setStatus("error");
      setErrorMessage(error?.response?.data?.error ?? "Submission failed. Try again.");
    }
  };

  const lockMessage = weekInfo?.lockAt
    ? `Picks lock at ${new Date(weekInfo.lockAt).toLocaleString()}`
    : undefined;

  return (
    <div className="rg-page">
      <section className="rg-hero">
        <span className="rg-pill">Weekly Picks</span>
        <h1>Week {weekInfo?.weekNumber ?? "--"} — Choose your active castaway</h1>
        <p>
          Make your selection before the lock deadline. Only drafted castaways are eligible each week, and once the
          episode airs, your points are locked in.
        </p>
        {lockMessage && <p style={{ color: "var(--text-muted)" }}>{lockMessage}</p>}
      </section>

      <section className="rg-section" style={{ marginTop: "3rem" }}>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <div className="rg-grid rg-grid--two" style={{ gap: "1.5rem" }}>
          {assigned.map((assignment) => {
            const active = selectedId === assignment.castawayId;
            return (
              <article
                key={assignment.castawayId}
                className="rg-card"
                style={{
                  border: active ? `2px solid var(--brand-red)` : undefined,
                  cursor: "pointer"
                }}
                onClick={() => setSelectedId(assignment.castawayId)}
              >
                <h3>{assignment.castaway.name}</h3>
                <p style={{ color: "var(--text-muted)", marginBottom: "0.75rem" }}>{assignment.castaway.tribe ?? ""}</p>
                <p>Round {assignment.round}</p>
              </article>
            );
          })}
          {assigned.length === 0 && (
            <p>No draft picks assigned yet. The draft will run as soon as rankings are locked.</p>
          )}
        </div>
        <div style={{ marginTop: "2rem" }}>
          <button onClick={handleSubmit} disabled={!selectedId || status === "saving"}>
            {status === "saving" ? "Submitting..." : "Submit Pick"}
          </button>
          {status === "success" && <p style={{ color: "green", marginTop: "0.75rem" }}>Pick submitted successfully!</p>}
        </div>
      </section>
    </div>
  );
};

export default WeeklyPicks;
