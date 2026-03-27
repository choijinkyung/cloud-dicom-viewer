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
