import { useMemo, useState } from "react";
import { useCrust } from "../../lib/hooks/useCrust";

type ClusteringAxis = "Row" | "Column" | "Both";
type LinkageFunction = "Average" | "Ward";
type DistanceMetric = "Euclidean" | "Chebyshev";

export const NetworkPage = () => {
  const [axis, setAxis] = useState<ClusteringAxis>("Row");
  const [linkage, setLinkage] = useState<LinkageFunction>("Average");
  const [distance, setDistance] = useState<DistanceMetric>("Euclidean");

  const example_data = useMemo(
    () => [
      1.0, 2.0, 3.0, 2.0, 3.0, 4.0, 3.0, 4.0, 5.0, 8.0, 8.0, 8.0, 1.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 6.0, 5.0, 4.0, 9.0, 9.0, 9.0, 2.0, 2.0, 2.0, 5.0, 5.0, 5.0,
    ],
    []
  );

  const example_ncols = 3;
  const example_nrows = 10;

  const clusteringResult = useCrust({
    data: example_data,
    nrows: example_nrows,
    ncols: example_ncols,
    axis,
    linkage,
    distance,
  });

  return (
    <div>
      <h1>Rust WASM + Web Worker</h1>
      <select
        value={axis}
        onChange={(event) => setAxis(event.target.value as ClusteringAxis)}
      >
        <option value={"Row"}>Row</option>
        <option value={"Column"}>Column</option>
        <option value={"Both"}>Both</option>
      </select>
      <select
        value={linkage}
        onChange={(event) => setLinkage(event.target.value as LinkageFunction)}
      >
        <option value={"Average"}>Average</option>
        <option value={"Ward"}>Ward</option>
      </select>
      <select
        value={distance}
        onChange={(event) => setDistance(event.target.value as DistanceMetric)}
      >
        <option value={"Euclidean"}>Euclidean</option>
        <option value={"Chebyshev"}>Chebyshev</option>
      </select>
      <pre>
        {clusteringResult
          ? clusteringResult.rowOrder.join(" ")
          : "Computing..."}
      </pre>
    </div>
  );
};
