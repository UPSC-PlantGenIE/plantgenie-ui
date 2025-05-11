import { RefObject, useEffect, useMemo } from "react";

import { gray } from "d3-color";
import { scaleLinear } from "d3-scale";
import { interpolateRdYlBu } from "d3-scale-chromatic";

import { ExpressionResponse } from "../../lib/api";
import {
  createReorderedColMapper,
  createReorderedIndexMapper,
  createReorderedRowMapper,
} from "../../lib/clustering/utils";

import { useMaxTextLength } from "../../lib/hooks";
// import { useClustering } from "../../lib/hooks";
// import { DataScalingOptions } from "../../lib/scaling";
// import {
//   DistanceMetricOptions,
//   LinkageMetricOptions,
// } from "../../lib/clustering";
import { useHeatMapStore, setSvgHeight, setSvgWidth } from "./state";

import styles from "./SvgHeatMap.module.css";
import { TooltipHandle } from "./Tooltip";

import {
  useCrust,
  ClusteringAxis,
  LinkageFunction,
  DistanceMetric,
} from "../../lib/hooks/useCrust";
import { DataScalers, DataScalingOptions } from "../../lib/scaling";

interface SvgHeatMapProps {
  svgRef: RefObject<SVGSVGElement | null>;
  tooltipRef: RefObject<TooltipHandle | null>;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  labelFontSize: number;
  labelPadding: number;
  cellPadding: number;
  cellHeight: number;
  expressionData: ExpressionResponse;
  scalingFunctionName: DataScalingOptions;
  distanceMetric: DistanceMetric;
  clusterAxis: ClusteringAxis;
  clusterLinkage: LinkageFunction;
}

interface RectHoverData {
  rowId: string;
  colId: string;
  value: number;
  scaledValue: number;
}

