import { useMutation } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { extractChords } from "../api/extractChord";
import type { ChordResult, ExtractStatus } from "@/shared/model";

interface UseExtractChordReturn {
  mutate: (url: string) => void;
  reset: () => void;
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  data: ChordResult | undefined;
  error: Error | null;
  /** 현재 파이프라인 단계 */
  pipelineStatus: ExtractStatus;
  /** 진행률 0~100 */
  progress: number;
}

export function useExtractChord(): UseExtractChordReturn {
  const [pipelineStatus, setPipelineStatus] = useState<ExtractStatus>("idle");
  const [progress, setProgress] = useState(0);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
  };

  const mutation = useMutation<ChordResult, Error, string>({
    mutationFn: (youtubeUrl: string) => extractChords(youtubeUrl),

    onMutate: () => {
      clearTimers();
      // 단계 1: Extracting Audio (0~1.0초)
      setPipelineStatus("extracting");
      setProgress(10);

      timerRefs.current.push(
        setTimeout(() => setProgress(30), 600),
        // 단계 2: Analyzing Chords (1.0~2.5초)
        setTimeout(() => {
          setPipelineStatus("recognizing");
          setProgress(50);
        }, 1000),
        setTimeout(() => setProgress(68), 1600),
        setTimeout(() => setProgress(78), 2000),
        // 단계 3: Finalizing Tab (2.5~3.5초)
        setTimeout(() => {
          setPipelineStatus("done");
          setProgress(90);
        }, 2500),
        setTimeout(() => setProgress(100), 3200),
      );
    },

    onSuccess: () => {
      clearTimers();
      setPipelineStatus("done");
      setProgress(100);
    },

    onError: (error) => {
      clearTimers();
      setPipelineStatus("error");
      setProgress(0);
      console.error("코드 추출 실패:", error);
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
