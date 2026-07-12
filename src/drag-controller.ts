import type { EditRecord, Snapshot } from './types';
import type { History } from './history';
import type { Overlay } from './overlay';
import { computeSnap } from './snap';
import { applyRecord } from './apply';

const DRAG_THRESHOLD = 3;

interface DragItem {
  rec: EditRecord;
  before: Snapshot;
  baseDx: number;
  baseDy: number;
}

interface DragState {
  els: HTMLElement[];
  startX: number;
  startY: number;
  items: DragItem[] | null;
  moved: boolean;
  downTarget: HTMLElement;
}

export interface DragEnd {
  moved: boolean;
  downTarget: HTMLElement;
}

export class DragController {
  private state: DragState | null = null;

  constructor(
    private history: History,
    private overlay: Overlay,
    private snapThreshold: number
  ) {}

  get active(): boolean {
    return this.state !== null;
  }

  /** arm a potential drag; it becomes real once the pointer travels past the threshold */
  start(e: PointerEvent, els: HTMLElement[], downTarget: HTMLElement): void {
    this.state = {
      els,
      startX: e.clientX,
      startY: e.clientY,
      items: null,
      moved: false,
      downTarget,
    };
  }

  move(e: PointerEvent): void {
    const d = this.state!;
    const rawDx = e.clientX - d.startX;
    const rawDy = e.clientY - d.startY;
    if (!d.moved) {
      if (Math.hypot(rawDx, rawDy) < DRAG_THRESHOLD) return;
      d.moved = true;
      d.items = d.els.map((el) => {
        const rec = this.history.ensure(el);
        return { rec, before: this.history.snapshot(rec), baseDx: rec.dx, baseDy: rec.dy };
      });
      document.documentElement.style.cursor = 'move';
    }
    const items = d.items!;

    if (items.length === 1) {
      const { rec, baseDx, baseDy } = items[0];
      let dx = baseDx + rawDx;
      let dy = baseDy + rawDy;

      // snap against siblings/parent using the proposed (un-snapped) rect
      const cur = d.els[0].getBoundingClientRect();
      const proposed = {
        left: cur.left + (dx - rec.dx),
        top: cur.top + (dy - rec.dy),
        width: cur.width,
        height: cur.height,
      };
      const snap = computeSnap(d.els[0], proposed, this.snapThreshold);
      dx += snap.adjX;
      dy += snap.adjY;
      this.overlay.setGuides(snap.guideV, snap.guideH);

      rec.dx = dx;
      rec.dy = dy;
      rec.moved = true;
      applyRecord(rec);
    } else {
      // multi-select: move the whole group by the same raw delta, no snapping
      this.overlay.setGuides(null, null);
      for (const { rec, baseDx, baseDy } of items) {
        rec.dx = baseDx + rawDx;
        rec.dy = baseDy + rawDy;
        rec.moved = true;
        applyRecord(rec);
      }
    }
  }

  /** commit the gesture on release; the caller decides what a no-movement click means */
  end(): DragEnd | null {
    const d = this.state;
    if (!d) return null;
    this.state = null;
    this.overlay.setGuides(null, null);
    document.documentElement.style.cursor = '';
    if (d.moved && d.items) {
      this.history.commitBatch(d.items.map(({ rec, before }) => ({ rec, before })));
    }
    return { moved: d.moved, downTarget: d.downTarget };
  }

  cancel(): void {
    this.state = null;
  }
}
