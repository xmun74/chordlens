interface ResultListErrorProps {
  error: Error;
  reset: () => void;
}

export function ResultListError({ error, reset }: ResultListErrorProps): React.JSX.Element {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-900/20 px-6 py-4 flex items-center justify-between">
      <p className="font-sans text-sm text-red-400">
        {error?.message ?? "목록을 불러오지 못했습니다."}
      </p>
      <button
        onClick={reset}
        className="font-sans text-sm font-semibold text-red-300 hover:text-red-200 underline"
      >
        다시 시도
      </button>
    </div>
  );
}
