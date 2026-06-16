export function PopularListSkeleton(): React.JSX.Element {
  return (
    <div className="grid grid-flow-col grid-rows-[repeat(2,auto)] auto-cols-[11rem] gap-4 overflow-hidden sm:auto-cols-[14rem]">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="aspect-square w-full animate-pulse rounded-lg bg-bg-card/40" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-bg-card/40" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-bg-card/40" />
        </div>
      ))}
    </div>
  );
}
