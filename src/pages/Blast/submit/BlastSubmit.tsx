import { useRef, useState, ChangeEvent, FormEvent } from "react";

import { useAppStore } from "../../../lib/state";
import { baseUrl } from "../../../lib/api";
import { Form } from "../../../components/routing/Form";
import { Divider } from "../../../components/general/Divider";

import styles from "./BlastSubmit.module.css";

type BlastProgramOptions = "blastn" | "blastp" | "blastx";
const blastProgramOptions: BlastProgramOptions[] = [
  "blastn",
  "blastp",
  "blastx",
];

type BlastDatabaseOptions = "genome" | "cds" | "mrna" | "protein";
const blastDatabaseOptions: BlastDatabaseOptions[] = [
  "genome",
  "cds",
  "mrna",
  "protein",
];

export const BlastSubmit = () => {
  const selectedSpecies = useAppStore((state) => state.species);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState(
    "Attach a file (max 1MB)"
  );
  const [fastaSequences, setFastaSequences] = useState<string>("");
  const [selectedProgram, setSelectedProgram] =
    useState<BlastProgramOptions>("blastn");

  const [selectedDatabase, setSelectedDatabase] =
    useState<BlastDatabaseOptions>("cds");

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log(e.target.files?.length);
    if (e.target.files !== null && e.target.files.length === 1) {
      const attachedFile = e.target.files[0];

      if (attachedFile.size > 2 ** 20) {
        setSelectedFileName("File size too big, attach another");
        return;
      }

      console.log(e.target.files[0].name);
      console.log(e.target.files[0]);

      attachedFile.text().then((value) => {
        setFastaSequences(value.trim());
        setSelectedFileName(attachedFile.name);
      });
    } else {
      setSelectedFileName("Attach a file");
    }
  };

  const handleFastaInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    const newText = event.target.value;

    const byteLength = new TextEncoder().encode(newText).length;

    if (byteLength <= 2 ** 20) {
      setFastaSequences(newText);
    }
  };

  const handleFileSelectorClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();

    const blob = new Blob([fastaSequences], { type: "text/plain" });
    // const fileName = "query.fasta";

    formData.append("file", blob, selectedFileName);
    formData.append("description", "string");
    formData.append("dbtype", selectedDatabase);
    formData.append("program", selectedProgram);
    formData.append("species", selectedSpecies);

    try {
      const response = await fetch(
        `${baseUrl}/submit-blast-query/`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Response:", result);

      window.history.pushState(
        { name: `/blast/result/${result.job_id}` },
        "",
        `/blast/result/${result.job_id}`
      );

      window.dispatchEvent(
        new PopStateEvent("popstate", {
          state: { name: `/blast/result/${result.job_id}`, results: result },
        })
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div
      id="container"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Form
        action="/blast/result/id"
        method="POST"
        handleSubmit={handleFormSubmit}
        className={styles.blastSubmissionContainer}
      >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "start",
              alignItems: "center",
              columnGap: "1em",
              border: "1px solid var(--color)",
              paddingTop: "0.5em",
              paddingBottom: "0.5em",
              paddingLeft: "0.5em",
              paddingRight: "0.5em",
              borderRadius: "var(--radius)",
            }}
          >
            <label
              style={{
                fontStyle: "var(--inter)",
                display: "flex",
                flexDirection: "column",
                fontSize: "0.75rem",
                fontWeight: "bold",
                alignItems: "flex-start",
              }}
            >
              Program
              <select
                style={{
                  paddingRight: "1em",
                  textAlign: "left",
                  backgroundColor: "var(--background)",
                  color: "var(--color)",
                  border: "1px solid var(--color)",
                  borderRadius: "var(--radius)",
                }}
                value={selectedProgram}
                onChange={(event) =>
                  setSelectedProgram(event.target.value as BlastProgramOptions)
                }
              >
                {blastProgramOptions.map((value, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <label
              style={{
                fontStyle: "var(--inter)",
                display: "flex",
                flexDirection: "column",
                fontSize: "0.75rem",
                fontWeight: "bold",
                alignItems: "flex-start",
              }}
            >
              Database
              <select
                style={{
                  paddingRight: "1em",
                  textAlign: "left",
                  backgroundColor: "var(--background)",
                  color: "var(--color)",
                  border: "1px solid var(--color)",
                  borderRadius: "var(--radius)",
                }}
                value={selectedDatabase}
                onChange={(event) =>
                  setSelectedDatabase(
                    event.target.value as BlastDatabaseOptions
                  )
                }
              >
                {blastDatabaseOptions.map((value, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div id="blast-form-container" className={styles.blastFormContainer}>
            <label
              style={{
                fontStyle: "var(--inter)",
                display: "flex",
                flexDirection: "column",
                fontSize: "0.75rem",
                fontWeight: "bold",
                alignItems: "flex-start",
                paddingTop: "0.5em",
                paddingBottom: "0.5em",
                paddingLeft: "0.25em",
              }}
            >
              Query Sequence
            </label>
            <Divider />
            <textarea
              className={styles.fastaInput}
              placeholder="Enter fasta formatted sequences (max 1 MB)"
              value={fastaSequences}
              onChange={handleFastaInputChange}
            ></textarea>
            <div className={styles.fileContainer}>
              <div
                id="file-selector"
                className={styles.fileSelector}
                onClick={handleFileSelectorClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={styles.attachIcon}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                  />
                </svg>
                <input
                  id="file-element"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  hidden={true}
                />
                <span
                  id="selected-filename"
                  className={styles.selectedFilename}
                >
                  {selectedFileName}
                </span>
              </div>
              <button type="submit" className={styles.submitButton}>
                Submit
              </button>
            </div>
          </div>
      </Form>
    </div>
  );
};
