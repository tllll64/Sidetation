import type { EditRecord } from './types';
import { snapshotSVG } from './snapshot';

export interface ToolbarCallbacks {
  onToggle(): void;
  onCopyMd(): void;
  onCopyCss(): void;
  onReset(): void;
  onRevert(id: number): void;
}

const rnd = Math.round;

const SHORTCUTS: [string, string][] = [
  ['点击', '选中元素，点子元素可下钻'],
  ['⇧ 点击', '多选 / 取消多选元素'],
  ['双击', '编辑文字内容（纯文本元素）'],
  ['⌥ 点击', '选中父级元素'],
  ['拖拽', '移动元素（多选时整体移动），自动对齐吸附'],
  ['拖拽手柄 / ⇧', '缩放 / 等比缩放'],
  ['方向键 / ⇧方向键', '微调 1px / 10px'],
  ['Delete / ⌫', '删除元素'],
  ['⌘Z / ⌘⇧Z', '撤销 / 重做'],
  ['Enter / ⇧Enter', '进入子级 / 返回父级'],
  ['Tab / ⇧Tab', '下一个 / 上一个兄弟元素'],
  ['Esc', '取消选中，再按退出编辑'],
];

export class Toolbar {
  private toggleBtn: HTMLButtonElement;
  private editsBtn: HTMLButtonElement;
  private mdBtn: HTMLButtonElement;
  private cssBtn: HTMLButtonElement;
  private resetBtn: HTMLButtonElement;
  private kbdBtn: HTMLButtonElement;
  private panelOpen = false;
  private records: EditRecord[] = [];

  constructor(
    bar: HTMLElement,
    private panel: HTMLElement,
    private shortcuts: HTMLElement,
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

    // all shortcuts live behind one ⌘ button: hover shows the cheat-sheet
    this.kbdBtn = btn('', () => {});
    this.kbdBtn.classList.add('kbd-btn');
    this.kbdBtn.title = '快捷键';
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', 'M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3');
    svg.append(path);
    this.kbdBtn.append(svg);
    this.buildShortcuts();
    this.kbdBtn.addEventListener('mouseenter', () => this.showShortcuts());
    this.kbdBtn.addEventListener('mouseleave', () => this.shortcuts.classList.remove('open'));
    divider();
    this.editsBtn = btn('修改 0', () => this.togglePanel());
    this.resetBtn = btn('重置', () => cb.onReset());
    divider();
    this.mdBtn = btn('复制 Markdown', () => cb.onCopyMd());
    this.cssBtn = btn('复制 CSS', () => cb.onCopyCss());
  }

  private buildShortcuts(): void {
    const title = document.createElement('div');
    title.className = 'shortcuts-title';
    title.textContent = '快捷键';
    this.shortcuts.append(title);
    for (const [keys, desc] of SHORTCUTS) {
      const row = document.createElement('div');
      row.className = 'shortcut-row';
      const kbd = document.createElement('span');
      kbd.className = 'kbd';
      kbd.textContent = keys;
      const text = document.createElement('span');
      text.className = 'shortcut-desc';
      text.textContent = desc;
      row.append(kbd, text);
      this.shortcuts.append(row);
    }
  }

  /** before -> after square thumbnails so the user can see what changed */
  private buildThumbs(rec: EditRecord): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'edit-thumbs';

    const thumb = (src: string | null, deleted = false): HTMLElement => {
      const t = document.createElement('div');
      t.className = 'thumb';
      if (deleted) {
        t.classList.add('deleted');
        t.textContent = '✕';
      } else if (src) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = '';
        t.append(img);
      } else {
        t.textContent = '?';
        t.classList.add('empty');
      }
      return t;
    };

    const arrow = document.createElement('span');
    arrow.className = 'thumb-arrow';
    arrow.textContent = '→';

    const after =
      rec.deleted || !rec.el.isConnected
        ? thumb(null, true)
        : thumb(snapshotSVG(rec.el));
    wrap.append(thumb(rec.beforeSnap), arrow, after);
    return wrap;
  }

  private showShortcuts(): void {
    const r = this.kbdBtn.getBoundingClientRect();
    this.shortcuts.style.left = `${r.left + r.width / 2}px`;
    this.shortcuts.style.bottom = `${window.innerHeight - r.top + 10}px`;
    this.shortcuts.classList.add('open');
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
    this.kbdBtn.style.display = active ? '' : 'none';
    if (!active) this.shortcuts.classList.remove('open');
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
      row.append(this.buildThumbs(rec));
      const deltas: string[] = [];
      if (rec.deleted) deltas.push('删除');
      if (rec.moved) deltas.push(`移动 Δx ${rnd(rec.dx)} / Δy ${rnd(rec.dy)}`);
      if (rec.resized) {
        deltas.push(
          `尺寸 ${rnd(rec.startSize.w)}×${rnd(rec.startSize.h)} → ${rnd(rec.size.w)}×${rnd(rec.size.h)}`
        );
      }
      const propCount = Object.keys(rec.props).length;
      if (propCount) deltas.push(`样式 ×${propCount}`);
      if (rec.text !== null) deltas.push('文字');
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
