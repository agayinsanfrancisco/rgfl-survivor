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
    <div className="container">
      <h2>Weekly Pick</h2>
      {weekInfo && <p>Week {weekInfo.weekNumber}</p>}
      {lockMessage && <p>{lockMessage}</p>}
      <p>Select one of your drafted castaways to be active this week:</p>

      <div className="castaway-grid">
        {assigned.map((assignment) => (
          <div
            key={assignment.castawayId}
            className={`castaway-card ${selectedId === assignment.castawayId ? "selected" : ""}`}
            onClick={() => setSelectedId(assignment.castawayId)}
          >
            <img src={assignment.castaway.imageUrl || "/default-avatar.png"} alt={assignment.castaway.name} className="avatar" />
            <h4>{assignment.castaway.name}</h4>
            <p>{assignment.castaway.tribe}</p>
            <p>Round {assignment.round}</p>
          </div>
        ))}
      </div>

      <button
        className="button"
        onClick={handleSubmit}
        disabled={!selectedId || status === "saving"}
        style={{ marginTop: 24 }}
      >
        {status === "saving" ? "Submitting..." : "Submit Pick"}
      </button>

      {status === "success" && <p style={{ color: "green" }}>Pick submitted successfully!</p>}
      {errorMessage && <p style={{ color: "crimson" }}>{errorMessage}</p>}

      <style>{`
        .castaway-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 16px;
          margin-top: 20px;
        }
        .castaway-card {
          cursor: pointer;
          border: 2px solid #ccc;
          border-radius: 12px;
          padding: 12px;
          text-align: center;
          transition: 0.2s ease;
        }
        .castaway-card.selected {
          border-color: #007bff;
          background-color: #eaf3ff;
        }
        .avatar {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 50%;
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
};

export default WeeklyPicks;
