import { useEffect, useState } from "react";

import { useAppStore } from "../../lib/state";

import styles from "./HeatMapVisualizer.module.css";
import {
  AVAILABLE_EXPERIMENTS_BY_SPECIES,
  ExperimentTitleToId,
  SPECIES_TO_NUMERIC_ID,
} from "../../lib/constants";
import { ExpressionRequest, ExpressionResponse, post } from "../../lib/api";
import { SvgHeatMap } from "./SvgHeatMap";
import {
  DistanceMetricOptions,
  LINKAGE_METRICS,
  LinkageMetricOptions,
} from "../../lib/clustering";
import { DISTANCE_METRICS } from "../../lib/clustering";
import { DATA_SCALING_METHODS, DataScalingOptions } from "../../lib/scaling";
import { NoGeneListsError } from "./Errors";
import { NoGeneListsErrorComponent } from "./HeatmapError";

import { useHeatMapStore } from "./state";

export const HeatMapVisualizer = () => {
  const svgRef = useHeatMapStore((state) => state.svgRef);
  const svgHeight = useHeatMapStore((state) => state.svgHeight);
  // const svgRef = useRef<SVGSVGElement>(null);
  const availableGeneLists = useAppStore((state) => state.availableGeneLists);
  const selectedSpeciesId = useAppStore((state) => state.speciesId);
  const selectedSpecies = useAppStore((state) => state.species);
  const activeGeneList = useAppStore((state) => state.activeGeneList);
  const setActiveGeneList = useAppStore((state) => state.setActiveGeneList);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const availableExperiments =
    AVAILABLE_EXPERIMENTS_BY_SPECIES[selectedSpecies];

  const [selectedExperiment, setSelectedExperiment] = useState<string>(
    availableExperiments[0]
  );

  const [expressionData, setExpressionData] =
    useState<ExpressionResponse | null>(null);
  const [scalingFunctionName, setScalingFunctionName] =
    useState<DataScalingOptions>("log");
  const [clusterLinkage, setClusterLinkage] =
    useState<LinkageMetricOptions>("average");
  const [distanceMetric, setDistanceMetric] =
    useState<DistanceMetricOptions>("euclidean");
  const [clusterAxis, setClusterAxis] = useState<string>("row");

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
  }, [availableGeneLists, selectedSpeciesId]);

  useEffect(() => {
    let defaultGeneList = activeGeneList;
    const geneListsForSelectedSpecies = availableGeneLists.filter(
      (value) => value.speciesId === selectedSpeciesId
    );

    if (activeGeneList === undefined) {
      // console.log("activeGeneList undefined");

      // defaultGeneList =
      //   availableGeneLists.length !== 0 ? availableGeneLists[0] : undefined;

      defaultGeneList =
        geneListsForSelectedSpecies.length !== 0
          ? geneListsForSelectedSpecies[0]
          : undefined;
      // console.log(`default gene list ${defaultGeneList}`);

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
        // console.log(value);
        setExpressionData(value);
      })
      .catch((e) => setError(e as Error))
      .finally(() => setLoading(false));
  }, [
    activeGeneList,
    selectedSpecies,
    selectedSpeciesId,
    selectedExperiment,
    availableGeneLists,
    setActiveGeneList,
  ]);

  const saveButtonClickHandler = () => {
    if (!svgRef.current) return;

    const now = new Date();
    const utcString = now.toISOString().replace(/[:.]/g, "-");
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

  // if (error) {
  //   return <div>Error!</div>
  // }

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
            value={distanceMetric}
            onChange={(event) =>
              setDistanceMetric(event.target.value as DistanceMetricOptions)
            }
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
            onChange={(event) =>
              setClusterLinkage(event.target.value as LinkageMetricOptions)
            }
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
          backgroundColor: "var(--background)",
          borderRadius: "var(--radius)",
          height: `${svgHeight}px`,
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
            expressionData={expressionData}
            marginTop={10}
            marginBottom={10}
            marginLeft={10}
            marginRight={10}
            labelFontSize={10}
            labelPadding={10}
            cellHeight={15}
            cellPadding={0}
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
