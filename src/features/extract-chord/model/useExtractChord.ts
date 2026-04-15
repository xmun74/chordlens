import { useMutation } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { extractChords } from "../api/extractChord";
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
      // 200ms 후에도 응답이 없으면 캐시 미스 → 로딩 애니메이션 시작
      // 캐시 히트는 200ms 내에 onSuccess가 타이머를 모두 취소함
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
        // 캐시 히트: 상태를 idle로 유지 → LoadingState가 노출되지 않음
        setPipelineStatus("idle");
        setProgress(0);
      } else {
        setPipelineStatus("done");
        setProgress(100);
      }
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
