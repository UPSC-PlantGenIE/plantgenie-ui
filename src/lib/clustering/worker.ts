// worker.ts
import init, { hierarchical_clustering } from "../../wasm/crust"; // Adjust path as needed

self.onmessage = async (event: MessageEvent) => {
  const { type, payload } = event.data;

  if (type === "hierarchical_clustering") {
    try {
      // Ensure WASM is initialized
      await init();

      const { nrows, ncols, values } = payload;
      const result = hierarchical_clustering(nrows, ncols, values);

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
    } catch (err: any) {
      self.postMessage({ type: "error", payload: err.message });
    }
  }
};
