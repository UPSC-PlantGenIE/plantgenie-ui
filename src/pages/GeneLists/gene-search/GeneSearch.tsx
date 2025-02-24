import styles from "./GeneSearch.module.css";
import { Form } from "../../../components/routing/Form";
import { ChangeEvent, FormEvent, useState } from "react";
export const GeneSearchRoute = () => {
  const [enteredGeneIds, setEnteredGeneIds] = useState<string>("");
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log("Submitted!");
    console.log(enteredGeneIds);
  };
  return (
    <div className={styles.GeneSearch}>
      Search Page!
      <Form action="/" method="GET" handleSubmit={handleSubmit}>
        <textarea
          id="gene-ids-entry"
          placeholder="Enter your gene ids here..."
          value={enteredGeneIds}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setEnteredGeneIds(event.target.value)}
        ></textarea>
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
};
