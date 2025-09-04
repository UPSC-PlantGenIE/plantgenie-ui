import { useEffect, useState } from "react";
import { useAppStore } from "../../../lib/state";
import {
  GeneAnnotation,
  getAnnotationData,
} from "../../../lib/backend";
import { TrashIcon } from "../../../assets/icons/Trash";

import styles from "./SingleGeneListViewer.module.css";

export const SingleGeneListViewer = ({ id }: Record<string, string>) => {
  const availableGeneLists = useAppStore((state) => state.availableGeneLists);
  const selectedSpecies = useAppStore((state) => state.species);
  const updateGeneList = useAppStore((state) => state.updateGeneList);

  // should just be the one matching the id (which was the one clicked on the previous page)
  const geneListsForView = availableGeneLists.filter(
    (value) => value.id === id
  );

  const selectedGeneList =
    geneListsForView.length !== 0 ? geneListsForView[0] : null;

  const [annotations, setAnnotations] = useState<Array<GeneAnnotation>>([]);

  useEffect(() => {
    if (!selectedGeneList) return;

    updateGeneList({
      ...selectedGeneList,
      lastAccessed: new Date().toUTCString(),
    });
  }, [id]);

  useEffect(() => {
    if (!selectedGeneList) return;

    getAnnotationData({
      species: selectedSpecies,
      geneIds: selectedGeneList.geneIds,
    })
      .then((results) => setAnnotations(results.results))
      .catch((error) => console.log(error));
  }, [id, availableGeneLists]);

  const deleteHandler = (geneIdToDelete: string) => {
    return () => {
      if (!selectedGeneList) return;

      updateGeneList({
        ...selectedGeneList,
        geneIds: selectedGeneList.geneIds.filter(
          (value) => value !== geneIdToDelete
        ),
        updatedAt: new Date().toUTCString(),
      });
    };
  };

  // if (activeGeneList !== undefined) {
  if (selectedGeneList) {
    return (
      <div id="container" className={styles.geneListViewer}>
        <div className={styles.geneListInfoDisplay}>
          <span style={{ fontWeight: "bold" }}>
            {selectedGeneList.name} ({selectedGeneList.geneIds.length} genes)
          </span>
          <span style={{ fontSize: "0.85em" }}>
            created: {selectedGeneList.createdAt}
          </span>
        </div>
        <div style={{ width: "100%", overflowX: "auto", display: "grid" }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Delete?</th>
              </tr>
            </thead>
            <tbody>
              {annotations.length > 0
                ? annotations.map((value, index) => (
                    <tr key={index}>
                      <td>{value.geneId}</td>
                      <td>{value.geneName ?? "NA"}</td>
                      <td>{value.description ?? "NA"}</td>
                      <td>
                        <button
                          className={styles.deleteButton}
                          onClick={deleteHandler(
                            `${value.geneId}`
                          )}
                        >
                          <TrashIcon height={20} width={20} />
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
  }

  return <div>404 Error! Gene list with id = {id} not found!</div>;
};
