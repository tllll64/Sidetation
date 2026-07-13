import type { EditRecord, Snapshot } from './types';
import type { History } from './history';

interface TextEditState {
  el: HTMLElement;
  rec: EditRecord;
  before: Snapshot;
  savedUserSelect: string;
}

export class TextEditController {
  private state: TextEditState | null = null;

  constructor(private history: History) {}

  get active(): boolean {
    return this.state !== null;
  }

  /** only plain-text elements (no child elements) can be edited in place */
  canEdit(el: HTMLElement): boolean {
    return el.childElementCount === 0 && (el.textContent ?? '').trim() !== '';
  }

  /** clicks inside the element being edited stay native (caret placement) */
  contains(e: Event): boolean {
    return this.state !== null && e.composedPath().includes(this.state.el);
  }

  start(el: HTMLElement): void {
    const rec = this.history.ensure(el);
    this.state = {
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

  commit(): void {
    const t = this.state;
    if (!t) return;
    this.state = null;
    t.el.removeAttribute('contenteditable');
    if (t.savedUserSelect) t.el.style.setProperty('user-select', t.savedUserSelect);
    else t.el.style.removeProperty('user-select');
    window.getSelection()?.removeAllRanges();
    const newText = t.el.textContent ?? '';
    t.rec.text = newText === t.rec.savedText ? null : newText;
    this.history.commit(t.rec, t.before);
  }
}
