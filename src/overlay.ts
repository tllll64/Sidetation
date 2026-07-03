import { STYLES } from './styles';

export type Dir = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';
const DIRS: Dir[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

/**
 * All Sidetation UI lives in one fixed, Shadow-DOM-isolated layer so host
 * page styles can't leak in and ours can't leak out. The layer itself is
 * pointer-events:none; only handles / toolbar / panel are interactive, so
 * elementFromPoint passes through to the page.
 */
export class Overlay {
  readonly host = document.createElement('div');
  private hoverBox: HTMLElement;
  private selBox: HTMLElement;
  private selLabel: HTMLElement;
  private guideV: HTMLElement;
  private guideH: HTMLElement;
  private toastEl: HTMLElement;
  readonly toolbarEl: HTMLElement;
  readonly panelEl: HTMLElement;
  readonly propsEl: HTMLElement;
  readonly shortcutsEl: HTMLElement;
  onHandleDown: ((dir: Dir, e: PointerEvent) => void) | null = null;
  private toastTimer = 0;

  constructor() {
    this.host.setAttribute('data-sidetation', '');
    Object.assign(this.host.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483647',
      pointerEvents: 'none',
    });
    const shadow = this.host.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = STYLES;
    shadow.append(style);

    const div = (cls: string): HTMLElement => {
      const d = document.createElement('div');
      d.className = cls;
      shadow.append(d);
      return d;
    };

    this.hoverBox = div('hover-box');
    this.selBox = div('sel-box');
    this.selLabel = document.createElement('div');
    this.selLabel.className = 'sel-label';
    this.selBox.append(this.selLabel);
    for (const dir of DIRS) {
      const h = document.createElement('div');
      h.className = 'handle';
      h.dataset.dir = dir;
      h.addEventListener('pointerdown', (e) => this.onHandleDown?.(dir, e));
      this.selBox.append(h);
    }
    this.guideV = div('guide guide-v');
    this.guideH = div('guide guide-h');
    this.panelEl = div('panel');
    this.propsEl = div('props');
    this.shortcutsEl = div('shortcuts');
    this.toolbarEl = div('toolbar');
    this.toastEl = div('toast');

    document.documentElement.appendChild(this.host);
  }

  private place(box: HTMLElement, r: DOMRect | null): void {
    if (!r) {
      box.style.display = 'none';
      return;
    }
    box.style.display = 'block';
    box.style.left = `${r.left}px`;
    box.style.top = `${r.top}px`;
    box.style.width = `${r.width}px`;
    box.style.height = `${r.height}px`;
  }

  setHover(r: DOMRect | null): void {
    this.place(this.hoverBox, r);
  }

  setSelection(r: DOMRect | null, label = ''): void {
    this.place(this.selBox, r);
    if (r) this.selLabel.textContent = label;
  }

  setGuides(v: number | null, h: number | null): void {
    this.guideV.style.display = v === null ? 'none' : 'block';
    if (v !== null) this.guideV.style.left = `${v}px`;
    this.guideH.style.display = h === null ? 'none' : 'block';
    if (h !== null) this.guideH.style.top = `${h}px`;
  }

  toast(msg: string): void {
    this.toastEl.textContent = msg;
    this.toastEl.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => this.toastEl.classList.remove('show'), 1600);
  }

  destroy(): void {
    clearTimeout(this.toastTimer);
    this.host.remove();
  }
}
