/**
 * Figma-style floating properties panel: Auto layout (flexbox / box model),
 * Appearance (opacity, radius), Fill (background) and Stroke (border).
 * Every change is committed through the host so it lands on the undo stack
 * and in the export, exactly like drag/resize edits.
 */

export interface PanelHost {
  /** write CSS properties onto the selected element's record (null deletes) */
  setProps(entries: Record<string, string | null>): void;
  /** write border-box width/height through the resize pipeline */
  setSize(w: number | null, h: number | null): void;
}

type Flow = 'none' | 'col' | 'row' | 'wrap';
const ALIGN_VALUES = ['flex-start', 'center', 'flex-end'] as const;

const pxNum = (v: string): number => Math.round(parseFloat(v) || 0);
const hex2 = (n: number): string => Math.round(n).toString(16).padStart(2, '0');

function parseColor(c: string): { hex: string; alpha: number } {
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (!m) return { hex: '#000000', alpha: c && c !== 'transparent' ? 1 : 0 };
  const p = m[1].split(',').map((s) => parseFloat(s));
  return { hex: `#${hex2(p[0])}${hex2(p[1])}${hex2(p[2])}`, alpha: p[3] ?? 1 };
}

function hexToRgba(hex: string, alpha: number): string {
  if (alpha >= 1) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${+alpha.toFixed(3)})`;
}

function normAlign(v: string): number {
  if (v.includes('center')) return 1;
  if (v.includes('end')) return 2;
  return 0; // normal / start / stretch -> start
}

export class PropsPanel {
  private el: HTMLElement | null = null;
  private flow: Flow = 'none';

  private flowBtns: HTMLButtonElement[] = [];
  private wInput!: HTMLInputElement;
  private hInput!: HTMLInputElement;
  private alignBtns: HTMLButtonElement[] = [];
  private gapInput!: HTMLInputElement;
  private padXInput!: HTMLInputElement;
  private padYInput!: HTMLInputElement;
  private padSides: HTMLInputElement[] = []; // left, top, right, bottom
  private padIndependent = false;
  private padLinkedRow!: HTMLElement;
  private padGridRow!: HTMLElement;
  private padToggle!: HTMLButtonElement;
  private clipInput!: HTMLInputElement;
  private opacityInput!: HTMLInputElement;
  private radiusInput!: HTMLInputElement;
  private fillColor!: HTMLInputElement;
  private fillPct!: HTMLInputElement;
  private strokeColor!: HTMLInputElement;
  private strokeWidth!: HTMLInputElement;
  private layoutOnly: HTMLElement[] = [];

  constructor(
    private root: HTMLElement,
    private host: PanelHost
  ) {
    this.build();
  }

  // ---------- DOM construction ----------

  private section(title: string): HTMLElement {
    const s = document.createElement('div');
    s.className = 'props-section';
    const t = document.createElement('div');
    t.className = 'props-title';
    t.textContent = title;
    s.append(t);
    this.root.append(s);
    return s;
  }

  private row(parent: HTMLElement, label?: string): HTMLElement {
    const r = document.createElement('div');
    r.className = 'props-row';
    if (label) {
      const l = document.createElement('div');
      l.className = 'props-label';
      l.textContent = label;
      r.append(l);
    }
    parent.append(r);
    return r;
  }

  private num(parent: HTMLElement, onInput: (n: number) => void, min = 0): HTMLInputElement {
    const i = document.createElement('input');
    i.type = 'number';
    i.min = String(min);
    i.addEventListener('input', () => {
      const n = parseFloat(i.value);
      if (!Number.isNaN(n)) onInput(n);
    });
    parent.append(i);
    return i;
  }

  private color(parent: HTMLElement, onInput: (hex: string) => void): HTMLInputElement {
    const i = document.createElement('input');
    i.type = 'color';
    i.addEventListener('input', () => onInput(i.value));
    parent.append(i);
    return i;
  }

  private build(): void {
    // ----- Auto layout -----
    const layout = this.section('Auto layout');

    const flowRow = this.row(layout, 'Flow');
    const seg = document.createElement('div');
    seg.className = 'seg';
    const flows: [Flow, string, string][] = [
      ['none', '✕', '不使用 flex'],
      ['col', '↓', '纵向排列 (column)'],
      ['row', '→', '横向排列 (row)'],
      ['wrap', '⤸', '横向换行 (wrap)'],
    ];
    for (const [flow, icon, title] of flows) {
      const b = document.createElement('button');
      b.textContent = icon;
      b.title = title;
      b.addEventListener('click', () => this.applyFlow(flow));
      seg.append(b);
      this.flowBtns.push(b);
    }
    flowRow.append(seg);

    const sizeRow = this.row(layout, 'W / H');
    this.wInput = this.num(sizeRow, (n) => this.host.setSize(n, null), 8);
    this.hInput = this.num(sizeRow, (n) => this.host.setSize(null, n), 8);

    const alignRow = this.row(layout, 'Align');
    const grid = document.createElement('div');
    grid.className = 'align-grid';
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const b = document.createElement('button');
        b.addEventListener('click', () => this.applyAlign(r, c));
        grid.append(b);
        this.alignBtns.push(b);
      }
    }
    alignRow.append(grid);
    const gapWrap = document.createElement('div');
    gapWrap.style.flex = '1';
    const gapLabel = document.createElement('div');
    gapLabel.className = 'props-label';
    gapLabel.textContent = 'Gap';
    gapWrap.append(gapLabel);
    this.gapInput = this.num(gapWrap, (n) => this.host.setProps({ gap: `${n}px` }));
    alignRow.append(gapWrap);
    this.layoutOnly.push(grid, gapWrap);

    this.padLinkedRow = this.row(layout, 'Padding');
    this.padXInput = this.num(this.padLinkedRow, () => this.applyPadding());
    this.padYInput = this.num(this.padLinkedRow, () => this.applyPadding());
    this.padXInput.title = '水平 padding';
    this.padYInput.title = '垂直 padding';
    this.padToggle = document.createElement('button');
    this.padToggle.className = 'pad-toggle';
    this.padToggle.textContent = '⊞';
    this.padToggle.title = '四边独立 padding';
    this.padToggle.addEventListener('click', () => this.togglePadMode());
    this.padLinkedRow.append(this.padToggle);

    this.padGridRow = this.row(layout, '');
    this.padGridRow.style.display = 'none';
    const padGrid = document.createElement('div');
    padGrid.className = 'pad-grid';
    const sideTitles = ['左 padding', '上 padding', '右 padding', '下 padding'];
    for (let i = 0; i < 4; i++) {
      const input = this.num(padGrid, () => this.applyPadding());
      input.title = sideTitles[i];
      this.padSides.push(input);
    }
    this.padGridRow.append(padGrid);

    const clipRow = this.row(layout);
    const clipLabel = document.createElement('label');
    clipLabel.className = 'check';
    this.clipInput = document.createElement('input');
    this.clipInput.type = 'checkbox';
    this.clipInput.addEventListener('change', () =>
      this.host.setProps({ overflow: this.clipInput.checked ? 'hidden' : 'visible' })
    );
    clipLabel.append(this.clipInput, 'Clip content');
    clipRow.append(clipLabel);

    // ----- Appearance -----
    const appearance = this.section('Appearance');
    const opRow = this.row(appearance, 'Opacity %');
    this.opacityInput = this.num(opRow, (n) =>
      this.host.setProps({ opacity: String(Math.min(100, Math.max(0, n)) / 100) })
    );
    const radRow = this.row(appearance, 'Radius');
    this.radiusInput = this.num(radRow, (n) => this.host.setProps({ 'border-radius': `${n}px` }));

    // ----- Fill -----
    const fill = this.section('Fill');
    const fillRow = this.row(fill, 'Color');
    this.fillColor = this.color(fillRow, () => this.applyFill());
    this.fillPct = this.num(fillRow, () => this.applyFill());
    this.fillPct.title = '不透明度 %';

    // ----- Stroke -----
    const stroke = this.section('Stroke');
    const strokeRow = this.row(stroke, 'Color / W');
    this.strokeColor = this.color(strokeRow, () => this.applyStroke());
    this.strokeWidth = this.num(strokeRow, () => this.applyStroke());
    this.strokeWidth.step = '0.5';
    this.strokeWidth.title = '描边宽度 px';
  }

  // ---------- writes ----------

  private applyFlow(flow: Flow): void {
    this.flow = flow;
    if (flow === 'none') {
      this.host.setProps({ display: 'block', 'flex-direction': null, 'flex-wrap': null });
    } else {
      this.host.setProps({
        display: 'flex',
        'flex-direction': flow === 'col' ? 'column' : 'row',
        'flex-wrap': flow === 'wrap' ? 'wrap' : 'nowrap',
      });
    }
    this.markFlow();
  }

  private applyAlign(r: number, c: number): void {
    // Figma's grid positions items inside the container: for row flow the
    // column picks justify-content and the row picks align-items; column
    // flow swaps the axes.
    const justify = this.flow === 'col' ? ALIGN_VALUES[r] : ALIGN_VALUES[c];
    const align = this.flow === 'col' ? ALIGN_VALUES[c] : ALIGN_VALUES[r];
    this.host.setProps({ 'justify-content': justify, 'align-items': align });
    this.markAlign(r, c);
  }

  private applyPadding(): void {
    if (this.padIndependent) {
      const [l, t, r, b] = this.padSides.map((i) => parseFloat(i.value) || 0);
      this.host.setProps({ padding: `${t}px ${r}px ${b}px ${l}px` });
    } else {
      const px = parseFloat(this.padXInput.value) || 0;
      const py = parseFloat(this.padYInput.value) || 0;
      this.host.setProps({ padding: `${py}px ${px}px` });
    }
  }

  private setPadMode(independent: boolean): void {
    this.padIndependent = independent;
    this.padXInput.style.display = independent ? 'none' : '';
    this.padYInput.style.display = independent ? 'none' : '';
    this.padGridRow.style.display = independent ? '' : 'none';
    this.padToggle.classList.toggle('on', independent);
  }

  private togglePadMode(): void {
    const toIndependent = !this.padIndependent;
    if (toIndependent) {
      // seed the four sides from the linked values
      const px = this.padXInput.value || '0';
      const py = this.padYInput.value || '0';
      const seed = [px, py, px, py];
      this.padSides.forEach((i, idx) => (i.value = seed[idx]));
    } else {
      this.padXInput.value = this.padSides[0].value || '0';
      this.padYInput.value = this.padSides[1].value || '0';
      this.applyPadding(); // collapsing back forces symmetry, write it
    }
    this.setPadMode(toIndependent);
  }

  private applyFill(): void {
    const pct = Math.min(100, Math.max(0, parseFloat(this.fillPct.value) || 0));
    this.host.setProps({ 'background-color': hexToRgba(this.fillColor.value, pct / 100) });
  }

  private applyStroke(): void {
    const w = Math.max(0, parseFloat(this.strokeWidth.value) || 0);
    this.host.setProps({
      'border-width': `${w}px`,
      'border-style': 'solid',
      'border-color': this.strokeColor.value,
    });
  }

  // ---------- reads ----------

  private markFlow(): void {
    const idx = ['none', 'col', 'row', 'wrap'].indexOf(this.flow);
    this.flowBtns.forEach((b, i) => b.classList.toggle('on', i === idx));
    for (const el of this.layoutOnly) el.classList.toggle('disabled', this.flow === 'none');
  }

  private markAlign(r: number, c: number): void {
    this.alignBtns.forEach((b, i) => b.classList.toggle('on', i === r * 3 + c));
  }

  private focusWithin(): boolean {
    const root = this.root.getRootNode();
    return root instanceof ShadowRoot && this.root.contains(root.activeElement);
  }

  private populate(el: HTMLElement): void {
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();

    if (cs.display.includes('flex')) {
      this.flow = cs.flexDirection.startsWith('column')
        ? 'col'
        : cs.flexWrap === 'wrap'
          ? 'wrap'
          : 'row';
    } else {
      this.flow = 'none';
    }
    this.markFlow();

    this.wInput.value = String(Math.round(rect.width));
    this.hInput.value = String(Math.round(rect.height));

    const j = normAlign(cs.justifyContent);
    const a = normAlign(cs.alignItems);
    this.markAlign(this.flow === 'col' ? j : a, this.flow === 'col' ? a : j);

    this.gapInput.value = String(cs.columnGap === 'normal' ? 0 : pxNum(cs.columnGap));
    const pads = [cs.paddingLeft, cs.paddingTop, cs.paddingRight, cs.paddingBottom].map(pxNum);
    const symmetric = pads[0] === pads[2] && pads[1] === pads[3];
    this.setPadMode(!symmetric);
    this.padXInput.value = String(pads[0]);
    this.padYInput.value = String(pads[1]);
    this.padSides.forEach((i, idx) => (i.value = String(pads[idx])));
    this.clipInput.checked = cs.overflowX !== 'visible';

    this.opacityInput.value = String(Math.round(parseFloat(cs.opacity) * 100));
    this.radiusInput.value = String(pxNum(cs.borderTopLeftRadius));

    const fill = parseColor(cs.backgroundColor);
    this.fillColor.value = fill.hex;
    this.fillPct.value = String(Math.round(fill.alpha * 100));

    const stroke = parseColor(cs.borderTopColor);
    this.strokeColor.value = stroke.hex;
    this.strokeWidth.value = String(parseFloat(cs.borderTopWidth) || 0);
  }

  // ---------- public ----------

  setTarget(el: HTMLElement | null): void {
    this.el = el;
    this.root.classList.toggle('open', el !== null);
    if (el && !this.focusWithin()) this.populate(el);
  }

  /** re-read values after undo/redo etc., unless the user is typing here */
  sync(): void {
    if (this.el && this.el.isConnected && !this.focusWithin()) this.populate(this.el);
  }

  /** live W/H while dragging handles */
  refreshRect(r: DOMRect): void {
    if (this.focusWithin()) return;
    this.wInput.value = String(Math.round(r.width));
    this.hInput.value = String(Math.round(r.height));
  }
}
