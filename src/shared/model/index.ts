export interface ChordEntry {
  time: string; // "0:12"
  chord: string; // "Am"
}

export interface ChordResult {
  id: string;
  title: string;
  channelName: string;
  thumbnailUrl: string;
  tempo?: number;
  key?: string;
  chords: ChordEntry[];
}

export type ExtractStatus = "idle" | "extracting" | "recognizing" | "done" | "error";

export interface VideoMeta {
  title: string;
  thumbnailUrl: string;
  channelName: string;
}
