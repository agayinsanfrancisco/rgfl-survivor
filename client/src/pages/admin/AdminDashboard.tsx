import React from "react";
import { useAuth } from "@/context/AuthContext";
import { routes } from "@/shared/routes";
import { Link } from "react-router-dom";

const adminLinks = [
  { label: "Weekly Score Entry", to: routes.admin.scoring },
  { label: "Castaway Management", to: routes.admin.castaways },
  { label: "User Management", to: routes.admin.users },
  { label: "League Management", to: routes.admin.league },
  { label: "Draft Manager", to: routes.admin.picks },
  { label: "Season Controls", to: routes.admin.season },
  { label: "System Stats", to: routes.admin.stats }
];

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

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
