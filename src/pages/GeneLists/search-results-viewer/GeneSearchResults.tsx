import { useAppStore } from "../../../lib/state";

export const GeneSearchResultsRoute = () => {
  const searchResults = useAppStore((state) => state.searchResults);

  return (
    <div id="container">
      <ul>
        {searchResults.map((value, index) => (
          <li key={index}>{value.description}</li>
        ))}
      </ul>
    </div>
  );
};
