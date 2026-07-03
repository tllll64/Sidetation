import type { EditRecord } from './types';

function restoreProp(el: HTMLElement, prop: string, saved: string): void {
  if (saved) el.style.setProperty(prop, saved);
  else el.style.removeProperty(prop);
}

/**
 * Project a record's current state onto the element's inline styles.
 * A pristine record (no move/resize/delete) restores the element exactly,
 * so this is also the revert path.
 */
export function applyRecord(rec: EditRecord): void {
  const { el, savedInline } = rec;

  if (rec.deleted) {
    el.style.display = 'none';
  } else if (rec.resized && rec.baseDisplay === 'inline') {
    el.style.display = 'inline-block';
  } else {
    restoreProp(el, 'display', savedInline.display);
  }

  if (rec.moved && (rec.dx !== 0 || rec.dy !== 0)) {
    const t = `translate(${rec.dx}px, ${rec.dy}px)`;
    // translate first so the shift stays in screen space even when the
    // element already has a transform (rotation, scale, ...)
    el.style.transform = rec.baseTransform === 'none' ? t : `${t} ${rec.baseTransform}`;
  } else {
    restoreProp(el, 'transform', savedInline.transform);
  }

  if (rec.resized) {
    el.style.width = `${rec.size.w - rec.sizeAdj.w}px`;
    el.style.height = `${rec.size.h - rec.sizeAdj.h}px`;
  } else {
    restoreProp(el, 'width', savedInline.width);
    restoreProp(el, 'height', savedInline.height);
  }

  // panel-edited properties: apply current values, restore removed ones
  const keys = new Set([...Object.keys(rec.savedProps), ...Object.keys(rec.props)]);
  for (const k of keys) {
    if (k in rec.props) el.style.setProperty(k, rec.props[k]);
    else restoreProp(el, k, rec.savedProps[k] ?? '');
  }

  // text (pure-text elements only); never while the user is typing in it
  if (rec.savedText !== null && !el.hasAttribute('contenteditable')) {
    const want = rec.text ?? rec.savedText;
    if (el.textContent !== want) el.textContent = want;
  }
}
