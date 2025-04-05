import { useEffect } from "react";
import { useAppStore } from "../../../lib/state";

export const SingleGeneListViewer = ({ id }: Record<string, string>) => {
  const availableGeneLists = useAppStore((state) => state.availableGeneLists);
  const activeGeneList = useAppStore((state) => state.activeGeneList);
  const setActiveGeneList = useAppStore((state) => state.setActiveGeneList);

  useEffect(() => {
    // update lastAccessed in Gene List for this route
    const filterForActiveGeneList = availableGeneLists.filter(
      (value) => value.id === id
    );

    if (filterForActiveGeneList.length > 0) {
      setActiveGeneList(filterForActiveGeneList[0].id);
    }
  }, [id, availableGeneLists, setActiveGeneList]);

  if (activeGeneList !== undefined) {
    return (
      <div id="container">
        <h2>
          {activeGeneList.name} created {activeGeneList.createdAt}
        </h2>
        <ol>
          {activeGeneList.geneIds.map((value, index) => (
            <li key={index}>{value}</li>
          ))}
        </ol>
      </div>
    );
  }

  return <div>404 Error! Gene list with id = {id} not found!</div>;
};
