"use client";

import { useEffect, useRef, type WheelEvent } from "react";
import * as cornerstone from "@cornerstonejs/core";
import type { StackViewport } from "@cornerstonejs/core";

interface DicomViewportProps {
  imageUrl?: string;
  stackImageUrls?: string[];
  currentImageIndex?: number;
  instanceNumber?: number | null;
  seriesDescription?: string | null;
  onImageIndexChange?: (nextIndex: number) => void;
}

export function DicomViewport({
  imageUrl,
  stackImageUrls = [],
  currentImageIndex = 0,
  instanceNumber,
  seriesDescription,
  onImageIndexChange,
}: DicomViewportProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const renderingEngineRef = useRef<cornerstone.RenderingEngine | null>(null);
  const wheelDeltaRef = useRef(0);

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (stackImageUrls.length < 2 || !onImageIndexChange) {
      return;
    }

    event.preventDefault();

    wheelDeltaRef.current += event.deltaY;

    if (Math.abs(wheelDeltaRef.current) < 32) {
      return;
    }

    const step = wheelDeltaRef.current > 0 ? 1 : -1;
    wheelDeltaRef.current = 0;

    const nextIndex = Math.max(
      0,
      Math.min(currentImageIndex + step, stackImageUrls.length - 1),
    );

    if (nextIndex !== currentImageIndex) {
      onImageIndexChange(nextIndex);
    }
  };

  useEffect(() => {
    if (!viewportRef.current) {
      return;
    }
    if (!imageUrl || stackImageUrls.length === 0) {
      return;
    }

    const element = viewportRef.current;
    let cancelled = false;

    const run = async () => {
      const { init, RenderingEngine, Enums } = cornerstone;
      await init();

      const cornerstoneDICOMImageLoader =
        await import("@cornerstonejs/dicom-image-loader");

      cornerstoneDICOMImageLoader.init({
        maxWebWorkers: 1,
      });

      const renderingEngineId = "dicom-rendering-engine";
      const viewportId = "dicom-stack-viewport";
      const stackImageIds = stackImageUrls.map((url) => `wadouri:${url}`);

      let renderingEngine = renderingEngineRef.current;

      if (!renderingEngine) {
        renderingEngine = new RenderingEngine(renderingEngineId);
        renderingEngineRef.current = renderingEngine;

        renderingEngine.setViewports([
          {
            viewportId,
            type: Enums.ViewportType.STACK,
            element,
            defaultOptions: {
              background: [0.02, 0.05, 0.09],
            },
          },
        ]);
      }

      console.log("Cornerstone viewport initialized", {
        imageUrl,
        viewportId,
        renderingEngineId,
        stackSize: stackImageIds.length,
      });

      const viewport = renderingEngine.getViewport(viewportId) as StackViewport;
      if (!viewport) {
        throw new Error("Viewport was not created.");
      }

      await viewport.setStack(
        stackImageIds,
        Math.max(0, Math.min(currentImageIndex, stackImageIds.length - 1)),
      );

      if (cancelled) {
        return;
      }

      viewport.render();
    };

    run().catch((error) => {
      console.error("Cornerstone init failed", error);
    });

    return () => {
      cancelled = true;
    };
  }, [
    currentImageIndex,
    imageUrl,
    instanceNumber,
    seriesDescription,
    stackImageUrls,
  ]);

  return (
    <div
      ref={viewportRef}
      onWheel={handleWheel}
      style={{
        flex: 1,
        minHeight: "360px",
        borderRadius: "20px",
        border: "1px solid rgba(143, 223, 243, 0.18)",
        background:
          "radial-gradient(circle at center, rgba(88, 196, 220, 0.18), transparent 32%), rgba(5, 10, 18, 0.96)",
        display: "grid",
        placeItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "14px",
          borderRadius: "16px",
          border: "1px dashed rgba(126, 224, 161, 0.18)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "22px",
          left: "22px",
          zIndex: 1,
          padding: "12px 14px",
          borderRadius: "14px",
          background: "rgba(4, 10, 18, 0.62)",
          border: "1px solid rgba(88, 196, 220, 0.14)",
          color: "#d9dfeb",
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#8fdff3",
            fontSize: "11px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Stack View
        </p>
        <p style={{ margin: "6px 0 0", fontSize: "15px", color: "#f3f7fb" }}>
          {seriesDescription ?? "N/A"}
        </p>
        <p style={{ margin: "6px 0 0", color: "#98a2b3", fontSize: "12px" }}>
          Slice {currentImageIndex + 1} / {stackImageUrls.length}
        </p>
      </div>
      <div
        style={{
          position: "absolute",
          right: "22px",
          bottom: "22px",
          zIndex: 1,
          padding: "10px 12px",
          borderRadius: "999px",
          background: "rgba(4, 10, 18, 0.62)",
          border: "1px solid rgba(126, 224, 161, 0.16)",
          color: "#d9dfeb",
          fontSize: "12px",
          pointerEvents: "none",
        }}
      >
        Wheel Scroll • Image {instanceNumber ?? currentImageIndex + 1}
      </div>
    </div>
  );
}
