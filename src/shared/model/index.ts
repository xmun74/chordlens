export interface ChordEntry {
  time: string;
  chord: string;
  fret?: number;
  voicing?: "open" | "barre";
  // 실제 운지 데이터 (chords-db). 백엔드가 전달하면 다이어그램을 그대로 렌더한다.
  // frets/fingers: 6현(저음 E현→고음 e현 순), -1=뮤트, 0=개방. base_fret: 시작 프렛.
  // barres: 바레가 걸리는(base_fret 상대) 프렛 목록. 구 캐시 데이터에는 없을 수 있다.
  frets?: number[];
  fingers?: number[];
  base_fret?: number;
  barres?: number[];
}

export interface LyricLine {
  time: string; // "0:12" — 해당 가사가 시작되는 시간
  text: string; // 가사 한 줄
}

export interface ChordResult {
  cached: boolean;
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
