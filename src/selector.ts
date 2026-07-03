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

export function generateSelector(el: Element): string {
  const id = stableId(el);
  if (id) {
    const sel = `#${CSS.escape(id)}`;
    if (matchesOnly(sel, el)) return sel;
  }

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
    parts.unshift(segment(cur));
    const sel = parts.join(' > ');
    if (matchesOnly(sel, el)) return sel;
    cur = cur.parentElement;
  }

  // disambiguate the leaf with :nth-of-type
  const parent = el.parentElement;
  if (parent) {
    const sameTag = Array.from(parent.children).filter((c) => c.tagName === el.tagName);
    const idx = sameTag.indexOf(el) + 1;
    const withNth = [...parts.slice(0, -1), `${segment(el)}:nth-of-type(${idx})`].join(' > ');
    if (matchesOnly(withNth, el)) return withNth;
    return withNth;
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
