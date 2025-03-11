import { useEffect, useRef } from "react";

import { useAppStore } from "../../lib/state";

import styles from "./HeatMapVisualizer.module.css";
import {
  AVAILABLE_EXPERIMENTS_BY_SPECIES,
  SPECIES_TO_NUMERIC_ID,
} from "../../lib/constants";

export const HeatMapVisualizer = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const availableGeneLists = useAppStore((state) => state.availableGeneLists);
  const selectedSpecies = useAppStore((state) => state.species);

  useEffect(() => {
    if (svgRef.current) {
      const { height, width } = svgRef.current.getBoundingClientRect();
      console.log(`svg height: ${height} width: ${width}`);
    }
    console.log(selectedSpecies);
  }, [selectedSpecies]);

  return (
    <div id="container" className={styles.heatMapContainer}>
      <div>
        <label>
          {" "}
          Gene List:{" "}
          <select>
            {availableGeneLists
              .filter(
                (value) =>
                  value.speciesId === SPECIES_TO_NUMERIC_ID[selectedSpecies]
              )
              .map((value, index) => (
                <option key={index} value={value.id}>
                  {value.name}
                </option>
              ))}
          </select>
        </label>
        <label>
          {" "}
          Experiment:{" "}
          <select>
            {AVAILABLE_EXPERIMENTS_BY_SPECIES[selectedSpecies].map(
              (value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              )
            )}
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
      <div style={{ backgroundColor: "var(--color)" }}>
        <svg ref={svgRef}>
          <rect
            width="100%"
            height="100%"
            fill="currentColor"
            rx="5"
            ry="5"
          />
          <rect x={0} y={0} width={100} height={100} fill="red"></rect>
          <rect x={100} y={100} width={100} height={100} fill="red"></rect>
          <rect x={200} y={200} width={100} height={100} fill="red"></rect>
          <rect x={300} y={300} width={100} height={100} fill="red"></rect>
        </svg>
      </div>
    </div>
  );
};
