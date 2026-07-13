import type { EditRecord, Snapshot } from './types';
import type { Dir } from './overlay';
import type { History } from './history';
import { applyRecord } from './apply';

interface ResizeState {
  rec: EditRecord;
  before: Snapshot;
  dir: Dir;
  startX: number;
  startY: number;
  startW: number;
  startH: number;
  baseDx: number;
  baseDy: number;
}

export class ResizeController {
  private state: ResizeState | null = null;

  constructor(private history: History) {}

  get active(): boolean {
    return this.state !== null;
  }

  start(dir: Dir, e: PointerEvent, el: HTMLElement): void {
    e.preventDefault();
    e.stopPropagation();
    const rec = this.history.ensure(el);
    const r = el.getBoundingClientRect();
    this.state = {
      rec,
      before: this.history.snapshot(rec),
      dir,
      startX: e.clientX,
      startY: e.clientY,
      startW: r.width,
      startH: r.height,
      baseDx: rec.dx,
      baseDy: rec.dy,
    };
  }

  move(e: PointerEvent): void {
    const rs = this.state!;
    const { rec, dir } = rs;
    const ddx = e.clientX - rs.startX;
    const ddy = e.clientY - rs.startY;

    let w = rs.startW;
    let h = rs.startH;
    if (dir.includes('e')) w = rs.startW + ddx;
    if (dir.includes('w')) w = rs.startW - ddx;
    if (dir.includes('s')) h = rs.startH + ddy;
    if (dir.includes('n')) h = rs.startH - ddy;

    // Shift keeps the aspect ratio, Figma-style, on corner AND edge handles
    if (e.shiftKey && rs.startH > 0 && rs.startW > 0) {
      const ratio = rs.startW / rs.startH;
      if (dir === 'e' || dir === 'w') h = w / ratio;
      else if (dir === 'n' || dir === 's') w = h * ratio;
      else if (Math.abs(ddx) > Math.abs(ddy)) h = w / ratio;
      else w = h * ratio;
    }
    w = Math.max(8, Math.round(w));
    h = Math.max(8, Math.round(h));

    // keep the opposite edge fixed when resizing from the north/west side
    rec.dx = dir.includes('w') ? rs.baseDx + (rs.startW - w) : rs.baseDx;
    rec.dy = dir.includes('n') ? rs.baseDy + (rs.startH - h) : rs.baseDy;
    if (rec.dx !== rs.baseDx || rec.dy !== rs.baseDy) rec.moved = true;

    rec.size = { w, h };
    rec.resized = true;
    applyRecord(rec);
  }

  end(): void {
    const rs = this.state;
    if (!rs) return;
    this.state = null;
    document.documentElement.style.cursor = '';
    this.history.commit(rs.rec, rs.before);
  }

  cancel(): void {
    this.state = null;
  }
}
