import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { routes } from "@/shared/routes";
import { Link } from "react-router-dom";
import api from "@/lib/api";

const adminLinks = [
  { label: "Weekly Score Entry", to: routes.admin.scoring },
  { label: "Analytics Dashboard", to: routes.admin.analytics },
  { label: "Castaway Management", to: routes.admin.castaways },
  { label: "User Management", to: routes.admin.users },
  { label: "League Management", to: routes.admin.league },
  { label: "Draft Manager", to: routes.admin.picks },
  { label: "Season Controls", to: routes.admin.season },
  { label: "System Stats", to: routes.admin.stats }
];

interface DashboardStats {
  users: number;
  picks: number;
  castaways: number;
  weeks: number;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/admin/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Failed to load stats:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rg-page">
      <section className="rg-hero">
        <span className="rg-pill">League Command Center</span>
        <h1>Welcome, {user?.name ?? "Admin"}</h1>
        <p>
          Here&apos;s where you run the show. Lock rankings, launch the draft, input weekly scores, and keep the Survivor
          faithful organized.
        </p>
      </section>

      {/* Stats Cards */}
      <section className="rg-section" style={{ marginTop: "2rem" }}>
        <h2>League Overview</h2>
        {loading ? (
          <p>Loading stats...</p>
        ) : stats ? (
          <div className="rg-grid rg-grid--four" style={{ marginTop: "1rem" }}>
            <div className="rg-card" style={{ textAlign: "center", padding: "1.5rem" }}>
              <h3 style={{ fontSize: "2.5rem", margin: 0, color: "var(--primary)" }}>{stats.users}</h3>
              <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>Total Players</p>
            </div>
            <div className="rg-card" style={{ textAlign: "center", padding: "1.5rem" }}>
              <h3 style={{ fontSize: "2.5rem", margin: 0, color: "var(--primary)" }}>{stats.castaways}</h3>
              <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>Castaways</p>
            </div>
            <div className="rg-card" style={{ textAlign: "center", padding: "1.5rem" }}>
              <h3 style={{ fontSize: "2.5rem", margin: 0, color: "var(--primary)" }}>{stats.weeks}</h3>
              <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>Weeks Created</p>
            </div>
            <div className="rg-card" style={{ textAlign: "center", padding: "1.5rem" }}>
              <h3 style={{ fontSize: "2.5rem", margin: 0, color: "var(--primary)" }}>{stats.picks}</h3>
              <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>Total Picks</p>
            </div>
          </div>
        ) : (
          <p className="error">Failed to load statistics.</p>
        )}
      </section>

      <section className="rg-section" style={{ marginTop: "3rem" }}>
        <h2>Quick Actions</h2>
        <div className="rg-grid rg-grid--two">
          {adminLinks.map((link) => (
            <Link key={link.to} to={link.to} className="rg-card">
              <h3>{link.label}</h3>
              <p style={{ color: "var(--text-muted)" }}>Manage {link.label.toLowerCase()}.</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
