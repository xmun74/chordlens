import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { extractChords } from "../api/extractChord";
import { resultsQueryKey } from "@/features/list-results";
import type { ChordResult } from "@/shared/model";
import type { ExtractStatus } from "./types";

interface UseExtractChordReturn {
  mutate: (url: string) => void;
  reset: () => void;
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  data: ChordResult | undefined;
  error: Error | null;
  /** 파이프라인 단계별 상태 */
  pipelineStatus: ExtractStatus;
  /** 진행률 0~100 */
  progress: number;
}

export function useExtractChord(): UseExtractChordReturn {
  const [pipelineStatus, setPipelineStatus] = useState<ExtractStatus>("idle");
  const [progress, setProgress] = useState(0);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const router = useRouter();
  const queryClient = useQueryClient();

  const clearTimers = () => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
  };

  const mutation = useMutation<ChordResult, Error, string>({
    mutationFn: (youtubeUrl: string) => extractChords(youtubeUrl),

    onMutate: () => {
      clearTimers();
      timerRefs.current.push(
        setTimeout(() => {
          setPipelineStatus("extracting");
          setProgress(10);
        }, 200),
        setTimeout(() => setProgress(30), 800),
        setTimeout(() => {
          setPipelineStatus("recognizing");
          setProgress(50);
        }, 1200),
        setTimeout(() => setProgress(68), 1800),
        setTimeout(() => setProgress(78), 2200),
        setTimeout(() => {
          setPipelineStatus("done");
          setProgress(90);
        }, 2700),
        setTimeout(() => setProgress(100), 3400),
      );
    },

    onSuccess: (data) => {
      clearTimers();
      if (data.cached) {
        setPipelineStatus("idle");
        setProgress(0);
      } else {
        setPipelineStatus("done");
        setProgress(100);
      }
      void router.push(`/result/${data.id}`);
      queryClient.invalidateQueries({ queryKey: resultsQueryKey, refetchType: "all" });
    },

    onError: () => {
      clearTimers();
      setPipelineStatus("error");
      setProgress(0);
    },
  });

  return {
    mutate: mutation.mutate,
    reset: () => {
      clearTimers();
      setPipelineStatus("idle");
      setProgress(0);
      mutation.reset();
    },
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    error: mutation.error,
    pipelineStatus,
    progress,
  };
}
