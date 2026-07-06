// Builds a Sidetation McpServer with its four read tools. Every tool reads the
// store fresh (see store.mjs), so the same definition works whether it's driven
// over stdio (server.mjs) or Streamable HTTP (receiver.mjs), and stays correct
// when several clients run at once.

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { resolve, listPages, clear } from './store.mjs';

export function buildMcp() {
  const mcp = new McpServer({ name: 'sidetation', version: '0.1.0' });
  const text = (s) => ({ content: [{ type: 'text', text: s }] });

  mcp.registerTool(
    'get_latest_edits',
    {
      title: '读取最近的视觉修改（Markdown）',
      description:
        '返回用户在浏览器里用 Sidetation 做的视觉修改，Markdown 格式，含稳定选择器、位移与 before/after 盒模型，直接据此改源码。不传 url 时取最近同步的页面。',
      inputSchema: { url: z.string().optional() },
    },
    async ({ url }) => {
      const snap = resolve(url);
      if (!snap) return text('还没有任何同步的修改。请在浏览器里点「同步 MCP」。');
      return text(snap.markdown);
    }
  );

  mcp.registerTool(
    'get_edits_json',
    {
      title: '读取视觉修改（结构化 JSON）',
      description:
        '返回结构化的修改数据（selector / tag / dx,dy / size / props / text / 原始与当前盒模型），适合需要精确数值的落码场景。',
      inputSchema: { url: z.string().optional() },
    },
    async ({ url }) => {
      const snap = resolve(url);
      if (!snap) return text('还没有任何同步的修改。');
      return text(
        JSON.stringify({ page: snap.page, viewport: snap.viewport, edits: snap.edits }, null, 2)
      );
    }
  );

  mcp.registerTool(
    'list_pages',
    {
      title: '列出已同步修改的页面',
      description: '列出目前存有 Sidetation 修改的所有页面 URL、修改数量与同步时间。',
      inputSchema: {},
    },
    async () => {
      const pages = listPages();
      if (pages.length === 0) return text('还没有任何同步的页面。');
      return text(JSON.stringify(pages, null, 2));
    }
  );

  mcp.registerTool(
    'clear_edits',
    {
      title: '清空已同步的修改',
      description: '清除已存储的修改。传 url 只清该页，不传则全清。',
      inputSchema: { url: z.string().optional() },
    },
    async ({ url }) => text(clear(url))
  );

  return mcp;
}
