import { ChangeEvent, useEffect, useState } from "react";

import { useAppStore } from "../../lib/state";

import styles from "./HeatMapVisualizer.module.css";
import {
  AVAILABLE_EXPERIMENTS_BY_SPECIES,
  ExperimentTitleToId,
  SPECIES_TO_NUMERIC_ID,
} from "../../lib/constants";
import { ExpressionRequest, ExpressionResponse, post } from "../../lib/api";
import { SvgHeatMap } from "./SvgHeatMap";
// import { useExpression } from "../../lib/hooks";
// import {
//   createReorderedIndexMapper,
//   getVectors,
//   reshapeData,
// } from "../../lib/clustering/utils";

export const HeatMapVisualizer = () => {
  const availableGeneLists = useAppStore((state) => state.availableGeneLists);
  const selectedSpecies = useAppStore((state) => state.species);
  const activeGeneList = useAppStore((state) => state.activeGeneList);
  const setActiveGeneList = useAppStore((state) => state.setActiveGeneList);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>();

  const availableExperiments =
    AVAILABLE_EXPERIMENTS_BY_SPECIES[selectedSpecies];

  const [selectedExperiment, setSelectedExperiment] = useState<string>(
    availableExperiments[0]
  );

  const [expressionData, setExpressionData] =
    useState<ExpressionResponse | null>(null);

  useEffect(() => {
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

    setLoading(true);

    const response = post<ExpressionRequest, ExpressionResponse>(
      "/api/expression",
      {
        species: selectedSpecies,
        experimentId:
          ExperimentTitleToId[`${selectedSpecies} ${selectedExperiment}`],
        geneIds: defaultGeneList.geneIds,
      }
    );

    response
      .then((value) => {
        console.log(value);
        setExpressionData(value);
      })
      .catch((e) => setError(e as Error))
      .finally(() => setLoading(false));
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
      <div id="heatmap-container" style={{ backgroundColor: "var(--color)" }}>
        {loading || !expressionData ? (
          <div style={{ color: "var(--background)" }}>Loading... </div>
        ) : null}
        {error ? <div>There was an error fetching the data :(</div> : null}
        {expressionData && !loading ? (
          <SvgHeatMap expressionData={expressionData} />
        ) : null}
      </div>
    </div>
  );
};
