import type { EditRecord, SidetationOptions, Snapshot } from './types';
import { Overlay, type Dir } from './overlay';
import { History } from './history';
import { Toolbar } from './toolbar';
import { PropsPanel } from './props-panel';
import { computeSnap } from './snap';
import { shortLabel } from './selector';
import { toMarkdown, toCSS, toSyncPayload } from './export';
import { applyRecord } from './apply';
import { save as persistSave, load as persistLoad } from './persist';
import { AlignPanel, type AlignMode } from './align-panel';

export type { SidetationOptions, EditRecord } from './types';

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

interface TextEditState {
  el: HTMLElement;
  rec: EditRecord;
  before: Snapshot;
  savedUserSelect: string;
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
  private propsPanel: PropsPanel;
  private alignPanel: AlignPanel;
  private opts: Required<SidetationOptions>;

  private active = false;
  private hovered: HTMLElement | null = null;
  private selected: HTMLElement[] = [];
  private drag: DragState | null = null;
  private resize: ResizeState | null = null;
  private textEdit: TextEditState | null = null;
  private lastDownAt = 0;
  private lastDownTarget: HTMLElement | null = null;
  private rafId = 0;
  private savedUserSelect = '';

  constructor(options: SidetationOptions = {}) {
    this.opts = {
      autoStart: false,
      snapThreshold: 6,
      enableMcpSync: false,
      mcpEndpoint: 'http://127.0.0.1:8787',
      ...options,
    };
    this.toolbar = new Toolbar(this.overlay.toolbarEl, this.overlay.panelEl, this.overlay.shortcutsEl, {
      onToggle: () => (this.active ? this.deactivate() : this.activate()),
      onCopyMd: () => this.copy(toMarkdown(this.history.all()), '已复制 Markdown'),
      onCopyCss: () => this.copy(toCSS(this.history.all()), '已复制 CSS'),
      onSync: () => this.syncToMcp(),
      onReset: () => this.history.resetAll(),
      onRevert: (id) => this.history.revert(id),
    }, this.opts.enableMcpSync);
    this.propsPanel = new PropsPanel(this.overlay.propsEl, {
      setProps: (entries) => this.panelSetProps(entries),
      setSize: (w, h) => this.panelSetSize(w, h),
    });
    this.alignPanel = new AlignPanel(this.overlay.alignEl, {
      align: (mode) => this.alignSelected(mode),
      distribute: (axis) => this.distributeSelected(axis),
    });
    this.history.onChange = () => {
      this.syncUI();
      persistSave(this.history.all());
    };
    this.overlay.onHandleDown = (dir, e) => this.startResize(dir, e);
    this.restoreSession();
    this.syncUI();
    if (this.opts.autoStart) this.activate();
  }

  /** re-apply edits saved from a previous session on this page, if any */
  private restoreSession(): void {
    const persisted = persistLoad();
    if (!persisted || persisted.length === 0) return;
    const failed = this.history.restore(persisted);
    if (failed > 0) {
      this.overlay.toast(`${failed} 处修改因页面结构变化未能恢复`);
    }
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
    this.commitTextEdit();
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
    this.selected = [];
    this.drag = null;
    this.resize = null;
    this.propsPanel.setTarget(null);
    this.alignPanel.hide();
    this.overlay.setHover(null);
    this.overlay.setSelection(null);
    this.overlay.setMultiSelection([]);
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
    if (this.selected.length > 0) {
      const connected = this.selected.filter((el) => el.isConnected);
      if (connected.length !== this.selected.length) this.selected = connected;
    }

    if (this.selected.length === 1) {
      const el = this.selected[0];
      const rect = el.getBoundingClientRect();
      this.overlay.setSelection(rect, this.selectionLabel());
      this.propsPanel.refreshRect(rect);
      this.overlay.setMultiSelection([]);
      this.alignPanel.hide();
    } else if (this.selected.length > 1) {
      const rects = this.selected.map((el) => el.getBoundingClientRect());
      this.overlay.setSelection(null);
      this.overlay.setMultiSelection(rects);
      this.overlay.positionAlignPanel(rects);
      this.alignPanel.show(this.selected.length);
    } else {
      this.overlay.setSelection(null);
      this.overlay.setMultiSelection([]);
      this.alignPanel.hide();
    }

    if (this.hovered && this.hovered.isConnected && !this.selected.includes(this.hovered)) {
      this.overlay.setHover(this.hovered.getBoundingClientRect());
    } else {
      this.overlay.setHover(null);
    }
    this.rafId = requestAnimationFrame(this.loop);
  };

