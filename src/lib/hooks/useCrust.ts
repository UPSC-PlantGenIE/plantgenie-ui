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
  payload: "string";
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
  const [result, setResult] = useState<HierarchicalClusteringResult | null>();

  useEffect(() => {
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
        setResult(payload satisfies HierarchicalClusteringResult);
      }
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

  return result ? {
    rowOrder: [...result.row_order],
    colOrder: [...result.col_order],
    values: [...result.values],
  } : {
    rowOrder: [...Array(nrows).keys()],
    colOrder: [...Array(ncols).keys()],
    values: data,
  };
};
