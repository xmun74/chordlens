interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 48, className = "" }: SpinnerProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="로딩 중"
    >
      {/* Outer dim ring */}
      <span
        className="absolute inset-0 rounded-full border-2 border-accent-light/20"
        style={{ width: size, height: size }}
      />
      {/* Spinning gradient ring */}
      <span
        className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent-light"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
