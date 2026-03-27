import type { ServerResponse } from "node:http";
import { appName } from "@dicom-viewer/shared";
import { sendJson } from "../lib/http";
import { getWorklistItems } from "../services/worklist-service";

export async function handleWorklistRoute(response: ServerResponse) {
  const items = await getWorklistItems();

  sendJson(response, 200, {
    appName,
    items,
  });
}
