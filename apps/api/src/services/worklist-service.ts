import { prisma } from "@dicom-viewer/db";
import { demoWorklistItems, type WorklistItem } from "@dicom-viewer/shared";
import {
  getOrthancStudyDetailByStudyInstanceUid,
  getOrthancSeriesDetail,
} from "./orthanc-service";

export async function getWorklistItems(): Promise<WorklistItem[]> {
  try {
    const studies = await prisma.study.findMany({
      orderBy: {
        receivedAt: "desc",
      },
      include: {
        patient: true,
      },
      take: 50,
    });

    if (studies.length === 0) {
      return demoWorklistItems;
    }

    return studies.map((study) => ({
      studyInstanceUid: study.studyInstanceUid,
      patientName: `${study.patient.firstName} ${study.patient.lastName}`,
      mrn: study.patient.primaryMrn ?? "UNKNOWN",
      accessionNumber: study.accessionNumber ?? "UNKNOWN",
      modality:
        study.modalitySummary === "MR" || study.modalitySummary === "XR"
          ? study.modalitySummary
          : "CT",
      studyDate:
        study.studyDate?.toISOString().slice(0, 10) ??
        study.receivedAt.toISOString().slice(0, 10),
      studyDescription: study.studyDescription ?? "Untitled Study",
      status:
        study.status === "READ"
          ? "read"
          : study.status === "ASSIGNED"
            ? "assigned"
            : "new",
    }));
  } catch (error) {
    console.warn(
      "Falling back to demo worklist data because DB query failed.",
      error,
    );
    return demoWorklistItems;
  }
}

export async function getStudyByInstanceUid(studyInstanceUid: string) {
  try {
    const study = await prisma.study.findUnique({
      where: {
        studyInstanceUid,
      },
      include: {
        patient: true,
        reports: true,
        series: {
          include: {
            instances: true,
          },
        },
      },
    });

    if (!study) {
      const orthancStudy =
        await getOrthancStudyDetailByStudyInstanceUid(studyInstanceUid);

      if (!orthancStudy) {
        return null;
      }

      const mainDicomTags = orthancStudy.MainDicomTags ?? {};
      const patientMainDicomTags = orthancStudy.PatientMainDicomTags ?? {};
      const seriesIds = Array.isArray(orthancStudy.Series)
        ? orthancStudy.Series
        : [];
      const orthancSeriesDetails = await Promise.all(
        seriesIds.map(async (seriesId: string) => {
          const seriesDetail = await getOrthancSeriesDetail(seriesId);
          return { seriesId, seriesDetail };
        }),
      );

      return {
        studyInstanceUid,
        accessionNumber: mainDicomTags.AccessionNumber ?? null,
        studyDescription: mainDicomTags.StudyDescription ?? null,
        modalitySummary: mainDicomTags.ModalitiesInStudy ?? null,
        status: "ORTHANC_ONLY",
        studyDate: mainDicomTags.StudyDate ?? null,
        receivedAt: new Date().toISOString(),
        patient: {
          id: patientMainDicomTags.PatientID ?? "orthanc-patient",
          firstName: patientMainDicomTags.PatientName ?? "Unknown",
          lastName: "",
          mrn: patientMainDicomTags.PatientID ?? null,
        },
        reports: [],
        series: orthancSeriesDetails.map(
          ({ seriesId, seriesDetail }, index: number) => {
            const seriesTags = seriesDetail.MainDicomTags ?? {};
            const instances = Array.isArray(seriesDetail.Instances)
              ? seriesDetail.Instances
              : [];

            return {
              id: seriesId,
              seriesInstanceUid: seriesTags.SeriesInstanceUID ?? seriesId,
              modality: seriesTags.Modality ?? null,
              description:
                seriesTags.SeriesDescription ?? `Orthanc Series ${index + 1}`,
              seriesNumber: Number(seriesTags.SeriesNumber ?? index + 1),
              instanceCount: instances.length,
              instances: instances.map(
                (instanceId: string, instanceIndex: number) => ({
                  id: instanceId,
                  orthancInstanceId: instanceId,
                  sopInstanceUid: instanceId,
                  instanceNumber: instanceIndex + 1,
                  sopClassUid: null,
                  imageUrl: `/api/instances/${instanceId}/file`,
                }),
              ),
            };
          },
        ),
      };
    }

    return {
      studyInstanceUid: study.studyInstanceUid,
      accessionNumber: study.accessionNumber,
      studyDescription: study.studyDescription,
      modalitySummary: study.modalitySummary,
      status: study.status,
      studyDate: study.studyDate?.toISOString().slice(0, 10) ?? null,
      receivedAt: study.receivedAt.toISOString(),
      patient: {
        id: study.patient.id,
        firstName: study.patient.firstName,
        lastName: study.patient.lastName,
        mrn: study.patient.primaryMrn,
      },
      reports: study.reports.map((report) => ({
        id: report.id,
        status: report.status,
        signedAt: report.signedAt?.toISOString() ?? null,
        content: report.content,
      })),
      series: study.series.map((series) => ({
        id: series.id,
        seriesInstanceUid: series.seriesInstanceUid,
        modality: series.modality,
        description: series.description,
        seriesNumber: series.seriesNumber,
        instanceCount: series.instances.length,
        instances: series.instances.map((instance) => ({
          id: instance.id,
          sopInstanceUid: instance.sopInstanceUid,
          instanceNumber: instance.instanceNumber,
          sopClassUid: instance.sopClassUid,
        })),
      })),
    };
  } catch (error) {
    console.warn("Failed to fetch study detail.", error);
    return null;
  }
}
