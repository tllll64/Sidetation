// Shared, file-backed store for Sidetation edits.
//
// Deliberately stateless-in-memory: every read re-loads the JSON file so that
// multiple processes (the receiver daemon writing, one or more MCP readers)
// always agree on the latest data. The file is tiny, so per-call reads are cheap.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const STORE_FILE =
  process.env.SIDETATION_STORE ?? path.join(os.homedir(), '.sidetation-mcp.json');

const EMPTY = { pages: {}, lastUrl: null };

/** always reads fresh from disk; never caches */
export function loadStore() {
  try {
    const parsed = JSON.parse(fs.readFileSync(STORE_FILE, 'utf8'));
    if (parsed && typeof parsed === 'object' && parsed.pages) {
      return { pages: parsed.pages, lastUrl: parsed.lastUrl ?? null };
    }
  } catch {
    // missing / unreadable / malformed: treat as empty
  }
  return { pages: {}, lastUrl: null };
}

function writeStore(store) {
  // write to a temp sibling then rename, so a concurrent reader never sees a
  // half-written file
  const tmp = `${STORE_FILE}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, JSON.stringify(store), 'utf8');
  fs.renameSync(tmp, STORE_FILE);
}

/** merge one page snapshot in; returns the ingested url */
export function ingest(payload) {
  const url = payload?.page?.url;
  if (!url) throw new Error('payload missing page.url');
  const store = loadStore();
  store.pages[url] = { ...payload, receivedAt: new Date().toISOString() };
  store.lastUrl = url;
  writeStore(store);
  return url;
}

/** the snapshot for an explicit url, or the most recently ingested one */
export function resolve(url) {
  const store = loadStore();
  const key = url ?? store.lastUrl;
  if (!key) return null;
  return store.pages[key] ?? null;
}

export function listPages() {
  const store = loadStore();
  return Object.values(store.pages).map((p) => ({
    url: p.page.url,
    title: p.page.title,
    count: p.count,
    receivedAt: p.receivedAt,
    latest: p.page.url === store.lastUrl,
  }));
}

/** clear one page (by url) or everything; returns a human summary */
export function clear(url) {
  const store = loadStore();
  if (url) {
    delete store.pages[url];
    if (store.lastUrl === url) store.lastUrl = null;
  } else {
    store.pages = {};
    store.lastUrl = null;
  }
  writeStore(store);
  return url ? `已清除 ${url} 的修改。` : '已清除全部修改。';
}

export function pageCount() {
  return Object.keys(loadStore().pages).length;
}
