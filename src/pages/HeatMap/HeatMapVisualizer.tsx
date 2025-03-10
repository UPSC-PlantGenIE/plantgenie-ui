import { SvgCanvas } from "../../components/general";
import { useAppStore } from "../../lib/state";

export const HeatMapVisualizer = () => {
  const availableGeneLists = useAppStore((state) => state.availableGeneLists);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div>
        <label>
          {" "}
          Gene List:{" "}
          <select>
            {availableGeneLists.map((value, index) => (
              <option key={index} value={value.id}>
                {value.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          {" "}
          Cluster Metric:{" "}
          <select>
            {["Euclidean", "Chebyshev"].map((value, index) => (
              <option key={index} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label>
          {" "}
          Cluster Linkage:{" "}
          <select>
            {["Average", "Ward"].map((value, index) => (
              <option key={index} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label>
          {" "}
          Cluster Axis:{" "}
          <select>
            {["row", "col", "both"].map((value, index) => (
              <option key={index} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label>
          {" "}
          Scaling:{" "}
          <select>
            {["row", "col", "zscore", "log2", "none"].map((value, index) => (
              <option key={index} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>

      <SvgCanvas height={400} width={400}>
        <rect x1={0} y1={0} width={100} height={100} fill="red"></rect>
      </SvgCanvas>
    </div>
  );
};
