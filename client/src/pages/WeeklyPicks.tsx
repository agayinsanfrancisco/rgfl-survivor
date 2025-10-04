import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { Castaway } from "../shared/types";
import { useAuth } from "../context/AuthContext";

const WeeklyPicks: React.FC = () => {
  const { user } = useAuth();
  const [castaways, setCastaways] = useState<Castaway[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  useEffect(() => {
    api.get("/api/castaways")
      .then((res) => setCastaways(res.data))
      .catch(() => setCastaways([]));
  }, []);

  const handleSubmit = async () => {
    if (!selectedId || !user) return;
    setStatus("saving");
    try {
      await api.post("/api/picks", {
        userId: user.id,
        castawayId: selectedId,
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="container">
      <h2>Weekly Pick</h2>
      <p>Select one castaway to represent you this week:</p>

      <div className="castaway-grid">
        {castaways.map((c) => (
          <div
            key={c.id}
            className={`castaway-card ${selectedId === c.id ? "selected" : ""}`}
            onClick={() => setSelectedId(c.id)}
          >
            <img src={c.imageUrl || "/default-avatar.png"} alt={c.name} className="avatar" />
            <h4>{c.name}</h4>
            <p>{c.tribe}</p>
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
      {status === "error" && <p style={{ color: "crimson" }}>Submission failed. Try again.</p>}

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