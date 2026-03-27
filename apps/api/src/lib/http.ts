import type { ServerResponse } from "node:http";

export function sendJson(
  response: ServerResponse,
  statusCode: number,
  payload: unknown,
) {
  response.writeHead(statusCode, { "content-type": "application/json" });
  response.end(JSON.stringify(payload));
}
