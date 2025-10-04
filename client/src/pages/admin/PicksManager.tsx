import React, { useEffect, useState } from "react";
import api from "@/lib/api";

const PicksManager = () => {
  const [picks, setPicks] = useState<any[]>([]);

  useEffect(() => {
    api.get("/api/picks/week/1").then(res => setPicks(res.data)); // TODO: dynamic week
  }, []);

  return (
    <div>
      <h2>Picks This Week</h2>
      <ul>
        {picks.map(p => (
          <li key={p.id}>
            {p.user?.name} picked {p.castaway?.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PicksManager;