import { useRef, useState, ChangeEvent, FormEvent } from "react";

import { Form } from "../../../components/routing/Form";

// import { useAppStore } from "../../../lib/state";

import styles from "./BlastSubmit.module.css";

export const BlastSubmit = () => {
  // const selectedSpecies = useAppStore((state) => state.species);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState("Attach a file");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length === 1) {
      console.log(e.target.files[0].name);
      console.log(e.target.files[0]);
      setSelectedFileName(e.target.files[0].name);
    } else {
      setSelectedFileName("Attach a file");
    }
  };

  const handleFileSelectorClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div id="container" className={styles.blastSubmissionContainer}>
      <Form
        action="/blast/result/id"
        method="POST"
        handleSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          console.log("submitted job");
        }}
      >
        <div id="submission-container" className={styles.blastFormContainer}>
          <textarea
            className={styles.fastaInput}
            placeholder="Enter fasta formatted sequences"
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
              <span id="selected-filename" className={styles.selectedFilename}>
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