  private selectionLabel(): string {
    if (this.selected.length !== 1) return '';
    const el = this.selected[0];
    const r = el.getBoundingClientRect();
    return `${shortLabel(el)}  ${Math.round(r.width)}×${Math.round(r.height)}`;
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

  private select(els: HTMLElement[]): void {
    this.selected = els;
    this.hovered = null;
    this.propsPanel.setTarget(els.length === 1 ? els[0] : null);
  }

  /** Shift+click: add/remove one element from the current selection */
  private toggleSelect(el: HTMLElement): void {
    const idx = this.selected.indexOf(el);
    if (idx >= 0) {
      const next = this.selected.slice();
      next.splice(idx, 1);
      this.select(next);
    } else {
      this.select([...this.selected, el]);
    }
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

    // while editing text: clicks inside stay native (caret placement),
    // clicking anywhere else commits the edit and falls through
    if (this.textEdit) {
      const path = e.composedPath();
      if (path.includes(this.textEdit.el)) return;
      this.commitTextEdit();
    }

    e.preventDefault();
    e.stopPropagation();

    // Alt+click drills up to the parent of the current selection (single-select only)
    if (e.altKey && this.selected.length === 1) {
      const parent = this.selected[0].parentElement;
      if (this.isSelectable(parent)) this.select([parent]);
      return;
    }

    const target = this.pageElementAt(e.clientX, e.clientY);
    if (!target) {
      this.select([]);
      return;
    }

    // Shift+click toggles the element in/out of a multi-selection; it never
    // starts a drag, keeping the gesture unambiguous
    if (e.shiftKey) {
      this.toggleSelect(target);
      return;
    }

    // double-click (own detection: native click events are suppressed)
    const now = Date.now();
    if (target === this.lastDownTarget && now - this.lastDownAt < 400) {
      this.lastDownAt = 0;
      this.startTextEdit(target);
      return;
    }
    this.lastDownAt = now;
    this.lastDownTarget = target;

    const single = this.selected.length === 1 ? this.selected[0] : null;
    const withinSelection = single !== null && (target === single || single.contains(target));
    const inGroup = this.selected.length > 1 && this.selected.includes(target);
    if (!withinSelection && !inGroup) this.select([target]);

    // Dragging anywhere inside the selection moves the whole selection; a
    // plain click (no movement) on a descendant re-selects just that descendant.
    this.drag = {
      els: this.selected,
      startX: e.clientX,
      startY: e.clientY,
      items: null,
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
      if (d.moved && d.items) {
        this.history.commitBatch(d.items.map(({ rec, before }) => ({ rec, before })));
      } else if (!(this.selected.length === 1 && this.selected[0] === d.downTarget)) {
        this.select([d.downTarget]); // click without dragging refines to the clicked descendant
      }
      e.preventDefault();
      e.stopPropagation();
    }
  };

  private blockEvent = (e: Event): void => {
    if (this.inOverlay(e)) return;
    if (this.textEdit && e.composedPath().includes(this.textEdit.el)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
  };

  // ---------- text editing ----------

  private startTextEdit(el: HTMLElement): void {
    if (el.childElementCount > 0 || !(el.textContent ?? '').trim()) {
      this.overlay.toast('仅支持纯文本元素（无子元素）');
      return;
    }
    this.select([el]);
    const rec = this.history.ensure(el);
    this.textEdit = {
      el,
      rec,
      before: this.history.snapshot(rec),
      savedUserSelect: el.style.getPropertyValue('user-select'),
    };
    el.setAttribute('contenteditable', 'plaintext-only');
    if (!el.isContentEditable) el.setAttribute('contenteditable', 'true');
    el.style.setProperty('user-select', 'text'); // page-wide user-select:none would block the caret
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  private commitTextEdit(): void {
    const t = this.textEdit;
    if (!t) return;
    this.textEdit = null;
    t.el.removeAttribute('contenteditable');
    if (t.savedUserSelect) t.el.style.setProperty('user-select', t.savedUserSelect);
    else t.el.style.removeProperty('user-select');
    window.getSelection()?.removeAllRanges();
    const newText = t.el.textContent ?? '';
    t.rec.text = newText === t.rec.savedText ? null : newText;
    this.history.commit(t.rec, t.before);
  }

  // ---------- drag ----------

  private moveDrag(e: PointerEvent): void {
    const d = this.drag!;
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
      const snap = computeSnap(d.els[0], proposed, this.opts.snapThreshold);
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

  // ---------- resize ----------

  private startResize(dir: Dir, e: PointerEvent): void {
    if (this.selected.length !== 1) return;
    const el = this.selected[0];
    e.preventDefault();
    e.stopPropagation();
    const rec = this.history.ensure(el);
    const r = el.getBoundingClientRect();
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
    // typing in the props panel (or toolbar) must not trigger page shortcuts:
    // Backspace there edits a field, not the element
    if (this.inOverlay(e)) return;

    // while editing text, everything is native except Esc (= finish editing)
    if (this.textEdit) {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        this.commitTextEdit();
      }
      return;
    }
    const mod = e.metaKey || e.ctrlKey;

    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      if (this.selected.length > 0) this.select([]);
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

    if (this.selected.length === 0) return;

    // Delete / Backspace removes the selection (recorded as one undoable batch)
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      e.stopPropagation();
      const count = this.selected.length;
      const items = this.selected.map((el) => {
        const rec = this.history.ensure(el);
        const before = this.history.snapshot(rec);
        rec.deleted = true;
        return { rec, before };
      });
      this.select([]);
      this.history.commitBatch(items);
      this.overlay.toast(count > 1 ? `已删除 ${count} 个元素（⌘Z 撤销）` : '已删除（⌘Z 撤销）');
      return;
    }

    if (this.selected.length === 1) {
      const el = this.selected[0];

      // Enter drills into the first child, Shift+Enter back to the parent
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        const next = e.shiftKey ? el.parentElement : el.firstElementChild;
        if (this.isSelectable(next)) this.select([next]);
        return;
      }

      // Tab / Shift+Tab walks between siblings
      if (e.key === 'Tab') {
        e.preventDefault();
        e.stopPropagation();
        const next = e.shiftKey ? el.previousElementSibling : el.nextElementSibling;
        if (this.isSelectable(next)) this.select([next]);
        return;
      }
    }

    // arrow-key nudging (1px, Shift = 10px) moves the whole selection,
    // coalesced on the undo stack
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
    const items = this.selected.map((el) => {
      const rec = this.history.ensure(el);
      const before = this.history.snapshot(rec);
      rec.dx += delta[0];
      rec.dy += delta[1];
      rec.moved = true;
      return { rec, before };
    });
    this.history.commitBatch(items, { coalesce: 'nudge' });
  };

  // ---------- properties panel ----------

  private panelSetProps(entries: Record<string, string | null>): void {
    if (this.selected.length !== 1) return;
    const el = this.selected[0];
    this.commitTextEdit();
    const rec = this.history.ensure(el);
    const before = this.history.snapshot(rec);
    for (const [prop, value] of Object.entries(entries)) {
      if (!(prop in rec.savedProps)) {
        rec.savedProps[prop] = el.style.getPropertyValue(prop);
      }
      if (value === null) delete rec.props[prop];
      else rec.props[prop] = value;
    }
    // coalesce rapid changes of the same field, but never across fields
    this.history.commit(rec, before, { coalesce: `props:${Object.keys(entries).sort().join(',')}` });
  }

  private panelSetSize(w: number | null, h: number | null): void {
    if (this.selected.length !== 1) return;
    this.commitTextEdit();
    const rec = this.history.ensure(this.selected[0]);
    const before = this.history.snapshot(rec);
    if (w !== null) rec.size.w = Math.max(8, w);
    if (h !== null) rec.size.h = Math.max(8, h);
    rec.resized = true;
    this.history.commit(rec, before, { coalesce: 'size' });
  }

  // ---------- multi-select: align / distribute ----------

  private alignSelected(mode: AlignMode): void {
    if (this.selected.length < 2) return;
    const items = this.selected.map((el) => ({
      rec: this.history.ensure(el),
      rect: el.getBoundingClientRect(),
    }));
    const before = items.map(({ rec }) => ({ rec, before: this.history.snapshot(rec) }));

    const left = Math.min(...items.map((i) => i.rect.left));
    const right = Math.max(...items.map((i) => i.rect.right));
    const top = Math.min(...items.map((i) => i.rect.top));
    const bottom = Math.max(...items.map((i) => i.rect.bottom));
    const hCenter = (left + right) / 2;
    const vCenter = (top + bottom) / 2;

    for (const { rec, rect } of items) {
      let dx = 0;
      let dy = 0;
      switch (mode) {
        case 'left':
          dx = left - rect.left;
          break;
        case 'right':
          dx = right - rect.right;
          break;
        case 'hcenter':
          dx = hCenter - (rect.left + rect.width / 2);
          break;
        case 'top':
          dy = top - rect.top;
          break;
        case 'bottom':
          dy = bottom - rect.bottom;
          break;
        case 'vcenter':
          dy = vCenter - (rect.top + rect.height / 2);
          break;
      }
      if (dx !== 0 || dy !== 0) {
        rec.dx += dx;
        rec.dy += dy;
        rec.moved = true;
        applyRecord(rec);
      }
    }
    this.history.commitBatch(before);
  }

  private distributeSelected(axis: 'h' | 'v'): void {
    if (this.selected.length < 3) return;
    const items = this.selected.map((el) => ({
      rec: this.history.ensure(el),
      rect: el.getBoundingClientRect(),
    }));
    const before = items.map(({ rec }) => ({ rec, before: this.history.snapshot(rec) }));

    const sorted = [...items].sort((a, b) =>
      axis === 'h' ? a.rect.left - b.rect.left : a.rect.top - b.rect.top
    );
    const first = sorted[0].rect;
    const last = sorted[sorted.length - 1].rect;
    const span = axis === 'h' ? last.right - first.left : last.bottom - first.top;
    const totalSize = sorted.reduce(
      (s, i) => s + (axis === 'h' ? i.rect.width : i.rect.height),
      0
    );
    const gap = (span - totalSize) / (sorted.length - 1);

    let pos = axis === 'h' ? first.left : first.top;
    for (const { rec, rect } of sorted) {
      const size = axis === 'h' ? rect.width : rect.height;
      const current = axis === 'h' ? rect.left : rect.top;
      const delta = pos - current;
      if (delta !== 0) {
        if (axis === 'h') rec.dx += delta;
        else rec.dy += delta;
        rec.moved = true;
        applyRecord(rec);
      }
      pos += size + gap;
    }
    this.history.commitBatch(before);
  }

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

  /** POST the current edits to the local MCP bridge so an AI agent can read them */
  async syncToMcp(): Promise<void> {
    const payload = toSyncPayload(this.history.all());
    if (payload.count === 0) {
      this.overlay.toast('没有可同步的修改');
      return;
    }
    const url = `${this.opts.mcpEndpoint.replace(/\/$/, '')}/ingest`;
    this.toolbar.setSyncState('syncing');
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.toolbar.setSyncState('idle');
      this.overlay.toast(`已同步 ${payload.count} 处修改到 MCP`);
    } catch (err) {
      this.toolbar.setSyncState('idle');
      this.overlay.toast(`同步失败：本地 MCP 服务未启动？(${String(err)})`);
    }
  }

  getMarkdown(): string {
    return toMarkdown(this.history.all());
  }

  getCSS(): string {
    return toCSS(this.history.all());
  }

  get isActive(): boolean {
    return this.active;
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
    this.propsPanel.sync();
  }
}

export function init(options?: SidetationOptions): Sidetation {
  return new Sidetation(options);
}
