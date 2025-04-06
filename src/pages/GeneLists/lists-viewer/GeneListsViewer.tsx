import { MouseEvent, MouseEventHandler } from "react";
import styles from "./GeneListsViewer.module.css";
import { useAppStore } from "../../../lib/state";
import { TrashIcon } from "../../../assets/icons/Trash";
import { NUMERIC_ID_TO_SPECIES } from "../../../lib/constants";

export const GeneListsViewerRoute = () => {
  const geneLists = useAppStore((state) => state.availableGeneLists);
  const setActiveGeneList = useAppStore((state) => state.setActiveGeneList);
  const updateGeneList = useAppStore((state) => state.updateGeneList);
  const removeGeneList = useAppStore((state) => state.removeGeneList);
  const availableGeneLists = useAppStore((state) => state.availableGeneLists);

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
      const filterForActiveGeneList = availableGeneLists.filter(
        (value) => value.id === id
      );

      updateGeneList({
        ...filterForActiveGeneList[0],
        lastAccessed: new Date().toUTCString(),
      });
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
      <div className={styles.geneListsInfoDisplay}>
        <span style={{ fontWeight: "bold" }}>
          {availableGeneLists.length === 1
            ? "1 gene list available"
            : `${availableGeneLists.length} gene lists available`}
        </span>
        <button
          className={styles.newGeneSearchButton}
          onClick={handleSearchClick}
        >
          New Gene Search
        </button>
      </div>
      <div style={{ width: "100%", overflowX: "auto", display: "grid" }}>
        <table>
          <thead>
            <tr>
              <th>List ID</th>
              <th>Name</th>
              <th>Species</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Last View</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {geneLists.length > 0
              ? geneLists.map((value, index) => (
                  <tr key={index} onClick={rowClickHandler(value.id)}>
                    <td>{value.id}</td>
                    <td>{value.name}</td>
                    <td style={{ fontStyle: "italic" }}>
                      {NUMERIC_ID_TO_SPECIES[value.speciesId]}
                    </td>
                    <td>{value.createdAt}</td>
                    <td>{value.updatedAt}</td>
                    <td>{value.lastAccessed}</td>
                    <td>
                      <button
                        className={styles.deleteButton}
                        onClick={(event) => {
                          event.stopPropagation();
                          removeGeneList(value.id);
                        }}
                      >
                        <TrashIcon
                          width={20}
                          height={20}
                          color="currentColor"
                        />
                      </button>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};
