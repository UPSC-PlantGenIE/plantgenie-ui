import styles from "./GeneSearch.module.css";
import { Form } from "../../../components/routing/Form";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import {
  AnnotationsRequest,
  AnnotationsResponse,
  post,
} from "../../../lib/api";
import { useAppStore } from "../../../lib/state";
import { Divider } from "../../../components/general/Divider";

export const GeneSearchRoute = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState(
    "Attach a file (max 1MB)"
  );
  const selectedSpecies = useAppStore((state) => state.species);
  const setSearchResults = useAppStore((state) => state.setSearchResults);
  const delimiters: Record<string, string> = {
    line: "\n",
    comma: ",",
    tab: "\t",
    space: " ",
  };
  const delimitersForHint: Record<string, string> = {
    "\n": "new lines",
    ",": "commas",
    "\t": "tabs",
    " ": "spaces",
  };
  const [enteredGeneIds, setEnteredGeneIds] = useState<string>("");
  const [delimiter, setDelimiter] = useState<string>("\n");
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedGeneIds = enteredGeneIds
      .trim()
      .split(delimiter)
      .map((line) => line.trim());

    const results = await post<AnnotationsRequest, AnnotationsResponse>(
      "/api/annotations",
      {
        species: selectedSpecies,
        geneIds: parsedGeneIds,
      }
    );

    setSearchResults(results.results);

    window.history.pushState(
      { name: "/gene-lists/search/results" },
      "",
      "/gene-lists/search/results"
    );

    window.dispatchEvent(
      new PopStateEvent("popstate", {
        state: { name: "/gene-lists/search/results", results: results },
      })
    );
  };

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
        setEnteredGeneIds(value.trim());
        setSelectedFileName(attachedFile.name);
      });
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
    <div
      id="container"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Form
        action="/"
        method="POST"
        handleSubmit={handleSubmit}
        className={styles.geneSearchContainer}
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
            Delimiter
            <select
              style={{
                paddingRight: "1em",
                textAlign: "left",
                backgroundColor: "var(--background)",
                color: "var(--color)",
                border: "1px solid var(--color)",
                borderRadius: "var(--radius)",
              }}
              onChange={(e) => {
                const value = e.target.value;
                setDelimiter(delimiters[value] || value);
              }}
              value={
                Object.entries({
                  "\n": "line",
                  ",": "comma",
                  "\t": "tab",
                  " ": "space",
                }).find(([key]) => key === delimiter)?.[1] || "line"
              }
            >
              {Object.entries(delimiters).map(([key]) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div id="gene-search-form-container" className={styles.geneSearchFormContainer}>
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
            Gene IDs
          </label>
          <Divider />
          <textarea
            className={styles.geneIdsInput}
            placeholder={`Enter gene ids delimited by ${delimitersForHint[delimiter]} (Max 1MB)`}
            value={enteredGeneIds}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              setEnteredGeneIds(event.target.value)
            }
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
