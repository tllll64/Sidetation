import type { EditRecord, Rect } from './types';

const r = Math.round;

function currentRect(rec: EditRecord): Rect {
  const b = rec.el.getBoundingClientRect();
  return { x: b.left + window.scrollX, y: b.top + window.scrollY, w: b.width, h: b.height };
}

function sign(n: number): string {
  const v = r(n);
  return v > 0 ? `+${v}` : `${v}`;
}

export function toMarkdown(records: EditRecord[]): string {
  const live = records.filter((rec) => rec.el.isConnected);
  const lines: string[] = [
    `# Sidetation 视觉修改记录（${live.length} 处）`,
    '',
    `- 页面：${location.href}`,
    `- 视口：${window.innerWidth}×${window.innerHeight}`,
    '',
  ];

  live.forEach((rec, i) => {
    const o = rec.originalRect;
    lines.push(`## ${i + 1}. \`${rec.selector}\``);
    lines.push(`- 元素：\`<${rec.tag}>\``);
    if (rec.deleted) {
      lines.push('- **删除该元素**');
      lines.push(`- 原始盒（页面坐标）：x ${r(o.x)}，y ${r(o.y)}，w ${r(o.w)}，h ${r(o.h)}`);
      lines.push('');
      return;
    }
    const cur = currentRect(rec);
    if (rec.moved) lines.push(`- 移动：Δx ${sign(rec.dx)}px，Δy ${sign(rec.dy)}px`);
    if (rec.resized) {
      lines.push(
        `- 尺寸：${r(rec.startSize.w)}×${r(rec.startSize.h)} → ${r(rec.size.w)}×${r(rec.size.h)}`
      );
    }
    lines.push(`- 原始盒（页面坐标）：x ${r(o.x)}，y ${r(o.y)}，w ${r(o.w)}，h ${r(o.h)}`);
    lines.push(`- 修改后：x ${r(cur.x)}，y ${r(cur.y)}，w ${r(cur.w)}，h ${r(cur.h)}`);
    lines.push('');
  });

  lines.push('---');
  lines.push(
    '请把以上视觉改动落实到源码中：根据元素所在布局选择合适的方式（margin / padding / flex / grid / gap / width / height 等），' +
      '不要直接照抄 transform 位移，那只是编辑器里的临时表现。'
  );
  return lines.join('\n');
}

export function toCSS(records: EditRecord[]): string {
  const live = records.filter((rec) => rec.el.isConnected);
  const blocks = live.map((rec) => {
    const props: string[] = [];
    if (rec.deleted) {
      props.push('  display: none;');
    } else {
      if (rec.moved) props.push(`  transform: translate(${r(rec.dx)}px, ${r(rec.dy)}px);`);
      if (rec.resized) {
        props.push(`  width: ${r(rec.size.w - rec.sizeAdj.w)}px;`);
        props.push(`  height: ${r(rec.size.h - rec.sizeAdj.h)}px;`);
      }
    }
    const note = `/* ${rec.tag}: ${r(rec.startSize.w)}×${r(rec.startSize.h)} @ (${r(
      rec.originalRect.x
    )}, ${r(rec.originalRect.y)}) */`;
    return `${note}\n${rec.selector} {\n${props.join('\n')}\n}`;
  });
  return blocks.join('\n\n') + '\n';
}
