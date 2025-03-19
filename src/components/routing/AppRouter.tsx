import { useEffect, createElement } from "react";

import { useAppStore } from "../../lib/state";
import { Root } from "../../pages";
import {
  GeneListsViewerRoute,
  GeneSearchRoute,
  GeneSearchResultsRoute,
  SingleGeneListViewer,
} from "../../pages/GeneLists";

import { BlastSubmit } from "../../pages/Blast";

import { HeatMapVisualizer } from "../../pages/HeatMap";

const routes = [
  { path: "/", component: () => <Root /> },
  { path: "/gene-lists", component: () => <GeneListsViewerRoute /> },
  { path: "/gene-lists/search", component: () => <GeneSearchRoute /> },
  {
    path: "/gene-lists/search/results",
    component: () => <GeneSearchResultsRoute />,
  },
  {
    path: "/gene-lists/:id",
    component: ({ id }: Record<string, string>) => (
      <SingleGeneListViewer id={id} />
    ),
  },
  { path: "/exheatmap", component: () => <HeatMapVisualizer /> },
  { path: "/blast", component: () => <BlastSubmit /> },
  {
    path: "/blast/result/:id",
    component: ({ id }: Record<string, string>) => (
      <div>Blast job id: {id}</div>
    ),
  },
];

const matchRoute = (
  componentPath: string,
  applicationPath: string
): Record<string, string> | null => {
  const componentPathParts = componentPath.split("/").filter(Boolean);
  const applicationPathParts = applicationPath.split("/").filter(Boolean);

  if (componentPathParts.length !== applicationPathParts.length) {
    return null;
  }

  const pathMagic = componentPathParts.map((value, index) =>
    value.startsWith(":")
      ? { [value.slice(1)]: applicationPathParts[index] }
      : value === applicationPathParts[index]
      ? true
      : false
  );

  if (pathMagic.includes(false)) return null;

  return pathMagic
    .filter((value) => typeof value !== "boolean")
    .reduce((acc, curr) => Object.assign(acc, curr), {});
};

export const ApplicationRouter = () => {
  const applicationPath = useAppStore((state) => state.applicationPath);
  const setApplicationPath = useAppStore((state) => state.setApplicationPath);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      console.log(event.state);
      setApplicationPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    console.log(`my app path: ${applicationPath}`);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [applicationPath, setApplicationPath]);

  for (const route of routes) {
    const params = matchRoute(route.path, applicationPath);
    if (params) {
      return createElement(route.component, params);
    }
  }

  return <>404 Not Found. Sorry!</>;
};
