/**
 * Lightweight DOM-to-image: clone the element, inline a curated set of
 * computed styles, and serialize into an SVG foreignObject data URL that
 * renders directly in an <img>. External resources (images, fonts) don't
 * load inside SVG image documents — colors, text and layout still give a
 * recognizable thumbnail, which is all the edits panel needs.
 */

const STYLE_PROPS = [
  'display',
  'position',
  'flex-direction',
  'flex-wrap',
  'flex',
  'justify-content',
  'align-items',
  'align-self',
  'order',
  'gap',
  'grid-template-columns',
  'width',
  'height',
  'box-sizing',
  'padding',
  'margin',
  'border-width',
  'border-style',
  'border-color',
  'border-radius',
  'background-color',
  'background-image',
  'background-size',
  'background-position',
  'background-repeat',
  'color',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'line-height',
  'text-align',
  'text-decoration',
  'letter-spacing',
  'white-space',
  'vertical-align',
  'list-style',
  'overflow',
  'opacity',
  'box-shadow',
  'transform',
  'object-fit',
];

const MAX_NODES = 120;

function copyTree(src: Element, dst: Element, budget: { n: number }): void {
  if (budget.n++ > MAX_NODES) {
    dst.replaceChildren();
    return;
  }
  const cs = getComputedStyle(src);
  let cssText = '';
  for (const p of STYLE_PROPS) cssText += `${p}:${cs.getPropertyValue(p)};`;
  dst.setAttribute('style', cssText);

  const srcKids = Array.from(src.children);
  const dstKids = Array.from(dst.children);
  for (let i = 0; i < dstKids.length; i++) {
    const tag = dstKids[i].tagName.toLowerCase();
    if (tag === 'script' || tag === 'iframe' || tag === 'video' || tag === 'canvas') {
      dstKids[i].remove();
      continue;
    }
    copyTree(srcKids[i], dstKids[i], budget);
  }
}

export function snapshotSVG(el: HTMLElement): string | null {
  const rect = el.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return null;
  try {
    const clone = el.cloneNode(true) as HTMLElement;
    copyTree(el, clone, { n: 0 });
    // the thumbnail frames the element itself: drop outer offsets
    clone.style.margin = '0';
    clone.style.transform = 'none';
    clone.style.maxWidth = 'none';
    clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    const html = new XMLSerializer().serializeToString(clone);
    const w = Math.ceil(rect.width);
    const h = Math.ceil(rect.height);
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
      `<foreignObject width="100%" height="100%">${html}</foreignObject></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  } catch {
    return null;
  }
}
