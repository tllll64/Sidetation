import type { EditRecord, SidetationOptions, Snapshot } from './types';
import { Overlay, type Dir } from './overlay';
import { History } from './history';
import { Toolbar } from './toolbar';
import { computeSnap } from './snap';
import { shortLabel } from './selector';
import { toMarkdown, toCSS } from './export';
import { applyRecord } from './apply';

export type { SidetationOptions, EditRecord } from './types';

const DRAG_THRESHOLD = 3;

interface DragState {
  el: HTMLElement;
  startX: number;
  startY: number;
  rec: EditRecord | null;
  before: Snapshot | null;
  baseDx: number;
  baseDy: number;
  moved: boolean;
  downTarget: HTMLElement;
}

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

export class Sidetation {
  private overlay = new Overlay();
  private history = new History();
  private toolbar: Toolbar;
  private opts: Required<SidetationOptions>;

  private active = false;
  private hovered: HTMLElement | null = null;
  private selected: HTMLElement | null = null;
  private drag: DragState | null = null;
  private resize: ResizeState | null = null;
  private rafId = 0;
  private savedUserSelect = '';

  constructor(options: SidetationOptions = {}) {
    this.opts = { autoStart: false, snapThreshold: 6, ...options };
    this.toolbar = new Toolbar(this.overlay.toolbarEl, this.overlay.panelEl, {
      onToggle: () => (this.active ? this.deactivate() : this.activate()),
      onCopyMd: () => this.copy(toMarkdown(this.history.all()), '已复制 Markdown'),
      onCopyCss: () => this.copy(toCSS(this.history.all()), '已复制 CSS'),
      onReset: () => this.history.resetAll(),
      onRevert: (id) => this.history.revert(id),
    });
    this.history.onChange = () => this.syncUI();
    this.overlay.onHandleDown = (dir, e) => this.startResize(dir, e);
    this.syncUI();
    if (this.opts.autoStart) this.activate();
  }

  // ---------- lifecycle ----------

  activate(): void {
    if (this.active) return;
    this.active = true;
    this.savedUserSelect = document.documentElement.style.userSelect;
    document.documentElement.style.userSelect = 'none';
    window.addEventListener('pointermove', this.onPointerMove, true);
    window.addEventListener('pointerdown', this.onPointerDown, true);
    window.addEventListener('pointerup', this.onPointerUp, true);
    window.addEventListener('pointercancel', this.onPointerUp, true);
    window.addEventListener('click', this.blockEvent, true);
    window.addEventListener('keydown', this.onKeyDown, true);
    this.rafId = requestAnimationFrame(this.loop);
    this.syncUI();
  }

  deactivate(): void {
    if (!this.active) return;
    this.active = false;
    document.documentElement.style.userSelect = this.savedUserSelect;
    document.documentElement.style.cursor = '';
    window.removeEventListener('pointermove', this.onPointerMove, true);
    window.removeEventListener('pointerdown', this.onPointerDown, true);
    window.removeEventListener('pointerup', this.onPointerUp, true);
    window.removeEventListener('pointercancel', this.onPointerUp, true);
    window.removeEventListener('click', this.blockEvent, true);
    window.removeEventListener('keydown', this.onKeyDown, true);
    cancelAnimationFrame(this.rafId);
    this.hovered = null;
    this.selected = null;
    this.drag = null;
    this.resize = null;
    this.overlay.setHover(null);
    this.overlay.setSelection(null);
    this.overlay.setGuides(null, null);
    this.syncUI();
  }

  /** remove the toolbar/overlay entirely; applied edits stay on the page */
  destroy(): void {
    this.deactivate();
    this.overlay.destroy();
  }

  // ---------- render loop ----------

  /** keep boxes glued to their elements through scroll/layout changes */
  private loop = (): void => {
    if (this.selected && this.selected.isConnected) {
      this.overlay.setSelection(this.selected.getBoundingClientRect(), this.selectionLabel());
    } else {
      if (this.selected) this.selected = null;
      this.overlay.setSelection(null);
    }
    if (this.hovered && this.hovered.isConnected && this.hovered !== this.selected) {
      this.overlay.setHover(this.hovered.getBoundingClientRect());
    } else {
      this.overlay.setHover(null);
    }
    this.rafId = requestAnimationFrame(this.loop);
  };

