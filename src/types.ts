export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface EditRecord {
  id: number;
  el: HTMLElement;
  selector: string;
  tag: string;
  /** page-coordinate rect before the first edit */
  originalRect: Rect;
  /** inline style values before we touched them, used for revert */
  savedInline: {
    transform: string;
    width: string;
    height: string;
    display: string;
  };
  /** computed transform at first edit ('none' or a matrix) */
  baseTransform: string;
  /** computed display at first edit, to upgrade inline -> inline-block on resize */
  baseDisplay: string;
  /** subtracted from border-box size when the element is content-box */
  sizeAdj: { w: number; h: number };
  dx: number;
  dy: number;
  moved: boolean;
  resized: boolean;
  deleted: boolean;
  startSize: { w: number; h: number };
  size: { w: number; h: number };
  /** SVG data-URL thumbnail captured before the first edit */
  beforeSnap: string | null;
  /** original text, only for pure-text elements (no element children) */
  savedText: string | null;
  /** edited text; null = unchanged */
  text: string | null;
  /** panel-edited CSS properties (property -> new value) */
  props: Record<string, string>;
  /** original inline values of panel-edited properties, saved lazily on first touch */
  savedProps: Record<string, string>;
}

/** value snapshot of a record's mutable state, for the undo/redo stack */
export interface Snapshot {
  dx: number;
  dy: number;
  size: { w: number; h: number };
  moved: boolean;
  resized: boolean;
  deleted: boolean;
  props: Record<string, string>;
  text: string | null;
}

export interface SidetationOptions {
  /** activate edit mode immediately after init (default false) */
  autoStart?: boolean;
  /** snap distance in px for alignment guides (default 6) */
  snapThreshold?: number;
}
