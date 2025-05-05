import { useEffect, useRef, useState } from "react";

interface HierarchicalClusteringArgs {
  nrows: number;
  ncols: number;
  values: Float64Array;
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
  const [result, setResult] = useState<Payload | null>(null);
  // const [result, setResult] = useState<Float64Array | null>(null);

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

  const example_ncols = 3;
  const example_nrows = 10;

  useEffect(() => {
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
      },
    } satisfies RustWorkerRequest);

    return () => {
      RustWorker.current?.terminate();
    };
  }, []);

  return (
    <div>
      <h1>Rust WASM + Web Worker</h1>
      <pre>{result ? result.values.join(" ") : "Computing..."}</pre>
    </div>
  );
};
