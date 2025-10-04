import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { Castaway } from "../shared/types";
import { useAuth } from "../context/AuthContext";

const WeeklyPicks: React.FC = () => {
  const { user } = useAuth();
  const [castaways, setCastaways] = useState<Castaway[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [castawaysRes, pickRes] = await Promise.all([
          api.get("/api/castaways"),
          api.get("/api/picks/me").catch(err => {
            if (err?.response?.status === 404) {
              setErrorMessage("No active week is available yet.");
              return { data: null };
            }
            throw err;
          })
        ]);
        setCastaways(castawaysRes.data);
        if (pickRes.data?.castawayId) {
          setSelectedId(pickRes.data.castawayId);
        }
      } catch (error) {
        console.error("Failed to load weekly picks data:", error);
        setCastaways([]);
        setErrorMessage("Unable to load weekly picks right now.");
      }
    }

    if (user) {
      load();
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!selectedId) return;
    setStatus("saving");
    setErrorMessage(null);
    try {
      await api.post("/api/picks/me", {
        castawayId: selectedId
      });
      setStatus("success");
    } catch (error) {
      console.error("Failed to save pick:", error);
      setStatus("error");
      setErrorMessage("Submission failed. Try again.");
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
