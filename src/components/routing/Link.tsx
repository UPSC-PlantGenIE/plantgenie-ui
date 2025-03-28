import { MouseEvent, ReactNode, useEffect, useState } from "react";
import { useAppStore } from "../../lib/state";

interface LinkProps {
  to: string;
  children?: ReactNode;
  className?: string;
  activeClassName?: string;
}

export const Link = ({
  to,
  children,
  className,
  activeClassName,
}: LinkProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  // const appPath = useAppStore((state) => state.applicationPath);
  const activeApp = useAppStore((state) => state.activeApp);

  useEffect(() => {
    // if (appPath === to) console.log(`${to} is active!`)

    setIsActive(to.startsWith(`/${activeApp}`));
  }, [to, activeApp]);

  const clickHandler = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.history.pushState({ name: to }, "", to);
    window.dispatchEvent(
      new PopStateEvent("popstate", { state: { name: to } })
    );
  };

  return (
    <a
      href={to}
      onClick={clickHandler}
      className={`${className} ${isActive ? activeClassName : ""}`.trim()}
      // className={!isActive || (activeClassName === null) || (to === "/") ? className : activeClassName}
    >
      {children}
    </a>
  );
};
