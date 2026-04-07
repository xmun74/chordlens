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

  export interface ChordConfig {
    chord: [number, number][];
    position?: number;
    barres?: BarreConfig[];
    tuning?: string[];
  }

  export class ChordBox {
    constructor(container: HTMLElement, options?: ChordBoxOptions);
    draw(config: ChordConfig): void;
  }
}
