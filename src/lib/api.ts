import "server-only";

export function fetchBackend(path: string, options?: RequestInit) {
  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl) {
    throw new Error("API_BASE_URL is required");
  }

  return fetch(new URL(path, baseUrl), options);
}

export function postBackendAuth(path: string, options: { body?: object; cookie?: string } = {}) {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) throw new Error("API_BASE_URL is required");

  const headers = new Headers({ origin: new URL(baseUrl).origin });
  if (options.cookie) headers.set("cookie", options.cookie);
  if (options.body) headers.set("content-type", "application/json");

  return fetchBackend(path, {
    method: "POST",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
    redirect: "error",
  });
}
