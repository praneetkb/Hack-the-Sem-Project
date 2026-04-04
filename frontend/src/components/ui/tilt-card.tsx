"use client";
import { use3DTilt } from "@/hooks/use3DTilt";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxRotation?: number;
  scaleReduction?: number;
  style?: React.CSSProperties;
}

export function TiltCard({
  children,
  className,
  maxRotation,
  scaleReduction,
  style,
}: TiltCardProps) {
  const { ref, tilt } = use3DTilt<HTMLDivElement>({ maxRotation, scaleReduction });

  const shadowX = -tilt.rotateY * 1.2;
  const shadowY = tilt.rotateX * 1.2;
  const shadowBlur = tilt.isHovering ? 35 : 12;
  const shadowOpacity = tilt.isHovering ? 0.14 : 0.06;

  return (
    <div style={{ perspective: "1000px" }}>
      <div
        ref={ref}
        className={className}
        style={{
          ...style,
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`,
          transition: tilt.isHovering
            ? "transform 0.08s ease-out, box-shadow 0.08s ease-out"
            : "transform 0.35s ease-out, box-shadow 0.35s ease-out",
          transformStyle: "preserve-3d",
          willChange: "transform",
          boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(44, 62, 80, ${shadowOpacity})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