export const SvgHeatMap = ({
  svgRef,
  tooltipRef,
  marginBottom,
  marginLeft,
  marginRight,
  marginTop,
  expressionData,
  labelFontSize,
  labelPadding,
  scalingFunctionName,
  distanceMetric,
  clusterAxis,
  clusterLinkage,
  cellHeight,
  cellPadding,
}: SvgHeatMapProps) => {
  const svgWidth = useHeatMapStore((state) => state.svgWidth);
  const svgHeight = useHeatMapStore((state) => state.svgHeight);

  const handleMouseOver = (
    event: React.MouseEvent<SVGRectElement, MouseEvent>,
    data: RectHoverData
  ) => {
    tooltipRef.current?.show(
      <>
        <div>
          <strong>GeneId</strong>: {data.rowId}
        </div>
        <div>
          <strong>Condition</strong>: {data.colId}
        </div>
        <div>
          <strong>Original</strong>: {data.value.toFixed(3)}
        </div>
        <div>
          <strong>Scaled</strong>: {(1 - data.scaledValue).toFixed(3)}
        </div>
      </>,
      event.pageX,
      event.pageY
    );
  };

  const handleMouseOut = () => {
    tooltipRef.current?.hide();
  };

  // const rowLabels = expressionData.genes.map(
  //   (value) => `${value.chromosomeId}_${value.geneId}`
  // );

  // const colLabels = expressionData.samples.map((value) => `${value.condition}`);

  const rowLabels = useMemo(
    () => expressionData.genes.map((v) => `${v.chromosomeId}_${v.geneId}`),
    [expressionData.genes]
  );

  const colLabels = useMemo(
    () => expressionData.samples.map((v) => `${v.condition}`),
    [expressionData.samples]
  );

  const rowTextLength = useMaxTextLength({
    texts: rowLabels,
    fontSize: labelFontSize,
    rotation: 0,
    axis: "width",
  });

  const colTextLength = useMaxTextLength({
    texts: colLabels,
    fontSize: labelFontSize,
    rotation: -45,
    axis: "height",
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const { width } = svgRef.current.getBoundingClientRect();
        requestAnimationFrame(() => {
          setSvgWidth(width);
        });
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    if (svgRef.current) {
      resizeObserver.observe(svgRef.current);
    }

    // Initial dimension update
    updateDimensions();

    const svg = svgRef.current ?? null;
    return () => {
      if (svg) {
        resizeObserver.unobserve(svg);
      }
    };
  }, [svgRef, cellPadding]);

  useEffect(() => {
    setSvgHeight(
      expressionData.genes.length * (cellHeight + cellPadding) +
        labelPadding +
        colTextLength +
        marginTop +
        marginBottom
    );
  }, [
    expressionData.genes,
    colTextLength,
    marginBottom,
    marginTop,
    cellHeight,
    cellPadding,
    labelPadding,
  ]);

  // const { rowOrder, colOrder, values } = useClustering({
  //   data: expressionData.values,
  //   nrows: rowLabels.length,
  //   ncols: colLabels.length,
  //   scalingFunctionName,
  //   clusterAxis,
  //   clusterLinkage,
  //   distanceMetric,
  // });

  const scaledData = useMemo(
    () =>
      DataScalers[scalingFunctionName].function({
        data: expressionData.values,
        nrows: rowLabels.length,
        ncols: colLabels.length,
      }),
    [rowLabels, colLabels, expressionData, scalingFunctionName]
  );

  const { rowOrder, colOrder, values } = useCrust({
    data: scaledData,
    nrows: rowLabels.length,
    ncols: colLabels.length,
    axis: clusterAxis,
    linkage: clusterLinkage,
    distance: distanceMetric,
  });

  const reorderedRowMap = useMemo(
    () => createReorderedRowMapper(rowOrder, colOrder.length),
    [rowOrder, colOrder]
  );

  const reorderedColMap = useMemo(
    () => createReorderedColMapper(colOrder),
    [colOrder]
  );

  const reorderedIndexMap = useMemo(
    () => createReorderedIndexMapper(rowOrder, colOrder),
    [rowOrder, colOrder]
  );

  const rowIndexMapper = createReorderedRowMapper(
    [...Array(expressionData.genes.length).keys()],
    expressionData.samples.length
  );
  const colIndexMapper = createReorderedColMapper([
    ...Array(expressionData.samples.length).keys(),
  ]);

  const heatmapBounds = {
    top: marginTop + colTextLength + labelPadding,
    bottom: svgHeight - marginBottom,
    left: marginLeft,
    right: svgWidth - marginRight - rowTextLength - labelPadding,
  };

  const horizontalScale = useMemo(
    () =>
      scaleLinear()
        .domain([0, colLabels.length])
        .range([heatmapBounds.left, heatmapBounds.right]),
    [colLabels.length, heatmapBounds.left, heatmapBounds.right]
  );

  const verticalScale = useMemo(
    () =>
      scaleLinear()
        .domain([0, rowLabels.length])
        .range([heatmapBounds.top, heatmapBounds.bottom]),
    [heatmapBounds.top, heatmapBounds.bottom, rowLabels.length]
  );

  const colorScale = useMemo(
    () =>
      scaleLinear()
        .domain([Math.max(...values), Math.min(...values)])
        .range([0, 1]),
    [values]
  );

  if (
    !(
      rowOrder.length !== 0 &&
      colOrder.length !== 0 &&
      values.length !== 0 &&
      horizontalScale !== null &&
      verticalScale !== null &&
      colorScale !== null &&
      svgHeight !== 0 &&
      svgWidth !== 0
    )
  ) {
    return (
      <svg
        ref={svgRef}
        style={{
          height: "100%",
          width: "100%",
          border: "1px solid var(--color)",
          borderRadius: "var(--radius)",
        }}
      >
        <rect width="100%" height="100%" fill="#080808" rx="5" ry="5"></rect>
      </svg>
    );
  }

  return (
    <svg
      ref={svgRef}
      style={{
        height: "100%",
        width: "100%",
        border: "1px solid var(--color)",
        borderRadius: "var(--radius)",
      }}
    >
      <rect
        id="svg-background"
        fill="var(--background)"
        style={{ borderRadius: "var(--radius)" }}
        width={svgWidth}
        height={svgHeight}
      ></rect>
      <rect
        id="heatmap-background"
        fill="var(--color)"
        strokeWidth={1}
        stroke="var(--color)"
        rx={1}
        ry={1}
        // +- cellPadding for extra whitespace around the heatmap
        x={heatmapBounds.left - cellPadding}
        y={heatmapBounds.top - cellPadding}
        width={heatmapBounds.right - heatmapBounds.left + cellPadding}
        height={heatmapBounds.bottom - heatmapBounds.top + cellPadding}
      ></rect>
      <g id="rectangles" className={styles.heatmapRectangles}>
        {expressionData.values.map((_, index) => (
          <rect
            className="heatmap-rect"
            key={index}
            x={horizontalScale(colIndexMapper(index))}
            y={verticalScale(rowIndexMapper(index))}
            rx={1}
            ry={1}
            height={cellHeight}
            width={
              Math.abs(horizontalScale(0) - horizontalScale(1)) - cellPadding
            }
            // fill={
            //   Number.isNaN(values[reorderedIndexMap(index)])
            //     ? gray(50).toString()
            //     : interpolateRdYlBu(values[reorderedIndexMap(index)])
            // }
            fill={
              Number.isNaN(values[index])
                ? gray(50).toString()
                : interpolateRdYlBu(values[index])
            }
            onMouseOver={(e) =>
              handleMouseOver(e, {
                value: expressionData.values[reorderedIndexMap(index)],
                scaledValue: values[reorderedIndexMap(index)],
                rowId: rowLabels[reorderedRowMap(index)],
                colId: colLabels[reorderedColMap(index)],
              })
            }
            onMouseOut={handleMouseOut}
          ></rect>
        ))}
      </g>
      <g id="row-labels">
        {rowOrder.map((value, index) => (
          <text
            key={index}
            transform={`translate(${svgWidth - marginRight - rowTextLength}, ${
              (verticalScale(index) + verticalScale(index + 1)) / 2
            })`}
            fontSize={labelFontSize}
            textAnchor="left"
            dominantBaseline="middle"
            fontWeight="normal"
            fill="var(--color)"
          >
            {rowLabels[value]}
          </text>
        ))}
      </g>
      <g id="col-labels">
        {colOrder.map((value, index) => (
          <text
            key={index}
            textAnchor="left"
            dominantBaseline="middle"
            fontWeight="normal"
            fontSize={labelFontSize}
            fill="var(--color)"
            transform={`translate(${
              (horizontalScale(index) + horizontalScale(index + 1)) / 2
            },${marginTop + colTextLength}) rotate(-45)`}
          >
            {colLabels[value]}
          </text>
        ))}
      </g>
    </svg>
  );
};
