"use client";
import { useRef, useState, useCallback, useEffect } from "react";

interface TiltState {
  rotateX: number;
  rotateY: number;
  scale: number;
  isHovering: boolean;
}

interface UseTiltOptions {
  maxRotation?: number;
  scaleReduction?: number;
}

export function use3DTilt<T extends HTMLElement>(options: UseTiltOptions = {}) {
  const { maxRotation = 12, scaleReduction = 0.03 } = options;
  const ref = useRef<T>(null);
  const [tilt, setTilt] = useState<TiltState>({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    isHovering: false,
  });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - rect.width / 2;
      const offsetY = e.clientY - rect.top - rect.height / 2;

      const rotateY = (offsetX / (rect.width / 2)) * maxRotation;
      const rotateX = -(offsetY / (rect.height / 2)) * maxRotation;

      const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
      const maxDist = Math.sqrt(
        (rect.width / 2) ** 2 + (rect.height / 2) ** 2
      );
      const scale = 1 - scaleReduction * (distance / maxDist);

      setTilt({ rotateX, rotateY, scale, isHovering: true });
    },
    [maxRotation, scaleReduction]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0, scale: 1, isHovering: false });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Disable on touch devices
    if (window.matchMedia("(hover: none)").matches) return;
    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return { ref, tilt };
}
