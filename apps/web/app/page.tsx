import Link from "next/link";
import { appName, demoWorklistItems } from "@dicom-viewer/shared";

const cardStyle = {
  background: "var(--surface)",
  border: "1px solid var(--line)",
  borderRadius: "24px",
  backdropFilter: "blur(14px)",
  boxShadow: "0 24px 70px rgba(2, 6, 16, 0.28)",
} as const;

export default function HomePage() {
  return (
    <main style={{ padding: "40px 20px 64px" }}>
      <section
        style={{
          ...cardStyle,
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "28px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "24px",
            flexWrap: "wrap",
            alignItems: "start",
          }}
        >
          <div style={{ maxWidth: "720px" }}>
            <p
              style={{
                margin: 0,
                color: "var(--accent-strong)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontSize: "12px",
              }}
            >
              Enterprise Imaging Workspace
            </p>
            <h1 style={{ margin: "14px 0 12px", fontSize: "48px", lineHeight: 1.05 }}>
              {appName}
            </h1>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: "18px", lineHeight: 1.6 }}>
              Worklist, viewer, RBAC, and interoperability in one cloud-native
              imaging platform. This starter lets us move from architecture to
              an actual product shell.
            </p>
          </div>

          <div
            style={{
              minWidth: "240px",
              padding: "18px",
              borderRadius: "18px",
              background: "var(--surface-strong)",
              border: "1px solid var(--line)",
            }}
          >
            <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)" }}>
              MVP flow
            </p>
            <p style={{ margin: "10px 0 0", lineHeight: 1.7 }}>
              Ingest study
              <br />
              Show on worklist
              <br />
              Open viewer
              <br />
              Enforce role policy
            </p>
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: "1180px",
          margin: "28px auto 0",
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "24px",
        }}
      >
        <div style={{ ...cardStyle, padding: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: "26px" }}>Worklist Preview</h2>
              <p style={{ margin: "8px 0 0", color: "var(--muted)" }}>
                Next step is wiring this to the API and Prisma-backed study table.
              </p>
            </div>
            <Link
              href="/worklist"
              style={{
                background: "var(--accent)",
                color: "#07111f",
                padding: "10px 14px",
                borderRadius: "999px",
                fontWeight: 700,
              }}
            >
              Open Worklist
            </Link>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            {demoWorklistItems.map((item) => (
              <article
                key={item.studyInstanceUid}
                style={{
                  padding: "16px",
                  borderRadius: "18px",
                  border: "1px solid var(--line)",
                  background:
                    "linear-gradient(180deg, rgba(18, 34, 54, 0.96), rgba(12, 24, 40, 0.98))",
                  boxShadow: "0 16px 36px rgba(2, 6, 16, 0.2)",
                }}
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
                    <strong style={{ color: "#f3f7fb" }}>{item.patientName}</strong>
                    <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>
                      {item.modality} | {item.accessionNumber} | {item.studyDescription}
                    </p>
                  </div>
                  <div style={{ color: "var(--muted)" }}>{item.studyDate}</div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside style={{ ...cardStyle, padding: "24px" }}>
          <h2 style={{ marginTop: 0, fontSize: "24px" }}>Platform Modules</h2>
          <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
            Viewer shell, DICOMweb study fetch, role-aware actions, audit log,
            and admin setup will land on top of this foundation.
          </p>
          <div style={{ display: "grid", gap: "10px", marginTop: "18px" }}>
            {["Worklist", "Viewer", "RBAC", "FHIR", "HL7", "Audit"].map((label) => (
              <div
                key={label}
                style={{
                  padding: "12px 14px",
                  borderRadius: "14px",
                  background:
                    "linear-gradient(180deg, rgba(18, 34, 54, 0.96), rgba(12, 24, 40, 0.98))",
                  border: "1px solid var(--line)",
                  color: "#dff6ff",
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
