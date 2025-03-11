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
    <div className={styles.GeneSearch}>
      Search Page!
      <Form action="/" method="POST" handleSubmit={handleSubmit}>
        <label>
          delimiter:
          <select
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
