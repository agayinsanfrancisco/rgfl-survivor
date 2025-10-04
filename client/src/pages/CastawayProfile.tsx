import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/lib/api";
import { Castaway } from "@/shared/types";
import { routes } from "@/shared/routes";

const CastawayProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [castaway, setCastaway] = useState<Castaway | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setErr("Missing castaway ID");
      setLoading(false);
      return;
    }
    api.get(`/api/castaways/${id}`)
      .then(res => setCastaway(res.data))
      .catch(() => setErr("Could not fetch castaway."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container">Loading castaway...</div>;
  if (err) return <div className="container" style={{ color: "crimson" }}>{err}</div>;
  if (!castaway) return <div className="container">Castaway not found.</div>;

  return (
    <div className="container">
      <Link to={routes.dashboard}>&larr; Back to Dashboard</Link>
      <h2>{castaway.name}</h2>
      <table>
        <tbody>
          <tr><th>Tribe:</th><td>{castaway.tribe}</td></tr>
          <tr><th>Age:</th><td>{castaway.age}</td></tr>
          <tr><th>Occupation:</th><td>{castaway.occupation}</td></tr>
          <tr><th>Hometown:</th><td>{castaway.hometown}</td></tr>
        </tbody>
      </table>
      <div style={{ marginTop: "2em" }}>
        <Link to={routes.weeklyPicks} className="button">Make Weekly Picks</Link>
      </div>
    </div>
  );
};

export default CastawayProfile;