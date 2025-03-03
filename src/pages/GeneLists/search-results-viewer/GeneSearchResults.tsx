import styles from "./GeneSearchResults.module.css";

import { useAppStore } from "../../../lib/state";
import { Form } from "../../../components/routing/Form";

export const GeneSearchResultsRoute = () => {
  const searchResults = useAppStore((state) => state.searchResults);

  return (
    <div id="container" className={styles.searchResultsViewer}>
      <div className={styles.tableWrapper}>
        <Form action="/" handleSubmit={() => console.log("submitted!")}>
          <div className={styles.tableElement}>
            <table>
              <thead>
                <tr>
                  <th>add?</th>
                  <th>Chromosome ID</th>
                  <th>Gene ID</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.length > 0
                  ? searchResults.map((value, index) => (
                      <tr key={index}>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td>{value.chromosomeId}</td>
                        <td>{value.geneId}</td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
            <button type="submit">submit</button>
          </div>
        </Form>
      </div>
    </div>
  );
};
