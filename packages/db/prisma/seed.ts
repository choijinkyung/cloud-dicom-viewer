import { PrismaClient, ReportStatus, StudyStatus, UserStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const organization = await prisma.organization.upsert({
    where: { slug: "northstar-imaging" },
    update: {},
    create: {
      slug: "northstar-imaging",
      name: "Northstar Imaging Group",
    },
  });

  const facility = await prisma.facility.upsert({
    where: {
      organizationId_code: {
        organizationId: organization.id,
        code: "VAN-01",
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      code: "VAN-01",
      name: "Northstar Vancouver",
      timezone: "America/Vancouver",
    },
  });

  const radiologistRole = await prisma.role.upsert({
    where: {
      organizationId_code: {
        organizationId: organization.id,
        code: "radiologist",
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      code: "radiologist",
      name: "Radiologist",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "radiologist@northstar-imaging.test" },
    update: {},
    create: {
      organizationId: organization.id,
      identityProviderSubject: "seed-radiologist-1",
      email: "radiologist@northstar-imaging.test",
      displayName: "Dr. Eleanor Brooks",
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.userRoleAssignment.upsert({
    where: { id: `${user.id}-${radiologistRole.id}-${facility.id}` },
    update: {},
    create: {
      id: `${user.id}-${radiologistRole.id}-${facility.id}`,
      userId: user.id,
      roleId: radiologistRole.id,
      facilityId: facility.id,
    },
  });

  const patient = await prisma.patient.upsert({
    where: {
      id: "seed-patient-eleanor-brooks",
    },
    update: {},
    create: {
      id: "seed-patient-eleanor-brooks",
      organizationId: organization.id,
      primaryMrn: "MRN-100245",
      firstName: "Eleanor",
      lastName: "Brooks",
      sex: "F",
    },
  });

  await prisma.patientIdentifier.upsert({
    where: {
      identifierType_identifierValue_assigningAuthority: {
        identifierType: "MRN",
        identifierValue: "MRN-100245",
        assigningAuthority: "Northstar",
      },
    },
    update: {},
    create: {
      patientId: patient.id,
      identifierType: "MRN",
      identifierValue: "MRN-100245",
      assigningAuthority: "Northstar",
    },
  });

  const study = await prisma.study.upsert({
    where: {
      studyInstanceUid: "1.2.840.10008.1001.1",
    },
    update: {},
    create: {
      organizationId: organization.id,
      facilityId: facility.id,
      patientId: patient.id,
      studyInstanceUid: "1.2.840.10008.1001.1",
      accessionNumber: "ACC-CT-24019",
      studyDescription: "CT Chest With Contrast",
      modalitySummary: "CT",
      status: StudyStatus.RECEIVED,
    },
  });
  const series1 = await prisma.series.upsert({
    where: {
      seriesInstanceUid: "1.2.840.10008.1001.1.1",
    },
    update: {},
    create: {
      studyId: study.id,
      seriesInstanceUid: "1.2.840.10008.1001.1.1",
      modality: "CT",
      description: "Axial Lung",
      seriesNumber: 1,
    },
  });

  const series2 = await prisma.series.upsert({
    where: {
      seriesInstanceUid: "1.2.840.10008.1001.1.2",
    },
    update: {},
    create: {
      studyId: study.id,
      seriesInstanceUid: "1.2.840.10008.1001.1.2",
      modality: "CT",
      description: "Coronal Soft Tissue",
      seriesNumber: 2,
    },
  });

    await prisma.instance.upsert({
      where: {
        sopInstanceUid: "1.2.840.10008.1001.1.1.1",
      },
      update: {},
      create: {
        seriesId: series1.id,
        sopInstanceUid: "1.2.840.10008.1001.1.1.1",
        instanceNumber: 1,
        sopClassUid: "1.2.840.10008.5.1.4.1.1.2",
      },
    });

    await prisma.instance.upsert({
      where: {
        sopInstanceUid: "1.2.840.10008.1001.1.1.2",
      },
      update: {},
      create: {
        seriesId: series1.id,
        sopInstanceUid: "1.2.840.10008.1001.1.1.2",
        instanceNumber: 2,
        sopClassUid: "1.2.840.10008.5.1.4.1.1.2",
      },
    });

    await prisma.instance.upsert({
      where: {
        sopInstanceUid: "1.2.840.10008.1001.1.2.1",
      },
      update: {},
      create: {
        seriesId: series2.id,
        sopInstanceUid: "1.2.840.10008.1001.1.2.1",
        instanceNumber: 1,
        sopClassUid: "1.2.840.10008.5.1.4.1.1.2",
      },
    });

  await prisma.report.create({
    data: {
      studyId: study.id,
      authorUserId: user.id,
      status: ReportStatus.DRAFT,
      content: {
        impression: "No acute cardiopulmonary finding.",
      },
    },
  }).catch(() => undefined);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
