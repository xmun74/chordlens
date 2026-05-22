export function getApiBaseUrl(): URL | null {
  const rawUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    url.pathname = url.pathname.replace(/\/+$/, "");
    url.search = "";
    url.hash = "";
    return url;
  } catch {
    return null;
  }
}

export function buildUpstreamUrl(
  baseUrl: URL,
  path: string,
  searchParams?: URLSearchParams,
): string {
  const url = new URL(baseUrl.href);
  const basePath = url.pathname.replace(/\/+$/, "");
  const nextPath = path.replace(/^\/+/, "");

  url.pathname = `${basePath}/${nextPath}`;
  url.search = searchParams?.toString() ?? "";

  return url.toString();
}
