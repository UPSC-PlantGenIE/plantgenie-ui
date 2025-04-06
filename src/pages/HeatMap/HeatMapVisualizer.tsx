import { useEffect, useRef, useState } from "react";

import { useAppStore } from "../../lib/state";

import styles from "./HeatMapVisualizer.module.css";
import {
  AVAILABLE_EXPERIMENTS_BY_SPECIES,
  ExperimentTitleToId,
  SPECIES_TO_NUMERIC_ID,
} from "../../lib/constants";
import { ExpressionRequest, ExpressionResponse, post } from "../../lib/api";
import { SvgHeatMap } from "./SvgHeatMap";
import { LINKAGE_METRICS } from "../../lib/clustering";
import { DISTANCE_METRICS } from "../../lib/clustering";
import { DATA_SCALING_METHODS } from "../../lib/scaling";

export const HeatMapVisualizer = () => {
  const svgRef = useRef<SVGSVGElement>(null);
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

  const [scalingFunctionName, setScalingFunctionName] = useState<string>("log");
  const [clusterLinkage, setClusterLinkage] = useState<string>("average");
  const [distanceMetric, setDistanceMetric] = useState<string>("euclidean");
  const [clusterAxis, setClusterAxis] = useState<string>("row");

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
      "/expression",
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
  }, [
    activeGeneList,
    selectedSpecies,
    selectedExperiment,
    availableGeneLists,
    setActiveGeneList,
  ]);

  const saveButtonClickHandler = () => {
    if (!svgRef.current) return;

    const now = new Date();
    const utcString = now.toISOString().replace(/[:.]/g, "-"); // safe for filenames
    const filename = `expression-heatmap-${utcString}.svg`;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgRef.current);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div id="container" className={styles.heatMapContainer}>
      <div
        style={{
          display: "flex",
          padding: "0.5em",
          gap: "0.25em",
          border: "1px solid var(--color)",
          borderRadius: "var(--radius)",
          flexWrap: "wrap",
        }}
      >
        <label
          style={{
            fontStyle: "var(--inter)",
            display: "flex",
            flexDirection: "column",
            fontSize: "0.75rem",
            fontWeight: "bold",
            alignItems: "flex-start",
          }}
        >
          <span>GeneList</span>
          <select
            style={{
              paddingRight: "1em",
              textAlign: "left",
              backgroundColor: "var(--background)",
              color: "var(--color)",
              border: "1px solid var(--color)",
              borderRadius: "var(--radius)",
            }}
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
        <label
          style={{
            fontStyle: "var(--inter)",
            display: "flex",
            flexDirection: "column",
            fontSize: "0.75rem",
            fontWeight: "bold",
            alignItems: "flex-start",
          }}
        >
          Experiment
          <select
            style={{
              paddingRight: "1em",
              textAlign: "left",
              backgroundColor: "var(--background)",
              color: "var(--color)",
              border: "1px solid var(--color)",
              borderRadius: "var(--radius)",
            }}
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
        <label
          style={{
            fontStyle: "var(--inter)",
            display: "flex",
            flexDirection: "column",
            fontSize: "0.75rem",
            fontWeight: "bold",
            alignItems: "flex-start",
          }}
        >
          Metric
          <select
            style={{
              paddingRight: "1em",
              textAlign: "left",
              backgroundColor: "var(--background)",
              color: "var(--color)",
              border: "1px solid var(--color)",
              borderRadius: "var(--radius)",
            }}
            value={distanceMetric}
            onChange={(event) => setDistanceMetric(event.target.value)}
          >
            {DISTANCE_METRICS.map((value, index) => (
              <option key={index} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label
          style={{
            fontStyle: "var(--inter)",
            display: "flex",
            flexDirection: "column",
            fontSize: "0.75rem",
            fontWeight: "bold",
            alignItems: "flex-start",
          }}
        >
          Linkage
          <select
            style={{
              paddingRight: "1em",
              textAlign: "left",
              backgroundColor: "var(--background)",
              color: "var(--color)",
              border: "1px solid var(--color)",
              borderRadius: "var(--radius)",
            }}
            value={clusterLinkage}
            onChange={(event) => setClusterLinkage(event.target.value)}
          >
            {LINKAGE_METRICS.map((value, index) => (
              <option key={index} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label
          style={{
            fontStyle: "var(--inter)",
            display: "flex",
            flexDirection: "column",
            fontSize: "0.75rem",
            fontWeight: "bold",
            alignItems: "flex-start",
          }}
        >
          Axis
          <select
            style={{
              paddingRight: "1em",
              textAlign: "left",
              backgroundColor: "var(--background)",
              color: "var(--color)",
              border: "1px solid var(--color)",
              borderRadius: "var(--radius)",
            }}
            value={clusterAxis}
            onChange={(event) => setClusterAxis(event.target.value)}
          >
            {["row", "col", "both"].map((value, index) => (
              <option key={index} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label
          style={{
            fontStyle: "var(--inter)",
            display: "flex",
            flexDirection: "column",
            fontSize: "0.75rem",
            fontWeight: "bold",
            alignItems: "flex-start",
          }}
        >
          Scaling
          <select
            style={{
              paddingRight: "1em",
              textAlign: "left",
              backgroundColor: "var(--background)",
              color: "var(--color)",
              border: "1px solid var(--color)",
              borderRadius: "var(--radius)",
            }}
            value={scalingFunctionName}
            onChange={(event) => setScalingFunctionName(event.target.value)}
          >
            {DATA_SCALING_METHODS.map((value, index) => (
              <option key={index} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <button className={styles.saveButton} onClick={saveButtonClickHandler}>
          Save
        </button>
      </div>
      <div id="heatmap-container" style={{ backgroundColor: "var(--color)" }}>
        {loading || !expressionData ? (
          <div style={{ color: "var(--background)" }}>Loading... </div>
        ) : null}
        {error ? <div>There was an error fetching the data :(</div> : null}
        {expressionData && !loading ? (
          <SvgHeatMap
            svgRef={svgRef}
            expressionData={expressionData}
            marginTop={10}
            marginBottom={10}
            marginLeft={10}
            marginRight={10}
            labelFontSize={10}
            labelPadding={10}
            cellHeight={20}
            cellPadding={1}
            scalingFunctionName={scalingFunctionName}
            clusterAxis={clusterAxis}
            distanceMetric={distanceMetric}
            clusterLinkage={clusterLinkage}
          />
        ) : null}
      </div>
    </div>
  );
};
