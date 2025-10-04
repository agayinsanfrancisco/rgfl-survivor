import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { WeeklyResult } from "../shared/types";

const WeeklyResults: React.FC = () => {
  const [results, setResults] = useState<WeeklyResult[]>([]);

  useEffect(() => {
    api.get("/api/results")
      .then(res => setResults(res.data))
      .catch(() => setResults([]));
  }, []);

  return (
    <div className="container">
      <h2>Weekly Results</h2>
      {results.length === 0 ? (
        <p>No results posted yet.</p>
      ) : (
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