import { ChangeEvent, useEffect, useRef, useState } from "react";

import { useAppStore } from "../../lib/state";

import styles from "./HeatMapVisualizer.module.css";
import {
  AVAILABLE_EXPERIMENTS_BY_SPECIES,
  ExperimentTitleToId,
  SPECIES_TO_NUMERIC_ID,
} from "../../lib/constants";
import { ExpressionRequest, ExpressionResponse, post } from "../../lib/api";
import { ScaleLinear, scaleLinear } from "d3";
import { interpolateRdYlBu } from "d3-scale-chromatic";

export const HeatMapVisualizer = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const availableGeneLists = useAppStore((state) => state.availableGeneLists);
  const selectedSpecies = useAppStore((state) => state.species);
  const activeGeneList = useAppStore((state) => state.activeGeneList);
  const setActiveGeneList = useAppStore((state) => state.setActiveGeneList);

  const availableExperiments =
    AVAILABLE_EXPERIMENTS_BY_SPECIES[selectedSpecies];

  const [selectedExperiment, setSelectedExperiment] = useState<string>(
    availableExperiments[0]
  );

  const [expressionData, setExpressionData] =
    useState<ExpressionResponse | null>(null);

  const [horizontalScale, setHorizontalScale] = useState<ScaleLinear<
    number,
    number,
    never
  > | null>(null);

  const [verticalScale, setVerticalScale] = useState<ScaleLinear<
    number,
    number,
    never
  > | null>(null);

  const [colorScale, setColorScale] = useState<ScaleLinear<
    number,
    number,
    never
  > | null>(null);

  useEffect(() => {
    if (svgRef === null) return;

    let defaultGeneList = activeGeneList;

    if (activeGeneList === undefined) {
      console.log("activeGeneList undefined");

      defaultGeneList =
        availableGeneLists.length !== 0 ? availableGeneLists[0] : undefined;

      if (defaultGeneList !== undefined) {
        setActiveGeneList(defaultGeneList.id);
        // above setActiveGeneList call will trigger re-render bc of useEffect dep, we return
        return;
      }
    } else {
      defaultGeneList = activeGeneList;
    }

    if (defaultGeneList === undefined) return;

    console.log(selectedSpecies);

    const response = post<ExpressionRequest, ExpressionResponse>(
      "/api/expression",
      {
        species: selectedSpecies,
        experimentId:
          ExperimentTitleToId[`${selectedSpecies} ${selectedExperiment}`],
        geneIds: defaultGeneList.geneIds,
      }
    );

    response.then((value) => {
      console.log(value);
      setExpressionData(value);
      if (svgRef.current !== null) {
        const { height, width } = svgRef.current.getBoundingClientRect();
        setHorizontalScale(() =>
          scaleLinear([0, value.samples.length], [50, width - 50])
        );
        setVerticalScale(() =>
          scaleLinear([0, value.genes.length], [50, height - 50])
        );
        setColorScale(() =>
          scaleLinear(
            [Math.max(...value.values), Math.min(...value.values)],
            [0, 1]
          )
        );
      }
    });
  }, [activeGeneList, selectedSpecies, selectedExperiment]);

  return (
    <div id="container" className={styles.heatMapContainer}>
      <div>
        <label>
          {" "}
          Gene List:{" "}
          <select
            value={activeGeneList !== undefined ? activeGeneList.id : ""}
            onChange={(event) => {
              setActiveGeneList(event.target.value);
            }}
          >
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
          <select
            onChange={(event) => setSelectedExperiment(event.target.value)}
          >
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
          <rect width="100%" height="100%" fill="currentColor" rx="5" ry="5" />
          {expressionData !== null
            ? expressionData?.samples.map((colValue, colIndex) =>
                expressionData?.genes.map((rowValue, rowIndex) => {
                  if (
                    horizontalScale !== null &&
                    verticalScale !== null &&
                    colorScale !== null
                  ) {
                    const x = horizontalScale(colIndex);
                    const y = verticalScale(rowIndex);
                    return (
                      <rect
                        key={rowIndex + rowIndex * colIndex}
                        x={x}
                        y={y}
                        width={10}
                        height={10}
                        fill={interpolateRdYlBu(
                          colorScale(
                            expressionData.values[
                              rowIndex + rowIndex * colIndex
                            ]
                          )
                        )}
                      ></rect>
                    );
                  }
                })
              )
            : null}
        </svg>
      </div>
    </div>
  );
};
