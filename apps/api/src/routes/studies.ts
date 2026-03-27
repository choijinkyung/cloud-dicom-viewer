import type { ServerResponse } from "node:http";
import { sendJson } from "../lib/http";
import { getStudyByInstanceUid } from "../services/worklist-service";

export async function handleStudyDetailRoute(
  response: ServerResponse,
  studyInstanceUid: string,
) {
  const study = await getStudyByInstanceUid(studyInstanceUid);

  if (!study) {
    sendJson(response, 404, { message: "Study not found." });
    return;
  }

  sendJson(response, 200, study);
}
