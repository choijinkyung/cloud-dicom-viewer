import Link from "next/link";
import { demoWorklistItems, WorklistItem } from "@dicom-viewer/shared";
import { getInternalApiBaseUrl } from "../../lib/api";

async function getWorklistItems(): Promise<WorklistItem[]> {
  try {
    const response = await fetch(`${getInternalApiBaseUrl()}/api/worklist`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch worklist items");
    }

    const data = (await response.json()) as { items: WorklistItem[] };
    return data.items;
  } catch {
    return demoWorklistItems;
  }
}

export default async function WorklistPage() {
  const items = await getWorklistItems();

  const worklistCardStyle = {
    display: "block",
    padding: "18px",
    background:
      "linear-gradient(180deg, rgba(18, 34, 54, 0.96), rgba(12, 24, 40, 0.98))",
    border: "1px solid rgba(88, 196, 220, 0.14)",
    borderRadius: "20px",
    boxShadow: "0 16px 40px rgba(2, 6, 16, 0.22)",
  } as const;

  return (
    <main
      style={{
        maxWidth: "1180px",
        margin: "0 auto",
        padding: "40px 20px 64px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              color: "#7ee0a1",
              textTransform: "uppercase",
              fontSize: "12px",
              letterSpacing: "0.08em",
            }}
          >
            Worklist
          </p>
          <p style={{ margin: "8px 0 0", color: "#8ea3b7" }}>
            Falls back to hosted demo data when the backend is unavailable.
          </p>
          <h1 style={{ margin: "10px 0 0", fontSize: "40px", color: "#f3f7fb" }}>
            Imaging Studies
          </h1>
        </div>
      </div>

      <div style={{ display: "grid", gap: "14px", marginTop: "24px" }}>
        {items.map((item) => (
          <Link
            href={`/studies/${item.studyInstanceUid}`}
            key={item.studyInstanceUid}
            style={worklistCardStyle}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <strong style={{ fontSize: "18px", color: "#f3f7fb" }}>
                  {item.patientName}
                </strong>
                <p style={{ margin: "8px 0 0", color: "#8ea3b7" }}>
                  MRN {item.mrn} | {item.modality} | {item.studyDescription}
                </p>
              </div>
              <div style={{ textAlign: "right", color: "#8ea3b7" }}>
                <div>{item.studyDate}</div>
                <div style={{ marginTop: "6px", color: "#7ee0a1" }}>{item.status}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
