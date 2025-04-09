import { useEffect, createElement } from "react";

import { useAppStore } from "../../lib/state";
import { Root } from "../../pages";
import {
  GeneListsViewerRoute,
  GeneSearchRoute,
  GeneSearchResultsRoute,
  SingleGeneListViewer,
} from "../../pages/GeneLists";

import { BlastResult, BlastSubmit } from "../../pages/Blast";

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
    component: ({ id }: Record<string, string>) => <BlastResult id={id} />,
  },
  // {
  //   path: "/jbrowse",
  //   component: () => (
  //     <div style={{width: "100%", height: "100%"}}>
  //       <iframe width="100%" height="100%" src="https://genomes.scilifelab.se/genome-browser/?config=%2Fdata%2F38qQhuj9O2BKK4HM0cdQfbxOGVXUchMO%2Fconfig.json"></iframe>
  //     </div>
  //   ),
  // },
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
  const setActiveApp = useAppStore((state) => state.setActiveApp);
  const unsetActiveApp = useAppStore((state) => state.unsetActiveApp);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      console.log(event.state);
      setApplicationPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    // console.log(`my app path: ${applicationPath}`);

    const splitApplicationPath = window.location.pathname.split("/");

    // console.log(window.location.pathname.split("/"));
    // console.log(splitApplicationPath);
    if (splitApplicationPath.length >= 2) {
      const retrievedActiveApp = splitApplicationPath[1];
      // console.log(`received: ${retrievedActiveApp}`);

      if (retrievedActiveApp === "") {
        unsetActiveApp();
      } else {
        setActiveApp(retrievedActiveApp);
      }
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, [applicationPath, setApplicationPath, setActiveApp, unsetActiveApp]);

  for (const route of routes) {
    const params = matchRoute(route.path, applicationPath);
    if (params) {
      return createElement(route.component, params);
    }
  }

  return <>404 Not Found. Sorry!</>;
};
