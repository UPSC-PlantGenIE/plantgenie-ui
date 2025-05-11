// worker.ts
import init, {
  hierarchical_clustering,
  ClusteringAxis,
  LinkageFunction,
  DistanceMetric,
} from "../../wasm/crust"; // Adjust path as needed

self.onmessage = async (event: MessageEvent) => {
  const { type, payload } = event.data;

  if (type === "hierarchical_clustering") {
    try {
      // Ensure WASM is initialized
      await init();

      const { nrows, ncols, values, axis, linkage, distance } = payload;

      console.log(axis, linkage, distance);

      const axisEnum = ClusteringAxis[axis as keyof typeof ClusteringAxis];
      const linkageEnum =
        LinkageFunction[linkage as keyof typeof LinkageFunction];
      const distanceEnum =
        DistanceMetric[distance as keyof typeof DistanceMetric];
      const result = hierarchical_clustering(
        nrows,
        ncols,
        values,
        axisEnum,
        linkageEnum,
        distanceEnum
      );

      // result is an instance of HierarchicalClusteringResult
      const row_order = result.row_order;
      const col_order = result.col_order;
      const clustered_values = result.values;

      self.postMessage({
        type: "result",
        payload: {
          row_order,
          col_order,
          values: clustered_values,
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        self.postMessage({ type: "error", payload: err.message });
      } else {
        self.postMessage({
          type: "error",
          payload: String(err),
        });
      }
    }
  }
};
