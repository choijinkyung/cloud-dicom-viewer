"use client";

import { useState } from "react";
import type { StudyDetail } from "@dicom-viewer/shared";
import { DicomViewport } from "./DicomViewport";

interface StudyViewerClientProps {
  study: StudyDetail;
}

export function StudyViewerClient({ study }: StudyViewerClientProps) {
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

  return (
    <main
      style={{
        minHeight: "100vh",
        maxWidth: "1480px",
        margin: "0 auto",
        padding: "24px 20px 56px",
      }}
    >
      <section
        style={{
          ...panelStyle,
          marginBottom: "18px",
          padding: "16px 20px",
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
                  fontSize: "26px",
                }}
              >
                {study.patient.firstName} {study.patient.lastName}
              </h1>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "10px",
              minWidth: "min(100%, 520px)",
              flex: "1 1 520px",
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
          gridTemplateColumns: "300px minmax(0, 1fr)",
          gap: "16px",
          alignItems: "stretch",
        }}
      >
        <aside
          style={{
            ...panelStyle,
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            minHeight: "100%",
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
          <div style={{ display: "grid", gap: "12px" }}>
            {study.series.length > 0 ? (
              study.series.map((series) => {
                const isSelectedSeries = series.id === selectedSeries?.id;

                return (
                  <div
                    key={series.id}
                    style={{
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
          }}
        >
          <div
            style={{
              ...panelStyle,
              padding: "16px",
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
                    padding: "10px 12px",
                    borderRadius: "14px",
                    cursor: "pointer",
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
              gridTemplateColumns: "minmax(0, 1.4fr) minmax(280px, 0.8fr)",
              gap: "16px",
            }}
          >
            <section
              style={{
                ...panelStyle,
                padding: "16px",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: "8px",
                  fontSize: "18px",
                  color: "#f3f7fb",
                }}
              >
                Images
              </h2>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                  flexWrap: "wrap",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "#8fdff3",
                    fontSize: "13px",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  Filmstrip
                </p>
                <p style={{ margin: 0, color: "#d7ecf6", fontSize: "13px" }}>
                  {selectedInstances.length > 0
                    ? `${currentImageIndex + 1} / ${selectedInstances.length}`
                    : "0 / 0"}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  overflowX: "auto",
                  paddingBottom: "6px",
                  scrollbarWidth: "thin",
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
                        flex: "0 0 122px",
                        minHeight: "118px",
                        padding: "10px",
                        borderRadius: "18px",
                        border: isSelectedInstance
                          ? "1px solid rgba(126, 224, 161, 0.7)"
                          : "1px solid rgba(88, 196, 220, 0.16)",
                        background: isSelectedInstance
                          ? "linear-gradient(180deg, rgba(88, 196, 220, 0.2), rgba(66, 176, 230, 0.12))"
                          : "linear-gradient(180deg, rgba(18, 34, 54, 0.96), rgba(12, 24, 40, 0.98))",
                        color: "#d7e3ea",
                        textAlign: "left",
                        cursor: "pointer",
                        }}
                      >
                      <div
                        style={{
                          height: "56px",
                          borderRadius: "12px",
                          marginBottom: "8px",
                          background:
                            "radial-gradient(circle at center, rgba(88, 196, 220, 0.16), transparent 52%), linear-gradient(180deg, rgba(9, 19, 31, 1), rgba(5, 10, 18, 0.98))",
                          border: "1px solid rgba(88, 196, 220, 0.1)",
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
                      <div style={{ fontSize: "14px", fontWeight: 600 }}>
                        Image {instance.instanceNumber ?? index + 1}
                      </div>
                      <div
                        style={{
                          marginTop: "4px",
                          color: "#7fb8ca",
                          fontSize: "12px",
                        }}
                      >
                        {isSelectedInstance ? "Current Slice" : "Tap To View"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section
              style={{
                display: "grid",
                gap: "16px",
              }}
            >
              <div
                style={{
                  ...panelStyle,
                  padding: "16px",
                }}
              >
                <h2
                  style={{
                    marginTop: 0,
                    marginBottom: "12px",
                    fontSize: "18px",
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
                  <p key={value} style={{ color: "#d7ecf6" }}>
                    {value}
                  </p>
                ))}
              </div>

              <div
                style={{
                  ...panelStyle,
                  padding: "16px",
                }}
              >
                <h2
                  style={{
                    marginTop: 0,
                    marginBottom: "12px",
                    fontSize: "18px",
                    color: "#f3f7fb",
                  }}
                >
                  Reports
                </h2>
                {study.reports.length > 0 ? (
                  study.reports.map((report) => (
                    <div key={report.id} style={{ color: "#d7ecf6" }}>
                      <p>Status: {report.status}</p>
                      <pre style={{ whiteSpace: "pre-wrap", color: "#8fbccc" }}>
                        {JSON.stringify(report.content, null, 2)}
                      </pre>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#d7ecf6" }}>No reports yet</p>
                )}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
