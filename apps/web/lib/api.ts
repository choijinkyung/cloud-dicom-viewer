const defaultApiHostport = process.env.API_HOSTPORT ?? "localhost:4000";

export function getInternalApiBaseUrl() {
  if (process.env.INTERNAL_API_BASE_URL) {
    return process.env.INTERNAL_API_BASE_URL;
  }

  return `http://${defaultApiHostport}`;
}

