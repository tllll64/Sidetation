const ct = `
:host {
  all: initial;
}
* {
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", sans-serif;
}

/* ---- hover highlight ---- */
.hover-box {
  position: fixed;
  display: none;
  pointer-events: none;
  border: 1px dashed rgba(79, 140, 255, 0.9);
  background: rgba(79, 140, 255, 0.08);
  z-index: 1;
}

/* ---- selection box + handles ---- */
.sel-box {
  position: fixed;
  display: none;
  pointer-events: none;
  border: 1.5px solid #4f8cff;
  z-index: 2;
}
.sel-label {
  position: absolute;
  top: -24px;
  left: -1.5px;
  padding: 2px 8px;
  background: #4f8cff;
  color: #fff;
  font-size: 11px;
  line-height: 16px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
}
.handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #fff;
  border: 1.5px solid #4f8cff;
  border-radius: 2px;
  pointer-events: auto;
}
.handle[data-dir="nw"] { top: -6px;  left: -6px;  cursor: nwse-resize; }
.handle[data-dir="n"]  { top: -6px;  left: calc(50% - 5px); cursor: ns-resize; }
.handle[data-dir="ne"] { top: -6px;  right: -6px; cursor: nesw-resize; }
.handle[data-dir="e"]  { top: calc(50% - 5px); right: -6px; cursor: ew-resize; }
.handle[data-dir="se"] { bottom: -6px; right: -6px; cursor: nwse-resize; }
.handle[data-dir="s"]  { bottom: -6px; left: calc(50% - 5px); cursor: ns-resize; }
.handle[data-dir="sw"] { bottom: -6px; left: -6px; cursor: nesw-resize; }
.handle[data-dir="w"]  { top: calc(50% - 5px); left: -6px; cursor: ew-resize; }

/* ---- multi-selection boxes (no handles) ---- */
.multi-box {
  position: fixed;
  display: none;
  pointer-events: none;
  border: 1.5px solid #4f8cff;
  background: rgba(79, 140, 255, 0.06);
  z-index: 2;
}

/* ---- alignment guides ---- */
.guide {
  position: fixed;
  display: none;
  pointer-events: none;
  background: #ff4f8c;
  z-index: 3;
}
.guide-v { width: 1px; top: 0; bottom: 0; }
.guide-h { height: 1px; left: 0; right: 0; }

/* ---- toolbar ---- */
.toolbar {
  position: fixed;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  background: #1c1e26;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
  pointer-events: auto;
  z-index: 10;
}
.brand {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px 0 6px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.2px;
}
.brand-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: #4f8cff;
  transform: rotate(45deg);
}
.toolbar button {
  appearance: none;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
  line-height: 1;
  padding: 7px 10px;
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
}
.toolbar button:hover { background: rgba(255, 255, 255, 0.09); }
.toolbar button:disabled { opacity: 0.35; cursor: default; }
.toolbar button:disabled:hover { background: transparent; }
.toolbar button.primary {
  background: #4f8cff;
  color: #fff;
  font-weight: 600;
}
.toolbar button.primary:hover { background: #3f7df5; }
.toolbar button.primary.active { background: #e8583f; }
.toolbar button.primary.active:hover { background: #d84c34; }
.divider {
  width: 1px;
  height: 16px;
  background: rgba(255, 255, 255, 0.12);
  margin: 0 2px;
}
.kbd-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 9px;
}
.kbd-btn svg {
  display: block;
  width: 14px;
  height: 14px;
}

/* ---- shortcuts cheat-sheet (hover popover) ---- */
.shortcuts {
  position: fixed;
  transform: translateX(-50%);
  width: 300px;
  display: none;
  background: #1c1e26;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  padding: 12px 14px;
  pointer-events: none;
  z-index: 12;
}
.shortcuts.open { display: block; }
.shortcuts-title {
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 10px;
}
.shortcut-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 7px;
}
.shortcut-row:last-child { margin-bottom: 0; }
.kbd {
  flex-shrink: 0;
  min-width: 108px;
  background: #12141b;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 5px;
  color: #e8eaf0;
  font-size: 11px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  padding: 3px 7px;
  text-align: center;
}
.shortcut-desc {
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
}

/* ---- edits panel ---- */
.panel {
  position: fixed;
  left: 50%;
  bottom: 66px;
  transform: translateX(-50%);
  width: 480px;
  max-width: calc(100vw - 32px);
  max-height: 320px;
  overflow-y: auto;
  display: none;
  background: #1c1e26;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  pointer-events: auto;
  padding: 6px;
  z-index: 9;
}
.panel.open { display: block; }
.edit-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
}
.edit-row:hover { background: rgba(255, 255, 255, 0.05); }
.edit-thumbs {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.thumb {
  width: 44px;
  height: 44px;
  border-radius: 6px;
  background:
    linear-gradient(45deg, rgba(255, 255, 255, 0.04) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.04) 75%),
    #12141b;
  background-size: 10px 10px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}
.thumb img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.thumb.deleted {
  color: #e8583f;
  font-size: 14px;
  border-style: dashed;
}
.thumb.empty {
  color: rgba(255, 255, 255, 0.3);
  font-size: 12px;
}
.thumb-arrow {
  color: rgba(255, 255, 255, 0.4);
  font-size: 10px;
}
.edit-info { flex: 1; min-width: 0; }
.edit-sel {
  color: #8fb4ff;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.edit-delta {
  color: rgba(255, 255, 255, 0.55);
  font-size: 11px;
  margin-top: 3px;
}
.edit-row button {
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: transparent;
  color: rgba(255, 255, 255, 0.75);
  font-size: 11px;
  padding: 4px 9px;
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
}
.edit-row button:hover { border-color: #e8583f; color: #e8583f; }
.panel-empty {
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
  text-align: center;
  padding: 20px 0;
}

/* ---- properties panel ---- */
.props {
  position: fixed;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 232px;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  display: none;
  background: #1c1e26;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  pointer-events: auto;
  z-index: 8;
  color: #e8eaf0;
  padding: 2px 0 6px;
}
.props.open { display: block; }
.props-section {
  padding: 10px 12px 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}
.props-section:first-of-type { border-top: none; }
.props-title {
  font-weight: 600;
  font-size: 12px;
  color: #fff;
  margin-bottom: 8px;
}
.props-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.props-label {
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
  width: 56px;
  flex-shrink: 0;
}
.props input[type="number"] {
  width: 100%;
  min-width: 0;
  background: #12141b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #fff;
  font-size: 12px;
  padding: 5px 7px;
  outline: none;
  user-select: text;
  -webkit-user-select: text;
}
.props input[type="number"]:focus { border-color: #4f8cff; }
.props input[type="color"] {
  width: 28px;
  height: 26px;
  padding: 1px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
}
.seg {
  flex: 1;
  display: flex;
  background: #12141b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
}
.seg button {
  flex: 1;
  appearance: none;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  padding: 6px 0;
  cursor: pointer;
}
.seg button.on { background: #4f8cff; color: #fff; }
.align-grid {
  display: grid;
  grid-template-columns: repeat(3, 20px);
  grid-auto-rows: 20px;
  gap: 2px;
  background: #12141b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 4px;
  flex-shrink: 0;
}
.align-grid button {
  appearance: none;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
}
.align-grid button::after {
  content: '';
  position: absolute;
  inset: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
}
.align-grid button.on { background: rgba(79, 140, 255, 0.25); }
.align-grid button.on::after { background: #4f8cff; inset: 5px; }
.props .disabled { opacity: 0.35; pointer-events: none; }
.pad-toggle {
  appearance: none;
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  background: #12141b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  cursor: pointer;
}
.pad-toggle:hover { color: #fff; }
.pad-toggle.on { background: #4f8cff; color: #fff; border-color: #4f8cff; }
.pad-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.props .check {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  cursor: pointer;
}
.props .check input { accent-color: #4f8cff; }

/* ---- align / distribute panel (multi-select) ---- */
.align-panel {
  position: fixed;
  transform: translate(-50%, calc(-100% - 12px));
  display: none;
  flex-direction: column;
  gap: 8px;
  background: #1c1e26;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  padding: 10px 12px;
  pointer-events: auto;
  z-index: 9;
}
.align-panel.open { display: flex; }
.align-title {
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  font-weight: 600;
}
.align-row {
  display: flex;
  gap: 4px;
}
.align-row button {
  appearance: none;
  width: 28px;
  height: 28px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #12141b;
  color: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}
.align-row button:hover { border-color: #4f8cff; color: #fff; }
.align-row button:disabled { opacity: 0.35; cursor: default; }
.align-row button:disabled:hover { border-color: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.8); }

/* ---- toast ---- */
.toast {
  position: fixed;
  left: 50%;
  bottom: 70px;
  transform: translateX(-50%) translateY(6px);
  background: #2b2e3b;
  color: #fff;
  font-size: 12px;
  padding: 8px 14px;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  opacity: 0;
  transition: opacity 0.18s ease, transform 0.18s ease;
  pointer-events: none;
  z-index: 11;
}
.toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
`, ht = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
class pt {
  constructor() {
    this.host = document.createElement("div"), this.multiBoxes = [], this.onHandleDown = null, this.toastTimer = 0, this.host.setAttribute("data-sidetation", ""), Object.assign(this.host.style, {
      position: "fixed",
      inset: "0",
      zIndex: "2147483647",
      pointerEvents: "none"
    });
    const t = this.host.attachShadow({ mode: "open" });
    this.shadow = t;
    const e = document.createElement("style");
    e.textContent = ct, t.append(e);
    const s = (o) => {
      const i = document.createElement("div");
      return i.className = o, t.append(i), i;
    };
    this.hoverBox = s("hover-box"), this.selBox = s("sel-box"), this.selLabel = document.createElement("div"), this.selLabel.className = "sel-label", this.selBox.append(this.selLabel);
    for (const o of ht) {
      const i = document.createElement("div");
      i.className = "handle", i.dataset.dir = o, i.addEventListener("pointerdown", (n) => {
        var a;
        return (a = this.onHandleDown) == null ? void 0 : a.call(this, o, n);
      }), this.selBox.append(i);
    }
    this.guideV = s("guide guide-v"), this.guideH = s("guide guide-h"), this.panelEl = s("panel"), this.propsEl = s("props"), this.alignEl = s("align-panel"), this.shortcutsEl = s("shortcuts"), this.toolbarEl = s("toolbar"), this.toastEl = s("toast"), document.documentElement.appendChild(this.host);
  }
  place(t, e) {
    if (!e) {
      t.style.display = "none";
      return;
    }
    t.style.display = "block", t.style.left = `${e.left}px`, t.style.top = `${e.top}px`, t.style.width = `${e.width}px`, t.style.height = `${e.height}px`;
  }
  setHover(t) {
    this.place(this.hoverBox, t);
  }
  setSelection(t, e = "") {
    this.place(this.selBox, t), t && (this.selLabel.textContent = e);
  }
  /** plain highlight boxes (no handles) for a multi-selection */
  setMultiSelection(t) {
    for (; this.multiBoxes.length < t.length; ) {
      const e = document.createElement("div");
      e.className = "multi-box", this.shadow.append(e), this.multiBoxes.push(e);
    }
    this.multiBoxes.forEach((e, s) => this.place(e, t[s] ?? null));
  }
  /** float the align/distribute panel above the selection's bounding box */
  positionAlignPanel(t) {
    if (t.length === 0) return;
    const e = Math.min(...t.map((i) => i.left)), s = Math.max(...t.map((i) => i.right)), o = Math.min(...t.map((i) => i.top));
    this.alignEl.style.left = `${(e + s) / 2}px`, this.alignEl.style.top = `${Math.max(0, o)}px`;
  }
  setGuides(t, e) {
    this.guideV.style.display = t === null ? "none" : "block", t !== null && (this.guideV.style.left = `${t}px`), this.guideH.style.display = e === null ? "none" : "block", e !== null && (this.guideH.style.top = `${e}px`);
  }
  toast(t) {
    this.toastEl.textContent = t, this.toastEl.classList.add("show"), clearTimeout(this.toastTimer), this.toastTimer = window.setTimeout(() => this.toastEl.classList.remove("show"), 1600);
  }
  destroy() {
    clearTimeout(this.toastTimer), this.host.remove();
  }
}
const ut = /(^|[-_])[0-9a-f]{5,}([-_]|$)|^(css|sc|jss|emotion)-|__[A-Za-z0-9]{5,}$/i, ft = ["data-testid", "data-test", "data-cy"];
function it(r) {
  return Array.from(r.classList).filter((t) => t.length <= 24 && !ut.test(t) && !/\d{3,}/.test(t)).slice(0, 2);
}
function Y(r) {
  return !r.id || /\d{3,}/.test(r.id) || /^[0-9a-f-]{8,}$/i.test(r.id) ? null : r.id;
}
function rt(r) {
  const t = r.tagName.toLowerCase();
  for (const s of ft) {
    const o = r.getAttribute(s);
    if (o) return `${t}[${s}="${o}"]`;
  }
  const e = it(r).map((s) => `.${CSS.escape(s)}`).join("");
  return t + e;
}
function W(r, t) {
  try {
    const e = document.querySelectorAll(r);
    return e.length === 1 && e[0] === t;
  } catch {
    return !1;
  }
}
function at(r) {
  const t = rt(r), e = r.parentElement;
  if (!e) return t;
  const s = Array.from(e.children).filter((o) => o.tagName === r.tagName);
  return s.length <= 1 ? t : `${t}:nth-of-type(${s.indexOf(r) + 1})`;
}
function J(r, t) {
  const e = [];
  let s = r;
  for (; s && s !== document.body && s !== document.documentElement && e.length < 5; ) {
    const o = Y(s);
    if (o && s !== r) {
      e.unshift(`#${CSS.escape(o)}`);
      const n = e.join(" > ");
      if (W(n, r)) return n;
      break;
    }
    e.unshift(t ? at(s) : rt(s));
    const i = e.join(" > ");
    if (W(i, r)) return i;
    s = s.parentElement;
  }
  return null;
}
function gt(r) {
  const t = Y(r);
  if (t) {
    const n = `#${CSS.escape(t)}`;
    if (W(n, r)) return n;
  }
  const e = J(r, !1);
  if (e) return e;
  const s = J(r, !0);
  if (s) return s;
  const o = [];
  let i = r;
  for (; i && i !== document.body && i !== document.documentElement && o.length < 5; )
    o.unshift(at(i)), i = i.parentElement;
  return o.join(" > ");
}
function mt(r) {
  const t = r.tagName.toLowerCase(), e = Y(r);
  if (e) return `${t}#${e}`;
  const s = it(r);
  return s.length ? `${t}.${s[0]}` : t;
}
function L(r, t, e) {
  e ? r.style.setProperty(t, e) : r.style.removeProperty(t);
}
function $(r) {
  const { el: t, savedInline: e } = r;
  if (r.deleted ? t.style.display = "none" : r.resized && r.baseDisplay === "inline" ? t.style.display = "inline-block" : L(t, "display", e.display), r.moved && (r.dx !== 0 || r.dy !== 0)) {
    const o = `translate(${r.dx}px, ${r.dy}px)`;
    t.style.transform = r.baseTransform === "none" ? o : `${o} ${r.baseTransform}`;
  } else
    L(t, "transform", e.transform);
  r.resized ? (t.style.width = `${r.size.w - r.sizeAdj.w}px`, t.style.height = `${r.size.h - r.sizeAdj.h}px`) : (L(t, "width", e.width), L(t, "height", e.height));
  const s = /* @__PURE__ */ new Set([...Object.keys(r.savedProps), ...Object.keys(r.props)]);
  for (const o of s)
    o in r.props ? t.style.setProperty(o, r.props[o]) : L(t, o, r.savedProps[o] ?? "");
  if (r.savedText !== null && !t.hasAttribute("contenteditable")) {
    const o = r.text ?? r.savedText;
    t.textContent !== o && (t.textContent = o);
  }
}
const xt = [
  "display",
  "position",
  "flex-direction",
  "flex-wrap",
  "flex",
  "justify-content",
  "align-items",
  "align-self",
  "order",
  "gap",
  "grid-template-columns",
  "width",
  "height",
  "box-sizing",
  "padding",
  "margin",
  "border-width",
  "border-style",
  "border-color",
  "border-radius",
  "background-color",
  "background-image",
  "background-size",
  "background-position",
  "background-repeat",
  "color",
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "line-height",
  "text-align",
  "text-decoration",
  "letter-spacing",
  "white-space",
  "vertical-align",
  "list-style",
  "overflow",
  "opacity",
  "box-shadow",
  "transform",
  "object-fit"
], bt = 120;
function lt(r, t, e) {
  if (e.n++ > bt) {
    t.replaceChildren();
    return;
  }
  const s = getComputedStyle(r);
  let o = "";
  for (const a of xt) o += `${a}:${s.getPropertyValue(a)};`;
  t.setAttribute("style", o);
  const i = Array.from(r.children), n = Array.from(t.children);
  for (let a = 0; a < n.length; a++) {
    const l = n[a].tagName.toLowerCase();
    if (l === "script" || l === "iframe" || l === "video" || l === "canvas") {
      n[a].remove();
      continue;
    }
    lt(i[a], n[a], e);
  }
}
function dt(r) {
  const t = r.getBoundingClientRect();
  if (t.width < 1 || t.height < 1) return null;
  try {
    const e = r.cloneNode(!0);
    lt(r, e, { n: 0 }), e.style.margin = "0", e.style.transform = "none", e.style.maxWidth = "none", e.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
    const s = new XMLSerializer().serializeToString(e), o = Math.ceil(t.width), i = Math.ceil(t.height), n = `<svg xmlns="http://www.w3.org/2000/svg" width="${o}" height="${i}"><foreignObject width="100%" height="100%">${s}</foreignObject></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(n)}`;
  } catch {
    return null;
  }
}
const yt = 800;
function Q(r) {
  return !r.moved && !r.resized && !r.deleted && Object.keys(r.props).length === 0 && r.text === null;
}
function wt(r, t) {
  const e = Object.keys(r);
  return e.length === Object.keys(t).length && e.every((s) => r[s] === t[s]);
}
function vt(r, t) {
  return r.dx === t.dx && r.dy === t.dy && r.size.w === t.size.w && r.size.h === t.size.h && r.moved === t.moved && r.resized === t.resized && r.deleted === t.deleted && r.text === t.text && wt(r.props, t.props);
}
const Et = {
  dx: 0,
  dy: 0,
  moved: !1,
  resized: !1,
  deleted: !1,
  text: null
};
class kt {
  constructor() {
    this.records = /* @__PURE__ */ new Map(), this.undoStack = [], this.redoStack = [], this.seq = 1, this.onChange = null;
  }
  ensure(t) {
    let e = this.records.get(t);
    if (e) return e;
    const s = t.getBoundingClientRect(), o = getComputedStyle(t), i = o.boxSizing === "content-box", n = (a) => parseFloat(a) || 0;
    return e = {
      id: this.seq++,
      el: t,
      selector: gt(t),
      tag: t.tagName.toLowerCase(),
      originalRect: {
        x: s.left + window.scrollX,
        y: s.top + window.scrollY,
        w: s.width,
        h: s.height
      },
      savedInline: {
        transform: t.style.getPropertyValue("transform"),
        width: t.style.getPropertyValue("width"),
        height: t.style.getPropertyValue("height"),
        display: t.style.getPropertyValue("display")
      },
      baseTransform: o.transform,
      baseDisplay: o.display,
      sizeAdj: i ? {
        w: n(o.paddingLeft) + n(o.paddingRight) + n(o.borderLeftWidth) + n(o.borderRightWidth),
        h: n(o.paddingTop) + n(o.paddingBottom) + n(o.borderTopWidth) + n(o.borderBottomWidth)
      } : { w: 0, h: 0 },
      dx: 0,
      dy: 0,
      moved: !1,
      resized: !1,
      deleted: !1,
      startSize: { w: s.width, h: s.height },
      size: { w: s.width, h: s.height },
      beforeSnap: dt(t),
      // captured pre-edit: this IS the "before"
      savedText: t.childElementCount === 0 ? t.textContent : null,
      text: null,
      props: {},
      savedProps: {}
    }, this.records.set(t, e), e;
  }
  get(t) {
    return this.records.get(t);
  }
  all() {
    return Array.from(this.records.values());
  }
  snapshot(t) {
    return {
      dx: t.dx,
      dy: t.dy,
      size: { ...t.size },
      moved: t.moved,
      resized: t.resized,
      deleted: t.deleted,
      props: { ...t.props },
      text: t.text
    };
  }
  /** finish a single-element gesture */
  commit(t, e, s) {
    this.commitBatch([{ rec: t, before: e }], s);
  }
  /** finish a (possibly multi-select) gesture as ONE undo step */
  commitBatch(t, e) {
    const s = [];
    for (const { rec: a, before: l } of t) {
      a.dx === 0 && a.dy === 0 && (a.moved = !1), $(a);
      const c = this.snapshot(a);
      vt(l, c) || s.push({ rec: a, before: l, after: c }), this.cleanup(a);
    }
    if (s.length === 0) {
      this.emit();
      return;
    }
    const o = (e == null ? void 0 : e.coalesce) ?? null, i = this.undoStack[this.undoStack.length - 1];
    o !== null && i !== void 0 && i.coalesce === o && Date.now() - i.at < yt && i.entries.length === s.length && i.entries.every((a, l) => a.rec === s[l].rec) ? (s.forEach((a, l) => i.entries[l].after = a.after), i.at = Date.now()) : this.undoStack.push({ entries: s, coalesce: o, at: Date.now() }), this.redoStack.length = 0, this.emit();
  }
  undo() {
    const t = this.undoStack.pop();
    if (!t) return !1;
    for (const e of t.entries) this.applySnap(e.rec, e.before);
    return this.redoStack.push(t), this.emit(), !0;
  }
  redo() {
    const t = this.redoStack.pop();
    if (!t) return !1;
    for (const e of t.entries) this.applySnap(e.rec, e.after);
    return this.undoStack.push(t), this.emit(), !0;
  }
  /** panel revert: back to pristine, as an undoable action */
  revert(t) {
    const e = this.all().find((o) => o.id === t);
    if (!e) return;
    const s = this.snapshot(e);
    this.applySnap(e, { ...Et, size: { ...e.startSize }, props: {} }), this.undoStack.push({
      entries: [{ rec: e, before: s, after: this.snapshot(e) }],
      coalesce: null,
      at: Date.now()
    }), this.redoStack.length = 0, this.emit();
  }
  resetAll() {
    for (const t of this.all()) this.revert(t.id);
  }
  applySnap(t, e) {
    t.dx = e.dx, t.dy = e.dy, t.size = { ...e.size }, t.moved = e.moved, t.resized = e.resized, t.deleted = e.deleted, t.props = { ...e.props }, t.text = e.text, $(t), this.cleanup(t);
  }
  /** keep the consolidated map in sync: pristine records drop out, edited ones stay */
  cleanup(t) {
    Q(t) ? this.records.delete(t.el) : this.records.set(t.el, t);
  }
  /**
   * Re-apply a previously saved session after a page refresh: re-resolve each
   * selector, splice the persisted state onto a freshly `ensure()`d record.
   * Returns the count of entries whose selector no longer resolves uniquely.
   */
  restore(t) {
    let e = 0;
    for (const s of t) {
      let o;
      try {
        o = document.querySelectorAll(s.selector);
      } catch {
        e++;
        continue;
      }
      if (o.length !== 1) {
        e++;
        continue;
      }
      const i = this.ensure(o[0]);
      i.dx = s.dx, i.dy = s.dy, i.moved = s.moved, i.resized = s.resized, i.deleted = s.deleted, i.startSize = { ...s.startSize }, i.size = { ...s.size }, i.text = s.text, i.props = { ...s.props }, i.savedProps = { ...s.savedProps }, $(i), this.cleanup(i);
    }
    return e;
  }
  /** drop records that were ensure()d but never turned into a real edit */
  prune() {
    for (const [t, e] of this.records)
      Q(e) && this.records.delete(t);
  }
  emit() {
    var t;
    (t = this.onChange) == null || t.call(this);
  }
}
const B = Math.round, St = [
  ["点击", "选中元素，点子元素可下钻"],
  ["⇧ 点击", "多选 / 取消多选元素"],
  ["双击", "编辑文字内容（纯文本元素）"],
  ["⌥ 点击", "选中父级元素"],
  ["拖拽", "移动元素（多选时整体移动），自动对齐吸附"],
  ["拖拽手柄 / ⇧", "缩放 / 等比缩放"],
  ["方向键 / ⇧方向键", "微调 1px / 10px"],
  ["Delete / ⌫", "删除元素"],
  ["⌘Z / ⌘⇧Z", "撤销 / 重做"],
  ["Enter / ⇧Enter", "进入子级 / 返回父级"],
  ["Tab / ⇧Tab", "下一个 / 上一个兄弟元素"],
  ["Esc", "取消选中，再按退出编辑"]
];
class zt {
  constructor(t, e, s, o) {
    this.panel = e, this.shortcuts = s, this.cb = o, this.panelOpen = !1, this.records = [];
    const i = document.createElement("div");
    i.className = "brand";
    const n = document.createElement("span");
    n.className = "brand-dot", i.append(n, "Sidetation"), t.append(i);
    const a = (p, f) => {
      const x = document.createElement("button");
      return x.textContent = p, x.addEventListener("click", f), t.append(x), x;
    }, l = () => {
      const p = document.createElement("div");
      p.className = "divider", t.append(p);
    };
    this.toggleBtn = a("开始编辑", () => o.onToggle()), this.toggleBtn.classList.add("primary"), this.kbdBtn = a("", () => {
    }), this.kbdBtn.classList.add("kbd-btn"), this.kbdBtn.title = "快捷键";
    const c = "http://www.w3.org/2000/svg", d = document.createElementNS(c, "svg");
    d.setAttribute("viewBox", "0 0 24 24"), d.setAttribute("fill", "none"), d.setAttribute("stroke", "currentColor"), d.setAttribute("stroke-width", "2"), d.setAttribute("stroke-linecap", "round"), d.setAttribute("stroke-linejoin", "round");
    const h = document.createElementNS(c, "path");
    h.setAttribute("d", "M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"), d.append(h), this.kbdBtn.append(d), this.buildShortcuts(), this.kbdBtn.addEventListener("mouseenter", () => this.showShortcuts()), this.kbdBtn.addEventListener("mouseleave", () => this.shortcuts.classList.remove("open")), l(), this.editsBtn = a("修改 0", () => this.togglePanel()), this.resetBtn = a("重置", () => o.onReset()), l(), this.mdBtn = a("复制 Markdown", () => o.onCopyMd()), this.cssBtn = a("复制 CSS", () => o.onCopyCss());
  }
  buildShortcuts() {
    const t = document.createElement("div");
    t.className = "shortcuts-title", t.textContent = "快捷键", this.shortcuts.append(t);
    for (const [e, s] of St) {
      const o = document.createElement("div");
      o.className = "shortcut-row";
      const i = document.createElement("span");
      i.className = "kbd", i.textContent = e;
      const n = document.createElement("span");
      n.className = "shortcut-desc", n.textContent = s, o.append(i, n), this.shortcuts.append(o);
    }
  }
  /** before -> after square thumbnails so the user can see what changed */
  buildThumbs(t) {
    const e = document.createElement("div");
    e.className = "edit-thumbs";
    const s = (n, a = !1) => {
      const l = document.createElement("div");
      if (l.className = "thumb", a)
        l.classList.add("deleted"), l.textContent = "✕";
      else if (n) {
        const c = document.createElement("img");
        c.src = n, c.alt = "", l.append(c);
      } else
        l.textContent = "?", l.classList.add("empty");
      return l;
    }, o = document.createElement("span");
    o.className = "thumb-arrow", o.textContent = "→";
    const i = t.deleted || !t.el.isConnected ? s(null, !0) : s(dt(t.el));
    return e.append(s(t.beforeSnap), o, i), e;
  }
  showShortcuts() {
    const t = this.kbdBtn.getBoundingClientRect();
    this.shortcuts.style.left = `${t.left + t.width / 2}px`, this.shortcuts.style.bottom = `${window.innerHeight - t.top + 10}px`, this.shortcuts.classList.add("open");
  }
  togglePanel() {
    this.panelOpen = !this.panelOpen, this.panel.classList.toggle("open", this.panelOpen), this.panelOpen && this.renderPanel();
  }
  update(t, e) {
    this.records = e, this.toggleBtn.textContent = t ? "完成" : "开始编辑", this.toggleBtn.classList.toggle("active", t), this.kbdBtn.style.display = t ? "" : "none", t || this.shortcuts.classList.remove("open"), this.editsBtn.textContent = `修改 ${e.length}`;
    const s = e.length === 0;
    this.editsBtn.disabled = s, this.resetBtn.disabled = s, this.mdBtn.disabled = s, this.cssBtn.disabled = s, s && this.panelOpen ? this.togglePanel() : this.panelOpen && this.renderPanel();
  }
  renderPanel() {
    if (this.panel.replaceChildren(), this.records.length === 0) {
      const t = document.createElement("div");
      t.className = "panel-empty", t.textContent = "还没有修改", this.panel.append(t);
      return;
    }
    for (const t of this.records) {
      const e = document.createElement("div");
      e.className = "edit-row", e.append(this.buildThumbs(t));
      const s = [];
      t.deleted && s.push("删除"), t.moved && s.push(`移动 Δx ${B(t.dx)} / Δy ${B(t.dy)}`), t.resized && s.push(
        `尺寸 ${B(t.startSize.w)}×${B(t.startSize.h)} → ${B(t.size.w)}×${B(t.size.h)}`
      );
      const o = Object.keys(t.props).length;
      o && s.push(`样式 ×${o}`), t.text !== null && s.push("文字");
      const i = document.createElement("div");
      i.className = "edit-info";
      const n = document.createElement("div");
      n.className = "edit-sel", n.textContent = t.selector;
      const a = document.createElement("div");
      a.className = "edit-delta", a.textContent = s.join(" · "), i.append(n, a), e.append(i);
      const l = document.createElement("button");
      l.textContent = "撤销", l.addEventListener("click", () => this.cb.onRevert(t.id)), e.append(l), this.panel.append(e);
    }
  }
}
const I = ["flex-start", "center", "flex-end"], F = (r) => Math.round(parseFloat(r) || 0), H = (r) => Math.round(r).toString(16).padStart(2, "0");
function tt(r) {
  const t = r.match(/rgba?\(([^)]+)\)/);
  if (!t) return { hex: "#000000", alpha: r && r !== "transparent" ? 1 : 0 };
  const e = t[1].split(",").map((s) => parseFloat(s));
  return { hex: `#${H(e[0])}${H(e[1])}${H(e[2])}`, alpha: e[3] ?? 1 };
}
function $t(r, t) {
  if (t >= 1) return r;
  const e = parseInt(r.slice(1, 3), 16), s = parseInt(r.slice(3, 5), 16), o = parseInt(r.slice(5, 7), 16);
  return `rgba(${e}, ${s}, ${o}, ${+t.toFixed(3)})`;
}
function et(r) {
  return r.includes("center") ? 1 : r.includes("end") ? 2 : 0;
}
class Ct {
  constructor(t, e) {
    this.root = t, this.host = e, this.el = null, this.flow = "none", this.cssOpen = !1, this.flowBtns = [], this.alignBtns = [], this.padSides = [], this.padIndependent = !1, this.layoutOnly = [], this.build();
  }
  // ---------- DOM construction ----------
  section(t) {
    const e = document.createElement("div");
    e.className = "props-section";
    const s = document.createElement("div");
    return s.className = "props-title", s.textContent = t, e.append(s), this.root.append(e), e;
  }
  row(t, e) {
    const s = document.createElement("div");
    if (s.className = "props-row", e) {
      const o = document.createElement("div");
      o.className = "props-label", o.textContent = e, s.append(o);
    }
    return t.append(s), s;
  }
  num(t, e, s = 0) {
    const o = document.createElement("input");
    o.type = "number", o.min = String(s);
    const i = () => {
      const n = parseFloat(o.value);
      Number.isNaN(n) || e(n);
    };
    return o.addEventListener("change", i), o.addEventListener("keydown", (n) => {
      n.key === "Enter" && (i(), o.blur());
    }), t.append(o), o;
  }
  color(t, e) {
    const s = document.createElement("input");
    return s.type = "color", s.addEventListener("change", () => e(s.value)), t.append(s), s;
  }
  build() {
    const t = document.createElement("div");
    t.className = "props-section css-section";
    const e = document.createElement("div");
    e.className = "props-title css-title", this.cssArrowEl = document.createElement("span"), this.cssArrowEl.className = "css-arrow", this.cssArrowEl.textContent = "▶", e.append(this.cssArrowEl, " CSS"), e.addEventListener("click", () => this.toggleCssViewer()), this.cssBody = document.createElement("div"), this.cssBody.className = "css-body", t.append(e, this.cssBody), this.root.append(t);
    const s = this.section("Auto layout"), o = this.row(s, "Flow"), i = document.createElement("div");
    i.className = "seg";
    const n = [
      ["none", "✕", "不使用 flex"],
      ["col", "↓", "纵向排列 (column)"],
      ["row", "→", "横向排列 (row)"],
      ["wrap", "⤸", "横向换行 (wrap)"]
    ];
    for (const [m, v, S] of n) {
      const z = document.createElement("button");
      z.textContent = v, z.title = S, z.addEventListener("click", () => this.applyFlow(m)), i.append(z), this.flowBtns.push(z);
    }
    o.append(i);
    const a = this.row(s, "W / H");
    this.wInput = this.num(a, (m) => this.host.setSize(m, null), 8), this.hInput = this.num(a, (m) => this.host.setSize(null, m), 8);
    const l = this.row(s, "Align"), c = document.createElement("div");
    c.className = "align-grid";
    for (let m = 0; m < 3; m++)
      for (let v = 0; v < 3; v++) {
        const S = document.createElement("button");
        S.addEventListener("click", () => this.applyAlign(m, v)), c.append(S), this.alignBtns.push(S);
      }
    l.append(c);
    const d = document.createElement("div");
    d.style.flex = "1";
    const h = document.createElement("div");
    h.className = "props-label", h.textContent = "Gap", d.append(h), this.gapInput = this.num(d, (m) => this.host.setProps({ gap: `${m}px` })), l.append(d), this.layoutOnly.push(c, d), this.padLinkedRow = this.row(s, "Padding"), this.padXInput = this.num(this.padLinkedRow, () => this.applyPadding()), this.padYInput = this.num(this.padLinkedRow, () => this.applyPadding()), this.padXInput.title = "水平 padding", this.padYInput.title = "垂直 padding", this.padToggle = document.createElement("button"), this.padToggle.className = "pad-toggle", this.padToggle.textContent = "⊞", this.padToggle.title = "四边独立 padding", this.padToggle.addEventListener("click", () => this.togglePadMode()), this.padLinkedRow.append(this.padToggle), this.padGridRow = this.row(s, ""), this.padGridRow.style.display = "none";
    const p = document.createElement("div");
    p.className = "pad-grid";
    const f = ["左 padding", "上 padding", "右 padding", "下 padding"];
    for (let m = 0; m < 4; m++) {
      const v = this.num(p, () => this.applyPadding());
      v.title = f[m], this.padSides.push(v);
    }
    this.padGridRow.append(p);
    const x = this.row(s), y = document.createElement("label");
    y.className = "check", this.clipInput = document.createElement("input"), this.clipInput.type = "checkbox", this.clipInput.addEventListener(
      "change",
      () => this.host.setProps({ overflow: this.clipInput.checked ? "hidden" : "visible" })
    ), y.append(this.clipInput, "Clip content"), x.append(y);
    const E = this.section("Appearance"), k = this.row(E, "Opacity %");
    this.opacityInput = this.num(
      k,
      (m) => this.host.setProps({ opacity: String(Math.min(100, Math.max(0, m)) / 100) })
    );
    const C = this.row(E, "Radius");
    this.radiusInput = this.num(C, (m) => this.host.setProps({ "border-radius": `${m}px` }));
    const T = this.section("Fill"), R = this.row(T, "Color");
    this.fillColor = this.color(R, () => this.applyFill()), this.fillPct = this.num(R, () => this.applyFill()), this.fillPct.title = "不透明度 %";
    const A = this.section("Stroke"), M = this.row(A, "Color / W");
    this.strokeColor = this.color(M, () => this.applyStroke()), this.strokeWidth = this.num(M, () => this.applyStroke()), this.strokeWidth.step = "0.5", this.strokeWidth.title = "描边宽度 px";
  }
  // ---------- writes ----------
  applyFlow(t) {
    this.flow = t, t === "none" ? this.host.setProps({ display: "block", "flex-direction": null, "flex-wrap": null }) : this.host.setProps({
      display: "flex",
      "flex-direction": t === "col" ? "column" : "row",
      "flex-wrap": t === "wrap" ? "wrap" : "nowrap"
    }), this.markFlow();
  }
  applyAlign(t, e) {
    const s = this.flow === "col" ? I[t] : I[e], o = this.flow === "col" ? I[e] : I[t];
    this.host.setProps({ "justify-content": s, "align-items": o }), this.markAlign(t, e);
  }
  applyPadding() {
    if (this.padIndependent) {
      const [t, e, s, o] = this.padSides.map((i) => parseFloat(i.value) || 0);
      this.host.setProps({ padding: `${e}px ${s}px ${o}px ${t}px` });
    } else {
      const t = parseFloat(this.padXInput.value) || 0, e = parseFloat(this.padYInput.value) || 0;
      this.host.setProps({ padding: `${e}px ${t}px` });
    }
  }
  setPadMode(t) {
    this.padIndependent = t, this.padXInput.style.display = t ? "none" : "", this.padYInput.style.display = t ? "none" : "", this.padGridRow.style.display = t ? "" : "none", this.padToggle.classList.toggle("on", t);
  }
  togglePadMode() {
    const t = !this.padIndependent;
    if (t) {
      const e = this.padXInput.value || "0", s = this.padYInput.value || "0", o = [e, s, e, s];
      this.padSides.forEach((i, n) => i.value = o[n]);
    } else
      this.padXInput.value = this.padSides[0].value || "0", this.padYInput.value = this.padSides[1].value || "0", this.applyPadding();
    this.setPadMode(t);
  }
  applyFill() {
    const t = Math.min(100, Math.max(0, parseFloat(this.fillPct.value) || 0));
    this.host.setProps({ "background-color": $t(this.fillColor.value, t / 100) });
  }
  applyStroke() {
    const t = Math.max(0, parseFloat(this.strokeWidth.value) || 0);
    this.host.setProps({
      "border-width": `${t}px`,
      "border-style": "solid",
      "border-color": this.strokeColor.value
    });
  }
  // ---------- CSS viewer ----------
  toggleCssViewer() {
    this.cssOpen = !this.cssOpen, this.cssArrowEl.classList.toggle("open", this.cssOpen), this.cssBody.classList.toggle("open", this.cssOpen), this.cssOpen && this.el && this.renderCSS(this.el);
  }
  renderCSS(t) {
    this.cssBody.replaceChildren();
    const e = getComputedStyle(t), s = (u) => e.getPropertyValue(u).trim(), o = (u, b, w, P) => u === b && b === w && w === P ? u : u === w && b === P ? `${u} ${b}` : `${u} ${b} ${w} ${P}`, i = [], n = (u, b, w) => {
      w && i.push([u, b, w]);
    };
    if (n("定位", "position", s("position")), s("position") !== "static") {
      for (const b of ["top", "right", "bottom", "left"]) {
        const w = s(b);
        w !== "auto" && n("定位", b, w);
      }
      const u = s("z-index");
      u !== "auto" && n("定位", "z-index", u);
    }
    const a = s("float");
    a !== "none" && n("定位", "float", a), n("盒模型", "display", s("display")), n("盒模型", "box-sizing", s("box-sizing")), n("盒模型", "width", s("width")), n("盒模型", "height", s("height"));
    const l = s("min-width");
    l !== "0px" && n("盒模型", "min-width", l);
    const c = s("max-width");
    c !== "none" && n("盒模型", "max-width", c);
    const d = s("min-height");
    d !== "0px" && n("盒模型", "min-height", d);
    const h = s("max-height");
    h !== "none" && n("盒模型", "max-height", h);
    const p = s("overflow-x"), f = s("overflow-y");
    n("盒模型", "overflow", p === f ? p : `${p} / ${f}`), n("间距", "margin", o(s("margin-top"), s("margin-right"), s("margin-bottom"), s("margin-left"))), n("间距", "padding", o(s("padding-top"), s("padding-right"), s("padding-bottom"), s("padding-left"))), n("字体", "font-family", s("font-family")), n("字体", "font-size", s("font-size")), n("字体", "font-weight", s("font-weight")), n("字体", "line-height", s("line-height"));
    const x = s("letter-spacing");
    x !== "normal" && n("字体", "letter-spacing", x), n("字体", "color", s("color")), n("字体", "text-align", s("text-align"));
    const y = s("text-decoration-line");
    y !== "none" && n("字体", "text-decoration", `${y} ${s("text-decoration-color")}`.trim());
    const E = s("text-transform");
    E !== "none" && n("字体", "text-transform", E);
    const k = s("white-space");
    k !== "normal" && n("字体", "white-space", k), n("背景", "background-color", s("background-color"));
    const C = s("background-image");
    C !== "none" && n("背景", "background-image", C);
    const T = s("background-size");
    T !== "auto" && n("背景", "background-size", T);
    const R = s("border-top-width"), A = s("border-top-style"), M = s("border-top-color");
    A !== "none" && n("边框", "border", `${R} ${A} ${M}`);
    const m = o(
      s("border-top-left-radius"),
      s("border-top-right-radius"),
      s("border-bottom-right-radius"),
      s("border-bottom-left-radius")
    );
    m !== "0px" && n("边框", "border-radius", m);
    const v = s("outline");
    v.startsWith("0px") || n("边框", "outline", v);
    const S = s("display");
    if (S.includes("flex")) {
      n("Flex", "flex-direction", s("flex-direction")), n("Flex", "flex-wrap", s("flex-wrap")), n("Flex", "justify-content", s("justify-content")), n("Flex", "align-items", s("align-items"));
      const u = s("row-gap"), b = s("column-gap");
      u !== "normal" && u !== "0px" && n("Flex", "gap", u === b ? u : `${u} ${b}`);
    }
    S.includes("grid") && (n("Grid", "grid-template-columns", s("grid-template-columns")), n("Grid", "grid-template-rows", s("grid-template-rows")), n("Grid", "grid-auto-flow", s("grid-auto-flow")));
    const z = s("align-self");
    z !== "auto" && n("Flex", "align-self", z);
    const V = s("flex-grow");
    V !== "0" && n("Flex", "flex-grow", V);
    const G = s("flex-shrink");
    G !== "1" && n("Flex", "flex-shrink", G);
    const U = s("opacity");
    U !== "1" && n("效果", "opacity", U);
    const K = s("box-shadow");
    K !== "none" && n("效果", "box-shadow", K);
    const _ = s("transform");
    _ !== "none" && n("效果", "transform", _);
    const N = s("transition");
    N && !N.startsWith("all 0s") && n("效果", "transition", N), n("效果", "cursor", s("cursor"));
    const q = s("pointer-events");
    if (q !== "auto" && n("效果", "pointer-events", q), i.length === 0) {
      const u = document.createElement("div");
      u.className = "css-empty", u.textContent = "暂无样式", this.cssBody.append(u);
      return;
    }
    let Z = "";
    for (const [u, b, w] of i) {
      if (u !== Z) {
        const O = document.createElement("div");
        O.className = "css-group-title", O.textContent = u, this.cssBody.append(O), Z = u;
      }
      const P = document.createElement("div");
      P.className = "css-entry";
      const j = document.createElement("span");
      j.className = "css-prop", j.textContent = b;
      const D = document.createElement("span");
      D.className = "css-val", D.textContent = w, D.title = w, P.append(j, D), this.cssBody.append(P);
    }
  }
  // ---------- reads ----------
  markFlow() {
    const t = ["none", "col", "row", "wrap"].indexOf(this.flow);
    this.flowBtns.forEach((e, s) => e.classList.toggle("on", s === t));
    for (const e of this.layoutOnly) e.classList.toggle("disabled", this.flow === "none");
  }
  markAlign(t, e) {
    this.alignBtns.forEach((s, o) => s.classList.toggle("on", o === t * 3 + e));
  }
  focusWithin() {
    const t = this.root.getRootNode();
    return t instanceof ShadowRoot && this.root.contains(t.activeElement);
  }
  populate(t) {
    const e = getComputedStyle(t), s = t.getBoundingClientRect();
    e.display.includes("flex") ? this.flow = e.flexDirection.startsWith("column") ? "col" : e.flexWrap === "wrap" ? "wrap" : "row" : this.flow = "none", this.markFlow(), this.wInput.value = String(Math.round(s.width)), this.hInput.value = String(Math.round(s.height));
    const o = et(e.justifyContent), i = et(e.alignItems);
    this.markAlign(this.flow === "col" ? o : i, this.flow === "col" ? i : o), this.gapInput.value = String(e.columnGap === "normal" ? 0 : F(e.columnGap));
    const n = [e.paddingLeft, e.paddingTop, e.paddingRight, e.paddingBottom].map(F), a = n[0] === n[2] && n[1] === n[3];
    this.setPadMode(!a), this.padXInput.value = String(n[0]), this.padYInput.value = String(n[1]), this.padSides.forEach((d, h) => d.value = String(n[h])), this.clipInput.checked = e.overflowX !== "visible", this.opacityInput.value = String(Math.round(parseFloat(e.opacity) * 100)), this.radiusInput.value = String(F(e.borderTopLeftRadius));
    const l = tt(e.backgroundColor);
    this.fillColor.value = l.hex, this.fillPct.value = String(Math.round(l.alpha * 100));
    const c = tt(e.borderTopColor);
    this.strokeColor.value = c.hex, this.strokeWidth.value = String(parseFloat(e.borderTopWidth) || 0), this.cssOpen && this.renderCSS(t);
  }
  // ---------- public ----------
  setTarget(t) {
    this.el = t, this.root.classList.toggle("open", t !== null), t && !this.focusWithin() && this.populate(t);
  }
  /** re-read values after undo/redo etc., unless the user is typing here */
  sync() {
    this.el && this.el.isConnected && !this.focusWithin() && this.populate(this.el);
  }
  /** live W/H while dragging handles */
  refreshRect(t) {
    this.focusWithin() || (this.wInput.value = String(Math.round(t.width)), this.hInput.value = String(Math.round(t.height)));
  }
}
function Pt(r, t, e) {
  const s = [], o = [], i = (p) => {
    s.push(p.left, p.right, p.left + p.width / 2), o.push(p.top, p.bottom, p.top + p.height / 2);
  }, n = r.parentElement;
  if (n && n !== document.body && i(n.getBoundingClientRect()), n) {
    let p = 0;
    for (const f of Array.from(n.children)) {
      if (f === r || !(f instanceof HTMLElement)) continue;
      const x = f.getBoundingClientRect();
      if (!(x.width === 0 && x.height === 0) && (i(x), ++p >= 30))
        break;
    }
  }
  const a = [t.left, t.left + t.width, t.left + t.width / 2], l = [t.top, t.top + t.height, t.top + t.height / 2], c = (p, f) => {
    let x = e + 1, y = null;
    for (const E of p)
      for (const k of f) {
        const C = Math.abs(k - E);
        C < x && (x = C, y = { adj: k - E, guide: k });
      }
    return y;
  }, d = c(a, s), h = c(l, o);
  return {
    adjX: (d == null ? void 0 : d.adj) ?? 0,
    adjY: (h == null ? void 0 : h.adj) ?? 0,
    guideV: (d == null ? void 0 : d.guide) ?? null,
    guideH: (h == null ? void 0 : h.guide) ?? null
  };
}
const g = Math.round;
function Bt(r) {
  const t = r.el.getBoundingClientRect();
  return { x: t.left + window.scrollX, y: t.top + window.scrollY, w: t.width, h: t.height };
}
function st(r) {
  const t = g(r);
  return t > 0 ? `+${t}` : `${t}`;
}
function ot(r) {
  const t = r.filter((s) => s.el.isConnected), e = [
    `# Sidetation 视觉修改记录（${t.length} 处）`,
    "",
    `- 页面：${location.href}`,
    `- 视口：${window.innerWidth}×${window.innerHeight}`,
    ""
  ];
  return t.forEach((s, o) => {
    const i = s.originalRect;
    if (e.push(`## ${o + 1}. \`${s.selector}\``), e.push(`- 元素：\`<${s.tag}>\``), s.deleted) {
      e.push("- **删除该元素**"), e.push(`- 原始盒（页面坐标）：x ${g(i.x)}，y ${g(i.y)}，w ${g(i.w)}，h ${g(i.h)}`), e.push("");
      return;
    }
    const n = Bt(s);
    s.moved && e.push(`- 移动：Δx ${st(s.dx)}px，Δy ${st(s.dy)}px`), s.resized && e.push(
      `- 尺寸：${g(s.startSize.w)}×${g(s.startSize.h)} → ${g(s.size.w)}×${g(s.size.h)}`
    );
    const a = Object.entries(s.props);
    if (a.length && e.push(`- 样式：${a.map(([l, c]) => `\`${l}: ${c}\``).join("，")}`), s.text !== null) {
      const l = (c) => (c ?? "").trim().replace(/\s+/g, " ").slice(0, 80);
      e.push(`- 文字："${l(s.savedText)}" → "${l(s.text)}"`);
    }
    e.push(`- 原始盒（页面坐标）：x ${g(i.x)}，y ${g(i.y)}，w ${g(i.w)}，h ${g(i.h)}`), e.push(`- 修改后：x ${g(n.x)}，y ${g(n.y)}，w ${g(n.w)}，h ${g(n.h)}`), e.push("");
  }), e.push("---"), e.push(
    "请把以上视觉改动落实到源码中：根据元素所在布局选择合适的方式（margin / padding / flex / grid / gap / width / height 等），不要直接照抄 transform 位移，那只是编辑器里的临时表现。"
  ), e.join(`
`);
}
function nt(r) {
  return r.filter((s) => s.el.isConnected).map((s) => {
    const o = [];
    if (s.deleted)
      o.push("  display: none;");
    else {
      s.moved && o.push(`  transform: translate(${g(s.dx)}px, ${g(s.dy)}px);`), s.resized && (o.push(`  width: ${g(s.size.w - s.sizeAdj.w)}px;`), o.push(`  height: ${g(s.size.h - s.sizeAdj.h)}px;`));
      for (const [n, a] of Object.entries(s.props)) o.push(`  ${n}: ${a};`);
    }
    return `${`/* ${s.tag}: ${g(s.startSize.w)}×${g(s.startSize.h)} @ (${g(
      s.originalRect.x
    )}, ${g(s.originalRect.y)}) */`}
${s.selector} {
${o.join(`
`)}
}`;
  }).join(`

`) + `
`;
}
function X() {
  return `sidetation:${location.origin}${location.pathname}`;
}
function Lt(r) {
  const t = r.filter((e) => e.el.isConnected);
  try {
    if (t.length === 0) {
      localStorage.removeItem(X());
      return;
    }
    const e = t.map((s) => ({
      selector: s.selector,
      dx: s.dx,
      dy: s.dy,
      moved: s.moved,
      resized: s.resized,
      deleted: s.deleted,
      startSize: s.startSize,
      size: s.size,
      savedText: s.savedText,
      text: s.text,
      props: s.props,
      savedProps: s.savedProps
    }));
    localStorage.setItem(X(), JSON.stringify(e));
  } catch {
  }
}
function Tt() {
  try {
    const r = localStorage.getItem(X());
    return r ? JSON.parse(r) : null;
  } catch {
    return null;
  }
}
class Rt {
  constructor(t, e) {
    this.root = t, this.host = e, this.countEl = document.createElement("div"), this.countEl.className = "align-title", this.root.append(this.countEl), this.buildAlignRow(), this.buildDistributeRow();
  }
  buildAlignRow() {
    const t = document.createElement("div");
    t.className = "align-row";
    const e = [
      ["left", "⇤", "左对齐"],
      ["hcenter", "↔", "水平居中对齐"],
      ["right", "⇥", "右对齐"],
      ["top", "⤒", "顶对齐"],
      ["vcenter", "↕", "垂直居中对齐"],
      ["bottom", "⤓", "底对齐"]
    ];
    for (const [s, o, i] of e) {
      const n = document.createElement("button");
      n.textContent = o, n.title = i, n.addEventListener("click", () => this.host.align(s)), t.append(n);
    }
    this.root.append(t);
  }
  buildDistributeRow() {
    const t = document.createElement("div");
    t.className = "align-row", this.distHBtn = document.createElement("button"), this.distHBtn.textContent = "⇹", this.distHBtn.title = "水平等距分布", this.distHBtn.addEventListener("click", () => this.host.distribute("h")), this.distVBtn = document.createElement("button"), this.distVBtn.textContent = "⇳", this.distVBtn.title = "垂直等距分布", this.distVBtn.addEventListener("click", () => this.host.distribute("v")), t.append(this.distHBtn, this.distVBtn), this.root.append(t);
  }
  show(t) {
    this.root.classList.add("open"), this.countEl.textContent = `已选 ${t} 个`;
    const e = t >= 3;
    this.distHBtn.disabled = !e, this.distVBtn.disabled = !e;
  }
  hide() {
    this.root.classList.remove("open");
  }
}
const At = 3;
class Mt {
  constructor(t = {}) {
    this.overlay = new pt(), this.history = new kt(), this.active = !1, this.hovered = null, this.selected = [], this.drag = null, this.resize = null, this.textEdit = null, this.lastDownAt = 0, this.lastDownTarget = null, this.rafId = 0, this.savedUserSelect = "", this.loop = () => {
      if (this.selected.length > 0) {
        const e = this.selected.filter((s) => s.isConnected);
        e.length !== this.selected.length && (this.selected = e);
      }
      if (this.selected.length === 1) {
        const s = this.selected[0].getBoundingClientRect();
        this.overlay.setSelection(s, this.selectionLabel()), this.propsPanel.refreshRect(s), this.overlay.setMultiSelection([]), this.alignPanel.hide();
      } else if (this.selected.length > 1) {
        const e = this.selected.map((s) => s.getBoundingClientRect());
        this.overlay.setSelection(null), this.overlay.setMultiSelection(e), this.overlay.positionAlignPanel(e), this.alignPanel.show(this.selected.length);
      } else
        this.overlay.setSelection(null), this.overlay.setMultiSelection([]), this.alignPanel.hide();
      this.hovered && this.hovered.isConnected && !this.selected.includes(this.hovered) ? this.overlay.setHover(this.hovered.getBoundingClientRect()) : this.overlay.setHover(null), this.rafId = requestAnimationFrame(this.loop);
    }, this.onPointerMove = (e) => {
      if (this.resize) {
        this.moveResize(e);
        return;
      }
      if (this.drag) {
        this.moveDrag(e);
        return;
      }
      if (this.inOverlay(e)) {
        this.hovered = null;
        return;
      }
      this.hovered = this.pageElementAt(e.clientX, e.clientY);
    }, this.onPointerDown = (e) => {
      if (this.inOverlay(e)) return;
      if (this.textEdit) {
        if (e.composedPath().includes(this.textEdit.el)) return;
        this.commitTextEdit();
      }
      if (e.preventDefault(), e.stopPropagation(), e.altKey && this.selected.length === 1) {
        const l = this.selected[0].parentElement;
        this.isSelectable(l) && this.select([l]);
        return;
      }
      const s = this.pageElementAt(e.clientX, e.clientY);
      if (!s) {
        this.select([]);
        return;
      }
      if (e.shiftKey) {
        this.toggleSelect(s);
        return;
      }
      const o = Date.now();
      if (s === this.lastDownTarget && o - this.lastDownAt < 400) {
        this.lastDownAt = 0, this.startTextEdit(s);
        return;
      }
      this.lastDownAt = o, this.lastDownTarget = s;
      const i = this.selected.length === 1 ? this.selected[0] : null, n = i !== null && (s === i || i.contains(s)), a = this.selected.length > 1 && this.selected.includes(s);
      !n && !a && this.select([s]), this.drag = {
        els: this.selected,
        startX: e.clientX,
        startY: e.clientY,
        items: null,
        moved: !1,
        downTarget: s
      };
    }, this.onPointerUp = (e) => {
      if (this.resize) {
        const s = this.resize;
        this.resize = null, document.documentElement.style.cursor = "", this.history.commit(s.rec, s.before);
        return;
      }
      if (this.drag) {
        const s = this.drag;
        this.drag = null, this.overlay.setGuides(null, null), document.documentElement.style.cursor = "", s.moved && s.items ? this.history.commitBatch(s.items.map(({ rec: o, before: i }) => ({ rec: o, before: i }))) : this.selected.length === 1 && this.selected[0] === s.downTarget || this.select([s.downTarget]), e.preventDefault(), e.stopPropagation();
      }
    }, this.blockEvent = (e) => {
      this.inOverlay(e) || this.textEdit && e.composedPath().includes(this.textEdit.el) || (e.preventDefault(), e.stopImmediatePropagation());
    }, this.onKeyDown = (e) => {
      if (this.inOverlay(e)) return;
      if (this.textEdit) {
        e.key === "Escape" && (e.preventDefault(), e.stopPropagation(), this.commitTextEdit());
        return;
      }
      const s = e.metaKey || e.ctrlKey;
      if (e.key === "Escape") {
        e.preventDefault(), e.stopPropagation(), this.selected.length > 0 ? this.select([]) : this.deactivate();
        return;
      }
      if (s && (e.key === "z" || e.key === "Z")) {
        e.preventDefault(), e.stopPropagation(), (e.shiftKey ? this.history.redo() : this.history.undo()) && this.overlay.toast(e.shiftKey ? "重做" : "撤销");
        return;
      }
      if (this.selected.length === 0) return;
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault(), e.stopPropagation();
        const l = this.selected.length, c = this.selected.map((d) => {
          const h = this.history.ensure(d), p = this.history.snapshot(h);
          return h.deleted = !0, { rec: h, before: p };
        });
        this.select([]), this.history.commitBatch(c), this.overlay.toast(l > 1 ? `已删除 ${l} 个元素（⌘Z 撤销）` : "已删除（⌘Z 撤销）");
        return;
      }
      if (this.selected.length === 1) {
        const l = this.selected[0];
        if (e.key === "Enter") {
          e.preventDefault(), e.stopPropagation();
          const c = e.shiftKey ? l.parentElement : l.firstElementChild;
          this.isSelectable(c) && this.select([c]);
          return;
        }
        if (e.key === "Tab") {
          e.preventDefault(), e.stopPropagation();
          const c = e.shiftKey ? l.previousElementSibling : l.nextElementSibling;
          this.isSelectable(c) && this.select([c]);
          return;
        }
      }
      const o = e.shiftKey ? 10 : 1, n = {
        ArrowLeft: [-o, 0],
        ArrowRight: [o, 0],
        ArrowUp: [0, -o],
        ArrowDown: [0, o]
      }[e.key];
      if (!n) return;
      e.preventDefault(), e.stopPropagation();
      const a = this.selected.map((l) => {
        const c = this.history.ensure(l), d = this.history.snapshot(c);
        return c.dx += n[0], c.dy += n[1], c.moved = !0, { rec: c, before: d };
      });
      this.history.commitBatch(a, { coalesce: "nudge" });
    }, this.opts = { autoStart: !1, snapThreshold: 6, ...t }, this.toolbar = new zt(this.overlay.toolbarEl, this.overlay.panelEl, this.overlay.shortcutsEl, {
      onToggle: () => this.active ? this.deactivate() : this.activate(),
      onCopyMd: () => this.copy(ot(this.history.all()), "已复制 Markdown"),
      onCopyCss: () => this.copy(nt(this.history.all()), "已复制 CSS"),
      onReset: () => this.history.resetAll(),
      onRevert: (e) => this.history.revert(e)
    }), this.propsPanel = new Ct(this.overlay.propsEl, {
      setProps: (e) => this.panelSetProps(e),
      setSize: (e, s) => this.panelSetSize(e, s)
    }), this.alignPanel = new Rt(this.overlay.alignEl, {
      align: (e) => this.alignSelected(e),
      distribute: (e) => this.distributeSelected(e)
    }), this.history.onChange = () => {
      this.syncUI(), Lt(this.history.all());
    }, this.overlay.onHandleDown = (e, s) => this.startResize(e, s), this.restoreSession(), this.syncUI(), this.opts.autoStart && this.activate();
  }
  /** re-apply edits saved from a previous session on this page, if any */
  restoreSession() {
    const t = Tt();
    if (!t || t.length === 0) return;
    const e = this.history.restore(t);
    e > 0 && this.overlay.toast(`${e} 处修改因页面结构变化未能恢复`);
  }
  // ---------- lifecycle ----------
  activate() {
    this.active || (this.active = !0, this.savedUserSelect = document.documentElement.style.userSelect, document.documentElement.style.userSelect = "none", window.addEventListener("pointermove", this.onPointerMove, !0), window.addEventListener("pointerdown", this.onPointerDown, !0), window.addEventListener("pointerup", this.onPointerUp, !0), window.addEventListener("pointercancel", this.onPointerUp, !0), window.addEventListener("click", this.blockEvent, !0), window.addEventListener("keydown", this.onKeyDown, !0), this.rafId = requestAnimationFrame(this.loop), this.syncUI());
  }
  deactivate() {
    this.active && (this.commitTextEdit(), this.active = !1, document.documentElement.style.userSelect = this.savedUserSelect, document.documentElement.style.cursor = "", window.removeEventListener("pointermove", this.onPointerMove, !0), window.removeEventListener("pointerdown", this.onPointerDown, !0), window.removeEventListener("pointerup", this.onPointerUp, !0), window.removeEventListener("pointercancel", this.onPointerUp, !0), window.removeEventListener("click", this.blockEvent, !0), window.removeEventListener("keydown", this.onKeyDown, !0), cancelAnimationFrame(this.rafId), this.hovered = null, this.selected = [], this.drag = null, this.resize = null, this.propsPanel.setTarget(null), this.alignPanel.hide(), this.overlay.setHover(null), this.overlay.setSelection(null), this.overlay.setMultiSelection([]), this.overlay.setGuides(null, null), this.syncUI());
  }
  /** remove the toolbar/overlay entirely; applied edits stay on the page */
  destroy() {
    this.deactivate(), this.overlay.destroy();
  }
  selectionLabel() {
    if (this.selected.length !== 1) return "";
    const t = this.selected[0], e = t.getBoundingClientRect();
    return `${mt(t)}  ${Math.round(e.width)}×${Math.round(e.height)}`;
  }
  // ---------- element picking ----------
  pageElementAt(t, e) {
    let s = document.elementFromPoint(t, e);
    for (; s && !(s instanceof HTMLElement); ) s = s.parentElement;
    return !s || s === document.body || s === document.documentElement || s.closest("[data-sidetation]") ? null : s;
  }
  inOverlay(t) {
    return t.composedPath().includes(this.overlay.host);
  }
  select(t) {
    this.selected = t, this.hovered = null, this.propsPanel.setTarget(t.length === 1 ? t[0] : null);
  }
  /** Shift+click: add/remove one element from the current selection */
  toggleSelect(t) {
    const e = this.selected.indexOf(t);
    if (e >= 0) {
      const s = this.selected.slice();
      s.splice(e, 1), this.select(s);
    } else
      this.select([...this.selected, t]);
  }
  isSelectable(t) {
    return t instanceof HTMLElement && t !== document.body && t !== document.documentElement && !t.closest("[data-sidetation]");
  }
  // ---------- text editing ----------
  startTextEdit(t) {
    if (t.childElementCount > 0 || !(t.textContent ?? "").trim()) {
      this.overlay.toast("仅支持纯文本元素（无子元素）");
      return;
    }
    this.select([t]);
    const e = this.history.ensure(t);
    this.textEdit = {
      el: t,
      rec: e,
      before: this.history.snapshot(e),
      savedUserSelect: t.style.getPropertyValue("user-select")
    }, t.setAttribute("contenteditable", "plaintext-only"), t.isContentEditable || t.setAttribute("contenteditable", "true"), t.style.setProperty("user-select", "text"), t.focus();
    const s = document.createRange();
    s.selectNodeContents(t);
    const o = window.getSelection();
    o == null || o.removeAllRanges(), o == null || o.addRange(s);
  }
  commitTextEdit() {
    var s;
    const t = this.textEdit;
    if (!t) return;
    this.textEdit = null, t.el.removeAttribute("contenteditable"), t.savedUserSelect ? t.el.style.setProperty("user-select", t.savedUserSelect) : t.el.style.removeProperty("user-select"), (s = window.getSelection()) == null || s.removeAllRanges();
    const e = t.el.textContent ?? "";
    t.rec.text = e === t.rec.savedText ? null : e, this.history.commit(t.rec, t.before);
  }
  // ---------- drag ----------
  moveDrag(t) {
    const e = this.drag, s = t.clientX - e.startX, o = t.clientY - e.startY;
    if (!e.moved) {
      if (Math.hypot(s, o) < At) return;
      e.moved = !0, e.items = e.els.map((n) => {
        const a = this.history.ensure(n);
        return { rec: a, before: this.history.snapshot(a), baseDx: a.dx, baseDy: a.dy };
      }), document.documentElement.style.cursor = "move";
    }
    const i = e.items;
    if (i.length === 1) {
      const { rec: n, baseDx: a, baseDy: l } = i[0];
      let c = a + s, d = l + o;
      const h = e.els[0].getBoundingClientRect(), p = {
        left: h.left + (c - n.dx),
        top: h.top + (d - n.dy),
        width: h.width,
        height: h.height
      }, f = Pt(e.els[0], p, this.opts.snapThreshold);
      c += f.adjX, d += f.adjY, this.overlay.setGuides(f.guideV, f.guideH), n.dx = c, n.dy = d, n.moved = !0, $(n);
    } else {
      this.overlay.setGuides(null, null);
      for (const { rec: n, baseDx: a, baseDy: l } of i)
        n.dx = a + s, n.dy = l + o, n.moved = !0, $(n);
    }
  }
  // ---------- resize ----------
  startResize(t, e) {
    if (this.selected.length !== 1) return;
    const s = this.selected[0];
    e.preventDefault(), e.stopPropagation();
    const o = this.history.ensure(s), i = s.getBoundingClientRect();
    this.resize = {
      rec: o,
      before: this.history.snapshot(o),
      dir: t,
      startX: e.clientX,
      startY: e.clientY,
      startW: i.width,
      startH: i.height,
      baseDx: o.dx,
      baseDy: o.dy
    };
  }
  moveResize(t) {
    const e = this.resize, { rec: s, dir: o } = e, i = t.clientX - e.startX, n = t.clientY - e.startY;
    let a = e.startW, l = e.startH;
    if (o.includes("e") && (a = e.startW + i), o.includes("w") && (a = e.startW - i), o.includes("s") && (l = e.startH + n), o.includes("n") && (l = e.startH - n), t.shiftKey && e.startH > 0 && e.startW > 0) {
      const c = e.startW / e.startH;
      o === "e" || o === "w" ? l = a / c : o === "n" || o === "s" ? a = l * c : Math.abs(i) > Math.abs(n) ? l = a / c : a = l * c;
    }
    a = Math.max(8, Math.round(a)), l = Math.max(8, Math.round(l)), s.dx = o.includes("w") ? e.baseDx + (e.startW - a) : e.baseDx, s.dy = o.includes("n") ? e.baseDy + (e.startH - l) : e.baseDy, (s.dx !== e.baseDx || s.dy !== e.baseDy) && (s.moved = !0), s.size = { w: a, h: l }, s.resized = !0, $(s);
  }
  // ---------- properties panel ----------
  panelSetProps(t) {
    if (this.selected.length !== 1) return;
    const e = this.selected[0];
    this.commitTextEdit();
    const s = this.history.ensure(e), o = this.history.snapshot(s);
    for (const [i, n] of Object.entries(t))
      i in s.savedProps || (s.savedProps[i] = e.style.getPropertyValue(i)), n === null ? delete s.props[i] : s.props[i] = n;
    this.history.commit(s, o, { coalesce: `props:${Object.keys(t).sort().join(",")}` });
  }
  panelSetSize(t, e) {
    if (this.selected.length !== 1) return;
    this.commitTextEdit();
    const s = this.history.ensure(this.selected[0]), o = this.history.snapshot(s);
    t !== null && (s.size.w = Math.max(8, t)), e !== null && (s.size.h = Math.max(8, e)), s.resized = !0, this.history.commit(s, o, { coalesce: "size" });
  }
  // ---------- multi-select: align / distribute ----------
  alignSelected(t) {
    if (this.selected.length < 2) return;
    const e = this.selected.map((d) => ({
      rec: this.history.ensure(d),
      rect: d.getBoundingClientRect()
    })), s = e.map(({ rec: d }) => ({ rec: d, before: this.history.snapshot(d) })), o = Math.min(...e.map((d) => d.rect.left)), i = Math.max(...e.map((d) => d.rect.right)), n = Math.min(...e.map((d) => d.rect.top)), a = Math.max(...e.map((d) => d.rect.bottom)), l = (o + i) / 2, c = (n + a) / 2;
    for (const { rec: d, rect: h } of e) {
      let p = 0, f = 0;
      switch (t) {
        case "left":
          p = o - h.left;
          break;
        case "right":
          p = i - h.right;
          break;
        case "hcenter":
          p = l - (h.left + h.width / 2);
          break;
        case "top":
          f = n - h.top;
          break;
        case "bottom":
          f = a - h.bottom;
          break;
        case "vcenter":
          f = c - (h.top + h.height / 2);
          break;
      }
      (p !== 0 || f !== 0) && (d.dx += p, d.dy += f, d.moved = !0, $(d));
    }
    this.history.commitBatch(s);
  }
  distributeSelected(t) {
    if (this.selected.length < 3) return;
    const e = this.selected.map((h) => ({
      rec: this.history.ensure(h),
      rect: h.getBoundingClientRect()
    })), s = e.map(({ rec: h }) => ({ rec: h, before: this.history.snapshot(h) })), o = [...e].sort(
      (h, p) => t === "h" ? h.rect.left - p.rect.left : h.rect.top - p.rect.top
    ), i = o[0].rect, n = o[o.length - 1].rect, a = t === "h" ? n.right - i.left : n.bottom - i.top, l = o.reduce(
      (h, p) => h + (t === "h" ? p.rect.width : p.rect.height),
      0
    ), c = (a - l) / (o.length - 1);
    let d = t === "h" ? i.left : i.top;
    for (const { rec: h, rect: p } of o) {
      const f = t === "h" ? p.width : p.height, x = t === "h" ? p.left : p.top, y = d - x;
      y !== 0 && (t === "h" ? h.dx += y : h.dy += y, h.moved = !0, $(h)), d += f + c;
    }
    this.history.commitBatch(s);
  }
  // ---------- output ----------
  copy(t, e) {
    var o;
    const s = () => {
      const i = document.createElement("textarea");
      i.value = t, i.style.position = "fixed", i.style.opacity = "0", document.body.append(i), i.select(), document.execCommand("copy"), i.remove(), this.overlay.toast(e);
    };
    (o = navigator.clipboard) != null && o.writeText ? navigator.clipboard.writeText(t).then(
      () => this.overlay.toast(e),
      () => s()
    ) : s();
  }
  getMarkdown() {
    return ot(this.history.all());
  }
  getCSS() {
    return nt(this.history.all());
  }
  get isActive() {
    return this.active;
  }
  undo() {
    return this.history.undo();
  }
  redo() {
    return this.history.redo();
  }
  syncUI() {
    this.history.prune(), this.toolbar.update(this.active, this.history.all()), this.propsPanel.sync();
  }
}
function Dt(r) {
  return new Mt(r);
}
export {
  Mt as Sidetation,
  Dt as init
};
