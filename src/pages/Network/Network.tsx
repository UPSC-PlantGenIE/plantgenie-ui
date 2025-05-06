import { useEffect, useRef, useState } from "react";

type ClusteringAxis = "Row" | "Column" | "Both";
type LinkageFunction = "Average" | "Ward";
type DistanceMetric = "Euclidean" | "Chebyshev";

interface HierarchicalClusteringArgs {
  nrows: number;
  ncols: number;
  values: Float64Array;
  axis: ClusteringAxis;
  linkage: LinkageFunction;
  distance: DistanceMetric;
}

type RustWorkerRequest = {
  type: "hierarchical_clustering";
  payload: HierarchicalClusteringArgs;
};

interface Payload {
  row_order: Uint32Array;
  col_order: Uint32Array;
  values: Float64Array;
}

type RustWorkerResponse =
  | {
      type: "result";
      payload: {
        row_order: Uint32Array;
        col_order: Uint32Array;
        values: Float64Array;
      };
    }
  | { type: "error"; payload: string };

// type RustWorkerResponse =
//   | { type: "result"; payload: Float64Array }
//   | { type: "error"; payload: string }; // Optional: catch errors

export const NetworkPage = () => {
  const RustWorker = useRef<Worker | null>(null);
  const [axis, setAxis] = useState<ClusteringAxis>("Row");
  const [linkage, setLinkage] = useState<LinkageFunction>("Average");
  const [distance, setDistance] = useState<DistanceMetric>("Euclidean");
  const [result, setResult] = useState<Payload | null>(null);
  // const [result, setResult] = useState<Float64Array | null>(null);

  useEffect(() => {
    const example_data = new Float64Array([
      1.0,
      2.0,
      3.0, // row 0
      2.0,
      3.0,
      4.0, // row 1
      3.0,
      4.0,
      5.0, // row 2
      8.0,
      8.0,
      8.0, // row 3
      1.0,
      0.0,
      1.0, // row 4
      0.0,
      1.0,
      0.0, // row 5
      6.0,
      5.0,
      4.0, // row 6
      9.0,
      9.0,
      9.0, // row 7
      2.0,
      2.0,
      2.0, // row 8
      5.0,
      5.0,
      5.0, // row 9
    ]);
    // const example_data = new Float64Array([
    //   // Cluster A under Euclidean
    //   1.0, 1.0, 1.0, // row 0
    //   2.0, 2.0, 2.0, // row 1
    //   3.0, 3.0, 3.0, // row 2

    //   // Cluster B under Chebyshev
    //   0.0, 0.0, 10.0, // row 3
    //   0.0, 0.0, 11.0, // row 4
    //   0.0, 0.0, 12.0, // row 5

    //   // These are outliers under Chebyshev but close in Euclidean to cluster A
    //   1.0, 1.0, 10.0, // row 6
    //   2.0, 2.0, 10.0, // row 7

    //   // Separate cluster in both
    //   50.0, 50.0, 50.0, // row 8
    //   51.0, 51.0, 51.0, // row 9
    // ]);

    const example_ncols = 3;
    const example_nrows = 10;
    console.log(axis);
    RustWorker.current = new Worker(
      new URL("../../lib/clustering/worker.ts", import.meta.url),
      {
        type: "module",
      }
    );

    RustWorker.current.onmessage = (
      event: MessageEvent<RustWorkerResponse>
    ) => {
      console.log("Worker response:", event.data);
      const { type, payload } = event.data;
      if (type === "result") {
        setResult(payload satisfies Payload);
      }
    };

    RustWorker.current.postMessage({
      type: "hierarchical_clustering",
      payload: {
        ncols: example_ncols,
        nrows: example_nrows,
        values: example_data,
        axis,
        linkage,
        distance,
      },
    } satisfies RustWorkerRequest);

    return () => {
      RustWorker.current?.terminate();
    };
  }, [axis, linkage, distance]);

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
      <pre>{result ? result.row_order.join(" ") : "Computing..."}</pre>
    </div>
  );
};
