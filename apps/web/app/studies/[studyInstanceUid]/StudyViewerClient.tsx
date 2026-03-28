"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { StudyDetail } from "@dicom-viewer/shared";
import { DicomViewport } from "./DicomViewport";

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
type ToolGroupKey = "Navigate" | "Measure" | "Annotate" | "Utility";
type ViewerOverlayPanel = "metadata" | "reports" | null;

type ToolbarItem =
  | { kind: "tool"; key: ViewerTool; label: string }
  | { kind: "action"; key: ViewerUtilityAction; label: string };

const TOOL_GROUPS: Array<{
  key: ToolGroupKey;
  label: string;
  items: ToolbarItem[];
}> = [
  {
    key: "Navigate",
    label: "Navigate",
    items: [
      { kind: "tool", key: "WL", label: "Window / Level" },
      { kind: "tool", key: "Zoom", label: "Zoom" },
      { kind: "tool", key: "Pan", label: "Pan" },
      { kind: "tool", key: "Rotate", label: "Rotate" },
      { kind: "tool", key: "Magnify", label: "Magnify" },
      { kind: "tool", key: "Cine", label: "Stack Scroll" },
    ],
  },
  {
    key: "Measure",
    label: "Measure",
    items: [
      { kind: "tool", key: "Length", label: "Length" },
      { kind: "tool", key: "Height", label: "Height" },
      { kind: "tool", key: "Probe", label: "Probe" },
      { kind: "tool", key: "Angle", label: "Angle" },
      { kind: "tool", key: "Cobb", label: "Cobb Angle" },
      { kind: "tool", key: "Bidirectional", label: "Bidirectional" },
      { kind: "tool", key: "RectROI", label: "Rectangle ROI" },
      { kind: "tool", key: "EllipseROI", label: "Ellipse ROI" },
      { kind: "tool", key: "CircleROI", label: "Circle ROI" },
    ],
  },
  {
    key: "Annotate",
    label: "Annotate",
    items: [
      { kind: "tool", key: "Arrow", label: "Arrow Annotate" },
      { kind: "tool", key: "KeyImage", label: "Key Image" },
    ],
  },
  {
    key: "Utility",
    label: "Utility",
    items: [
      { kind: "action", key: "Reset", label: "Reset View" },
      { kind: "action", key: "Fit", label: "Fit to Window" },
      { kind: "action", key: "Clear", label: "Clear Markups" },
    ],
  },
];

function ToolbarGlyph({
  item,
}: {
  item: ViewerTool | ViewerUtilityAction;
}) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (item) {
    case "WL":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="5" />
          <path d="M8 3v10M3 8h10" />
        </svg>
      );
    case "Zoom":
      return (
        <svg {...common}>
          <circle cx="7" cy="7" r="4" />
          <path d="M10.5 10.5L14 14M7 5v4M5 7h4" />
        </svg>
      );
    case "Pan":
      return (
        <svg {...common}>
          <path d="M8 2v12M2 8h12M8 2l2 2M8 2L6 4M14 8l-2 2M14 8l-2-2M8 14l2-2M8 14l-2-2M2 8l2 2M2 8l2-2" />
        </svg>
      );
    case "Rotate":
      return (
        <svg {...common}>
          <path d="M11 5V2l2 2-2 2M12 8a4 4 0 1 1-1.2-2.8" />
        </svg>
      );
    case "Magnify":
      return (
        <svg {...common}>
          <rect x="2.5" y="2.5" width="8" height="8" rx="1.5" />
          <path d="M10.5 10.5L13.5 13.5" />
        </svg>
      );
    case "Cine":
      return (
        <svg {...common}>
          <path d="M6 4l5 4-5 4V4z" />
          <rect x="2.5" y="3" width="1.5" height="10" />
        </svg>
      );
    case "Length":
      return (
        <svg {...common}>
          <path d="M3 12L13 4M3 12h3M13 4v3" />
        </svg>
      );
    case "Height":
      return (
        <svg {...common}>
          <path d="M8 2v12M6 4l2-2 2 2M6 12l2 2 2-2" />
        </svg>
      );
    case "Probe":
      return (
        <svg {...common}>
          <circle cx="6" cy="6" r="2.5" />
          <path d="M8 8l5 5" />
        </svg>
      );
    case "Angle":
      return (
        <svg {...common}>
          <path d="M3 12L8 4l5 8M8 4v8" />
        </svg>
      );
    case "Cobb":
      return (
        <svg {...common}>
          <path d="M2.5 5h11M3.5 11h9M5 5l-2 2M11 11l2-2" />
        </svg>
      );
    case "Bidirectional":
      return (
        <svg {...common}>
          <path d="M3 5h10M8 5v6M3 11h10" />
        </svg>
      );
    case "RectROI":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="10" height="8" rx="1" />
        </svg>
      );
    case "EllipseROI":
      return (
        <svg {...common}>
          <ellipse cx="8" cy="8" rx="5" ry="3.5" />
        </svg>
      );
    case "CircleROI":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="4.5" />
        </svg>
      );
    case "Arrow":
      return (
        <svg {...common}>
          <path d="M3 13L13 3M13 3H9M13 3v4" />
        </svg>
      );
    case "KeyImage":
      return (
        <svg {...common}>
          <path d="M8 2l1.6 3.2 3.4.5-2.5 2.4.6 3.4L8 9.8 4.9 11.5l.6-3.4L3 5.7l3.4-.5L8 2z" />
        </svg>
      );
    case "Reset":
      return (
        <svg {...common}>
          <path d="M5 4H2v3M2.5 6A5.5 5.5 0 1 0 8 2.5" />
        </svg>
      );
    case "Fit":
      return (
        <svg {...common}>
          <path d="M5.5 2.5h-3v3M10.5 2.5h3v3M5.5 13.5h-3v-3M10.5 13.5h3v-3" />
          <rect x="5" y="5" width="6" height="6" rx="1" />
        </svg>
      );
    case "Clear":
      return (
        <svg {...common}>
          <path d="M3 4h10M6 4V3h4v1M5 6.5v4M8 6.5v4M11 6.5v4M4.5 4l.7 8.5h5.6l.7-8.5" />
        </svg>
      );
  }
}

