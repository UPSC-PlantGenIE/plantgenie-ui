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
import { useClustering } from "../../lib/hooks";
import { DataScalingOptions } from "../../lib/scaling";
import {
  DistanceMetricOptions,
  LinkageMetricOptions,
} from "../../lib/clustering";
import { useHeatMapStore, setSvgHeight, setSvgWidth } from "./state";

interface SvgHeatMapProps {
  svgRef: RefObject<SVGSVGElement | null>;
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
  distanceMetric: DistanceMetricOptions;
  clusterAxis: string;
  clusterLinkage: LinkageMetricOptions;
}

export const SvgHeatMap = ({
  svgRef,
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

  const rowLabels = expressionData.genes.map(
    (value) => `${value.chromosomeId}_${value.geneId}`
  );
  const colLabels = expressionData.samples.map(
    (value) => `${value.reference} ${value.condition}`
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
          // setSvgHeight(height);
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
  }, [svgRef]);

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
  ]);

  const { rowOrder, colOrder, values } = useClustering({
    data: expressionData.values,
    nrows: rowLabels.length,
    ncols: colLabels.length,
    scalingFunctionName,
    clusterAxis,
    clusterLinkage,
    distanceMetric,
  });

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
        .domain([
          Math.max(...expressionData.values),
          Math.min(...expressionData.values),
        ])
        .range([0, 1]),
    [expressionData.values]
  );

  if (
    !(
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
        <rect
          width="100%"
          height="100%"
          fill="var(--background)"
          rx="5"
          ry="5"
        ></rect>
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
        fill="#080808"
        width="100%"
        height="100%"
        rx={5}
        ry={5}
      ></rect>
      <rect
        id="heatmap-background"
        fill="var(--color)"
        strokeWidth={1}
        stroke="var(--color)"
        rx={1}
        ry={1}
        // +- 1 for extra whitespace around the heatmap
        x={heatmapBounds.left - 1}
        y={heatmapBounds.top - 1}
        width={heatmapBounds.right - heatmapBounds.left + 2}
        height={heatmapBounds.bottom - heatmapBounds.top + 2}
      ></rect>
      {/* <rect
        width="100%"
        height="100%"
        fill="var(--background)"
        rx="5"
        ry="5"
      ></rect> */}
      <g id="rectangles">
        {expressionData.values.map((_, index) => (
          <rect
            key={index}
            x={horizontalScale(colIndexMapper(index))}
            y={verticalScale(rowIndexMapper(index))}
            // height={Math.abs(verticalScale(0) - verticalScale(1))}
            height={cellHeight}
            width={Math.abs(horizontalScale(0) - horizontalScale(1)) - cellPadding}
            fill={
              Number.isNaN(values[reorderedIndexMap(index)])
                ? gray(50).toString()
                : interpolateRdYlBu(values[reorderedIndexMap(index)])
            }
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
