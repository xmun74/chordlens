"use client";

import { useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { incrementResultView } from "@/entities/result";

interface Props {
  id: string;
  title: string;
}

export function ViewTracker({ id, title }: Props) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      sendGAEvent("event", "result_view", { result_id: id, title });
    }
    void incrementResultView(id);
  }, [id, title]);

  return null;
}
