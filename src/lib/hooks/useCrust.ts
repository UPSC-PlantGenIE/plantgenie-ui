import { useEffect, useRef, useState } from "react";

export type ClusteringAxis = "Row" | "Column" | "Both";
export type LinkageFunction = "Average" | "Ward";
export type DistanceMetric = "Euclidean" | "Chebyshev";

interface HierarchicalClusteringArgs {
  nrows: number;
  ncols: number;
  values: Float64Array;
  axis: ClusteringAxis;
  linkage: LinkageFunction;
  distance: DistanceMetric;
}

type CrustWorkerRequest = {
  type: "hierarchical_clustering";
  payload: HierarchicalClusteringArgs;
};

interface HierarchicalClusteringResult {
  row_order: Uint32Array;
  col_order: Uint32Array;
  values: Float64Array;
}

type CrustWorkerSuccessResponse = {
  type: "result";
  payload: HierarchicalClusteringResult;
};

type CrustWorkerErrorResponse = {
  type: "error";
  payload: string;
};

type CrustWorkerResponse =
  | CrustWorkerSuccessResponse
  | CrustWorkerErrorResponse;

interface CrustHookProps {
  data: number[];
  nrows: number;
  ncols: number;
  axis: ClusteringAxis;
  linkage: LinkageFunction;
  distance: DistanceMetric;
}

export const useCrust = ({
  data,
  nrows,
  ncols,
  axis,
  linkage,
  distance,
}: CrustHookProps) => {
  const crustWorker = useRef<Worker | null>(null);
  const [result, setResult] = useState<HierarchicalClusteringResult | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setResult(null);
    setError(null);

    crustWorker.current = new Worker(
      new URL("../../lib/clustering/worker.ts", import.meta.url),
      {
        type: "module",
      }
    );

    crustWorker.current.onmessage = (
      event: MessageEvent<CrustWorkerResponse>
    ) => {
      console.log("Worker response:", event.data);
      const { type, payload } = event.data;
      if (type === "result") {
        setResult(payload);
        setError(null);
      } else if (type === "error") {
        setError(payload);
        setResult(null);
      }
      setLoading(false);
    };

    crustWorker.current.postMessage({
      type: "hierarchical_clustering",
      payload: {
        ncols: ncols,
        nrows: nrows,
        values: new Float64Array(data),
        axis,
        linkage,
        distance,
      },
    } satisfies CrustWorkerRequest);

    return () => {
      crustWorker.current?.terminate();
    };
  }, [axis, linkage, distance, data, ncols, nrows]);

  if (loading) {
    return {
      rowOrder: [], // Return empty arrays while loading
      colOrder: [],
      values: [],
      // loading: true,
      // error: null,
    };
  }

  if (error) {
    return {
      rowOrder: [...Array(nrows).keys()], // Fallback to original data on error
      colOrder: [...Array(ncols).keys()],
      values: data,
      // loading: false,
      // error: error,
    };
  }

  return {
    rowOrder: result ? [...result.row_order] : [...Array(nrows).keys()],
    colOrder: result ? [...result.col_order] : [...Array(ncols).keys()],
    values: result ? [...result.values] : data, // Use result.values if available
    // loading: false,
    // error: null,
  };

  // return result
  //   ? {
  //       rowOrder: [...result.row_order],
  //       colOrder: [...result.col_order],
  //       values: [...result.values],
  //     }
  //   : {
  //       rowOrder: [...Array(nrows).keys()],
  //       colOrder: [...Array(ncols).keys()],
  //       values: data,
  //     };
};
