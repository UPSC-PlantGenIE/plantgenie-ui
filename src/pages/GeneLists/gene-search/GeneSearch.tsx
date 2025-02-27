import styles from "./GeneSearch.module.css";
import { Form } from "../../../components/routing/Form";
import { ChangeEvent, FormEvent, useState } from "react";

export const GeneSearchRoute = () => {
  const [enteredGeneIds, setEnteredGeneIds] = useState<string>("");
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
