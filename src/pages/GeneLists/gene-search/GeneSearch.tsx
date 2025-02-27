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
  const speciesId = useAppStore((state) => state.speciesId);
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
        species: "Picea abies",
        geneIds: parsedGeneIds,
      }
    );

    console.log(results);

    window.history.pushState(
      { name: "/gene-lists/search/results" },
      "",
      "/gene-lists/search/results"
    );

    window.dispatchEvent(
      new PopStateEvent("popstate", { state: "/gene-lists/search/results" })
    );
  };

  return (
    <div className={styles.GeneSearch}>
      Search Page!
      <Form action="/" method="POST" handleSubmit={handleSubmit}>
        <select>
          <option>{"line"}</option>
          <option>{"comma"}</option>
          <option>{"tab"}</option>
          <option>{"space"}</option>
        </select>
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
