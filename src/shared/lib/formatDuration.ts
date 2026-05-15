export function formatDuration(totalSeconds: number | null | undefined): string | null {
  if (totalSeconds == null) return null;
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return null;
  const s = Math.floor(totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
