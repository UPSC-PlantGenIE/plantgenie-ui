import { useEffect, useState } from "react";
import { useAppStore } from "../../../lib/state";
import {
  AnnotationsRequest,
  AnnotationsResponse,
  GeneAnnotation,
  post,
} from "../../../lib/api";
import { TrashIcon } from "../../../assets/icons/Trash";

import styles from "./SingleGeneListViewer.module.css";

export const SingleGeneListViewer = ({ id }: Record<string, string>) => {
  const availableGeneLists = useAppStore((state) => state.availableGeneLists);
  const activeGeneList = useAppStore((state) => state.activeGeneList);
  const selectedSpecies = useAppStore((state) => state.species);
  const setActiveGeneList = useAppStore((state) => state.setActiveGeneList);
  const updateGeneList = useAppStore((state) => state.updateGeneList);

  const [annotations, setAnnotations] = useState<Array<GeneAnnotation>>([]);

  useEffect(() => {
    // update lastAccessed in Gene List for this route
    const filterForActiveGeneList = availableGeneLists.filter(
      (value) => value.id === id
    );

    if (filterForActiveGeneList.length < 0) return;

    const geneList = filterForActiveGeneList[0];
    setActiveGeneList(geneList.id);

    const fetchAnnotations = async () => {
      return await post<AnnotationsRequest, AnnotationsResponse>(
        "/annotations",
        {
          species: selectedSpecies,
          geneIds: geneList.geneIds,
        }
      );
    };

    fetchAnnotations()
      .then((results) => setAnnotations(results.results))
      .catch((error) => console.log(error));
  }, [id, availableGeneLists, setActiveGeneList]);

  const deleteHandler = (geneIdToDelete: string) => {
    return () => {
      if (!activeGeneList) return;

      updateGeneList({
        ...activeGeneList,
        geneIds: activeGeneList.geneIds.filter(
          (value) => value !== geneIdToDelete
        ),
        updatedAt: new Date().toUTCString(),
      });
    };
  };

  if (activeGeneList !== undefined) {
    return (
      <div id="container" className={styles.geneListViewer}>
        <div className={styles.geneListInfoDisplay}>
          <span style={{ fontWeight: "bold" }}>
            {activeGeneList.name} ({activeGeneList.geneIds.length} genes)
          </span>
          <span style={{ fontSize: "0.85em" }}>
            created: {activeGeneList.createdAt}
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
                      <td>{`${value.chromosomeId}_${value.geneId}`}</td>
                      <td>{value.preferredName}</td>
                      <td>{value.description}</td>
                      <td>
                        <button
                          className={styles.deleteButton}
                          onClick={deleteHandler(
                            `${value.chromosomeId}_${value.geneId}`
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
