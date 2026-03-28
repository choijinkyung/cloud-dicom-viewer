export const appName = "Cloud DICOM Viewer";

export type WorklistItem = {
  studyInstanceUid: string;
  patientName: string;
  mrn: string;
  accessionNumber: string;
  modality: "CT" | "MR" | "XR";
  studyDate: string;
  studyDescription: string;
  status: "new" | "assigned" | "read";
};

export type StudyDetail = {
  studyInstanceUid: string;
  accessionNumber: string | null;
  studyDescription: string | null;
  modalitySummary: string | null;
  status: string;
  studyDate: string | null;
  receivedAt: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    mrn: string | null;
  };
  reports: Array<{
    id: string;
    status: string;
    signedAt: string | null;
    content: unknown;
  }>;
  series: Array<{
    id: string;
    seriesInstanceUid: string;
    modality: string | null;
    description: string | null;
    seriesNumber: number | null;
    instanceCount: number;
    instances: Array<{
      id: string;
      orthancInstanceId?: string;
      sopInstanceUid: string;
      instanceNumber: number | null;
      sopClassUid: string | null;
      imageUrl?: string;
    }>;
  }>;
};

export const demoWorklistItems: WorklistItem[] = [
  {
    studyInstanceUid: "1.2.840.10008.1001.1",
    patientName: "Eleanor Brooks",
    mrn: "MRN-100245",
    accessionNumber: "ACC-CT-24019",
    modality: "CT",
    studyDate: "2026-03-24",
    studyDescription: "CT Chest With Contrast",
    status: "new",
  },
  {
    studyInstanceUid: "1.2.840.10008.1001.2",
    patientName: "Daniel Parker",
    mrn: "MRN-100246",
    accessionNumber: "ACC-MR-88412",
    modality: "MR",
    studyDate: "2026-03-25",
    studyDescription: "MRI Brain Without Contrast",
    status: "assigned",
  },
  {
    studyInstanceUid: "1.2.840.10008.1001.3",
    patientName: "Amelia Foster",
    mrn: "MRN-100247",
    accessionNumber: "ACC-XR-99418",
    modality: "XR",
    studyDate: "2026-03-26",
    studyDescription: "Chest X-Ray AP Portable",
    status: "read",
  },
];

export const demoStudyDetails: Record<string, StudyDetail> = {
  "1.2.840.10008.1001.1": {
    studyInstanceUid: "1.2.840.10008.1001.1",
    accessionNumber: "ACC-CT-24019",
    studyDescription: "CT Chest With Contrast",
    modalitySummary: "CT",
    status: "DEMO",
    studyDate: "2026-03-24",
    receivedAt: "2026-03-24T08:30:00.000Z",
    patient: {
      id: "demo-patient-1",
      firstName: "Eleanor",
      lastName: "Brooks",
      mrn: "MRN-100245",
    },
    reports: [
      {
        id: "demo-report-1",
        status: "draft",
        signedAt: null,
        content:
          "Demo deployment mode: full DICOM rendering is available in the local full-stack environment.",
      },
    ],
    series: [
      {
        id: "demo-series-ct-1",
        seriesInstanceUid: "demo-series-ct-1",
        modality: "CT",
        description: "Bundled Sample Series 1",
        seriesNumber: 1,
        instanceCount: 5,
        instances: Array.from({ length: 5 }, (_, index) => ({
          id: `demo-ct-1-${index + 1}`,
          sopInstanceUid: `demo-ct-1-${index + 1}`,
          instanceNumber: index + 1,
          sopClassUid: null,
          imageUrl: `/TESTDCM/daae3df7f522b56724aed7e3e544c0fe/series-000001/image-${String(
            index + 1,
          ).padStart(6, "0")}.dcm`,
        })),
      },
      {
        id: "demo-series-ct-2",
        seriesInstanceUid: "demo-series-ct-2",
        modality: "CT",
        description: "Bundled Sample Series 2",
        seriesNumber: 2,
        instanceCount: 2,
        instances: Array.from({ length: 2 }, (_, index) => ({
          id: `demo-ct-2-${index + 1}`,
          sopInstanceUid: `demo-ct-2-${index + 1}`,
          instanceNumber: index + 1,
          sopClassUid: null,
          imageUrl: `/TESTDCM/daae3df7f522b56724aed7e3e544c0fe/series-000002/image-${String(
            index + 1,
          ).padStart(6, "0")}.dcm`,
        })),
      },
    ],
  },
  "1.2.840.10008.1001.2": {
    studyInstanceUid: "1.2.840.10008.1001.2",
    accessionNumber: "ACC-MR-88412",
    studyDescription: "MRI Brain Without Contrast",
    modalitySummary: "MR",
    status: "DEMO",
    studyDate: "2026-03-25",
    receivedAt: "2026-03-25T14:10:00.000Z",
    patient: {
      id: "demo-patient-2",
      firstName: "Daniel",
      lastName: "Parker",
      mrn: "MRN-100246",
    },
    reports: [
      {
        id: "demo-report-2",
        status: "preliminary",
        signedAt: null,
        content:
          "UI demo only. Run the local stack to connect Orthanc and render actual DICOM instances.",
      },
    ],
    series: [
      {
        id: "demo-series-mr-1",
        seriesInstanceUid: "demo-series-mr-1",
        modality: "MR",
        description: "Ax T2 FLAIR",
        seriesNumber: 3,
        instanceCount: 24,
        instances: Array.from({ length: 24 }, (_, index) => ({
          id: `demo-mr-1-${index + 1}`,
          sopInstanceUid: `demo-mr-1-${index + 1}`,
          instanceNumber: index + 1,
          sopClassUid: null,
        })),
      },
      {
        id: "demo-series-mr-2",
        seriesInstanceUid: "demo-series-mr-2",
        modality: "MR",
        description: "Sag T1",
        seriesNumber: 5,
        instanceCount: 16,
        instances: Array.from({ length: 16 }, (_, index) => ({
          id: `demo-mr-2-${index + 1}`,
          sopInstanceUid: `demo-mr-2-${index + 1}`,
          instanceNumber: index + 1,
          sopClassUid: null,
        })),
      },
    ],
  },
  "1.2.840.10008.1001.3": {
    studyInstanceUid: "1.2.840.10008.1001.3",
    accessionNumber: "ACC-XR-99418",
    studyDescription: "Chest X-Ray AP Portable",
    modalitySummary: "XR",
    status: "DEMO",
    studyDate: "2026-03-26",
    receivedAt: "2026-03-26T09:45:00.000Z",
    patient: {
      id: "demo-patient-3",
      firstName: "Amelia",
      lastName: "Foster",
      mrn: "MRN-100247",
    },
    reports: [
      {
        id: "demo-report-3",
        status: "final",
        signedAt: "2026-03-26T12:00:00.000Z",
        content:
          "No acute cardiopulmonary abnormality. Demo report shown for hosted UI preview.",
      },
    ],
    series: [
      {
        id: "demo-series-xr-1",
        seriesInstanceUid: "demo-series-xr-1",
        modality: "XR",
        description: "Portable AP",
        seriesNumber: 1,
        instanceCount: 1,
        instances: [
          {
            id: "demo-xr-1-1",
            sopInstanceUid: "demo-xr-1-1",
            instanceNumber: 1,
            sopClassUid: null,
          },
        ],
      },
    ],
  },
};

export function getDemoStudyDetail(studyInstanceUid: string): StudyDetail {
  return (
    demoStudyDetails[studyInstanceUid] ??
    demoStudyDetails["1.2.840.10008.1001.2"]
  );
}
