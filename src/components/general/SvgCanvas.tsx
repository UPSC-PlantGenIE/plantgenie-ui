import { ReactNode, SVGProps, useEffect, useRef } from "react";

interface SvgCanvasProps extends SVGProps<SVGSVGElement> {
  children?: ReactNode | ReactNode[];
}

export const SvgCanvas = ({ children, ...props }: SvgCanvasProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  return <svg ref={svgRef} {...props}>{children}</svg>;
};
