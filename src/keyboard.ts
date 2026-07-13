import type { History } from './history';
import type { Overlay } from './overlay';

/** what the shortcuts need from the coordinating Sidetation instance */
export interface KeyboardHost {
  inOverlay(e: Event): boolean;
  isSelectable(el: Element | null): el is HTMLElement;
  getSelected(): HTMLElement[];
  select(els: HTMLElement[]): void;
  deactivate(): void;
  isTextEditing(): boolean;
  commitTextEdit(): void;
}

/** Figma-style keyboard shortcuts */
export class KeyboardController {
  constructor(
    private history: History,
    private overlay: Overlay,
    private host: KeyboardHost
  ) {}

  onKeyDown = (e: KeyboardEvent): void => {
    const host = this.host;

    // typing in the props panel (or toolbar) must not trigger page shortcuts:
    // Backspace there edits a field, not the element
    if (host.inOverlay(e)) return;

    // while editing text, everything is native except Esc (= finish editing)
    if (host.isTextEditing()) {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        host.commitTextEdit();
      }
      return;
    }
    const mod = e.metaKey || e.ctrlKey;
    const selected = host.getSelected();

    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      if (selected.length > 0) host.select([]);
      else host.deactivate();
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

    if (selected.length === 0) return;

    // Delete / Backspace removes the selection (recorded as one undoable batch)
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      e.stopPropagation();
      const count = selected.length;
      const items = selected.map((el) => {
        const rec = this.history.ensure(el);
        const before = this.history.snapshot(rec);
        rec.deleted = true;
        return { rec, before };
      });
      host.select([]);
      this.history.commitBatch(items);
      this.overlay.toast(count > 1 ? `已删除 ${count} 个元素（⌘Z 撤销）` : '已删除（⌘Z 撤销）');
      return;
    }

    if (selected.length === 1) {
      const el = selected[0];

      // Enter drills into the first child, Shift+Enter back to the parent
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        const next = e.shiftKey ? el.parentElement : el.firstElementChild;
        if (host.isSelectable(next)) host.select([next]);
        return;
      }

      // Tab / Shift+Tab walks between siblings
      if (e.key === 'Tab') {
        e.preventDefault();
        e.stopPropagation();
        const next = e.shiftKey ? el.previousElementSibling : el.nextElementSibling;
        if (host.isSelectable(next)) host.select([next]);
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
    const items = selected.map((el) => {
      const rec = this.history.ensure(el);
      const before = this.history.snapshot(rec);
      rec.dx += delta[0];
      rec.dy += delta[1];
      rec.moved = true;
      return { rec, before };
    });
    this.history.commitBatch(items, { coalesce: 'nudge' });
  };
}
