import { useEffect, useRef, useState } from "react";

import { ScaleLinear, scaleLinear } from "d3-scale";
import { interpolateRdYlBu } from "d3-scale-chromatic";

import { ExpressionResponse } from "../../lib/api";

interface SvgHeatMapProps {
  expressionData: ExpressionResponse;
}

export const SvgHeatMap = ({ expressionData }: SvgHeatMapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const [svgWidth, setSvgWidth] = useState<number | undefined>(undefined);
  const [svgHeight, setSvgHeight] = useState<number | undefined>(undefined);

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
    if (svgRef.current !== null) {
      const { height, width } = svgRef.current.getBoundingClientRect();
      setSvgHeight(height);
      setSvgWidth(width);
      setHorizontalScale(() =>
        scaleLinear([0, expressionData.samples.length], [50, width - 50])
      );
      setVerticalScale(() =>
        scaleLinear([0, expressionData.genes.length], [50, height - 50])
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
    }
  }, []);

  return (
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
                        expressionData.values[rowIndex + rowIndex * colIndex]
                      )
                    )}
                  ></rect>
                );
              }
            })
          )
        : null}
    </svg>
  );
};
