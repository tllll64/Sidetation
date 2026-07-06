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
    const props = Object.entries(rec.props);
    if (props.length) {
      lines.push(`- 样式：${props.map(([k, v]) => `\`${k}: ${v}\``).join('，')}`);
    }
    if (rec.text !== null) {
      const clip = (s: string | null): string =>
        (s ?? '').trim().replace(/\s+/g, ' ').slice(0, 80);
      lines.push(`- 文字："${clip(rec.savedText)}" → "${clip(rec.text)}"`);
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

/** one edit, serialized without any DOM references so it survives the wire */
export interface SyncEdit {
  selector: string;
  tag: string;
  deleted: boolean;
  moved: boolean;
  dx: number;
  dy: number;
  resized: boolean;
  startSize: { w: number; h: number };
  size: { w: number; h: number };
  props: Record<string, string>;
  text: { before: string | null; after: string } | null;
  originalRect: Rect;
  currentRect: Rect | null;
}

/** full snapshot POSTed to the MCP bridge; carries pre-rendered md/css so the
 *  server never needs a DOM to reproduce the export */
export interface SyncPayload {
  version: 1;
  page: { url: string; origin: string; path: string; title: string };
  viewport: { w: number; h: number };
  count: number;
  markdown: string;
  css: string;
  edits: SyncEdit[];
}

function roundRect(rect: Rect): Rect {
  return { x: r(rect.x), y: r(rect.y), w: r(rect.w), h: r(rect.h) };
}

export function toSyncPayload(records: EditRecord[]): SyncPayload {
  const live = records.filter((rec) => rec.el.isConnected);
  const edits: SyncEdit[] = live.map((rec) => {
    const o = rec.originalRect;
    return {
      selector: rec.selector,
      tag: rec.tag,
      deleted: rec.deleted,
      moved: rec.moved,
      dx: r(rec.dx),
      dy: r(rec.dy),
      resized: rec.resized,
      startSize: { w: r(rec.startSize.w), h: r(rec.startSize.h) },
      size: { w: r(rec.size.w), h: r(rec.size.h) },
      props: { ...rec.props },
      text: rec.text === null ? null : { before: rec.savedText, after: rec.text },
      originalRect: { x: r(o.x), y: r(o.y), w: r(o.w), h: r(o.h) },
      currentRect: rec.deleted ? null : roundRect(currentRect(rec)),
    };
  });
  return {
    version: 1,
    page: {
      url: location.href,
      origin: location.origin,
      path: location.pathname,
      title: document.title,
    },
    viewport: { w: window.innerWidth, h: window.innerHeight },
    count: edits.length,
    markdown: toMarkdown(records),
    css: toCSS(records),
    edits,
  };
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
      for (const [k, v] of Object.entries(rec.props)) props.push(`  ${k}: ${v};`);
    }
    const note = `/* ${rec.tag}: ${r(rec.startSize.w)}×${r(rec.startSize.h)} @ (${r(
      rec.originalRect.x
    )}, ${r(rec.originalRect.y)}) */`;
    return `${note}\n${rec.selector} {\n${props.join('\n')}\n}`;
  });
  return blocks.join('\n\n') + '\n';
}
