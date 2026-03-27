"use client";

import { useEffect, useState } from "react";
import type { StudyDetail } from "@dicom-viewer/shared";
import { DicomViewport } from "./DicomViewport";

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
    : "calc(100dvh - 176px)";

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
          "clamp(8px, 1.2vw, 16px) clamp(8px, 1.2vw, 16px) clamp(16px, 2vw, 24px)",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        overflowX: "clip",
      }}
    >
      <section
        style={{
          ...panelStyle,
          marginBottom: "16px",
          padding: "clamp(12px, 1.8vw, 16px)",
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
          gap: "16px",
          alignItems: "start",
          flex: 1,
          minHeight: viewerShellMinHeight,
          minWidth: 0,
        }}
      >
        <aside
          style={{
            ...panelStyle,
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            width: "100%",
            maxHeight: isCompactLayout ? "none" : viewerShellMinHeight,
            overflow: isCompactLayout ? "visible" : "auto",
            position: isCompactLayout ? "relative" : "sticky",
            top: isCompactLayout ? "auto" : "16px",
            alignSelf: isCompactLayout ? "stretch" : "flex-start",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "14px",
              color: "#f3f7fb",
              fontSize: "28px",
            }}
          >
            Series
          </h2>
          <div
            style={{
              display: isCompactLayout ? "flex" : "grid",
              gap: "12px",
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
                      padding: "12px",
                      borderRadius: "16px",
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
                          height: "84px",
                          borderRadius: "14px",
                          marginBottom: "12px",
                          border: "1px solid rgba(126, 224, 161, 0.14)",
                          background:
                            "radial-gradient(circle at center, rgba(88, 196, 220, 0.22), transparent 56%), linear-gradient(180deg, rgba(5, 10, 18, 0.96), rgba(9, 19, 31, 0.98))",
                          display: "grid",
                          placeItems: "center",
                          color: "#8fdff3",
                          fontSize: "12px",
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
                      <p style={{ margin: "8px 0 0", color: "#d7e3ea" }}>
                        {series.description ?? "Untitled Series"}
                      </p>
                      <p
                        style={{
                          margin: "6px 0 0",
                          color: "#7fb8ca",
                          fontSize: "14px",
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
            gap: "16px",
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
              padding: "12px 14px",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {["WL", "Zoom", "Pan", "Length", "ROI", "Cine"].map((tool) => (
                <button
                  key={tool}
                  type="button"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(18, 34, 54, 0.92), rgba(12, 24, 40, 0.98))",
                    color: "#dff6ff",
                    border: "1px solid rgba(88, 196, 220, 0.2)",
                    padding: "8px 11px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  {tool}
                </button>
              ))}
            </div>
          </div>

          <DicomViewport
            imageUrl={selectedInstance?.imageUrl}
            stackImageUrls={selectedSeriesImageUrls}
            currentImageIndex={currentImageIndex}
            instanceNumber={selectedInstance?.instanceNumber}
            seriesDescription={selectedSeries?.description}
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

            <div
              style={{
                display: "grid",
                gap: "12px",
                minWidth: 0,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isCompactLayout
                    ? "minmax(0, 1fr)"
                    : "minmax(0, 0.9fr) minmax(0, 1.1fr)",
                  gap: "12px",
                  minWidth: 0,
                }}
              >
                <div
                style={{
                  ...panelStyle,
                  padding: "14px",
                }}
              >
                <h2
                  style={{
                    marginTop: 0,
                    marginBottom: "10px",
                    fontSize: "16px",
                    color: "#f3f7fb",
                  }}
                >
                  Study Metadata
                </h2>
                {[
                  `Study Date: ${study.studyDate ?? "N/A"}`,
                  `Received At: ${study.receivedAt}`,
                  `Series Count: ${study.series.length}`,
                  `Selected Series UID: ${selectedSeries?.seriesInstanceUid ?? "N/A"}`,
                ].map((value) => (
                  <p
                    key={value}
                    style={{
                      color: "#d7ecf6",
                      margin: "0 0 8px",
                      fontSize: "13px",
                      lineHeight: 1.45,
                    }}
                  >
                    {value}
                  </p>
                ))}
                </div>

                <div
                style={{
                  ...panelStyle,
                  padding: "14px",
                  minWidth: 0,
                }}
              >
                <h2
                  style={{
                    marginTop: 0,
                    marginBottom: "10px",
                    fontSize: "16px",
                    color: "#f3f7fb",
                  }}
                >
                  Reports
                </h2>
                {study.reports.length > 0 ? (
                  study.reports.map((report) => (
                    <div key={report.id} style={{ color: "#d7ecf6" }}>
                      <p style={{ margin: "0 0 8px", fontSize: "13px" }}>
                        Status: {report.status}
                      </p>
                      <pre
                        style={{
                          whiteSpace: "pre-wrap",
                          color: "#8fbccc",
                          margin: 0,
                          maxHeight: "168px",
                          overflow: "auto",
                          fontSize: "12px",
                          lineHeight: 1.45,
                        }}
                      >
                        {JSON.stringify(report.content, null, 2)}
                      </pre>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#d7ecf6" }}>No reports yet</p>
                )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
