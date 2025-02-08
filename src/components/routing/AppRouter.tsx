import { useEffect, createElement } from "react";

import { useAppStore } from "../../lib/state";
import { BaseLayout } from "../layouts/BaseLayout";

type RouteParams = Record<string, string>;

const routes = [{ path: "/", component: () => <>This is the home page</> }];

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

  return (
    <div id="main">
      404 Not Found. Sorry!
    </div>
  );
};
