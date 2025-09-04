import { useEffect, useState } from "react";

import { baseUrl } from "../../../lib/api";

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
  "QID",
  "HID",
  "%Id",
  "Len",
  "MM",
  "Gap",
  "QS",
  "QE",
  "SS",
  "SE",
  "E",
  "Bit",
];

const parseBlastResults = (data: string): BlastResultRow[] => {
  return data
    .trim()
    .split("\n")
    .map((line) => {
      const cols = line.split("\t");
      if (cols.length !== 12) return null;

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
    .filter((row): row is BlastResultRow => row !== null);
};

export const BlastResult = ({ id }: Record<string, string>) => {
  const [status, setStatus] = useState<"polling" | "success" | "error">(
    "polling"
  );
  // const [result, setResult] = useState<string | null>(null);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [blastResults, setBlastResults] = useState<BlastResultRow[]>([]);

  useEffect(() => {
    let retries = 0;
    const maxRetries = 5;
    const interval = setInterval(async () => {
      retries += 1;
      try {
        if (retries > maxRetries) {
          clearInterval(interval);
          throw Error(`Failed to download result with id = ${id}`);
        }
        // const response = await fetch(
        //   `${baseUrl}/poll-for-blast-result/${id}`
        // );
        const response = await fetch(`${baseUrl}/v1/blast/poll/${id}`)
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
        // const response = await fetch(
        //   `${baseUrl}/retrieve-blast-result/${id}`
        // );
        const response = await fetch(`${baseUrl}/v1/blast/retrieve/${id}/tsv`);
        const data = await response.text();
        // setResult(data);
        setBlastResults(parseBlastResults(data));
        setStatus("success");
      } catch (err) {
        setError("Failed to fetch results.");
        setStatus("error");
      }
    };
    return () => clearInterval(interval);
  });

  const saveBlastTableHandler = async () => {
    try {
      // const response = await fetch(
      //   `${baseUrl}/retrieve-blast-result/${id}`
      // );
      const response = await fetch(`${baseUrl}/v1/blast/retrieve/${id}/tsv`);

      const data = await response.text();

      const blob = new Blob([data], { type: "text/tsv" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `blast-${id}.tsv`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      window.alert("There was an error downloading the file");
    }
  };

  const saveBlastHtmlHandler = async () => {
    try {
      // const response = await fetch(
      //   `${baseUrl}/retrieve-blast-result-as-html/${id}`
      // );
      const response = await fetch(`${baseUrl}/v1/blast/retrieve/${id}/html`);

      const data = await response.text();

      const blob = new Blob([data], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `blast-${id}.html`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      window.alert("There was an error downloading the file");
    }
  };

  return (
    <div id="container" className={styles.blastResultContainer}>
      {/* <h3>Blast Job ID: {id}</h3> */}
      {status === "polling" && <p>Waiting for job to complete...</p>}
      {status === "success" && (
        <>
          <div className={styles.blastResultDisplay}>
            <span>Job ID: {id}</span>
            <span style={{ fontSize: "0.85em" }}>
              completed: {completedAt ?? "(pending)"}
            </span>
          </div>
          <div style={{ width: "100%", overflowX: "auto", display: "grid" }}>
            <table>
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
          <div className={styles.blastTableFooter}>
            <span style={{ fontSize: "0.5em" }}>
              No. Results: {blastResults.length}
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                columnGap: "0.5em",
              }}
            >
              <button
                className={styles.downloadButton}
                onClick={saveBlastTableHandler}
              >
                Download Table
              </button>
              <button
                className={styles.downloadButton}
                onClick={saveBlastHtmlHandler}
              >
                Download HTML
              </button>
            </div>
          </div>
        </>
      )}
      {status === "error" && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
};
