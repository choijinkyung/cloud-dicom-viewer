"use client";

import { useEffect, useRef } from "react";
import * as cornerstone from "@cornerstonejs/core";
import type { StackViewport } from "@cornerstonejs/core";

type ViewerTool =
  | "WL"
  | "Zoom"
  | "Pan"
  | "Rotate"
  | "Magnify"
  | "Cine"
  | "Length"
  | "Height"
  | "Probe"
  | "Angle"
  | "Cobb"
  | "Bidirectional"
  | "RectROI"
  | "EllipseROI"
  | "CircleROI"
  | "Arrow"
  | "KeyImage";

type ViewerUtilityAction = "Reset" | "Fit" | "Clear";

const renderingEngineId = "dicom-rendering-engine";
const viewportId = "dicom-stack-viewport";
const toolGroupId = "dicom-stack-tool-group";

interface DicomViewportProps {
  imageUrl?: string;
  stackImageUrls?: string[];
  currentImageIndex?: number;
  instanceNumber?: number | null;
  seriesDescription?: string | null;
  activeTool: ViewerTool;
  utilityActionRequest?: {
    type: ViewerUtilityAction;
    nonce: number;
  } | null;
  onImageIndexChange?: (nextIndex: number) => void;
}

export function DicomViewport({
  imageUrl,
  stackImageUrls = [],
  currentImageIndex = 0,
  instanceNumber,
  seriesDescription,
  activeTool,
  utilityActionRequest,
  onImageIndexChange,
}: DicomViewportProps) {
  const isDemoMode = stackImageUrls.length === 0;
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const renderingEngineRef = useRef<cornerstone.RenderingEngine | null>(null);
  const csToolsRef = useRef<Awaited<
    typeof import("@cornerstonejs/tools")
  > | null>(null);
  const toolGroupReadyRef = useRef(false);
  const wheelDeltaRef = useRef(0);
  const imageAspectRatioRef = useRef<number>(1);
  const imageFrameRef = useRef({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });
  const resizeRafRef = useRef<number | null>(null);
  const fitDisplayAreaRef = useRef({
    type: "FIT" as const,
    imageArea: [1, 1] as [number, number],
    storeAsInitialCamera: true,
  });

  const updateImageFrame = () => {
    const element = viewportRef.current;
    const renderingEngine = renderingEngineRef.current;
    const viewport = renderingEngine?.getViewport(
      viewportId,
    ) as
      | (StackViewport & {
          getImageData: () => {
            imageData?: {
              indexToWorld: (index: [number, number, number]) => number[];
            };
            dimensions?: number[];
          };
        })
      | undefined;

    if (!element) {
      return;
    }

    const imageData = viewport?.getImageData?.();
    const dimensions = imageData?.dimensions ?? [];
    const vtkImageData = imageData?.imageData;
    const indexToWorld = vtkImageData?.indexToWorld;

    if (
      viewport &&
      vtkImageData &&
      typeof indexToWorld === "function" &&
      typeof dimensions[0] === "number" &&
      typeof dimensions[1] === "number" &&
      dimensions[0] > 0 &&
      dimensions[1] > 0
    ) {
      const toPoint3 = (point: ArrayLike<number>) =>
        [point[0], point[1], point[2]] as [number, number, number];
      const canvasCorners = [
        viewport.worldToCanvas(toPoint3(indexToWorld([0, 0, 0]))),
        viewport.worldToCanvas(
          toPoint3(indexToWorld([dimensions[0] - 1, 0, 0])),
        ),
        viewport.worldToCanvas(
          toPoint3(indexToWorld([0, dimensions[1] - 1, 0])),
        ),
        viewport.worldToCanvas(
          toPoint3(indexToWorld([dimensions[0] - 1, dimensions[1] - 1, 0])),
        ),
      ];

      const xValues = canvasCorners.map((point) => point[0]);
      const yValues = canvasCorners.map((point) => point[1]);
      const left = Math.max(0, Math.min(...xValues));
      const top = Math.max(0, Math.min(...yValues));
      const right = Math.min(element.clientWidth, Math.max(...xValues));
      const bottom = Math.min(element.clientHeight, Math.max(...yValues));

      if (right > left && bottom > top) {
        imageFrameRef.current = {
          width: right - left,
          height: bottom - top,
          left,
          top,
        };
        return;
      }
    }

    const viewportWidth = element.clientWidth;
    const viewportHeight = element.clientHeight;
    const imageAspectRatio = imageAspectRatioRef.current || 1;
    const viewportAspectRatio = viewportWidth / viewportHeight;

    let imageWidth = viewportWidth;
    let imageHeight = viewportHeight;

    if (imageAspectRatio > viewportAspectRatio) {
      imageHeight = viewportWidth / imageAspectRatio;
    } else {
      imageWidth = viewportHeight * imageAspectRatio;
    }

    imageFrameRef.current = {
      width: imageWidth,
      height: imageHeight,
      left: (viewportWidth - imageWidth) / 2,
      top: (viewportHeight - imageHeight) / 2,
    };
  };

  const syncViewportGeometry = () => {
    const renderingEngine = renderingEngineRef.current;
    const viewport = renderingEngine?.getViewport(viewportId) as
      | StackViewport
      | undefined;

    if (!renderingEngine || !viewport) {
      updateImageFrame();
      return;
    }

    renderingEngine.resize(true, false);
    viewport.setDisplayArea(fitDisplayAreaRef.current, true);
    viewport.render();
    updateImageFrame();

    if (resizeRafRef.current !== null) {
      cancelAnimationFrame(resizeRafRef.current);
    }

    resizeRafRef.current = requestAnimationFrame(() => {
      const nextRenderingEngine = renderingEngineRef.current;
      const nextViewport = nextRenderingEngine?.getViewport(viewportId) as
        | StackViewport
        | undefined;

      if (!nextRenderingEngine || !nextViewport) {
        updateImageFrame();
        resizeRafRef.current = null;
        return;
      }

      nextRenderingEngine.resize(true, false);
      nextViewport.setDisplayArea(fitDisplayAreaRef.current, true);
      nextViewport.render();
      updateImageFrame();
      resizeRafRef.current = null;
    });
  };

  const isPointInsideImageFrame = (clientX: number, clientY: number) => {
    const element = viewportRef.current;
    const imageFrame = imageFrameRef.current;

    if (!element || imageFrame.width <= 0 || imageFrame.height <= 0) {
      return false;
    }

    const rect = element.getBoundingClientRect();
    const left = rect.left + imageFrame.left;
    const top = rect.top + imageFrame.top;
    const right = left + imageFrame.width;
    const bottom = top + imageFrame.height;

    return (
      clientX >= left &&
      clientX <= right &&
      clientY >= top &&
      clientY <= bottom
    );
  };

  useEffect(() => {
    const element = viewportRef.current;

    if (!element) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      if (
        stackImageUrls.length < 2 ||
        !onImageIndexChange ||
        !isPointInsideImageFrame(event.clientX, event.clientY)
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

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

    element.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      element.removeEventListener("wheel", handleWheel);
    };
  }, [currentImageIndex, onImageIndexChange, stackImageUrls.length]);

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

      const csTools = await import("@cornerstonejs/tools");
      csToolsRef.current = csTools;

      const cornerstoneDICOMImageLoader =
        await import("@cornerstonejs/dicom-image-loader");

      await csTools.init();
      cornerstoneDICOMImageLoader.init({
        maxWebWorkers: 1,
      });

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

      const toolDefinitions = [
        csTools.WindowLevelTool,
        csTools.ZoomTool,
        csTools.PanTool,
        csTools.PlanarRotateTool,
        csTools.MagnifyTool,
        csTools.StackScrollTool,
        csTools.LengthTool,
        csTools.HeightTool,
        csTools.ProbeTool,
        csTools.AngleTool,
        csTools.CobbAngleTool,
        csTools.BidirectionalTool,
        csTools.RectangleROITool,
        csTools.EllipticalROITool,
        csTools.CircleROITool,
        csTools.ArrowAnnotateTool,
        csTools.KeyImageTool,
      ];

      toolDefinitions.forEach((toolDefinition) => {
        try {
          csTools.addTool(toolDefinition);
        } catch {
          // Tools are global singletons and may already be registered.
        }
      });

      let toolGroup = csTools.ToolGroupManager.getToolGroup(toolGroupId);

      if (!toolGroup) {
        toolGroup = csTools.ToolGroupManager.createToolGroup(toolGroupId);
      }

      if (!toolGroup) {
        throw new Error("Tool group was not created.");
      }

      [
        csTools.WindowLevelTool.toolName,
        csTools.ZoomTool.toolName,
        csTools.PanTool.toolName,
        csTools.PlanarRotateTool.toolName,
        csTools.MagnifyTool.toolName,
        csTools.StackScrollTool.toolName,
        csTools.LengthTool.toolName,
        csTools.HeightTool.toolName,
        csTools.ProbeTool.toolName,
        csTools.AngleTool.toolName,
        csTools.CobbAngleTool.toolName,
        csTools.BidirectionalTool.toolName,
        csTools.RectangleROITool.toolName,
        csTools.EllipticalROITool.toolName,
        csTools.CircleROITool.toolName,
        csTools.ArrowAnnotateTool.toolName,
        csTools.KeyImageTool.toolName,
      ].forEach((toolName) => {
        if (!toolGroup?.hasTool(toolName)) {
          toolGroup?.addTool(toolName);
        }
      });

      if (!toolGroup.getViewportIds().includes(viewportId)) {
        toolGroup.addViewport(viewportId, renderingEngineId);
      }

      toolGroupReadyRef.current = true;

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

      const imageData = viewport.getImageData() as
        | { dimensions?: number[]; spacing?: number[] }
        | undefined;
      const dimensions = imageData?.dimensions ?? [];
      const spacing = imageData?.spacing ?? [];
      const imageWidth = dimensions[0];
      const imageHeight = dimensions[1];
      const columnSpacing = spacing[0];
      const rowSpacing = spacing[1];

      if (
        typeof imageWidth === "number" &&
        typeof imageHeight === "number" &&
        imageWidth > 0 &&
        imageHeight > 0
      ) {
        imageAspectRatioRef.current =
          typeof columnSpacing === "number" &&
          typeof rowSpacing === "number" &&
          columnSpacing > 0 &&
          rowSpacing > 0
            ? (imageWidth * columnSpacing) / (imageHeight * rowSpacing)
            : imageWidth / imageHeight;
      }

      viewport.setDisplayArea(fitDisplayAreaRef.current, true);
      viewport.render();
      updateImageFrame();

      requestAnimationFrame(() => {
        if (!cancelled) {
          syncViewportGeometry();
        }
      });
    };

    run().catch((error) => {
      console.error("Cornerstone init failed", error);
    });

    return () => {
      if (resizeRafRef.current !== null) {
        cancelAnimationFrame(resizeRafRef.current);
        resizeRafRef.current = null;
      }

      cancelled = true;
    };
  }, [
    activeTool,
    currentImageIndex,
    imageUrl,
    instanceNumber,
    seriesDescription,
    stackImageUrls,
  ]);

  useEffect(() => {
    const csTools = csToolsRef.current;

    if (!csTools || !toolGroupReadyRef.current) {
      return;
    }

    const toolGroup = csTools.ToolGroupManager.getToolGroup(toolGroupId);

    if (!toolGroup) {
      return;
    }

    const toolNames = [
      csTools.WindowLevelTool.toolName,
      csTools.ZoomTool.toolName,
      csTools.PanTool.toolName,
      csTools.PlanarRotateTool.toolName,
      csTools.MagnifyTool.toolName,
      csTools.StackScrollTool.toolName,
      csTools.LengthTool.toolName,
      csTools.HeightTool.toolName,
      csTools.ProbeTool.toolName,
      csTools.AngleTool.toolName,
      csTools.CobbAngleTool.toolName,
      csTools.BidirectionalTool.toolName,
      csTools.RectangleROITool.toolName,
      csTools.EllipticalROITool.toolName,
      csTools.CircleROITool.toolName,
      csTools.ArrowAnnotateTool.toolName,
      csTools.KeyImageTool.toolName,
    ];

    toolNames.forEach((toolName) => {
      toolGroup.setToolPassive(toolName, {
        removeAllBindings: true,
      });
    });

    const activeToolNameMap: Record<ViewerTool, string> = {
      WL: csTools.WindowLevelTool.toolName,
      Zoom: csTools.ZoomTool.toolName,
      Pan: csTools.PanTool.toolName,
      Rotate: csTools.PlanarRotateTool.toolName,
      Magnify: csTools.MagnifyTool.toolName,
      Cine: csTools.StackScrollTool.toolName,
      Length: csTools.LengthTool.toolName,
      Height: csTools.HeightTool.toolName,
      Probe: csTools.ProbeTool.toolName,
      Angle: csTools.AngleTool.toolName,
      Cobb: csTools.CobbAngleTool.toolName,
      Bidirectional: csTools.BidirectionalTool.toolName,
      RectROI: csTools.RectangleROITool.toolName,
      EllipseROI: csTools.EllipticalROITool.toolName,
      CircleROI: csTools.CircleROITool.toolName,
      Arrow: csTools.ArrowAnnotateTool.toolName,
      KeyImage: csTools.KeyImageTool.toolName,
    };

    toolGroup.setToolActive(activeToolNameMap[activeTool], {
      bindings: [{ mouseButton: csTools.Enums.MouseBindings.Primary }],
    });
  }, [activeTool]);

  useEffect(() => {
    if (!utilityActionRequest) {
      return;
    }

    const renderingEngine = renderingEngineRef.current;
    const viewport = renderingEngine?.getViewport(viewportId) as
      | (StackViewport & {
          resetProperties?: () => void;
          resetToDefaultProperties?: () => void;
          resetCamera?: (options?: {
            resetPan?: boolean;
            resetZoom?: boolean;
            suppressEvents?: boolean;
          }) => boolean;
        })
      | undefined;

    if (!renderingEngine || !viewport) {
      return;
    }

    if (utilityActionRequest.type === "Clear") {
      const csTools = csToolsRef.current as
        | (Awaited<typeof import("@cornerstonejs/tools")> & {
            stateManagement?: {
              removeAllAnnotations?: () => void;
            };
          })
        | null;

      csTools?.stateManagement?.removeAllAnnotations?.();
      viewport.render();
      return;
    }

    if (utilityActionRequest.type === "Reset") {
      viewport.resetToDefaultProperties?.();
      viewport.resetProperties?.();
      viewport.resetCamera?.({
        resetPan: true,
        resetZoom: true,
        suppressEvents: false,
      });
    }

    if (utilityActionRequest.type === "Fit") {
      viewport.resetCamera?.({
        resetPan: true,
        resetZoom: true,
        suppressEvents: false,
      });
    }

    viewport.setDisplayArea(fitDisplayAreaRef.current, true);
    viewport.render();
    updateImageFrame();
  }, [utilityActionRequest]);

  useEffect(() => {
    const element = viewportRef.current;

    if (!element || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => {
      syncViewportGeometry();
    });

    observer.observe(element);

    const handleWindowResize = () => {
      syncViewportGeometry();
    };

    const handleFullscreenChange = () => {
      syncViewportGeometry();
      setTimeout(() => {
        syncViewportGeometry();
      }, 60);
    };

    window.addEventListener("resize", handleWindowResize);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.visualViewport?.addEventListener("resize", handleWindowResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleWindowResize);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.visualViewport?.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <div
      ref={viewportRef}
      style={{
        flex: 1,
        width: "100%",
        maxWidth: "100%",
        aspectRatio: "16 / 10",
        minHeight: "clamp(320px, 40dvh, 520px)",
        height: "auto",
        maxHeight: "calc(100dvh - 280px)",
        margin: 0,
        borderRadius: "24px",
        border: "1px solid rgba(143, 223, 243, 0.18)",
        background:
          "radial-gradient(circle at center, rgba(88, 196, 220, 0.18), transparent 32%), rgba(5, 10, 18, 0.96)",
        position: "relative",
        overflow: "hidden",
        cursor: stackImageUrls.length > 1 ? "ns-resize" : "default",
        boxShadow: "0 28px 80px rgba(2, 6, 16, 0.42)",
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
          zIndex: 3,
          padding: "10px 12px",
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
          {isDemoMode
            ? "Hosted UI Demo"
            : `Slice ${currentImageIndex + 1} / ${stackImageUrls.length}`}
        </p>
      </div>
      {isDemoMode ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            padding: "24px",
            zIndex: 2,
          }}
        >
          <div
            style={{
              maxWidth: "560px",
              padding: "22px 24px",
              borderRadius: "20px",
              background: "rgba(4, 10, 18, 0.68)",
              border: "1px solid rgba(88, 196, 220, 0.16)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#8fdff3",
                fontSize: "12px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Demo Mode
            </p>
            <p style={{ margin: "10px 0 0", color: "#f3f7fb", fontSize: "24px" }}>
              Hosted UI preview
            </p>
            <p style={{ margin: "10px 0 0", color: "#9fb3c8", lineHeight: 1.6 }}>
              This deployment showcases the viewer layout and workflow. Run the
              local full stack to connect Orthanc and render live DICOM slices.
            </p>
          </div>
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          right: "22px",
          bottom: "22px",
          zIndex: 3,
          padding: "9px 11px",
          borderRadius: "999px",
          background: "rgba(4, 10, 18, 0.62)",
          border: "1px solid rgba(126, 224, 161, 0.16)",
          color: "#d9dfeb",
          fontSize: "11px",
          pointerEvents: "none",
        }}
      >
        {isDemoMode
          ? "Local stack required for live DICOM"
          : `Wheel Scroll • Image ${instanceNumber ?? currentImageIndex + 1}`}
      </div>
    </div>
  );
}
