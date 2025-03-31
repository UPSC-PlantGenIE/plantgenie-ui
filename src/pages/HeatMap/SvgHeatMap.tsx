import { useEffect, useRef, useState } from "react";

import { ScaleLinear, scaleLinear } from "d3-scale";
import { interpolateRdYlBu } from "d3-scale-chromatic";

import { ExpressionResponse } from "../../lib/api";
import {
  createReorderedColMapper,
  createReorderedIndexMapper,
  createReorderedRowMapper,
} from "../../lib/clustering/utils";

import { useMaxTextLength } from "../../lib/hooks";
import { useClustering } from "../../lib/hooks";

interface SvgHeatMapProps {
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  labelFontSize: number;
  labelPadding: number;
  cellPadding: number;
  cellHeight: number;
  expressionData: ExpressionResponse;
  scalingFunctionName: string;
}

export const SvgHeatMap = ({
  expressionData,
  labelFontSize,
}: SvgHeatMapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const [svgWidth, setSvgWidth] = useState<number | undefined>(undefined);
  const [svgHeight, setSvgHeight] = useState<number | undefined>(undefined);
  expressionData.genes.map((value) => value.chromosomeId);

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
    const updateDimensions = () => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.getBoundingClientRect();
        requestAnimationFrame(() => {
          setSvgWidth(width);
          setSvgHeight(height);
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
  }, []);
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

  // const { rowOrder, colOrder, values } = useClustering({
  //   data: expressionData.values,
  //   nrows: rowLabels.length,
  //   ncols: colLabels.length,
  // });

  // const originalRowMap = useMemo(
  //   () =>
  //     createReorderedRowMapper(
  //       rowLabels.map((_, index) => index),
  //       colLabels.length
  //     ),
  //   [rowLabels, colLabels]
  // );

  // const originalColMap = useMemo(
  //   () => createReorderedColMapper(colLabels.map((_, index) => index)),
  //   [rowLabels, colLabels]
  // );

  // const reorderedIndexMap = useMemo(
  //   () => createReorderedIndexMapper(rowOrder, colOrder),
  //   [rowOrder, colOrder]
  // );

  // const reorderedRowMap = useMemo(
  //   () => createReorderedRowMapper(rowOrder, colOrder.length),
  //   [rowOrder, colOrder]
  // );

  // const reorderedColMap = useMemo(
  //   () => createReorderedColMapper(colOrder),
  //   [colOrder]
  // );

  const valueIndexMapper = createReorderedIndexMapper(
    [...Array(expressionData.genes.length).keys()],
    [...Array(expressionData.samples.length).keys()]
  );

  const rowIndexMapper = createReorderedRowMapper(
    [...Array(expressionData.genes.length).keys()],
    expressionData.samples.length
  );
  const colIndexMapper = createReorderedColMapper([
    ...Array(expressionData.samples.length).keys(),
  ]);

  useEffect(() => {
    if (!(svgHeight && svgWidth)) return;

    setHorizontalScale(() =>
      scaleLinear([0, expressionData.samples.length], [50, svgWidth - 50])
    );
    setVerticalScale(() =>
      scaleLinear([0, expressionData.genes.length], [50, svgHeight - 50])
    );
    setColorScale(() =>
      scaleLinear(
        [
          Math.max(...expressionData.values),
          Math.min(...expressionData.values),
        ],
        [0, 1]
      )
    );
  }, [svgHeight, svgWidth, expressionData]);

  return (
    <svg
      ref={svgRef}
      style={{ height: "100%", width: "100%", border: "1px solid blue" }}
    >
      <rect width="100%" height="100%" fill="currentColor" rx="5" ry="5" />
      {horizontalScale !== null &&
      verticalScale !== null &&
      colorScale !== null &&
      svgHeight !== undefined &&
      svgWidth !== undefined
        ? expressionData.values.map((value, index) => (
            <rect
              key={index}
              x={horizontalScale(colIndexMapper(index))}
              y={verticalScale(rowIndexMapper(index))}
              height={(svgHeight - 100) / expressionData.genes.length}
              width={(svgWidth - 100) / expressionData.samples.length}
              fill={interpolateRdYlBu(colorScale(value))}
            ></rect>
          ))
        : null}
    </svg>
  );
};
