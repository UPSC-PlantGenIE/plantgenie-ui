import { LinkageMetricOptions } from "./linkages";
import { DistanceMetricOptions } from "./metrics";

export interface Node {
  id: number;
  parent: Node | null;
  children: Node[];
  height: number;
  indices: number[];
}

export type DistanceMetric = (a: number[], b: number[]) => number;

export interface NodeLinkageArgs {
  firstNode: Node;
  secondNode: Node;
  dataMatrix?: number[][];
  distanceMatrix?: number[][];
}

export type NodeLinkage = ({}: NodeLinkageArgs) => number;

export interface HierarchicalClusteringArgs {
  data: number[][];
  distanceMetric: DistanceMetricOptions;
  linkageMetric: LinkageMetricOptions;
  by: string;
}
