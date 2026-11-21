import "server-only";

import { fetchBackend } from "./api";

export type Listing = {
  id: string;
  title: string;
  category: string;
  priceMinor: number;
  imageUrl?: string;
  location?: string;
  vendor: { name: string };
};

export async function readCatalog(query: URLSearchParams) {
  try {
    const response = await fetchBackend(`/api/services?${query}`, {
      cache: "no-store", redirect: "error", signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    return (await response.json()) as { services: Listing[]; hasNext: boolean };
  } catch {
    return null;
  }
}