function ToolGroupIcon({ group }: { group: ToolGroupKey }) {
  const common = {
    width: 14,
    height: 14,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (group) {
    case "Navigate":
      return (
        <svg {...common}>
          <path d="M3 8h10M8 3v10M8 3l2 2M8 3L6 5M13 8l-2 2M13 8l-2-2M8 13l2-2M8 13l-2-2M3 8l2 2M3 8l2-2" />
        </svg>
      );
    case "Measure":
      return (
        <svg {...common}>
          <path d="M3 11l8-8 2 2-8 8H3v-2zM8 6l2 2" />
        </svg>
      );
    case "Annotate":
      return (
        <svg {...common}>
          <path d="M3 13L13 3M13 3H9M13 3v4" />
        </svg>
      );
    case "Utility":
      return (
        <svg {...common}>
          <path d="M8 2.5v2M8 11.5v2M2.5 8h2M11.5 8h2M4.2 4.2l1.4 1.4M10.4 10.4l1.4 1.4M11.8 4.2l-1.4 1.4M5.6 10.4l-1.4 1.4" />
          <circle cx="8" cy="8" r="2.2" />
        </svg>
      );
  }
}

const TOOL_LABELS: Record<ViewerTool, string> = {
  WL: "Window / Level",
  Zoom: "Zoom",
  Pan: "Pan",
  Rotate: "Rotate",
  Magnify: "Magnify",
  Cine: "Stack Scroll",
  Length: "Length",
  Height: "Height",
  Probe: "Probe",
  Angle: "Angle",
  Cobb: "Cobb Angle",
  Bidirectional: "Bidirectional",
  RectROI: "Rectangle ROI",
  EllipseROI: "Ellipse ROI",
  CircleROI: "Circle ROI",
  Arrow: "Arrow Annotate",
  KeyImage: "Key Image",
};

const GROUP_DESCRIPTIONS: Record<ToolGroupKey, string> = {
  Navigate: "Viewport manipulation",
  Measure: "Measurement and ROI tools",
  Annotate: "Markup and key image tools",
  Utility: "Reset and cleanup actions",
};

function getToolbarGridColumns(itemCount: number) {
  if (itemCount <= 4) {
    return "repeat(2, 64px)";
  }

  if (itemCount <= 9) {
    return "repeat(3, 64px)";
  }

  return "repeat(4, 64px)";
}

interface StudyViewerClientProps {
  study: StudyDetail;
}

export function StudyViewerClient({ study }: StudyViewerClientProps) {
  const [isCompactLayout, setIsCompactLayout] = useState(false);
  const [isFilmstripCollapsed, setIsFilmstripCollapsed] = useState(false);
  const initialSeries = study.series[0] ?? null;
  const initialInstance = initialSeries?.instances[0] ?? null;

  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(
    initialSeries?.id ?? null,
  );
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(
    initialInstance?.id ?? null,
  );

  const [activeTool, setActiveTool] = useState<ViewerTool | null>("WL");
  const [activeToolGroup, setActiveToolGroup] = useState<ToolGroupKey>("Navigate");
  const [openToolGroup, setOpenToolGroup] = useState<ToolGroupKey | null>(
    "Navigate",
  );
  const [openOverlayPanel, setOpenOverlayPanel] =
    useState<ViewerOverlayPanel>(null);
  const [hoveredToolbarItem, setHoveredToolbarItem] = useState<string | null>(
    null,
  );
  const [utilityActionRequest, setUtilityActionRequest] = useState<{
    type: ViewerUtilityAction;
    nonce: number;
  } | null>(null);

  const selectedSeries =
    study.series.find((series) => series.id === selectedSeriesId) ??
    initialSeries;
  const selectedInstance =
    selectedSeries?.instances.find(
      (instance) => instance.id === selectedInstanceId,
    ) ??
    selectedSeries?.instances[0] ??
    null;
  const selectedInstances = selectedSeries?.instances ?? [];
  const selectedSeriesImageUrls = (selectedSeries?.instances ?? [])
    .map((instance) => instance.imageUrl)
    .filter((imageUrl): imageUrl is string => Boolean(imageUrl));
  const currentImageIndex = Math.max(
    0,
    selectedInstances.findIndex(
      (instance) => instance.id === selectedInstance?.id,
    ),
  );

  const handleImageIndexChange = (nextIndex: number) => {
    const nextInstance = selectedInstances[nextIndex];

    if (!nextInstance || nextInstance.id === selectedInstance?.id) {
      return;
    }

    setSelectedInstanceId(nextInstance.id);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName?.toLowerCase();
      const isTypingContext =
        target?.isContentEditable ||
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select";

      if (isTypingContext) {
        return;
      }

      if (event.key === "Escape") {
        if (openOverlayPanel) {
          setOpenOverlayPanel(null);
          return;
        }

        setActiveToolGroup("Navigate");
        setOpenToolGroup(null);
        setActiveTool(null);
        return;
      }

      if (selectedInstances.length < 2) {
        return;
      }

      if (event.key !== "ArrowDown" && event.key !== "ArrowRight" && event.key !== "ArrowUp" && event.key !== "ArrowLeft") {
        return;
      }

      event.preventDefault();

      const step =
        event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = Math.max(
        0,
        Math.min(currentImageIndex + step, selectedInstances.length - 1),
      );

      if (nextIndex !== currentImageIndex) {
        handleImageIndexChange(nextIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentImageIndex, openOverlayPanel, selectedInstances, selectedInstance?.id]);

  const panelStyle = {
    border: "1px solid rgba(156, 200, 216, 0.12)",
    borderRadius: "24px",
    background:
      "linear-gradient(180deg, rgba(14, 27, 43, 0.94), rgba(9, 19, 31, 0.98))",
    boxShadow: "0 28px 80px rgba(2, 6, 16, 0.42)",
    backdropFilter: "blur(20px)",
  } as const;
  const viewerShellMinHeight = isCompactLayout
    ? "auto"
    : "calc(100dvh - 148px)";

  useEffect(() => {
    const syncLayout = () => {
      setIsCompactLayout(window.innerWidth < 1180);
    };

    syncLayout();
    window.addEventListener("resize", syncLayout);

    return () => {
      window.removeEventListener("resize", syncLayout);
    };
  }, []);

  return (
    <main
      style={{
        minHeight: "100dvh",
        maxWidth: "100%",
        margin: "0 auto",
        padding:
          "clamp(6px, 1vw, 12px) clamp(6px, 1vw, 12px) clamp(12px, 1.6vw, 18px)",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        overflowX: "clip",
      }}
    >
      <section
        style={{
          ...panelStyle,
          marginBottom: "12px",
          padding: "clamp(10px, 1.4vw, 14px)",
          background:
            "linear-gradient(180deg, rgba(10, 21, 36, 0.82), rgba(9, 19, 31, 0.88))",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "18px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                display: "grid",
                placeItems: "center",
                width: "46px",
                height: "46px",
                borderRadius: "14px",
                color: "#06111d",
                fontWeight: 700,
                background: "linear-gradient(135deg, #7ee0a1 0%, #58c4dc 100%)",
                boxShadow: "0 10px 24px rgba(88, 196, 220, 0.28)",
              }}
            >
              DV
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  color: "#7ee0a1",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                RT Viewer Style Workspace
              </p>
              <h1
                style={{
                  margin: "6px 0 0",
                  color: "#f3f7fb",
                  fontSize: "clamp(22px, 2.2vw, 28px)",
                }}
              >
                {study.patient.firstName} {study.patient.lastName}
              </h1>
            </div>
          </div>

          <Link
            href="/worklist"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              borderRadius: "14px",
              textDecoration: "none",
              color: "#e9f6fb",
              background:
                "linear-gradient(180deg, rgba(18, 34, 54, 0.96), rgba(11, 21, 35, 0.98))",
              border: "1px solid rgba(88, 196, 220, 0.18)",
              boxShadow: "0 12px 28px rgba(2, 6, 16, 0.22)",
              minWidth: "fit-content",
            }}
          >
            <span
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "10px",
                display: "grid",
                placeItems: "center",
                background:
                  "linear-gradient(180deg, rgba(126, 224, 161, 0.18), rgba(88, 196, 220, 0.18))",
                color: "#8fdff3",
                flexShrink: 0,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 3L1.5 8 6 13" />
                <path d="M2 8h12" />
              </svg>
            </span>
            <span style={{ display: "grid", gap: "2px" }}>
              <span
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#8fbccc",
                }}
              >
                Navigator
              </span>
              <span style={{ fontSize: "13px", fontWeight: 600 }}>
                Back to Worklist
              </span>
            </span>
          </Link>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "10px",
              minWidth: isCompactLayout ? "100%" : "min(100%, 560px)",
              flex: "1 1 520px",
              width: "100%",
            }}
          >
            {[
              `MRN ${study.patient.mrn ?? "UNKNOWN"}`,
              `${study.modalitySummary ?? "N/A"} | ${study.studyDescription ?? "Untitled Study"}`,
              `Accession ${study.accessionNumber ?? "UNKNOWN"} | ${study.status}`,
            ].map((copy) => (
              <div
                key={copy}
                style={{
                  padding: "12px 14px",
                  borderRadius: "16px",
                  background:
                    "linear-gradient(180deg, rgba(18, 34, 54, 0.92), rgba(12, 24, 40, 0.98))",
                  color: "#e3f4fb",
                  border: "1px solid rgba(88, 196, 220, 0.16)",
                  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.02)",
                }}
              >
                {copy}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isCompactLayout
            ? "minmax(0, 1fr)"
            : "clamp(236px, 18vw, 288px) minmax(0, 1fr)",
          gap: "12px",
          alignItems: "start",
          flex: 1,
          minHeight: viewerShellMinHeight,
          minWidth: 0,
        }}
      >
        <aside
          style={{
            ...panelStyle,
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            width: "100%",
            maxHeight: isCompactLayout ? "none" : viewerShellMinHeight,
            overflow: isCompactLayout ? "visible" : "auto",
            position: isCompactLayout ? "relative" : "sticky",
            top: isCompactLayout ? "auto" : "12px",
            alignSelf: isCompactLayout ? "stretch" : "flex-start",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "10px",
              color: "#f3f7fb",
              fontSize: "24px",
            }}
          >
            Series
          </h2>
          <div
            style={{
              display: isCompactLayout ? "flex" : "grid",
              gap: "10px",
              overflowX: isCompactLayout ? "auto" : "visible",
              gridTemplateColumns: isCompactLayout ? undefined : "1fr",
              paddingBottom: isCompactLayout ? "6px" : 0,
            }}
          >
            {study.series.length > 0 ? (
              study.series.map((series) => {
                const isSelectedSeries = series.id === selectedSeries?.id;

                return (
                  <div
                    key={series.id}
                    style={{
                      flex: isCompactLayout ? "0 0 220px" : undefined,
                      padding: "10px",
                      borderRadius: "14px",
                      background: isSelectedSeries
                        ? "linear-gradient(180deg, rgba(88, 196, 220, 0.18), rgba(66, 176, 230, 0.12))"
                        : "linear-gradient(180deg, rgba(18, 34, 54, 0.96), rgba(12, 24, 40, 0.98))",
                      border: isSelectedSeries
                        ? "1px solid rgba(198, 245, 255, 0.38)"
                        : "1px solid rgba(88, 196, 220, 0.14)",
                      boxShadow: isSelectedSeries
                        ? "0 12px 28px rgba(88, 196, 220, 0.14)"
                        : "inset 0 1px 0 rgba(255, 255, 255, 0.02)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSeriesId(series.id);
                        setSelectedInstanceId(series.instances[0]?.id ?? null);
                      }}
                      style={{
                        all: "unset",
                        display: "block",
                        width: "100%",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          height: "72px",
                          borderRadius: "12px",
                          marginBottom: "10px",
                          border: "1px solid rgba(126, 224, 161, 0.14)",
                          background:
                            "radial-gradient(circle at center, rgba(88, 196, 220, 0.22), transparent 56%), linear-gradient(180deg, rgba(5, 10, 18, 0.96), rgba(9, 19, 31, 0.98))",
                          display: "grid",
                          placeItems: "center",
                          color: "#8fdff3",
                          fontSize: "11px",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        Series Preview
                      </div>
                      <strong>
                        <span style={{ color: "#f3f7fb" }}>
                          {series.seriesNumber ?? "-"} |{" "}
                          {series.modality ?? "N/A"}
                        </span>
                      </strong>
                      <p style={{ margin: "6px 0 0", color: "#d7e3ea", fontSize: "14px" }}>
                        {series.description ?? "Untitled Series"}
                      </p>
                      <p
                        style={{
                          margin: "6px 0 0",
                          color: "#7fb8ca",
                          fontSize: "13px",
                        }}
                      >
                        {series.instanceCount} instances
                      </p>
                    </button>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  padding: "12px",
                  borderRadius: "14px",
                  background:
                    "linear-gradient(180deg, rgba(18, 34, 54, 0.96), rgba(12, 24, 40, 0.98))",
                  border: "1px solid rgba(88, 196, 220, 0.14)",
                  color: "#d7e3ea",
                }}
              >
                No series yet
              </div>
            )}
          </div>
        </aside>

        <section
          style={{
            display: "grid",
            gap: "12px",
            minWidth: 0,
            minHeight: viewerShellMinHeight,
            alignContent: "start",
            width: "100%",
            justifyItems: "stretch",
          }}
        >
          <div
            style={{
              ...panelStyle,
              padding: "8px 12px 10px",
              width: "100%",
              position: "relative",
              zIndex: 8,
              overflow: "visible",
            }}
          >
            <div
              style={{
                display: "grid",
                gap: "10px",
                position: "relative",
                overflow: "visible",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  alignItems: "center",
                  overflowX: "visible",
                  paddingBottom: "2px",
                }}
              >
                {TOOL_GROUPS.map((group) => {
                  const isActiveGroup = activeToolGroup === group.key;
                  const isOpen = openToolGroup === group.key;

                  return (
                    <button
                      key={group.key}
                      type="button"
                      onClick={() => {
                        setActiveToolGroup(group.key);
                        setOpenToolGroup((currentGroup) =>
                          currentGroup === group.key ? null : group.key,
                        );

                        const firstTool = group.items.find(
                          (item) => item.kind === "tool",
                        );

                        if (
                          firstTool &&
                          !group.items.some(
                            (item) =>
                              item.kind === "tool" && item.key === activeTool,
                          )
                        ) {
                          setActiveTool(firstTool.key);
                        }
                      }}
                      style={{
                        background:
                          isActiveGroup || isOpen
                            ? "linear-gradient(180deg, rgba(88, 196, 220, 0.2), rgba(42, 108, 122, 0.28))"
                            : "linear-gradient(180deg, rgba(18, 34, 54, 0.92), rgba(12, 24, 40, 0.98))",
                        color:
                          isActiveGroup || isOpen ? "#f3fffb" : "#a7cad8",
                        border:
                          isActiveGroup || isOpen
                            ? "1px solid rgba(143, 223, 243, 0.42)"
                            : "1px solid rgba(88, 196, 220, 0.16)",
                        width: "58px",
                        minWidth: "58px",
                        height: "58px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontSize: "10px",
                        display: "grid",
                        justifyItems: "center",
                        alignContent: "center",
                        gap: "4px",
                        flexShrink: 0,
                        position: "relative",
                        boxShadow:
                          isActiveGroup || isOpen
                            ? "0 10px 22px rgba(88, 196, 220, 0.16)"
                            : "none",
                      }}
                    >
                      <span
                        style={{
                          color:
                            isActiveGroup || isOpen ? "#f3fffb" : "#dff6ff",
                        }}
                      >
                        <ToolGroupIcon group={group.key} />
                      </span>
                        <span
                        style={{
                          maxWidth: "42px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          lineHeight: 1,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                          <span
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {group.label}
                          </span>
                          <span
                            style={{
                              fontSize: "9px",
                              transform: isOpen
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                              transition: "transform 160ms ease",
                              color: "#8fdff3",
                              flexShrink: 0,
                            }}
                          >
                            ▼
                          </span>
                        </span>
                    </button>
                  );
                })}

                <div
                  style={{
                    marginLeft: "auto",
                    padding: "0 4px 0 8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#8ea3b7",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {(
                    [
                      { key: "metadata", label: "Study" },
                      { key: "reports", label: "Report" },
                    ] as const
                  ).map((panel) => {
                    const isOpen = openOverlayPanel === panel.key;

                    return (
                      <button
                        key={panel.key}
                        type="button"
                        onClick={() =>
                          setOpenOverlayPanel((current) =>
                            current === panel.key ? null : panel.key,
                          )
                        }
                        style={{
                          borderRadius: "999px",
                          border: isOpen
                            ? "1px solid rgba(143, 223, 243, 0.42)"
                            : "1px solid rgba(88, 196, 220, 0.16)",
                          background: isOpen
                            ? "linear-gradient(180deg, rgba(88, 196, 220, 0.18), rgba(42, 108, 122, 0.28))"
                            : "linear-gradient(180deg, rgba(18, 34, 54, 0.92), rgba(12, 24, 40, 0.98))",
                          color: "#dff6ff",
                          fontSize: "11px",
                          padding: "6px 10px",
                          cursor: "pointer",
                        }}
                      >
                        {panel.label}
                      </button>
                    );
                  })}
                  Active:{" "}
                  <span style={{ color: "#dff6ff", marginLeft: "6px" }}>
                    {activeTool ? TOOL_LABELS[activeTool] : "Idle"}
                  </span>
                </div>
              </div>

              {openToolGroup ? (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: 0,
                    zIndex: 30,
                    borderRadius: "14px",
                    border: "1px solid rgba(88, 196, 220, 0.16)",
                    background:
                      "linear-gradient(180deg, rgba(15, 21, 33, 0.98), rgba(10, 18, 30, 0.98))",
                    padding: "10px",
                    display: "grid",
                    gap: "10px",
                    boxShadow: "0 24px 60px rgba(0, 0, 0, 0.42)",
                    width: "fit-content",
                    maxWidth: "min(320px, calc(100vw - 40px))",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "#cdebf5",
                        fontSize: "11px",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      <ToolGroupIcon group={openToolGroup} />
                      {openToolGroup}
                    </div>
                    <div style={{ color: "#6f8594", fontSize: "10px" }}>
                      {GROUP_DESCRIPTIONS[openToolGroup]}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: "6px",
                      gridTemplateColumns: getToolbarGridColumns(
                        TOOL_GROUPS.find((group) => group.key === openToolGroup)
                          ?.items.length ?? 0,
                      ),
                    }}
                  >
                    {TOOL_GROUPS.find((group) => group.key === openToolGroup)?.items.map(
                      (item) => {
                        const isTool = item.kind === "tool";
                        const isActive =
                          isTool && activeTool === item.key;
                        const itemId = `${openToolGroup}-${item.key}`;

                        return (
                          <div
                            key={item.key}
                            style={{
                              position: "relative",
                              display: "grid",
                            }}
                            onMouseEnter={() => setHoveredToolbarItem(itemId)}
                            onMouseLeave={() => setHoveredToolbarItem(null)}
                          >
                            <button
                              type="button"
                              aria-label={item.label}
                          onClick={() => {
                                if (isTool) {
                                  setActiveTool(item.key);
                                  setActiveToolGroup(openToolGroup);
                                  return;
                                }

                                setUtilityActionRequest({
                                  type: item.key,
                                  nonce: Date.now(),
                                });
                              }}
                              style={{
                                width: "64px",
                                height: "64px",
                                display: "grid",
                                justifyItems: "center",
                                alignContent: "center",
                                gap: "6px",
                                padding: "6px 4px 5px",
                                background: isActive
                                  ? "linear-gradient(180deg, rgba(88, 196, 220, 0.22), rgba(42, 108, 122, 0.32))"
                                  : "linear-gradient(180deg, rgba(18, 34, 54, 0.92), rgba(12, 24, 40, 0.98))",
                                color: isActive ? "#fff1f4" : "#dff6ff",
                                border: isActive
                                  ? "1px solid rgba(143, 223, 243, 0.48)"
                                  : "1px solid rgba(88, 196, 220, 0.2)",
                                borderRadius: "10px",
                                cursor: "pointer",
                                boxShadow: isActive
                                  ? "0 12px 28px rgba(88, 196, 220, 0.18)"
                                  : "none",
                                textAlign: "center",
                              }}
                            >
                              <ToolbarGlyph item={item.key} />
                              <span
                                style={{
                                  maxWidth: "52px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  fontSize: "10px",
                                  lineHeight: 1,
                                  color: isActive ? "#f4fbff" : "#cfe5ef",
                                }}
                              >
                                {item.label}
                              </span>
                            </button>

                            {hoveredToolbarItem === itemId ? (
                              <div
                                style={{
                                  position: "absolute",
                                  left: "50%",
                                  bottom: "calc(100% + 10px)",
                                  transform: "translateX(-50%)",
                                  pointerEvents: "none",
                                  zIndex: 4,
                                  padding: "8px 10px",
                                  borderRadius: "10px",
                                  border:
                                    "1px solid rgba(255, 255, 255, 0.08)",
                                  background:
                                    "linear-gradient(180deg, rgba(19, 24, 37, 0.98), rgba(8, 12, 20, 0.98))",
                                  color: "#eff7fb",
                                  fontSize: "12px",
                                  whiteSpace: "nowrap",
                                  boxShadow: "0 16px 40px rgba(0, 0, 0, 0.34)",
                                }}
                                >
                                  {item.label}
                                  <div
                                    style={{
                                      position: "absolute",
                                      left: "50%",
                                      top: "100%",
                                      width: "10px",
                                      height: "10px",
                                      background: "rgba(8, 12, 20, 0.98)",
                                      borderRight:
                                        "1px solid rgba(255, 255, 255, 0.08)",
                                      borderBottom:
                                        "1px solid rgba(255, 255, 255, 0.08)",
                                      transform:
                                        "translate(-50%, -50%) rotate(45deg)",
                                    }}
                                  />
                                </div>
                            ) : null}
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              ) : null}

              {openOverlayPanel ? (
                <div
                  onClick={() => setOpenOverlayPanel(null)}
                  style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 40,
                    background: "rgba(2, 6, 16, 0.46)",
                    display: "grid",
                    placeItems: "center",
                    padding: "24px",
                  }}
                >
                  <div
                    onClick={(event) => event.stopPropagation()}
                    style={{
                      width: "min(720px, calc(100vw - 32px))",
                      maxHeight: "min(72dvh, 760px)",
                      overflow: "auto",
                      borderRadius: "22px",
                      border: "1px solid rgba(88, 196, 220, 0.18)",
                      background:
                        "linear-gradient(180deg, rgba(14, 27, 43, 0.98), rgba(9, 19, 31, 0.99))",
                      boxShadow: "0 32px 80px rgba(2, 6, 16, 0.52)",
                      padding: "18px",
                      display: "grid",
                      gap: "14px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            margin: 0,
                            color: "#8fdff3",
                            fontSize: "11px",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                          }}
                        >
                          Viewer Panel
                        </p>
                        <h3
                          style={{
                            margin: "6px 0 0",
                            color: "#f3f7fb",
                            fontSize: "22px",
                          }}
                        >
                          {openOverlayPanel === "metadata"
                            ? "Study Metadata"
                            : "Reports"}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOpenOverlayPanel(null)}
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "999px",
                          border: "1px solid rgba(88, 196, 220, 0.16)",
                          background:
                            "linear-gradient(180deg, rgba(18, 34, 54, 0.92), rgba(12, 24, 40, 0.98))",
                          color: "#dff6ff",
                          cursor: "pointer",
                          fontSize: "16px",
                        }}
                      >
                        ×
                      </button>
                    </div>

                    {openOverlayPanel === "metadata" ? (
                      <div
                        style={{
                          display: "grid",
                          gap: "10px",
                        }}
                      >
                        {[
                          `Study Date: ${study.studyDate ?? "N/A"}`,
                          `Received At: ${study.receivedAt}`,
                          `Series Count: ${study.series.length}`,
                          `Selected Series UID: ${selectedSeries?.seriesInstanceUid ?? "N/A"}`,
                          `Accession Number: ${study.accessionNumber ?? "UNKNOWN"}`,
                          `Status: ${study.status}`,
                        ].map((value) => (
                          <div
                            key={value}
                            style={{
                              padding: "12px 14px",
                              borderRadius: "16px",
                              background:
                                "linear-gradient(180deg, rgba(18, 34, 54, 0.92), rgba(12, 24, 40, 0.98))",
                              border: "1px solid rgba(88, 196, 220, 0.14)",
                              color: "#d7ecf6",
                              fontSize: "14px",
                              lineHeight: 1.45,
                            }}
                          >
                            {value}
                          </div>
                        ))}
                      </div>
                    ) : study.reports.length > 0 ? (
                      <div style={{ display: "grid", gap: "12px" }}>
                        {study.reports.map((report) => (
                          <div
                            key={report.id}
                            style={{
                              padding: "14px",
                              borderRadius: "18px",
                              background:
                                "linear-gradient(180deg, rgba(18, 34, 54, 0.92), rgba(12, 24, 40, 0.98))",
                              border: "1px solid rgba(88, 196, 220, 0.14)",
                            }}
                          >
                            <p
                              style={{
                                margin: "0 0 10px",
                                color: "#d7ecf6",
                                fontSize: "14px",
                              }}
                            >
                              Status: {report.status}
                            </p>
                            <pre
                              style={{
                                whiteSpace: "pre-wrap",
                                color: "#8fbccc",
                                margin: 0,
                                overflow: "auto",
                                fontSize: "12px",
                                lineHeight: 1.5,
                              }}
                            >
                              {JSON.stringify(report.content, null, 2)}
                            </pre>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          padding: "16px",
                          borderRadius: "16px",
                          background:
                            "linear-gradient(180deg, rgba(18, 34, 54, 0.92), rgba(12, 24, 40, 0.98))",
                          border: "1px solid rgba(88, 196, 220, 0.14)",
                          color: "#d7ecf6",
                        }}
                      >
                        No reports yet
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <DicomViewport
            imageUrl={selectedInstance?.imageUrl}
            stackImageUrls={selectedSeriesImageUrls}
            currentImageIndex={currentImageIndex}
            instanceNumber={selectedInstance?.instanceNumber}
            seriesDescription={selectedSeries?.description}
            activeTool={activeTool}
            utilityActionRequest={utilityActionRequest}
            onImageIndexChange={handleImageIndexChange}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr)",
              gap: "16px",
              minWidth: 0,
              width: "100%",
            }}
          >
            <section
              style={{
                ...panelStyle,
                padding: "12px",
                minWidth: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: isFilmstripCollapsed ? 0 : "8px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      color: "#f3f7fb",
                    }}
                  >
                    Images
                  </h2>
                  <p
                    style={{
                      margin: "4px 0 0",
                      color: "#8fdff3",
                      fontSize: "12px",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    Filmstrip
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                    justifyContent: "flex-end",
                  }}
                >
                  <p style={{ margin: 0, color: "#d7ecf6", fontSize: "13px" }}>
                    {selectedInstances.length > 0
                      ? `${currentImageIndex + 1} / ${selectedInstances.length}`
                      : "0 / 0"}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setIsFilmstripCollapsed((collapsed) => !collapsed)
                    }
                    style={{
                      border: "1px solid rgba(88, 196, 220, 0.18)",
                      background:
                        "linear-gradient(180deg, rgba(18, 34, 54, 0.92), rgba(12, 24, 40, 0.98))",
                      color: "#dff6ff",
                      borderRadius: "999px",
                      padding: "7px 10px",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    {isFilmstripCollapsed ? "Show Strip" : "Hide Strip"}
                  </button>
                </div>
              </div>
              {!isFilmstripCollapsed ? (
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    overflowX: "auto",
                    paddingBottom: "2px",
                    scrollbarWidth: "thin",
                    scrollSnapType: "x proximity",
                    alignItems: "stretch",
                  }}
                >
                  {selectedInstances.map((instance, index) => {
                    const isSelectedInstance =
                      instance.id === selectedInstance?.id;

                    return (
                      <button
                        key={instance.id}
                        type="button"
                        onClick={() => setSelectedInstanceId(instance.id)}
                        style={{
                          flex: isCompactLayout ? "0 0 72px" : "0 0 84px",
                          minHeight: isCompactLayout ? "64px" : "72px",
                          padding: "6px",
                          borderRadius: "14px",
                          border: isSelectedInstance
                            ? "1px solid rgba(126, 224, 161, 0.7)"
                            : "1px solid rgba(88, 196, 220, 0.16)",
                          background: isSelectedInstance
                            ? "linear-gradient(180deg, rgba(88, 196, 220, 0.2), rgba(66, 176, 230, 0.12))"
                            : "linear-gradient(180deg, rgba(18, 34, 54, 0.96), rgba(12, 24, 40, 0.98))",
                          color: "#d7e3ea",
                          textAlign: "left",
                          cursor: "pointer",
                          scrollSnapAlign: "start",
                        }}
                      >
                        <div
                          style={{
                            height: isCompactLayout ? "22px" : "26px",
                            borderRadius: "8px",
                            marginBottom: "5px",
                            background:
                              "radial-gradient(circle at center, rgba(88, 196, 220, 0.16), transparent 52%), linear-gradient(180deg, rgba(9, 19, 31, 1), rgba(5, 10, 18, 0.98))",
                            border: "1px solid rgba(88, 196, 220, 0.1)",
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          <span
                            style={{
                              color: "#8fdff3",
                              fontSize: "11px",
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                            }}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: isCompactLayout ? "9px" : "10px",
                            fontWeight: 700,
                          }}
                        >
                          Image {instance.instanceNumber ?? index + 1}
                        </div>
                        <div
                          style={{
                            marginTop: "2px",
                            color: "#7fb8ca",
                            fontSize: "9px",
                          }}
                        >
                          {isSelectedInstance ? "Current Slice" : "Tap To View"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
