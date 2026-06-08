declare module "vexchords" {
  export interface ChordBoxOptions {
    width?: number;
    height?: number;
    strokeColor?: string;
    textColor?: string;
    stringColor?: string;
    fretColor?: string;
    labelColor?: string;
    bgColor?: string;
    fontFamily?: string;
    fontSize?: number;
    numFrets?: number;
    numStrings?: number;
    showTuning?: boolean;
    bridgeColor?: string;
  }

  export interface BarreConfig {
    fret: number;
    fromString: number;
    toString: number;
  }

  // chord: [string, fret, label?]
  //   string: 1=high e … 6=low E
  //   fret: 0=open, "x"=muted, n=fret (position 기준 상대)
  //   label: 손가락 번호/표시 (number 또는 string)
  export interface ChordConfig {
    chord: [number, number | "x", (number | string)?][];
    position?: number;
    barres?: BarreConfig[];
    tuning?: string[];
  }

  export class ChordBox {
    constructor(container: HTMLElement, options?: ChordBoxOptions);
    draw(config: ChordConfig): void;
  }
}
