import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// Same-origin proxy for PocketBase files. The server (which can reach
// POCKETBASE_URL) streams them; the browser only ever talks to this origin.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const pocketBaseUrl = process.env.POCKETBASE_URL;
  if (!pocketBaseUrl) {
    return new Response("PocketBase is not configured", { status: 500 });
  }

  const { path } = await params;
  const isFile =
    path.length === 3 && path.every((s) => s && s !== "." && s !== "..");
  if (!isFile) {
    return new Response("Not found", { status: 404 });
  }

  const target = new URL(
    `/api/files/${path.map(encodeURIComponent).join("/")}`,
    pocketBaseUrl,
  );
  target.search = request.nextUrl.search;

  const requestHeaders = new Headers();
  for (const name of ["range", "if-modified-since", "if-none-match"]) {
    const value = request.headers.get(name);
    if (value) requestHeaders.set(name, value);
  }

  const response = await fetch(target, {
    headers: requestHeaders,
    cache: "no-store",
  });

  const responseHeaders = new Headers();
  for (const name of [
    "accept-ranges",
    "cache-control",
    "content-disposition",
    "content-length",
    "content-range",
    "content-type",
    "etag",
    "last-modified",
  ]) {
    const value = response.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}