  private selectionLabel(): string {
    if (!this.selected) return '';
    const r = this.selected.getBoundingClientRect();
    return `${shortLabel(this.selected)}  ${Math.round(r.width)}×${Math.round(r.height)}`;
  }

  // ---------- element picking ----------

  private pageElementAt(x: number, y: number): HTMLElement | null {
    let el: Element | null = document.elementFromPoint(x, y);
    while (el && !(el instanceof HTMLElement)) el = el.parentElement;
    if (!el) return null;
    if (el === document.body || el === document.documentElement) return null;
    if (el.closest('[data-sidetation]')) return null;
    return el;
  }

  private inOverlay(e: Event): boolean {
    return e.composedPath().includes(this.overlay.host);
  }

  private select(el: HTMLElement | null): void {
    this.selected = el;
    this.hovered = null;
  }

  private isSelectable(el: Element | null): el is HTMLElement {
    return (
      el instanceof HTMLElement &&
      el !== document.body &&
      el !== document.documentElement &&
      !el.closest('[data-sidetation]')
    );
  }

  // ---------- pointer events ----------

  private onPointerMove = (e: PointerEvent): void => {
    if (this.resize) {
      this.moveResize(e);
      return;
    }
    if (this.drag) {
      this.moveDrag(e);
      return;
    }
    if (this.inOverlay(e)) {
      this.hovered = null;
      return;
    }
    this.hovered = this.pageElementAt(e.clientX, e.clientY);
  };

  private onPointerDown = (e: PointerEvent): void => {
    if (this.inOverlay(e)) return; // toolbar / panel / handles handle themselves
    e.preventDefault();
    e.stopPropagation();

    // Alt+click drills up to the parent of the current selection
    if (e.altKey && this.selected) {
      if (this.isSelectable(this.selected.parentElement)) this.select(this.selected.parentElement);
      return;
    }

    const target = this.pageElementAt(e.clientX, e.clientY);
    if (!target) {
      this.select(null);
      return;
    }

    const withinSelection =
      this.selected !== null && (target === this.selected || this.selected.contains(target));
    if (!withinSelection) this.select(target);

    // Dragging anywhere inside the selection moves the selection; a plain
    // click (no movement) on a descendant re-selects that descendant.
    const el = this.selected!;
    this.drag = {
      el,
      startX: e.clientX,
      startY: e.clientY,
      rec: null,
      before: null,
      baseDx: 0,
      baseDy: 0,
      moved: false,
      downTarget: target,
    };
  };

  private onPointerUp = (e: PointerEvent): void => {
    if (this.resize) {
      const rs = this.resize;
      this.resize = null;
      document.documentElement.style.cursor = '';
      this.history.commit(rs.rec, rs.before);
      return;
    }
    if (this.drag) {
      const d = this.drag;
      this.drag = null;
      this.overlay.setGuides(null, null);
      document.documentElement.style.cursor = '';
      if (d.moved && d.rec && d.before) {
        this.history.commit(d.rec, d.before);
      } else if (d.downTarget !== this.selected) {
        this.select(d.downTarget); // click on a child selects the child
      }
      e.preventDefault();
      e.stopPropagation();
    }
  };

