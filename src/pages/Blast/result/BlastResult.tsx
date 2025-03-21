import { useEffect, useState } from "react";

export const BlastResult = ({ id }: Record<string, string>) => {
  const [status, setStatus] = useState<"polling" | "success" | "error">(
    "polling"
  );
  const [result, setResult] = useState<string | null>(null);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/poll-for-blast-result/${id}`
        );
        const data = await response.json();

        if (data.status === "SUCCESS") {
          setCompletedAt(data.completed_at);
          clearInterval(interval);
          fetchResults();
        } else if (data.status === "FAILED") {
          clearInterval(interval);
          setError("Job failed.");
          setStatus("error");
        }
        // Otherwise, keep polling...
      } catch (err) {
        clearInterval(interval);
        setError("Error checking job status.");
        setStatus("error");
      }
    }, 3000);

    const fetchResults = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/retrieve-blast-result/${id}`
        );
        const data = await response.text();
        setResult(data);
        setStatus("success");
      } catch (err) {
        setError("Failed to fetch results.");
        setStatus("error");
      }
    };
    return () => clearInterval(interval);
  });
  return (
    <div id="container">
      <h2>Blast Job ID: {id} - completed at {completedAt ?? "(pending)"}</h2>
      {status === "polling" && <p>Waiting for job to complete...</p>}
      {status === "success" && <p>Job Completed! Result: {result}</p>}
      {status === "error" && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
};
