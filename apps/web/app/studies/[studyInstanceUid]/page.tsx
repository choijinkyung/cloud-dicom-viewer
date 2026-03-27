import { getDemoStudyDetail, type StudyDetail } from "@dicom-viewer/shared";
import { StudyViewerClient } from "./StudyViewerClient";
import { getInternalApiBaseUrl } from "../../../lib/api";

interface StudyViewerPageProps {
  params: Promise<{
    studyInstanceUid: string;
  }>;
}

async function getStudyDetail(studyInstanceUid: string): Promise<StudyDetail> {
  try {
    const response = await fetch(
      `${getInternalApiBaseUrl()}/api/studies/${encodeURIComponent(studyInstanceUid)}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch study detail.");
    }

    return (await response.json()) as StudyDetail;
  } catch {
    return getDemoStudyDetail(studyInstanceUid);
  }
}

export default async function StudyViewerPage({
  params,
}: StudyViewerPageProps) {
  const { studyInstanceUid } = await params;
  const study = await getStudyDetail(studyInstanceUid);

  return <StudyViewerClient study={study} />;
}
