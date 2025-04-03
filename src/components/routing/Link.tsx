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
  const activeApp = useAppStore((state) => state.activeApp);

  useEffect(() => {

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
    >
      {children}
    </a>
  );
};
