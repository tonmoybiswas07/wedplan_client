import { fetchBackend } from "@/lib/api";

export async function GET() {
  try {
    const upstream = await fetchBackend("/api/health", { cache: "no-store" });
    const body: unknown = await upstream.json();

    return Response.json(body, { status: upstream.status });
  } catch {
    return Response.json({ error: "Backend unavailable" }, { status: 502 });
  }
}
