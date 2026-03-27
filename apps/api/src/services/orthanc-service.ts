const orthancUrl = process.env.ORTHANC_URL ?? "http://localhost:8042";
const orthancUsername = process.env.ORTHANC_USERNAME ?? "orthanc";
const orthancPassword = process.env.ORTHANC_PASSWORD ?? "orthanc";

function getAuthHeader() {
  const token = Buffer.from(`${orthancUsername}:${orthancPassword}`).toString(
    "base64",
  );
  return `Basic ${token}`;
}

export async function findOrthancStudyByStudyInstanceUid(
  studyInstanceUid: string,
) {
  const response = await fetch(`${orthancUrl}/tools/find`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: getAuthHeader(),
    },
    body: JSON.stringify({
      Level: "Study",
      Query: {
        StudyInstanceUID: studyInstanceUid,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to query Orthanc.");
  }

  const data = (await response.json()) as string[];
  return data[0] ?? null;
}

export async function getOrthancStudyDetailByStudyInstanceUid(
  studyInstanceUid: string,
) {
  const orthancStudyId =
    await findOrthancStudyByStudyInstanceUid(studyInstanceUid);

  if (!orthancStudyId) {
    return null;
  }

  const response = await fetch(`${orthancUrl}/studies/${orthancStudyId}`, {
    headers: {
      authorization: getAuthHeader(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Orthanc study detail.");
  }

  const data = await response.json();
  return data;
}

export async function getOrthancSeriesDetail(seriesId: string) {
  const response = await fetch(`${orthancUrl}/series/${seriesId}`, {
    headers: {
      authorization: getAuthHeader(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Orthanc series detail.");
  }

  const data = await response.json();
  return data;
}

export async function fetchOrthancInstanceFile(instanceId: string) {
  const response = await fetch(`${orthancUrl}/instances/${instanceId}/file`, {
    headers: {
      authorization: getAuthHeader(),
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Orthanc instance file: ${response.status}`,
    );
  }

  return response;
}
