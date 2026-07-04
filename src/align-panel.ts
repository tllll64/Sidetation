/** shown instead of the properties panel when 2+ elements are selected */

export type AlignMode = 'left' | 'hcenter' | 'right' | 'top' | 'vcenter' | 'bottom';

export interface AlignHost {
  align(mode: AlignMode): void;
  distribute(axis: 'h' | 'v'): void;
}

export class AlignPanel {
  private countEl: HTMLElement;
  private distHBtn!: HTMLButtonElement;
  private distVBtn!: HTMLButtonElement;

  constructor(
    private root: HTMLElement,
    private host: AlignHost
  ) {
    this.countEl = document.createElement('div');
    this.countEl.className = 'align-title';
    this.root.append(this.countEl);
    this.buildAlignRow();
    this.buildDistributeRow();
  }

  private buildAlignRow(): void {
    const row = document.createElement('div');
    row.className = 'align-row';
    const modes: [AlignMode, string, string][] = [
      ['left', '⇤', '左对齐'],
      ['hcenter', '↔', '水平居中对齐'],
      ['right', '⇥', '右对齐'],
      ['top', '⤒', '顶对齐'],
      ['vcenter', '↕', '垂直居中对齐'],
      ['bottom', '⤓', '底对齐'],
    ];
    for (const [mode, icon, title] of modes) {
      const b = document.createElement('button');
      b.textContent = icon;
      b.title = title;
      b.addEventListener('click', () => this.host.align(mode));
      row.append(b);
    }
    this.root.append(row);
  }

  private buildDistributeRow(): void {
    const row = document.createElement('div');
    row.className = 'align-row';
    this.distHBtn = document.createElement('button');
    this.distHBtn.textContent = '⇹';
    this.distHBtn.title = '水平等距分布';
    this.distHBtn.addEventListener('click', () => this.host.distribute('h'));
    this.distVBtn = document.createElement('button');
    this.distVBtn.textContent = '⇳';
    this.distVBtn.title = '垂直等距分布';
    this.distVBtn.addEventListener('click', () => this.host.distribute('v'));
    row.append(this.distHBtn, this.distVBtn);
    this.root.append(row);
  }

  show(count: number): void {
    this.root.classList.add('open');
    this.countEl.textContent = `已选 ${count} 个`;
    const enableDist = count >= 3;
    this.distHBtn.disabled = !enableDist;
    this.distVBtn.disabled = !enableDist;
  }

  hide(): void {
    this.root.classList.remove('open');
  }
}
