export interface ChordEntry {
  time: string; // "0:12"
  chord: string; // "Am"
}

export interface LyricLine {
  time: string; // "0:12" — 해당 가사가 시작되는 시간
  text: string; // 가사 한 줄
}

export interface ChordResult {
  id: string;
  videoId: string;
  title: string;
  channelName: string;
  thumbnailUrl: string;
  tempo?: number;
  key?: string;
  chords: ChordEntry[];
  lyrics?: LyricLine[]; // 가사 (백엔드 지원 시 포함)
}
