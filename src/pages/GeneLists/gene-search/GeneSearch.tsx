import styles from "./GeneSearch.module.css";
import { Form } from "../../../components/routing/Form";
import { ChangeEvent, FormEvent, useState } from "react";
import {
  AnnotationsRequest,
  AnnotationsResponse,
  post,
} from "../../../lib/api";
import { useAppStore } from "../../../lib/state";

export const GeneSearchRoute = () => {
  const selectedSpecies = useAppStore((state) => state.species);
  const setSearchResults = useAppStore((state) => state.setSearchResults);
  const delimiters: Record<string, string> = {
    line: "\n",
    comma: ",",
    tab: "\t",
    space: " ",
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

  return (
    <div
      id="container"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <span>Gene ID Search</span>
      <Form action="/" method="POST" handleSubmit={handleSubmit} className={styles.geneSearchForm}>
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

        <textarea
          id="gene-ids-entry"
          placeholder="Enter your gene ids here..."
          value={enteredGeneIds}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            setEnteredGeneIds(event.target.value)
          }
        ></textarea>
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
};
