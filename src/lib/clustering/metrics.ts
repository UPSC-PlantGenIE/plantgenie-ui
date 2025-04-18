import { DistanceMetric } from "./types";

export const euclideanDistance: DistanceMetric = (
  a: number[],
  b: number[]
): number =>
  Math.sqrt(
    a
      .map((value, index) => Math.pow(value - b[index], 2))
      .reduce((acc, current) => acc + current, 0)
  );

export const chebyshevDistance: DistanceMetric = (
  a: number[],
  b: number[]
): number => {
  return a.reduce((max, ai, idx) => Math.max(max, Math.abs(ai - b[idx])), 0);
};

export const DistanceMetrics = {
  euclidean: euclideanDistance,
  chebyshev: chebyshevDistance,
};

export const DISTANCE_METRICS = Object.keys(DistanceMetrics);

export type DistanceMetricOptions = keyof typeof DistanceMetrics;
