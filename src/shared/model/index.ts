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
