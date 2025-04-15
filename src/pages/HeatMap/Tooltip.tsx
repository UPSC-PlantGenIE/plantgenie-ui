import { useImperativeHandle, forwardRef, useState, ReactNode } from "react";

export type TooltipHandle = {
  show: (content: React.ReactNode, x: number, y: number) => void;
  hide: () => void;
};

interface D3TooltipProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * D3Tooltip is a React component that renders an absolutely positioned tooltip.
 * It exposes "show" and "hide" methods via its ref so that you can integrate it with D3
 * mouse events or any other logic.
 */
const D3Tooltip = forwardRef<TooltipHandle, D3TooltipProps>(
  ({ className, style }, ref) => {
    const [visible, setVisible] = useState(false);
    const [content, setContent] = useState<ReactNode>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    // Expose tooltip methods to parent components
    useImperativeHandle(ref, () => ({
      show: (content: React.ReactNode, x: number, y: number) => {
        setContent(content);
        setPosition({ x, y });
        setVisible(true);
      },
      hide: () => {
        setVisible(false);
      },
    }));

    return (
      <div
        className={className || "d3-tooltip"}
        style={{
          display: "flex",
          flexDirection: "column",
          gap:"0.1em",
          alignItems: "center",
          position: "absolute",
          top: `${position.y}px`,
          left: `${position.x}px`,
          overflow: "visible",
          pointerEvents: "none",
          padding: "0.75em",
          backgroundColor: "var(--color)",
          color: "var(--background)",
          opacity: visible ? 0.9 : 0,
          transition: "opacity 0.3s ease",
          borderRadius: "var(--radius)",
          fontSize: "0.6em",
          fontFamily: "var(--source)",
          ...style,
        }}
      >
        {content}
      </div>
    );
  }
);

export default D3Tooltip;
