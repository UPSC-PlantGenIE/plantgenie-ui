import { createRef, RefObject } from "react";
import { create, StateCreator } from "zustand";

export interface SvgSlice {
  svgRef: RefObject<SVGSVGElement | null>;
  svgHeight: number;
  svgWidth: number;
}

export const createSvgSlice: StateCreator<SvgSlice, [], [], SvgSlice> = () => ({
  svgRef: createRef<SVGSVGElement>(),
  svgHeight: 0,
  svgWidth: 0,
});

export const useHeatMapStore = create<SvgSlice>()((...storeArgs) => ({
  ...createSvgSlice(...storeArgs),
}));

export const setSvgHeight = (height: number) =>
  useHeatMapStore.setState({ svgHeight: height });


export const setSvgWidth = (width: number) =>
  useHeatMapStore.setState({ svgWidth: width });
