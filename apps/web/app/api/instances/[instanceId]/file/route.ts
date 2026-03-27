import { NextRequest } from "next/server";
import { getInternalApiBaseUrl } from "../../../../../lib/api";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ instanceId: string }> },
) {
  const { instanceId } = await context.params;
  const response = await fetch(
    `${getInternalApiBaseUrl()}/api/instances/${encodeURIComponent(instanceId)}/file`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return new Response("Failed to fetch instance file.", {
      status: response.status,
    });
  }

  return new Response(response.body, {
    status: response.status,
    headers: {
      "content-type":
        response.headers.get("content-type") ?? "application/dicom",
    },
  });
}

