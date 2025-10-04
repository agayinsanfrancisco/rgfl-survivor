import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/lib/api";

const CastawayProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [castaway, setCastaway] = useState<any>(null);

  useEffect(() => {
    if (id) {
      api.get(`/api/castaways/${id}`).then(setCastaway);
    }
  }, [id]);

  if (!castaway) return <div>Loading castaway...</div>;

  return (
    <div className="castaway-profile">
      <h2>{castaway.name}</h2>
      <ul>
        <li><b>Age:</b> {castaway.age}</li>
        <li><b>Tribe:</b> {castaway.tribe}</li>
        <li><b>Occupation:</b> {castaway.occupation}</li>
      </ul>
    </div>
  );
};

export default CastawayProfile;