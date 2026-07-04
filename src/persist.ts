import type { EditRecord } from './types';

/** subset of EditRecord that survives a page refresh (no DOM references) */
export interface PersistedRecord {
  selector: string;
  dx: number;
  dy: number;
  moved: boolean;
  resized: boolean;
  deleted: boolean;
  startSize: { w: number; h: number };
  size: { w: number; h: number };
  savedText: string | null;
  text: string | null;
  props: Record<string, string>;
  savedProps: Record<string, string>;
}

function storageKey(): string {
  return `sidetation:${location.origin}${location.pathname}`;
}

/** origin+pathname only: query/hash changes shouldn't fragment the saved session */
export function save(records: EditRecord[]): void {
  const live = records.filter((rec) => rec.el.isConnected);
  try {
    if (live.length === 0) {
      localStorage.removeItem(storageKey());
      return;
    }
    const data: PersistedRecord[] = live.map((rec) => ({
      selector: rec.selector,
      dx: rec.dx,
      dy: rec.dy,
      moved: rec.moved,
      resized: rec.resized,
      deleted: rec.deleted,
      startSize: rec.startSize,
      size: rec.size,
      savedText: rec.savedText,
      text: rec.text,
      props: rec.props,
      savedProps: rec.savedProps,
    }));
    localStorage.setItem(storageKey(), JSON.stringify(data));
  } catch {
    // storage disabled/full: editing still works this session, just won't survive a refresh
  }
}

export function load(): PersistedRecord[] | null {
  try {
    const raw = localStorage.getItem(storageKey());
    return raw ? (JSON.parse(raw) as PersistedRecord[]) : null;
  } catch {
    return null;
  }
}
