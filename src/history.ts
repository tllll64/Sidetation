import type { EditRecord, Snapshot } from './types';
import { generateSelector } from './selector';
import { applyRecord } from './apply';

interface Action {
  rec: EditRecord;
  before: Snapshot;
  after: Snapshot;
  /** consecutive coalescable actions (keyboard nudges) merge into one step */
  coalesce: boolean;
  at: number;
}

const COALESCE_MS = 800;

function isPristine(s: { moved: boolean; resized: boolean; deleted: boolean }): boolean {
  return !s.moved && !s.resized && !s.deleted;
}

function sameSnap(a: Snapshot, b: Snapshot): boolean {
  return (
    a.dx === b.dx &&
    a.dy === b.dy &&
    a.size.w === b.size.w &&
    a.size.h === b.size.h &&
    a.moved === b.moved &&
    a.resized === b.resized &&
    a.deleted === b.deleted
  );
}

const PRISTINE: Omit<Snapshot, 'size'> = {
  dx: 0,
  dy: 0,
  moved: false,
  resized: false,
  deleted: false,
};

/**
 * One record per touched element (consolidated view for export/panel), plus
 * a gesture-level undo/redo stack on top: every finished gesture commits a
 * before/after snapshot.
 */
export class History {
  private records = new Map<HTMLElement, EditRecord>();
  private undoStack: Action[] = [];
  private redoStack: Action[] = [];
  private seq = 1;
  onChange: (() => void) | null = null;

  ensure(el: HTMLElement): EditRecord {
    let rec = this.records.get(el);
    if (rec) return rec;

    const rect = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const contentBox = cs.boxSizing === 'content-box';
    const px = (v: string) => parseFloat(v) || 0;

    rec = {
      id: this.seq++,
      el,
      selector: generateSelector(el),
      tag: el.tagName.toLowerCase(),
      originalRect: {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        w: rect.width,
        h: rect.height,
      },
      savedInline: {
        transform: el.style.getPropertyValue('transform'),
        width: el.style.getPropertyValue('width'),
        height: el.style.getPropertyValue('height'),
        display: el.style.getPropertyValue('display'),
      },
      baseTransform: cs.transform,
      baseDisplay: cs.display,
      sizeAdj: contentBox
        ? {
            w: px(cs.paddingLeft) + px(cs.paddingRight) + px(cs.borderLeftWidth) + px(cs.borderRightWidth),
            h: px(cs.paddingTop) + px(cs.paddingBottom) + px(cs.borderTopWidth) + px(cs.borderBottomWidth),
          }
        : { w: 0, h: 0 },
      dx: 0,
      dy: 0,
      moved: false,
      resized: false,
      deleted: false,
      startSize: { w: rect.width, h: rect.height },
      size: { w: rect.width, h: rect.height },
    };
    this.records.set(el, rec);
    return rec;
  }

  get(el: HTMLElement): EditRecord | undefined {
    return this.records.get(el);
  }

  all(): EditRecord[] {
    return Array.from(this.records.values());
  }

  snapshot(rec: EditRecord): Snapshot {
    return {
      dx: rec.dx,
      dy: rec.dy,
      size: { ...rec.size },
      moved: rec.moved,
      resized: rec.resized,
      deleted: rec.deleted,
    };
  }

  /** finish a gesture: normalize, push onto the undo stack, re-render */
  commit(rec: EditRecord, before: Snapshot, opts?: { coalesce?: boolean }): void {
    if (rec.dx === 0 && rec.dy === 0) rec.moved = false; // dragged back to start = no move
    applyRecord(rec);
    const after = this.snapshot(rec);
    if (sameSnap(before, after)) {
      this.cleanup(rec);
      this.emit();
      return;
    }
    const last = this.undoStack[this.undoStack.length - 1];
    if (opts?.coalesce && last?.coalesce && last.rec === rec && Date.now() - last.at < COALESCE_MS) {
      last.after = after;
      last.at = Date.now();
    } else {
      this.undoStack.push({ rec, before, after, coalesce: !!opts?.coalesce, at: Date.now() });
    }
    this.redoStack.length = 0;
    this.cleanup(rec);
    this.emit();
  }

  undo(): boolean {
    const a = this.undoStack.pop();
    if (!a) return false;
    this.applySnap(a.rec, a.before);
    this.redoStack.push(a);
    this.emit();
    return true;
  }

  redo(): boolean {
    const a = this.redoStack.pop();
    if (!a) return false;
    this.applySnap(a.rec, a.after);
    this.undoStack.push(a);
    this.emit();
    return true;
  }

  /** panel revert: back to pristine, as an undoable action */
  revert(id: number): void {
    const rec = this.all().find((r) => r.id === id);
    if (!rec) return;
    const before = this.snapshot(rec);
    this.applySnap(rec, { ...PRISTINE, size: { ...rec.startSize } });
    this.undoStack.push({
      rec,
      before,
      after: this.snapshot(rec),
      coalesce: false,
      at: Date.now(),
    });
    this.redoStack.length = 0;
    this.emit();
  }

  resetAll(): void {
    for (const rec of this.all()) this.revert(rec.id);
  }

  private applySnap(rec: EditRecord, s: Snapshot): void {
    rec.dx = s.dx;
    rec.dy = s.dy;
    rec.size = { ...s.size };
    rec.moved = s.moved;
    rec.resized = s.resized;
    rec.deleted = s.deleted;
    applyRecord(rec);
    this.cleanup(rec);
  }

  /** keep the consolidated map in sync: pristine records drop out, edited ones stay */
  private cleanup(rec: EditRecord): void {
    if (isPristine(rec)) this.records.delete(rec.el);
    else this.records.set(rec.el, rec);
  }

  /** drop records that were ensure()d but never turned into a real edit */
  prune(): void {
    for (const [el, rec] of this.records) {
      if (isPristine(rec)) this.records.delete(el);
    }
  }

  emit(): void {
    this.onChange?.();
  }
}
