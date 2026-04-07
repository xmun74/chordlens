export const YOUTUBE_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/;

export function isValidYouTubeUrl(url: string): boolean {
  return YOUTUBE_REGEX.test(url.trim());
}

export function extractVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  return match ? match[1] : null;
}
