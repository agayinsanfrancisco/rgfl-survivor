import React, { useEffect, useState } from "react";
import api from "@/lib/api";

const StatsDashboard = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get("/api/admin/stats").then(setStats);
  }, []);

  if (!stats) return <div>Loading stats…</div>;

  return (
    <div>
      <h2>System Stats</h2>
      <ul>
        <li>Total Users: {stats.users}</li>
        <li>Total Picks: {stats.picks}</li>
        <li>Total Castaways: {stats.castaways}</li>
      </ul>
    </div>
  );
};

export default StatsDashboard;