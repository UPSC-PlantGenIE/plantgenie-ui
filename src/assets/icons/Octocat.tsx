import { SVGProps } from "react";

type GithubIconProps = SVGProps<SVGSVGElement>;

export const Octocat = ({
  className = "size-5",
  fill = "currentColor",
  viewBox = "0 0 24 24",
  ...props
}: GithubIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill={fill}
    viewBox={viewBox}
    {...props}
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.799 8.205 11.387.6.111.793-.261.793-.578 0-.286-.011-1.042-.016-2.046-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.755-1.333-1.755-1.089-.744.082-.729.082-.729 1.205.085 1.838 1.236 1.838 1.236 1.07 1.834 2.807 1.304 3.492.997.108-.775.42-1.305.763-1.605-2.665-.303-5.466-1.333-5.466-5.93 0-1.31.468-2.381 1.235-3.221-.124-.303-.535-1.524.118-3.176 0 0 1.008-.322 3.3 1.23a11.513 11.513 0 0 1 3.003-.404c1.018.004 2.044.138 3.003.404 2.29-1.553 3.297-1.23 3.297-1.23.655 1.653.244 2.874.12 3.176.77.84 1.233 1.911 1.233 3.221 0 4.61-2.807 5.625-5.479 5.921.432.372.815 1.102.815 2.222 0 1.605-.014 2.896-.014 3.293 0 .32.19.694.8.577C20.565 21.796 24 17.298 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);
