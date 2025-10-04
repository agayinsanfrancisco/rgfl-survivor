import React, { useEffect, useState } from "react";
import api from "@/lib/api";

const LeagueManager = () => {
  const [league, setLeague] = useState<any>(null);

  useEffect(() => {
    api.get("/api/league").then(setLeague);
  }, []);

  if (!league) return <div>Loading...</div>;

  return (
    <div>
      <h2>League Settings</h2>
      <p>Name: {league.name}</p>
      <p>Members: {league.members?.length}</p>
      {/* Extend for league configuration here */}
    </div>
  );
};

export default LeagueManager;