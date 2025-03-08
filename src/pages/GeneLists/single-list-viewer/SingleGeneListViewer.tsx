import { useAppStore } from "../../../lib/state";

export const SingleGeneListViewer = ({ id }: Record<string, string>) => {
  const activeGeneList = useAppStore((state) => state.activeGeneList);

  if (activeGeneList !== undefined) {
    return (
      <div>
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

  return <div>404 Not Found! Sorry!</div>;
};