  private blockEvent = (e: Event): void => {
    if (this.inOverlay(e)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
  };

  // ---------- drag ----------

  private moveDrag(e: PointerEvent): void {
    const d = this.drag!;
    const rawDx = e.clientX - d.startX;
    const rawDy = e.clientY - d.startY;
    if (!d.moved) {
      if (Math.hypot(rawDx, rawDy) < DRAG_THRESHOLD) return;
      d.moved = true;
      d.rec = this.history.ensure(d.el);
      d.before = this.history.snapshot(d.rec);
      d.baseDx = d.rec.dx;
      d.baseDy = d.rec.dy;
      document.documentElement.style.cursor = 'move';
    }
    const rec = d.rec!;
    let dx = d.baseDx + rawDx;
    let dy = d.baseDy + rawDy;

    // snap against siblings/parent using the proposed (un-snapped) rect
    const cur = d.el.getBoundingClientRect();
    const proposed = {
      left: cur.left + (dx - rec.dx),
      top: cur.top + (dy - rec.dy),
      width: cur.width,
      height: cur.height,
    };
    const snap = computeSnap(d.el, proposed, this.opts.snapThreshold);
    dx += snap.adjX;
    dy += snap.adjY;
    this.overlay.setGuides(snap.guideV, snap.guideH);

    rec.dx = dx;
    rec.dy = dy;
    rec.moved = true;
    applyRecord(rec);
  }

  // ---------- resize ----------

  private startResize(dir: Dir, e: PointerEvent): void {
    if (!this.selected) return;
    e.preventDefault();
    e.stopPropagation();
    const rec = this.history.ensure(this.selected);
    const r = this.selected.getBoundingClientRect();
    this.resize = {
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

  private moveResize(e: PointerEvent): void {
    const rs = this.resize!;
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

  // ---------- keyboard (Figma-style) ----------

  private onKeyDown = (e: KeyboardEvent): void => {
    const mod = e.metaKey || e.ctrlKey;

    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      if (this.selected) this.select(null);
      else this.deactivate();
      return;
    }

    // undo / redo work with or without a selection
    if (mod && (e.key === 'z' || e.key === 'Z')) {
      e.preventDefault();
      e.stopPropagation();
      const done = e.shiftKey ? this.history.redo() : this.history.undo();
      if (done) this.overlay.toast(e.shiftKey ? '重做' : '撤销');
      return;
    }

    if (!this.selected) return;

    // Delete / Backspace removes the element (recorded, undoable)
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      e.stopPropagation();
      const rec = this.history.ensure(this.selected);
      const before = this.history.snapshot(rec);
      rec.deleted = true;
      this.select(null);
      this.history.commit(rec, before);
      this.overlay.toast('已删除（⌘Z 撤销）');
      return;
    }

    // Enter drills into the first child, Shift+Enter back to the parent
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      const next = e.shiftKey
        ? this.selected.parentElement
        : this.selected.firstElementChild;
      if (this.isSelectable(next)) this.select(next);
      return;
    }

    // Tab / Shift+Tab walks between siblings
    if (e.key === 'Tab') {
      e.preventDefault();
      e.stopPropagation();
      const next = e.shiftKey
        ? this.selected.previousElementSibling
        : this.selected.nextElementSibling;
      if (this.isSelectable(next)) this.select(next);
      return;
    }

    // arrow-key nudging (1px, Shift = 10px), coalesced on the undo stack
    const step = e.shiftKey ? 10 : 1;
    const nudge: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const delta = nudge[e.key];
    if (!delta) return;
    e.preventDefault();
    e.stopPropagation();
    const rec = this.history.ensure(this.selected);
    const before = this.history.snapshot(rec);
    rec.dx += delta[0];
    rec.dy += delta[1];
    rec.moved = true;
    this.history.commit(rec, before, { coalesce: true });
  };

  // ---------- output ----------

  private copy(text: string, doneMsg: string): void {
    const fallback = (): void => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.append(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      this.overlay.toast(doneMsg);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(
        () => this.overlay.toast(doneMsg),
        () => fallback()
      );
    } else {
      fallback();
    }
  }

  getMarkdown(): string {
    return toMarkdown(this.history.all());
  }

  getCSS(): string {
    return toCSS(this.history.all());
  }

  undo(): boolean {
    return this.history.undo();
  }

  redo(): boolean {
    return this.history.redo();
  }

  private syncUI(): void {
    this.history.prune();
    this.toolbar.update(this.active, this.history.all());
  }
}

export function init(options?: SidetationOptions): Sidetation {
  return new Sidetation(options);
}
