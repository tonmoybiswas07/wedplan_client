import "server-only";

export function fetchBackend(path: string, options?: RequestInit) {
  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl) {
    throw new Error("API_BASE_URL is required");
  }

  return fetch(new URL(path, baseUrl), options);
}
