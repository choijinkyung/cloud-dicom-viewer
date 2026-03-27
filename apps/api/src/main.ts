import { createServer, IncomingMessage } from "node:http";
import { sendJson } from "./lib/http";
import { handleStudyDetailRoute } from "./routes/studies";
import { handleWorklistRoute } from "./routes/worklist";
import { fetchOrthancInstanceFile } from "./services/orthanc-service";

const port = Number(process.env.PORT ?? 4000);
const defaultWebOrigin = process.env.WEB_ORIGIN ?? "http://localhost:3000";

function getAllowedOrigin(request: IncomingMessage) {
  return request.headers.origin ?? defaultWebOrigin;
}

const server = createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    const allowedOrigin = getAllowedOrigin(request);
    response.writeHead(204, {
      "access-control-allow-origin": allowedOrigin,
      "access-control-allow-methods": "GET,OPTIONS",
      "access-control-allow-headers": "Content-Type",
      vary: "Origin",
    });
    response.end();
    return;
  }

  if (request.url === "/health") {
    sendJson(response, 200, { ok: true, service: "api" });
    return;
  }

  if (request.url === "/api/worklist") {
    await handleWorklistRoute(response);
    return;
  }

  const instanceFileMatch = request.url?.match(
    /^\/api\/instances\/([^/]+)\/file$/,
  );

  if (instanceFileMatch) {
    const instanceId = decodeURIComponent(instanceFileMatch[1]);

    try {
      const orthancResponse = await fetchOrthancInstanceFile(instanceId);
      const arrayBuffer = await orthancResponse.arrayBuffer();
      const allowedOrigin = getAllowedOrigin(request);

      response.writeHead(200, {
        "content-type": "application/dicom",
        "access-control-allow-origin": allowedOrigin,
        "access-control-allow-methods": "GET,OPTIONS",
        "access-control-allow-headers": "Content-Type",
        vary: "Origin",
      });
      response.end(Buffer.from(arrayBuffer));
    } catch (error) {
      console.error("Failed to proxy Orthanc instance file", error);
      response.writeHead(500, { "content-type": "application/json" });
      response.end(
        JSON.stringify({ message: "Failed to fetch instance file." }),
      );
    }

    return;
  }

  const studyMatch = request.url?.match(/^\/api\/studies\/(.+)$/);

  if (studyMatch) {
    const studyInstanceUid = decodeURIComponent(studyMatch[1]);
    await handleStudyDetailRoute(response, studyInstanceUid);
    return;
  }

  sendJson(response, 200, {
    ok: true,
    message: "Cloud DICOM Viewer API scaffold is running.",
  });
});

server.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
