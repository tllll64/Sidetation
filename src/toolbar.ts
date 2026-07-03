import type { EditRecord } from './types';

export interface ToolbarCallbacks {
  onToggle(): void;
  onCopyMd(): void;
  onCopyCss(): void;
  onReset(): void;
  onRevert(id: number): void;
}

const rnd = Math.round;

export class Toolbar {
  private toggleBtn: HTMLButtonElement;
  private editsBtn: HTMLButtonElement;
  private mdBtn: HTMLButtonElement;
  private cssBtn: HTMLButtonElement;
  private resetBtn: HTMLButtonElement;
  private hintEl: HTMLElement;
  private panelOpen = false;
  private records: EditRecord[] = [];

  constructor(
    bar: HTMLElement,
    private panel: HTMLElement,
    private cb: ToolbarCallbacks
  ) {
    const brand = document.createElement('div');
    brand.className = 'brand';
    const dot = document.createElement('span');
    dot.className = 'brand-dot';
    brand.append(dot, 'Sidetation');
    bar.append(brand);

    const btn = (label: string, onClick: () => void): HTMLButtonElement => {
      const b = document.createElement('button');
      b.textContent = label;
      b.addEventListener('click', onClick);
      bar.append(b);
      return b;
    };
    const divider = (): void => {
      const d = document.createElement('div');
      d.className = 'divider';
      bar.append(d);
    };

    this.toggleBtn = btn('开始编辑', () => cb.onToggle());
    this.toggleBtn.classList.add('primary');
    this.hintEl = document.createElement('div');
    this.hintEl.className = 'hint';
    bar.append(this.hintEl);
    divider();
    this.editsBtn = btn('修改 0', () => this.togglePanel());
    this.resetBtn = btn('重置', () => cb.onReset());
    divider();
    this.mdBtn = btn('复制 Markdown', () => cb.onCopyMd());
    this.cssBtn = btn('复制 CSS', () => cb.onCopyCss());
  }

  private togglePanel(): void {
    this.panelOpen = !this.panelOpen;
    this.panel.classList.toggle('open', this.panelOpen);
    if (this.panelOpen) this.renderPanel();
  }

  update(active: boolean, records: EditRecord[]): void {
    this.records = records;
    this.toggleBtn.textContent = active ? '完成' : '开始编辑';
    this.toggleBtn.classList.toggle('active', active);
    this.hintEl.textContent = active ? '拖拽移动 · Del 删除 · ⌘Z 撤销 · Esc 退出' : '';
    this.hintEl.style.display = active ? '' : 'none';
    this.editsBtn.textContent = `修改 ${records.length}`;
    const none = records.length === 0;
    this.editsBtn.disabled = none;
    this.resetBtn.disabled = none;
    this.mdBtn.disabled = none;
    this.cssBtn.disabled = none;
    if (none && this.panelOpen) this.togglePanel();
    else if (this.panelOpen) this.renderPanel();
  }

  private renderPanel(): void {
    this.panel.replaceChildren();
    if (this.records.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'panel-empty';
      empty.textContent = '还没有修改';
      this.panel.append(empty);
      return;
    }
    for (const rec of this.records) {
      const row = document.createElement('div');
      row.className = 'edit-row';
      const deltas: string[] = [];
      if (rec.deleted) deltas.push('删除');
      if (rec.moved) deltas.push(`移动 Δx ${rnd(rec.dx)} / Δy ${rnd(rec.dy)}`);
      if (rec.resized) {
        deltas.push(
          `尺寸 ${rnd(rec.startSize.w)}×${rnd(rec.startSize.h)} → ${rnd(rec.size.w)}×${rnd(rec.size.h)}`
        );
      }
      const info = document.createElement('div');
      info.className = 'edit-info';
      const sel = document.createElement('div');
      sel.className = 'edit-sel';
      sel.textContent = rec.selector;
      const delta = document.createElement('div');
      delta.className = 'edit-delta';
      delta.textContent = deltas.join(' · ');
      info.append(sel, delta);
      row.append(info);
      const revert = document.createElement('button');
      revert.textContent = '撤销';
      revert.addEventListener('click', () => this.cb.onRevert(rec.id));
      row.append(revert);
      this.panel.append(row);
    }
  }
}
