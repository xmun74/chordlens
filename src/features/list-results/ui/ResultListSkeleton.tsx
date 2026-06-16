export function ResultListSkeleton(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-20 animate-pulse rounded-xl bg-bg-card/40" />
      ))}
    </div>
  );
}
