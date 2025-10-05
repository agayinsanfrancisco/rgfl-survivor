import React, { useEffect, useState } from "react";
import api from "@/lib/api";

interface LeagueWithUsers {
  id: string;
  name: string;
  code: string;
  draftStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  draftRunAt: string | null;
  picksPerUser: number;
  rankingLockAt: string | null;
  users: Array<{ id: string; name: string; email: string; isAdmin: boolean }>;
}

interface DraftStatus {
  draftStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  draftRunAt: string | null;
  picks: Array<{
    id: string;
    round: number;
    pickNumber: number;
    user: { id: string; name: string; email: string };
    castaway: { id: string; name: string };
  }>;
}

const LeagueManager = () => {
  const [league, setLeague] = useState<LeagueWithUsers | null>(null);
  const [draftStatus, setDraftStatus] = useState<DraftStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [runningDraft, setRunningDraft] = useState(false);
  const [editingSettings, setEditingSettings] = useState(false);
  const [picksPerUser, setPicksPerUser] = useState(2);

  const loadLeague = async () => {
    try {
      const res = await api.get("/api/league");
      setLeague(res.data);
      setPicksPerUser(res.data.picksPerUser);
      setError(null);
    } catch (err) {
      console.error("Failed to load league:", err);
      setError("Unable to load league settings.");
    }
  };

  const loadDraftStatus = async () => {
    try {
      const res = await api.get("/api/draft/status");
      setDraftStatus(res.data);
    } catch (err) {
      console.error("Failed to load draft status:", err);
    }
  };

  useEffect(() => {
    loadLeague();
    loadDraftStatus();
  }, []);

  const runDraft = async () => {
    if (!window.confirm("Run the draft now? This will assign castaways based on user rankings.")) {
      return;
    }

    setRunningDraft(true);
    try {
      await api.post("/api/draft/run");
      await loadLeague();
      await loadDraftStatus();
      alert("Draft completed successfully!");
    } catch (err: any) {
      console.error("Failed to run draft:", err);
      alert(err.response?.data?.error || "Failed to run draft");
    } finally {
      setRunningDraft(false);
    }
  };

  const resetDraft = async () => {
    if (!window.confirm("Reset the draft? This will delete all draft picks and reset the draft status.")) {
      return;
    }

    try {
      await api.post("/api/draft/reset");
      await loadLeague();
      await loadDraftStatus();
      alert("Draft reset successfully!");
    } catch (err: any) {
      console.error("Failed to reset draft:", err);
      alert(err.response?.data?.error || "Failed to reset draft");
    }
  };

  const saveSettings = async () => {
    try {
      await api.put("/api/league", { picksPerUser });
      await loadLeague();
      setEditingSettings(false);
      alert("Settings saved!");
    } catch (err: any) {
      console.error("Failed to save settings:", err);
      alert(err.response?.data?.error || "Failed to save settings");
    }
  };

  if (error) {
    return <div className="rg-page" style={{ color: "crimson" }}>{error}</div>;
  }

  if (!league) return <div className="rg-page">Loading...</div>;

  const draftStatusColor =
    league.draftStatus === "COMPLETED" ? "green" :
    league.draftStatus === "IN_PROGRESS" ? "orange" : "gray";

  return (
    <div className="rg-page">
      <section className="rg-hero">
        <span className="rg-pill">League Settings</span>
        <h1>{league.name}</h1>
        <p>League code: {league.code} · Total members: {league.users.length}</p>
      </section>

      {/* Draft Configuration */}
      <section className="rg-section" style={{ marginTop: "2rem" }}>
        <h2>Draft Configuration</h2>
        <div className="rg-card" style={{ marginTop: "1rem", padding: "1.5rem" }}>
          <div style={{ display: "grid", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>Draft Status:</strong>
                <span style={{
                  marginLeft: "0.75rem",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "4px",
                  backgroundColor: draftStatusColor,
                  color: "white",
                  fontSize: "0.875rem"
                }}>
                  {league.draftStatus}
                </span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {league.draftStatus === "COMPLETED" && (
                  <button
                    onClick={resetDraft}
                    style={{ backgroundColor: "orange" }}
                  >
                    Reset Draft
                  </button>
                )}
                {league.draftStatus !== "IN_PROGRESS" && (
                  <button
                    onClick={runDraft}
                    disabled={runningDraft}
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    {runningDraft ? "Running Draft..." : league.draftStatus === "COMPLETED" ? "Re-run Draft" : "Run Draft Now"}
                  </button>
                )}
              </div>
            </div>

            {/* Picks Per User Setting */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>Picks Per User:</strong>
                {editingSettings ? (
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={picksPerUser}
                    onChange={(e) => setPicksPerUser(Number(e.target.value))}
                    style={{ marginLeft: "0.75rem", width: "80px" }}
                  />
                ) : (
                  <span style={{ marginLeft: "0.75rem" }}>{league.picksPerUser}</span>
                )}
              </div>
              {editingSettings ? (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={saveSettings} style={{ fontSize: "0.875rem", padding: "0.35rem 0.75rem" }}>
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingSettings(false);
                      setPicksPerUser(league.picksPerUser);
                    }}
                    style={{ fontSize: "0.875rem", padding: "0.35rem 0.75rem" }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingSettings(true)}
                  style={{ fontSize: "0.875rem", padding: "0.35rem 0.75rem" }}
                >
                  Edit
                </button>
              )}
            </div>

            {league.draftRunAt && (
              <div>
                <strong>Last Draft Run:</strong> {new Date(league.draftRunAt).toLocaleString()}
              </div>
            )}
            {league.rankingLockAt && (
              <div>
                <strong>Rankings Locked At:</strong> {new Date(league.rankingLockAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Draft Results */}
        {draftStatus && draftStatus.picks.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            <h3>Draft Results ({draftStatus.picks.length} picks)</h3>
            <div style={{ marginTop: "1rem", maxHeight: "400px", overflowY: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>Pick #</th>
                    <th>Round</th>
                    <th>Player</th>
                    <th>Castaway</th>
                  </tr>
                </thead>
                <tbody>
                  {draftStatus.picks.map((pick) => (
                    <tr key={pick.id}>
                      <td>{pick.pickNumber}</td>
                      <td>{pick.round}</td>
                      <td>{pick.user.name}</td>
                      <td>{pick.castaway.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* League Members */}
      <section className="rg-section" style={{ marginTop: "3rem" }}>
        <h2>League Members</h2>
        <table style={{ marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {league.users.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>
                  <span style={{
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    backgroundColor: member.isAdmin ? "var(--primary)" : "var(--text-muted)",
                    color: "white",
                    fontSize: "0.875rem"
                  }}>
                    {member.isAdmin ? "Admin" : "Player"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default LeagueManager;
