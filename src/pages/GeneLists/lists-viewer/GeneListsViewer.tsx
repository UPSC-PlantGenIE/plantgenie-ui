import { MouseEvent, MouseEventHandler } from "react";
import styles from "./GeneListsViewer.module.css";
import { useAppStore } from "../../../lib/state";
import { TrashIcon } from "../../../assets/icons/Trash";
import { NUMERIC_ID_TO_SPECIES } from "../../../lib/constants";

export const GeneListsViewerRoute = () => {
  const geneLists = useAppStore((state) => state.availableGeneLists);
  const setActiveGeneList = useAppStore((state) => state.setActiveGeneList);
  const removeGeneList = useAppStore((state) => state.removeGeneList);

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

  const rowClickHandler = (id: string) => {
    console.log(id);

    const navLink = `/gene-lists/${id}`;
    return () => {
      setActiveGeneList(id);
      window.history.pushState({ name: navLink }, "", navLink);
      window.dispatchEvent(
        new PopStateEvent("popstate", {
          state: { name: navLink },
        })
      );
    };
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
                <th>species</th>
                <th>creation date</th>
                <th>last updated</th>
                <th>last accessed</th>
                <th>delete?</th>
              </tr>
            </thead>
            <tbody>
              {geneLists.length > 0
                ? geneLists.map((value, index) => (
                    <tr key={index} onClick={rowClickHandler(value.id)}>
                      <td>{value.id}</td>
                      <td>{value.name}</td>
                      <td>{NUMERIC_ID_TO_SPECIES[value.speciesId]}</td>
                      <td>{value.createdAt}</td>
                      <td>{value.updatedAt}</td>
                      <td>{value.lastAccessed}</td>
                      <td style={{ backgroundColor: "red" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onClick={(event) => {
                            event.stopPropagation();
                            removeGeneList(value.id);
                          }}
                        >
                          <TrashIcon width={20} height={20} color="white" />
                          {/* </button> */}
                        </div>
                      </td>
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
