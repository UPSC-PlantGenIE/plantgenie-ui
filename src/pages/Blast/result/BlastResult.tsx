import { useEffect, useState } from "react";

import styles from "./BlastResult.module.css";

interface BlastResultRow {
  qseqid: string;
  sseqid: string;
  pident: number;
  length: number;
  mismatch: number;
  gapopen: number;
  qstart: number;
  qend: number;
  sstart: number;
  send: number;
  evalue: number;
  bitscore: number;
}

const blastTsvColumns = [
  "Query ID",
  "Hit ID",
  "% Identity",
  "length",
  "mismatch",
  "gapopen",
  "qstart",
  "qend",
  "sstart",
  "send",
  "evalue",
  "bitscore",
];

const parseBlastResults = (data: string): BlastResultRow[] => {
  return data
    .trim() // Remove leading/trailing whitespace
    .split("\n") // Split into rows
    .map((line) => {
      const cols = line.split("\t"); // Split each row into columns
      if (cols.length !== 12) return null; // Ensure correct number of columns

      return {
        qseqid: cols[0],
        sseqid: cols[1],
        pident: parseFloat(cols[2]),
        length: parseInt(cols[3], 10),
        mismatch: parseInt(cols[4], 10),
        gapopen: parseInt(cols[5], 10),
        qstart: parseInt(cols[6], 10),
        qend: parseInt(cols[7], 10),
        sstart: parseInt(cols[8], 10),
        send: parseInt(cols[9], 10),
        evalue: parseFloat(cols[10]),
        bitscore: parseFloat(cols[11]),
      };
    })
    .filter((row): row is BlastResultRow => row !== null); // Filter out any invalid rows
};

export const BlastResult = ({ id }: Record<string, string>) => {
  const [status, setStatus] = useState<"polling" | "success" | "error">(
    "polling"
  );
  const [result, setResult] = useState<string | null>(null);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [blastResults, setBlastResults] = useState<BlastResultRow[]>([]);

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
        setBlastResults(parseBlastResults(data));
        setStatus("success");
      } catch (err) {
        setError("Failed to fetch results.");
        setStatus("error");
      }
    };
    return () => clearInterval(interval);
  }, []);
  return (
    <div id="container" className={styles.blastResultContainer}>
      <h3>Blast Job ID: {id}</h3>
      {status === "polling" && <p>Waiting for job to complete...</p>}
      {status === "success" && (
        <>
          <div>Completed at {completedAt ?? "(pending)"}</div>
          <div style={{ width: "100%", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {blastTsvColumns.map((value, index) => (
                    <th key={index}>{value}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {blastResults.map((row, index) => (
                  <tr key={index}>
                    <td>{row.qseqid}</td>
                    <td>{row.sseqid}</td>
                    <td>{row.pident}</td>
                    <td>{row.length}</td>
                    <td>{row.mismatch}</td>
                    <td>{row.gapopen}</td>
                    <td>{row.qstart}</td>
                    <td>{row.qend}</td>
                    <td>{row.sstart}</td>
                    <td>{row.send}</td>
                    <td>{row.evalue}</td>
                    <td>{row.bitscore}</td>
                  </tr>
                ))}
                <tr></tr>
              </tbody>
            </table>
          </div>
        </>
      )}
      {status === "error" && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
};
