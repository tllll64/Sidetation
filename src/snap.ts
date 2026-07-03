export interface SnapResult {
  adjX: number;
  adjY: number;
  guideV: number | null;
  guideH: number | null;
}

/**
 * Figma-style smart guides: snap the dragged element's edges and center
 * lines to those of its siblings and parent (viewport coordinates).
 */
export function computeSnap(
  el: HTMLElement,
  proposed: { left: number; top: number; width: number; height: number },
  threshold: number
): SnapResult {
  const xs: number[] = [];
  const ys: number[] = [];
  const collect = (r: DOMRect): void => {
    xs.push(r.left, r.right, r.left + r.width / 2);
    ys.push(r.top, r.bottom, r.top + r.height / 2);
  };

  const parent = el.parentElement;
  if (parent && parent !== document.body) collect(parent.getBoundingClientRect());
  if (parent) {
    let count = 0;
    for (const sib of Array.from(parent.children)) {
      if (sib === el || !(sib instanceof HTMLElement)) continue;
      const r = sib.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      collect(r);
      if (++count >= 30) break;
    }
  }

  const edgesX = [proposed.left, proposed.left + proposed.width, proposed.left + proposed.width / 2];
  const edgesY = [proposed.top, proposed.top + proposed.height, proposed.top + proposed.height / 2];

  const best = (edges: number[], candidates: number[]): { adj: number; guide: number } | null => {
    let bestDist = threshold + 1;
    let result: { adj: number; guide: number } | null = null;
    for (const edge of edges) {
      for (const c of candidates) {
        const d = Math.abs(c - edge);
        if (d < bestDist) {
          bestDist = d;
          result = { adj: c - edge, guide: c };
        }
      }
    }
    return result;
  };

  const bx = best(edgesX, xs);
  const by = best(edgesY, ys);
  return {
    adjX: bx?.adj ?? 0,
    adjY: by?.adj ?? 0,
    guideV: bx?.guide ?? null,
    guideH: by?.guide ?? null,
  };
}
