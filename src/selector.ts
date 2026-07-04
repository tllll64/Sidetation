/**
 * Generate a selector that is stable enough for an AI agent to grep the
 * source code with: prefer ids and test attributes, filter out hashed
 * class names produced by CSS-in-JS / CSS modules.
 */

const HASHED_CLASS = /(^|[-_])[0-9a-f]{5,}([-_]|$)|^(css|sc|jss|emotion)-|__[A-Za-z0-9]{5,}$/i;
const TEST_ATTRS = ['data-testid', 'data-test', 'data-cy'];

function stableClasses(el: Element): string[] {
  return Array.from(el.classList)
    .filter((c) => c.length <= 24 && !HASHED_CLASS.test(c) && !/\d{3,}/.test(c))
    .slice(0, 2);
}

function stableId(el: Element): string | null {
  if (!el.id) return null;
  if (/\d{3,}/.test(el.id) || /^[0-9a-f-]{8,}$/i.test(el.id)) return null;
  return el.id;
}

function segment(el: Element): string {
  const tag = el.tagName.toLowerCase();
  for (const attr of TEST_ATTRS) {
    const v = el.getAttribute(attr);
    if (v) return `${tag}[${attr}="${v}"]`;
  }
  const cls = stableClasses(el)
    .map((c) => `.${CSS.escape(c)}`)
    .join('');
  return tag + cls;
}

function matchesOnly(sel: string, el: Element): boolean {
  try {
    const found = document.querySelectorAll(sel);
    return found.length === 1 && found[0] === el;
  } catch {
    return false;
  }
}

/** segment() plus :nth-of-type, but only when siblings of the same tag actually need it */
function segmentWithPosition(el: Element): string {
  const base = segment(el);
  const parent = el.parentElement;
  if (!parent) return base;
  const sameTag = Array.from(parent.children).filter((c) => c.tagName === el.tagName);
  if (sameTag.length <= 1) return base;
  return `${base}:nth-of-type(${sameTag.indexOf(el) + 1})`;
}

/**
 * Walk up from el building a selector one ancestor at a time, returning as
 * soon as it uniquely matches. `withPosition` escalates every level to
 * :nth-of-type, needed when repeated sibling structures (card grids, list
 * items) make the plain tag/class chain ambiguous at every level.
 */
function buildChain(el: Element, withPosition: boolean): string | null {
  const parts: string[] = [];
  let cur: Element | null = el;
  while (cur && cur !== document.body && cur !== document.documentElement && parts.length < 5) {
    const curId = stableId(cur);
    if (curId && cur !== el) {
      parts.unshift(`#${CSS.escape(curId)}`);
      const sel = parts.join(' > ');
      if (matchesOnly(sel, el)) return sel;
      break;
    }
    parts.unshift(withPosition ? segmentWithPosition(cur) : segment(cur));
    const sel = parts.join(' > ');
    if (matchesOnly(sel, el)) return sel;
    cur = cur.parentElement;
  }
  return null;
}

export function generateSelector(el: Element): string {
  const id = stableId(el);
  if (id) {
    const sel = `#${CSS.escape(id)}`;
    if (matchesOnly(sel, el)) return sel;
  }

  const plain = buildChain(el, false);
  if (plain) return plain;

  const positional = buildChain(el, true);
  if (positional) return positional;

  // last resort (>5 ancestors of repeated structure): best-effort positional chain
  const parts: string[] = [];
  let cur: Element | null = el;
  while (cur && cur !== document.body && cur !== document.documentElement && parts.length < 5) {
    parts.unshift(segmentWithPosition(cur));
    cur = cur.parentElement;
  }
  return parts.join(' > ');
}

/** short human-readable label, e.g. `button.primary` */
export function shortLabel(el: Element): string {
  const tag = el.tagName.toLowerCase();
  const id = stableId(el);
  if (id) return `${tag}#${id}`;
  const cls = stableClasses(el);
  return cls.length ? `${tag}.${cls[0]}` : tag;
}
