"use client";

import { useEffect } from "react";
import { recordHistory } from "@/lib/storage/history";

export function WatchHistoryRecorder({
  id,
  title,
  image,
}: {
  id: number;
  title: string;
  image: string;
}) {
  useEffect(() => {
    recordHistory({ id, title, image, progress: 0 });
  }, [id, title, image]);

  return null;
}
