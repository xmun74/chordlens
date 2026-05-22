const YOUTUBE_VIDEO_ID_REGEX = /^[\w-]{11}$/;
const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com"]);
const SHORT_YOUTUBE_HOSTS = new Set(["youtu.be", "www.youtu.be"]);

export function isValidYouTubeUrl(url: string): boolean {
  return extractVideoId(url) !== null;
}

export function extractVideoId(url: string): string | null {
  const value = url.trim();
  if (!value) return null;

  try {
    const parsed = new URL(value.match(/^https?:\/\//i) ? value : `https://${value}`);
    const host = parsed.hostname.toLowerCase();

    if (YOUTUBE_HOSTS.has(host) && parsed.pathname === "/watch") {
      const videoId = parsed.searchParams.get("v");
      return videoId && YOUTUBE_VIDEO_ID_REGEX.test(videoId) ? videoId : null;
    }

    if (SHORT_YOUTUBE_HOSTS.has(host)) {
      const videoId = parsed.pathname.split("/").filter(Boolean)[0];
      return videoId && YOUTUBE_VIDEO_ID_REGEX.test(videoId) ? videoId : null;
    }
  } catch {
    return null;
  }

  return null;
}
