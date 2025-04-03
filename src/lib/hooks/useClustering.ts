import { useMemo } from "react";
import { DataScalers } from "../scaling";
import { hierarchicalClustering } from "../clustering/cluster";
import { getVectors } from "../clustering/utils";

interface ClusteringHookProps {
  data: number[];
  nrows: number;
  ncols: number;
  scalingFunctionName: string;
  clusterAxis: string;
  distanceMetric: string;
  clusterLinkage: string;
}

export const useClustering = ({
  data,
  nrows,
  ncols,
  scalingFunctionName,
  clusterAxis,
  distanceMetric,
  clusterLinkage,
}: ClusteringHookProps) => {
  const scaledData = useMemo(() => {
    return DataScalers[scalingFunctionName].function({ data, nrows, ncols });
  }, [scalingFunctionName, data, nrows, ncols]);

  const rowOrder = useMemo(() => {
    return clusterAxis === "row" || clusterAxis === "both"
      ? hierarchicalClustering({
          data: getVectors(scaledData, nrows, ncols, "row"),
          distanceMetric: distanceMetric,
          linkageMetric: clusterLinkage,
          by: "row",
        })
      : Array.from({ length: nrows }, (_, index) => index);
  }, [scaledData, nrows, ncols, clusterAxis, distanceMetric, clusterLinkage]);

  const colOrder = useMemo(() => {
    return clusterAxis === "col" || clusterAxis === "both"
      ? hierarchicalClustering({
          data: getVectors(scaledData, nrows, ncols, "col"),
          distanceMetric: distanceMetric,
          linkageMetric: clusterLinkage,
          by: "col",
        })
      : Array.from({ length: ncols }, (_, index) => index);
  }, [scaledData, ncols, nrows, clusterAxis, distanceMetric, clusterLinkage]);

  return { rowOrder, colOrder, values: scaledData };
};
