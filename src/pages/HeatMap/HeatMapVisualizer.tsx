import { useEffect, useRef, useState } from "react";

import { useAppStore } from "../../lib/state";

import styles from "./HeatMapVisualizer.module.css";
import {
  AVAILABLE_EXPERIMENTS_BY_SPECIES,
  ExperimentTitleToId,
  SPECIES_TO_NUMERIC_ID,
} from "../../lib/constants";
import {
  ExpressionResponse,
  getExpressionData,
} from "../../lib/backend";
import { SvgHeatMap } from "./SvgHeatMap";
import { DATA_SCALING_METHODS, DataScalingOptions } from "../../lib/scaling";
import { NoGeneListsError } from "./Errors";
import { NoGeneListsErrorComponent } from "./HeatmapError";

import { useHeatMapStore } from "./state";
import D3Tooltip, { TooltipHandle } from "./Tooltip";

type ClusteringAxis = "Row" | "Column" | "Both";
type LinkageFunction = "Average" | "Ward";
type DistanceMetric = "Euclidean" | "Chebyshev";

export const HeatMapVisualizer = () => {
  const tooltipRef = useRef<TooltipHandle>(null);
  const svgRef = useHeatMapStore((state) => state.svgRef);
  const svgHeight = useHeatMapStore((state) => state.svgHeight);
  const availableGeneLists = useAppStore((state) => state.availableGeneLists);
  const selectedSpeciesId = useAppStore((state) => state.speciesId);
  const selectedSpecies = useAppStore((state) => state.species);
  const activeGeneList = useAppStore((state) => state.activeGeneList);
  const setActiveGeneList = useAppStore((state) => state.setActiveGeneList);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [availableExperiments, setAvailableExperiments]= useState<Array<string>>(AVAILABLE_EXPERIMENTS_BY_SPECIES[selectedSpecies] );

  const [selectedExperiment, setSelectedExperiment] = useState<string>(
    availableExperiments[0]
  );

  const [expressionData, setExpressionData] =
    useState<ExpressionResponse | null>(null);
  const [scalingFunctionName, setScalingFunctionName] =
    useState<DataScalingOptions>("log");

  const [axis, setAxis] = useState<ClusteringAxis>("Row");
  const [linkage, setLinkage] = useState<LinkageFunction>("Average");
  const [distance, setDistance] = useState<DistanceMetric>("Euclidean");

  useEffect(() => {
    if (
      availableGeneLists.filter(
        (value) => value.speciesId === selectedSpeciesId
      ).length === 0
    ) {
      setError(
        new NoGeneListsError("No gene lists are available. Please create one!")
      );
    } else {
      setError(undefined);
    }
    const experiments = AVAILABLE_EXPERIMENTS_BY_SPECIES[selectedSpecies];
    setAvailableExperiments(experiments);
    setSelectedExperiment(experiments[0]);
  }, [availableGeneLists, selectedSpeciesId, selectedSpecies]);

  useEffect(() => {
    let defaultGeneList = activeGeneList;
    const geneListsForSelectedSpecies = availableGeneLists.filter(
      (value) => value.speciesId === selectedSpeciesId
    );

    if (activeGeneList === undefined) {
      defaultGeneList =
        geneListsForSelectedSpecies.length !== 0
          ? geneListsForSelectedSpecies[0]
          : undefined;

      if (defaultGeneList !== undefined) {
        setActiveGeneList(defaultGeneList.id);
        // above setActiveGeneList call will trigger re-render bc of useEffect dep, we return
        return;
      }
    } else {
      defaultGeneList = activeGeneList;
    }

    if (defaultGeneList === undefined) {
      setError(new Error("No gene list available"));
      setLoading(false);
      return;
    }

    setLoading(true);

    console.log(`${selectedSpecies} ${selectedExperiment}`)

    const response = getExpressionData({
      experimentId:
        ExperimentTitleToId[`${selectedSpecies} ${selectedExperiment}`],
      geneIds: defaultGeneList.geneIds,
    });

    // const response = post<ExpressionRequest, ExpressionResponse>(
    //   "/expression",
    //   {
    //     species: selectedSpecies,
    //     experimentId:
    //       ExperimentTitleToId[`${selectedSpecies} ${selectedExperiment}`],
    //     geneIds: defaultGeneList.geneIds,
    //   }
    // );

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
    selectedSpeciesId,
    availableExperiments,
    selectedExperiment,
    availableGeneLists,
    setActiveGeneList,
  ]);

  const saveButtonClickHandler = () => {
    if (!svgRef.current) return;

    const svgClone = svgRef.current.cloneNode(true) as SVGSVGElement;
    const svgBackground = svgClone.getElementById(
      "svg-background"
    ) as SVGRectElement;

    const heatmapBackground = svgClone.getElementById(
      "heatmap-background"
    ) as SVGRectElement;

    svgBackground.setAttribute("fill", "white");
    heatmapBackground.setAttribute("fill", "white");
    heatmapBackground.setAttribute("stroke", "black");

    const now = new Date();
    const utcString = now.toISOString().replace(/[:.]/g, "-");
    const filename = `expression-heatmap-${utcString}.svg`;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgClone);
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
          GeneList
          <select
            style={{
              paddingRight: "1em",
              textAlign: "left",
              backgroundColor: "var(--background)",
              color: "var(--color)",
              border: "1px solid var(--color)",
              borderRadius: "var(--radius)",
            }}
            disabled={
              availableGeneLists.filter(
                (value) => value.speciesId === selectedSpeciesId
              ).length === 0
            }
            value={activeGeneList !== undefined ? activeGeneList.id : ""}
            onChange={(event) => {
              setActiveGeneList(event.target.value);
            }}
          >
            {availableGeneLists.filter(
              (value) => value.speciesId === selectedSpeciesId
            ).length !== 0 ? (
              availableGeneLists
                .filter(
                  (value) =>
                    value.speciesId === SPECIES_TO_NUMERIC_ID[selectedSpecies]
                )
                .map((value, index) => (
                  <option key={index} value={value.id}>
                    {value.name}
                  </option>
                ))
            ) : (
              <option>No gene lists available!</option>
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
            value={distance}
            onChange={(event) =>
              setDistance(event.target.value as DistanceMetric)
            }
          >
            <option value={"Euclidean"}>euclidean</option>
            <option value={"Chebyshev"}>chebyshev</option>
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
            value={linkage}
            onChange={(event) =>
              setLinkage(event.target.value as LinkageFunction)
            }
          >
            <option value={"Average"}>average</option>
            <option value={"Ward"}>ward</option>
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
            value={axis}
            onChange={(event) => setAxis(event.target.value as ClusteringAxis)}
          >
            <option value={"Row"}>row</option>
            <option value={"Column"}>column</option>
            <option value={"Both"}>both</option>
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
            onChange={(event) =>
              setScalingFunctionName(event.target.value as DataScalingOptions)
            }
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
      <div
        id="heatmap-container"
        style={{
          position: "relative",
          backgroundColor: "var(--background)",
          borderRadius: "var(--radius)",
          height: `${svgHeight}px`,
          width: "100%",
        }}
      >
        {loading && !expressionData && !error ? (
          <div style={{ color: "var(--color)" }}>Loading... </div>
        ) : null}
        {error ? (
          error instanceof NoGeneListsError ? (
            <NoGeneListsErrorComponent />
          ) : (
            <div>An error occurred</div>
          )
        ) : null}
        {expressionData && !loading && !error ? (
          <SvgHeatMap
            svgRef={svgRef}
            tooltipRef={tooltipRef}
            expressionData={expressionData}
            marginTop={10}
            marginBottom={10}
            marginLeft={10}
            marginRight={10}
            labelFontSize={10}
            labelPadding={10}
            cellHeight={15}
            cellPadding={1}
            scalingFunctionName={scalingFunctionName}
            clusterAxis={axis}
            distanceMetric={distance}
            clusterLinkage={linkage}
          />
        ) : null}
      </div>
      <D3Tooltip ref={tooltipRef} />
    </div>
  );
};
