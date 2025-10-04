import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { WeeklyResult } from "../shared/types";

const WeeklyResults: React.FC = () => {
  const [results, setResults] = useState<WeeklyResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/api/results")
      .then(res => {
        setResults(res.data);
        setError(null);
      })
      .catch(() => {
        setResults([]);
        setError("Unable to load weekly results.");
      });
  }, []);

  return (
    <div className="container">
      <h2>Weekly Results</h2>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {results.length === 0 && !error ? (
        <p>No results posted yet.</p>
      ) : null}
      {results.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Week</th>
              <th>Castaway</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {results.map(result => (
              <tr key={result.id}>
                <td>{result.weekNumber}</td>
                <td>{result.castaway.name}</td>
                <td>{result.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WeeklyResults;
