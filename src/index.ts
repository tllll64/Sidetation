import type { SidetationOptions } from './types';
import { Overlay } from './overlay';
import { History } from './history';
import { Toolbar } from './toolbar';
import { PropsPanel } from './props-panel';
import { shortLabel } from './selector';
import { toMarkdown, toCSS, toSyncPayload } from './export';
import { applyRecord } from './apply';
import { save as persistSave, load as persistLoad } from './persist';
import { AlignPanel, type AlignMode } from './align-panel';
import { DragController } from './drag-controller';
import { ResizeController } from './resize-controller';
import { KeyboardController } from './keyboard';
import { TextEditController } from './text-edit';

export type { SidetationOptions, EditRecord } from './types';

export class Sidetation {
  private overlay = new Overlay();
  private history = new History();
  private toolbar: Toolbar;
  private propsPanel: PropsPanel;
  private alignPanel: AlignPanel;
  private opts: Required<SidetationOptions>;

  private drag: DragController;
  private resize: ResizeController;
  private keyboard: KeyboardController;
  private textEdit: TextEditController;

  private active = false;
  private hovered: HTMLElement | null = null;
  private selected: HTMLElement[] = [];
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
    this.drag = new DragController(this.history, this.overlay, this.opts.snapThreshold);
    this.resize = new ResizeController(this.history);
    this.textEdit = new TextEditController(this.history);
    this.keyboard = new KeyboardController(this.history, this.overlay, {
      inOverlay: (e) => this.inOverlay(e),
      isSelectable: (el: Element | null): el is HTMLElement => this.isSelectable(el),
      getSelected: () => this.selected,
      select: (els) => this.select(els),
      deactivate: () => this.deactivate(),
      isTextEditing: () => this.textEdit.active,
      commitTextEdit: () => this.textEdit.commit(),
    });
    this.history.onChange = () => {
      this.syncUI();
      persistSave(this.history.all());
    };
    this.overlay.onHandleDown = (dir, e) => {
      if (this.selected.length === 1) this.resize.start(dir, e, this.selected[0]);
    };
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
    window.addEventListener('keydown', this.keyboard.onKeyDown, true);
    this.rafId = requestAnimationFrame(this.loop);
    this.syncUI();
  }

  deactivate(): void {
    if (!this.active) return;
    this.textEdit.commit();
    this.active = false;
    document.documentElement.style.userSelect = this.savedUserSelect;
    document.documentElement.style.cursor = '';
    window.removeEventListener('pointermove', this.onPointerMove, true);
    window.removeEventListener('pointerdown', this.onPointerDown, true);
    window.removeEventListener('pointerup', this.onPointerUp, true);
    window.removeEventListener('pointercancel', this.onPointerUp, true);
    window.removeEventListener('click', this.blockEvent, true);
    window.removeEventListener('keydown', this.keyboard.onKeyDown, true);
    cancelAnimationFrame(this.rafId);
    this.hovered = null;
    this.selected = [];
    this.drag.cancel();
    this.resize.cancel();
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
    if (this.resize.active) {
      this.resize.move(e);
      return;
    }
    if (this.drag.active) {
      this.drag.move(e);
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
    if (this.textEdit.active) {
      if (this.textEdit.contains(e)) return;
      this.textEdit.commit();
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
    this.drag.start(e, this.selected, target);
  };

  private onPointerUp = (e: PointerEvent): void => {
    if (this.resize.active) {
      this.resize.end();
      return;
    }
    const ended = this.drag.end();
    if (!ended) return;
    if (!ended.moved && !(this.selected.length === 1 && this.selected[0] === ended.downTarget)) {
      this.select([ended.downTarget]); // click without dragging refines to the clicked descendant
    }
    e.preventDefault();
    e.stopPropagation();
  };

  private blockEvent = (e: Event): void => {
    if (this.inOverlay(e)) return;
    if (this.textEdit.contains(e)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
  };

  // ---------- text editing ----------

  private startTextEdit(el: HTMLElement): void {
    if (!this.textEdit.canEdit(el)) {
      this.overlay.toast('仅支持纯文本元素（无子元素）');
      return;
    }
    this.select([el]);
    this.textEdit.start(el);
  }

  // ---------- properties panel ----------

  private panelSetProps(entries: Record<string, string | null>): void {
    if (this.selected.length !== 1) return;
    const el = this.selected[0];
    this.textEdit.commit();
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
    this.textEdit.commit();
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
