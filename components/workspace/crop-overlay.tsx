"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CropConfig } from "@/types/workspace";

interface CropOverlayProps {
  crop: CropConfig;
  onChange: (crop: Partial<CropConfig>) => void;
  imageElement: HTMLImageElement | null;
  enabled: boolean;
}

type DragHandle = "tl" | "tr" | "bl" | "br" | "center" | null;

export function CropOverlay({
  crop,
  onChange,
  imageElement,
  enabled,
}: CropOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragHandle, setDragHandle] = useState<DragHandle>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Redraw the overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !imageElement) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Set canvas resolution to match container size and device pixel ratio
    const width = Math.round(rect.width * dpr);
    const height = Math.round(rect.height * dpr);

    canvas.width = width;
    canvas.height = height;

    // Scale context for device pixel ratio
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!crop.enabled) return;

    // Draw crop box
    const startX = crop.x * canvas.width;
    const startY = crop.y * canvas.height;
    const boxWidth = crop.w * canvas.width;
    const boxHeight = crop.h * canvas.height;

    // Semi-transparent overlay outside crop area
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(startX, startY, boxWidth, boxHeight);

    // Crop box border
    ctx.strokeStyle = "#6440e8";
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, boxWidth, boxHeight);

    // Draw handles (circles at corners and center)
    const handleRadius = Math.max(6, Math.min(10, Math.min(canvas.width, canvas.height) * 0.02));
    const handles = [
      { x: startX, y: startY, name: "tl" },
      { x: startX + boxWidth, y: startY, name: "tr" },
      { x: startX, y: startY + boxHeight, name: "bl" },
      { x: startX + boxWidth, y: startY + boxHeight, name: "br" },
      { x: startX + boxWidth / 2, y: startY + boxHeight / 2, name: "center" },
    ];

    handles.forEach(({ x, y }) => {
      ctx.fillStyle = "#6440e8";
      ctx.beginPath();
      ctx.arc(x, y, handleRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw grid lines (rule of thirds)
    ctx.strokeStyle = "rgba(100, 64, 232, 0.3)";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 2; i++) {
      const x = startX + (boxWidth / 3) * i;
      const y = startY + (boxHeight / 3) * i;
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, startY + boxHeight);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(startX + boxWidth, y);
      ctx.stroke();
    }
  }, [crop, imageElement]);

  // Get handle at position
  const getHandleAtPoint = (
    clientX: number,
    clientY: number
  ): DragHandle => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const startX = crop.x * canvas.width;
    const startY = crop.y * canvas.height;
    const boxWidth = crop.w * canvas.width;
    const boxHeight = crop.h * canvas.height;
    const threshold = 12;

    // Check handles
    if (
      Math.abs(x - startX) < threshold &&
      Math.abs(y - startY) < threshold
    ) {
      return "tl";
    }
    if (
      Math.abs(x - (startX + boxWidth)) < threshold &&
      Math.abs(y - startY) < threshold
    ) {
      return "tr";
    }
    if (
      Math.abs(x - startX) < threshold &&
      Math.abs(y - (startY + boxHeight)) < threshold
    ) {
      return "bl";
    }
    if (
      Math.abs(x - (startX + boxWidth)) < threshold &&
      Math.abs(y - (startY + boxHeight)) < threshold
    ) {
      return "br";
    }

    // Check center for move
    if (
      x > startX &&
      x < startX + boxWidth &&
      y > startY &&
      y < startY + boxHeight
    ) {
      return "center";
    }

    return null;
  };

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!enabled || !crop.enabled) return;
      e.preventDefault();

      const handle = getHandleAtPoint(e.clientX, e.clientY);
      if (handle) {
        setDragHandle(handle);
        setIsDragging(true);
      }
    },
    [enabled, crop.enabled]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging || !dragHandle || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

      const normX = x / rect.width;
      const normY = y / rect.height;

      let newCrop = { ...crop };

      if (dragHandle === "center") {
        // Move crop box
        const deltaX = normX - (crop.x + crop.w / 2);
        const deltaY = normY - (crop.y + crop.h / 2);

        const newX = Math.max(0, Math.min(crop.x + deltaX, 1 - crop.w));
        const newY = Math.max(0, Math.min(crop.y + deltaY, 1 - crop.h));

        newCrop = { ...crop, x: newX, y: newY };
      } else if (dragHandle === "tl") {
        newCrop = {
          ...crop,
          x: Math.min(normX, crop.x + crop.w - 0.05),
          y: Math.min(normY, crop.y + crop.h - 0.05),
          w: Math.max(0.05, crop.w + (crop.x - Math.min(normX, crop.x + crop.w - 0.05))),
          h: Math.max(0.05, crop.h + (crop.y - Math.min(normY, crop.y + crop.h - 0.05))),
        };
      } else if (dragHandle === "tr") {
        newCrop = {
          ...crop,
          y: Math.min(normY, crop.y + crop.h - 0.05),
          w: Math.max(0.05, Math.min(normX, 1) - crop.x),
          h: Math.max(0.05, crop.h + (crop.y - Math.min(normY, crop.y + crop.h - 0.05))),
        };
      } else if (dragHandle === "bl") {
        newCrop = {
          ...crop,
          x: Math.min(normX, crop.x + crop.w - 0.05),
          w: Math.max(0.05, crop.w + (crop.x - Math.min(normX, crop.x + crop.w - 0.05))),
          h: Math.max(0.05, Math.min(normY, 1) - crop.y),
        };
      } else if (dragHandle === "br") {
        newCrop = {
          ...crop,
          w: Math.max(0.05, Math.min(normX, 1) - crop.x),
          h: Math.max(0.05, Math.min(normY, 1) - crop.y),
        };
      }

      onChange(newCrop);
    },
    [isDragging, dragHandle, crop, onChange]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    setDragHandle(null);
  }, []);

  // Add global pointer event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
      return () => {
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  // Update cursor
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const handle = getHandleAtPoint(e.clientX, e.clientY);
      const cursorMap: Record<Exclude<DragHandle, null>, string> = {
        tl: "nwse-resize",
        tr: "nesw-resize",
        bl: "nesw-resize",
        br: "nwse-resize",
        center: "grab",
      };
      canvas.style.cursor = handle ? cursorMap[handle] : "default";
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    return () => canvas.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        touchAction: "none",
        userSelect: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          cursor: "default",
        }}
      />
    </div>
  );
}
