import { MouseEvent, MouseEventHandler } from "react";
import styles from "./GeneListsViewer.module.css";
import { useAppStore } from "../../../lib/state";

export const GeneListsViewerRoute = () => {
  const geneLists = useAppStore((state) => state.availableGeneLists);

  const handleSearchClick: MouseEventHandler = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    window.history.pushState(
      { name: "/gene-lists/search" },
      "",
      "/gene-lists/search"
    );
    window.dispatchEvent(
      new PopStateEvent("popstate", {
        state: { name: `/gene-lists/search` },
      })
    );
  };

  return (
    <div id="container" className={styles.geneListViewerContainer}>
      <button onClick={handleSearchClick}>New Gene Search</button>
      <div className={styles.tableWrapper}>
        <div className={styles.tableElement}>
          <table>
            <thead>
              <tr>
                <th>id</th>
                <th>name</th>
                <th>creation date</th>
                <th>last updated</th>
                <th>last accessed</th>
              </tr>
            </thead>
            <tbody>
              {geneLists.length > 0
                ? geneLists.map((value, index) => (
                    <tr key={index}>
                      <td>{value.id}</td>
                      <td>{value.name}</td>
                      <td>{value.createdAt}</td>
                      <td>{value.updatedAt}</td>
                      <td>{value.lastAccessed}</td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
