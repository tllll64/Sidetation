const ht = `
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

/* ---- collapsed (inactive) toolbar: only the brand shows, click to start ---- */
.toolbar { transition: gap 0.16s ease, padding 0.16s ease; }
.toolbar.collapsed { gap: 0; padding: 5px 6px; }
.toolbar.collapsed > *:not(.brand) { display: none !important; }
.toolbar.collapsed .brand {
  cursor: pointer;
  padding: 5px 12px 5px 10px;
  border-radius: 999px;
  outline: none;
  transition: background 0.15s ease;
}
.toolbar.collapsed .brand:hover { background: rgba(255, 255, 255, 0.09); }
.toolbar.collapsed .brand:active { background: rgba(255, 255, 255, 0.14); }
.toolbar.collapsed .brand:focus-visible { box-shadow: 0 0 0 2px rgba(79, 140, 255, 0.6); }
.toolbar.collapsed .brand-dot { transition: transform 0.15s ease; }
.toolbar.collapsed .brand:hover .brand-dot { transform: rotate(45deg) scale(1.15); }

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
`, pt = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
class ut {
  constructor() {
    this.host = document.createElement("div"), this.multiBoxes = [], this.onHandleDown = null, this.toastTimer = 0, this.host.setAttribute("data-sidetation", ""), Object.assign(this.host.style, {
      position: "fixed",
      inset: "0",
      zIndex: "2147483647",
      pointerEvents: "none"
    });
    const t = this.host.attachShadow({ mode: "open" });
    this.shadow = t;
    const s = document.createElement("style");
    s.textContent = ht, t.append(s);
    const e = (o) => {
      const r = document.createElement("div");
      return r.className = o, t.append(r), r;
    };
    this.hoverBox = e("hover-box"), this.selBox = e("sel-box"), this.selLabel = document.createElement("div"), this.selLabel.className = "sel-label", this.selBox.append(this.selLabel);
    for (const o of pt) {
      const r = document.createElement("div");
      r.className = "handle", r.dataset.dir = o, r.addEventListener("pointerdown", (n) => {
        var l;
        return (l = this.onHandleDown) == null ? void 0 : l.call(this, o, n);
      }), this.selBox.append(r);
    }
    this.guideV = e("guide guide-v"), this.guideH = e("guide guide-h"), this.panelEl = e("panel"), this.propsEl = e("props"), this.alignEl = e("align-panel"), this.shortcutsEl = e("shortcuts"), this.toolbarEl = e("toolbar"), this.toastEl = e("toast"), document.documentElement.appendChild(this.host);
  }
  place(t, s) {
    if (!s) {
      t.style.display = "none";
      return;
    }
    t.style.display = "block", t.style.left = `${s.left}px`, t.style.top = `${s.top}px`, t.style.width = `${s.width}px`, t.style.height = `${s.height}px`;
  }
  setHover(t) {
    this.place(this.hoverBox, t);
  }
  setSelection(t, s = "") {
    this.place(this.selBox, t), t && (this.selLabel.textContent = s);
  }
  /** plain highlight boxes (no handles) for a multi-selection */
  setMultiSelection(t) {
    for (; this.multiBoxes.length < t.length; ) {
      const s = document.createElement("div");
      s.className = "multi-box", this.shadow.append(s), this.multiBoxes.push(s);
    }
    this.multiBoxes.forEach((s, e) => this.place(s, t[e] ?? null));
  }
  /** float the align/distribute panel above the selection's bounding box */
  positionAlignPanel(t) {
    if (t.length === 0) return;
    const s = Math.min(...t.map((r) => r.left)), e = Math.max(...t.map((r) => r.right)), o = Math.min(...t.map((r) => r.top));
    this.alignEl.style.left = `${(s + e) / 2}px`, this.alignEl.style.top = `${Math.max(0, o)}px`;
  }
  setGuides(t, s) {
    this.guideV.style.display = t === null ? "none" : "block", t !== null && (this.guideV.style.left = `${t}px`), this.guideH.style.display = s === null ? "none" : "block", s !== null && (this.guideH.style.top = `${s}px`);
  }
  toast(t) {
    this.toastEl.textContent = t, this.toastEl.classList.add("show"), clearTimeout(this.toastTimer), this.toastTimer = window.setTimeout(() => this.toastEl.classList.remove("show"), 1600);
  }
  destroy() {
    clearTimeout(this.toastTimer), this.host.remove();
  }
}
const gt = /(^|[-_])[0-9a-f]{5,}([-_]|$)|^(css|sc|jss|emotion)-|__[A-Za-z0-9]{5,}$/i, ft = ["data-testid", "data-test", "data-cy"];
function it(i) {
  return Array.from(i.classList).filter((t) => t.length <= 24 && !gt.test(t) && !/\d{3,}/.test(t)).slice(0, 2);
}
function G(i) {
  return !i.id || /\d{3,}/.test(i.id) || /^[0-9a-f-]{8,}$/i.test(i.id) ? null : i.id;
}
function rt(i) {
  const t = i.tagName.toLowerCase();
  for (const e of ft) {
    const o = i.getAttribute(e);
    if (o) return `${t}[${e}="${o}"]`;
  }
  const s = it(i).map((e) => `.${CSS.escape(e)}`).join("");
  return t + s;
}
function W(i, t) {
  try {
    const s = document.querySelectorAll(i);
    return s.length === 1 && s[0] === t;
  } catch {
    return !1;
  }
}
function at(i) {
  const t = rt(i), s = i.parentElement;
  if (!s) return t;
  const e = Array.from(s.children).filter((o) => o.tagName === i.tagName);
  return e.length <= 1 ? t : `${t}:nth-of-type(${e.indexOf(i) + 1})`;
}
function tt(i, t) {
  const s = [];
  let e = i;
  for (; e && e !== document.body && e !== document.documentElement && s.length < 5; ) {
    const o = G(e);
    if (o && e !== i) {
      s.unshift(`#${CSS.escape(o)}`);
      const n = s.join(" > ");
      if (W(n, i)) return n;
      break;
    }
    s.unshift(t ? at(e) : rt(e));
    const r = s.join(" > ");
    if (W(r, i)) return r;
    e = e.parentElement;
  }
  return null;
}
function mt(i) {
  const t = G(i);
  if (t) {
    const n = `#${CSS.escape(t)}`;
    if (W(n, i)) return n;
  }
  const s = tt(i, !1);
  if (s) return s;
  const e = tt(i, !0);
  if (e) return e;
  const o = [];
  let r = i;
  for (; r && r !== document.body && r !== document.documentElement && o.length < 5; )
    o.unshift(at(r)), r = r.parentElement;
  return o.join(" > ");
}
function xt(i) {
  const t = i.tagName.toLowerCase(), s = G(i);
  if (s) return `${t}#${s}`;
  const e = it(i);
  return e.length ? `${t}.${e[0]}` : t;
}
function T(i, t, s) {
  s ? i.style.setProperty(t, s) : i.style.removeProperty(t);
}
function $(i) {
  const { el: t, savedInline: s } = i;
  if (i.deleted ? t.style.display = "none" : i.resized && i.baseDisplay === "inline" ? t.style.display = "inline-block" : T(t, "display", s.display), i.moved && (i.dx !== 0 || i.dy !== 0)) {
    const o = `translate(${i.dx}px, ${i.dy}px)`;
    t.style.transform = i.baseTransform === "none" ? o : `${o} ${i.baseTransform}`;
  } else
    T(t, "transform", s.transform);
  i.resized ? (t.style.width = `${i.size.w - i.sizeAdj.w}px`, t.style.height = `${i.size.h - i.sizeAdj.h}px`) : (T(t, "width", s.width), T(t, "height", s.height));
  const e = /* @__PURE__ */ new Set([...Object.keys(i.savedProps), ...Object.keys(i.props)]);
  for (const o of e)
    o in i.props ? t.style.setProperty(o, i.props[o]) : T(t, o, i.savedProps[o] ?? "");
  if (i.savedText !== null && !t.hasAttribute("contenteditable")) {
    const o = i.text ?? i.savedText;
    t.textContent !== o && (t.textContent = o);
  }
}
const bt = [
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
], yt = 120;
function lt(i, t, s) {
  if (s.n++ > yt) {
    t.replaceChildren();
    return;
  }
  const e = getComputedStyle(i);
  let o = "";
  for (const l of bt) o += `${l}:${e.getPropertyValue(l)};`;
  t.setAttribute("style", o);
  const r = Array.from(i.children), n = Array.from(t.children);
  for (let l = 0; l < n.length; l++) {
    const a = n[l].tagName.toLowerCase();
    if (a === "script" || a === "iframe" || a === "video" || a === "canvas") {
      n[l].remove();
      continue;
    }
    lt(r[l], n[l], s);
  }
}
function dt(i) {
  const t = i.getBoundingClientRect();
  if (t.width < 1 || t.height < 1) return null;
  try {
    const s = i.cloneNode(!0);
    lt(i, s, { n: 0 }), s.style.margin = "0", s.style.transform = "none", s.style.maxWidth = "none", s.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
    const e = new XMLSerializer().serializeToString(s), o = Math.ceil(t.width), r = Math.ceil(t.height), n = `<svg xmlns="http://www.w3.org/2000/svg" width="${o}" height="${r}"><foreignObject width="100%" height="100%">${e}</foreignObject></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(n)}`;
  } catch {
    return null;
  }
}
const wt = 800;
function et(i) {
  return !i.moved && !i.resized && !i.deleted && Object.keys(i.props).length === 0 && i.text === null;
}
function vt(i, t) {
  const s = Object.keys(i);
  return s.length === Object.keys(t).length && s.every((e) => i[e] === t[e]);
}
function St(i, t) {
  return i.dx === t.dx && i.dy === t.dy && i.size.w === t.size.w && i.size.h === t.size.h && i.moved === t.moved && i.resized === t.resized && i.deleted === t.deleted && i.text === t.text && vt(i.props, t.props);
}
const kt = {
  dx: 0,
  dy: 0,
  moved: !1,
  resized: !1,
  deleted: !1,
  text: null
};
class Et {
  constructor() {
    this.records = /* @__PURE__ */ new Map(), this.undoStack = [], this.redoStack = [], this.seq = 1, this.onChange = null;
  }
  ensure(t) {
    let s = this.records.get(t);
    if (s) return s;
    const e = t.getBoundingClientRect(), o = getComputedStyle(t), r = o.boxSizing === "content-box", n = (l) => parseFloat(l) || 0;
    return s = {
      id: this.seq++,
      el: t,
      selector: mt(t),
      tag: t.tagName.toLowerCase(),
      originalRect: {
        x: e.left + window.scrollX,
        y: e.top + window.scrollY,
        w: e.width,
        h: e.height
      },
      savedInline: {
        transform: t.style.getPropertyValue("transform"),
        width: t.style.getPropertyValue("width"),
        height: t.style.getPropertyValue("height"),
        display: t.style.getPropertyValue("display")
      },
      baseTransform: o.transform,
      baseDisplay: o.display,
      sizeAdj: r ? {
        w: n(o.paddingLeft) + n(o.paddingRight) + n(o.borderLeftWidth) + n(o.borderRightWidth),
        h: n(o.paddingTop) + n(o.paddingBottom) + n(o.borderTopWidth) + n(o.borderBottomWidth)
      } : { w: 0, h: 0 },
      dx: 0,
      dy: 0,
      moved: !1,
      resized: !1,
      deleted: !1,
      startSize: { w: e.width, h: e.height },
      size: { w: e.width, h: e.height },
      beforeSnap: dt(t),
      // captured pre-edit: this IS the "before"
      savedText: t.childElementCount === 0 ? t.textContent : null,
      text: null,
      props: {},
      savedProps: {}
    }, this.records.set(t, s), s;
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
  commit(t, s, e) {
    this.commitBatch([{ rec: t, before: s }], e);
  }
  /** finish a (possibly multi-select) gesture as ONE undo step */
  commitBatch(t, s) {
    const e = [];
    for (const { rec: l, before: a } of t) {
      l.dx === 0 && l.dy === 0 && (l.moved = !1), $(l);
      const c = this.snapshot(l);
      St(a, c) || e.push({ rec: l, before: a, after: c }), this.cleanup(l);
    }
    if (e.length === 0) {
      this.emit();
      return;
    }
    const o = (s == null ? void 0 : s.coalesce) ?? null, r = this.undoStack[this.undoStack.length - 1];
    o !== null && r !== void 0 && r.coalesce === o && Date.now() - r.at < wt && r.entries.length === e.length && r.entries.every((l, a) => l.rec === e[a].rec) ? (e.forEach((l, a) => r.entries[a].after = l.after), r.at = Date.now()) : this.undoStack.push({ entries: e, coalesce: o, at: Date.now() }), this.redoStack.length = 0, this.emit();
  }
  undo() {
    const t = this.undoStack.pop();
    if (!t) return !1;
    for (const s of t.entries) this.applySnap(s.rec, s.before);
    return this.redoStack.push(t), this.emit(), !0;
  }
  redo() {
    const t = this.redoStack.pop();
    if (!t) return !1;
    for (const s of t.entries) this.applySnap(s.rec, s.after);
    return this.undoStack.push(t), this.emit(), !0;
  }
  /** panel revert: back to pristine, as an undoable action */
  revert(t) {
    const s = this.all().find((o) => o.id === t);
    if (!s) return;
    const e = this.snapshot(s);
    this.applySnap(s, { ...kt, size: { ...s.startSize }, props: {} }), this.undoStack.push({
      entries: [{ rec: s, before: e, after: this.snapshot(s) }],
      coalesce: null,
      at: Date.now()
    }), this.redoStack.length = 0, this.emit();
  }
  resetAll() {
    for (const t of this.all()) this.revert(t.id);
  }
  applySnap(t, s) {
    t.dx = s.dx, t.dy = s.dy, t.size = { ...s.size }, t.moved = s.moved, t.resized = s.resized, t.deleted = s.deleted, t.props = { ...s.props }, t.text = s.text, $(t), this.cleanup(t);
  }
  /** keep the consolidated map in sync: pristine records drop out, edited ones stay */
  cleanup(t) {
    et(t) ? this.records.delete(t.el) : this.records.set(t.el, t);
  }
  /**
   * Re-apply a previously saved session after a page refresh: re-resolve each
   * selector, splice the persisted state onto a freshly `ensure()`d record.
   * Returns the count of entries whose selector no longer resolves uniquely.
   */
  restore(t) {
    let s = 0;
    for (const e of t) {
      let o;
      try {
        o = document.querySelectorAll(e.selector);
      } catch {
        s++;
        continue;
      }
      if (o.length !== 1) {
        s++;
        continue;
      }
      const r = this.ensure(o[0]);
      r.dx = e.dx, r.dy = e.dy, r.moved = e.moved, r.resized = e.resized, r.deleted = e.deleted, r.startSize = { ...e.startSize }, r.size = { ...e.size }, r.text = e.text, r.props = { ...e.props }, r.savedProps = { ...e.savedProps }, $(r), this.cleanup(r);
    }
    return s;
  }
  /** drop records that were ensure()d but never turned into a real edit */
  prune() {
    for (const [t, s] of this.records)
      et(s) && this.records.delete(t);
  }
  emit() {
    var t;
    (t = this.onChange) == null || t.call(this);
  }
}
const B = Math.round, zt = [
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
class $t {
  constructor(t, s, e, o, r = !1) {
    this.bar = t, this.panel = s, this.shortcuts = e, this.cb = o, this.panelOpen = !1, this.active = !1, this.records = [];
    const n = document.createElement("div");
    n.className = "brand", n.setAttribute("role", "button");
    const l = document.createElement("span");
    l.className = "brand-dot", n.append(l, "Sidetation"), t.append(n), this.brandEl = n, n.addEventListener("click", () => {
      this.active || this.cb.onToggle();
    }), n.addEventListener("keydown", (g) => {
      !this.active && (g.key === "Enter" || g.key === " ") && (g.preventDefault(), this.cb.onToggle());
    });
    const a = (g, b) => {
      const x = document.createElement("button");
      return x.textContent = g, x.addEventListener("click", b), t.append(x), x;
    }, c = () => {
      const g = document.createElement("div");
      g.className = "divider", t.append(g);
    };
    this.toggleBtn = a("开始编辑", () => o.onToggle()), this.toggleBtn.classList.add("primary"), this.kbdBtn = a("", () => {
    }), this.kbdBtn.classList.add("kbd-btn"), this.kbdBtn.title = "快捷键";
    const h = "http://www.w3.org/2000/svg", d = document.createElementNS(h, "svg");
    d.setAttribute("viewBox", "0 0 24 24"), d.setAttribute("fill", "none"), d.setAttribute("stroke", "currentColor"), d.setAttribute("stroke-width", "2"), d.setAttribute("stroke-linecap", "round"), d.setAttribute("stroke-linejoin", "round");
    const p = document.createElementNS(h, "path");
    p.setAttribute("d", "M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"), d.append(p), this.kbdBtn.append(d), this.buildShortcuts(), this.kbdBtn.addEventListener("mouseenter", () => this.showShortcuts()), this.kbdBtn.addEventListener("mouseleave", () => this.shortcuts.classList.remove("open")), c(), this.editsBtn = a("修改 0", () => this.togglePanel()), this.resetBtn = a("重置", () => o.onReset()), c(), this.mdBtn = a("复制 Markdown", () => o.onCopyMd()), this.cssBtn = a("复制 CSS", () => o.onCopyCss()), r && (this.syncBtn = a("同步 MCP", () => o.onSync()), this.syncBtn.title = "把当前修改推送到本地 MCP 服务，供 AI 编码助手读取");
  }
  /** reflect the in-flight sync request on the button */
  setSyncState(t) {
    if (!this.syncBtn) return;
    const s = t === "syncing";
    this.syncBtn.textContent = s ? "同步中…" : "同步 MCP", this.syncBtn.disabled = s || this.records.length === 0;
  }
  buildShortcuts() {
    const t = document.createElement("div");
    t.className = "shortcuts-title", t.textContent = "快捷键", this.shortcuts.append(t);
    for (const [s, e] of zt) {
      const o = document.createElement("div");
      o.className = "shortcut-row";
      const r = document.createElement("span");
      r.className = "kbd", r.textContent = s;
      const n = document.createElement("span");
      n.className = "shortcut-desc", n.textContent = e, o.append(r, n), this.shortcuts.append(o);
    }
  }
  /** before -> after square thumbnails so the user can see what changed */
  buildThumbs(t) {
    const s = document.createElement("div");
    s.className = "edit-thumbs";
    const e = (n, l = !1) => {
      const a = document.createElement("div");
      if (a.className = "thumb", l)
        a.classList.add("deleted"), a.textContent = "✕";
      else if (n) {
        const c = document.createElement("img");
        c.src = n, c.alt = "", a.append(c);
      } else
        a.textContent = "?", a.classList.add("empty");
      return a;
    }, o = document.createElement("span");
    o.className = "thumb-arrow", o.textContent = "→";
    const r = t.deleted || !t.el.isConnected ? e(null, !0) : e(dt(t.el));
    return s.append(e(t.beforeSnap), o, r), s;
  }
  showShortcuts() {
    const t = this.kbdBtn.getBoundingClientRect();
    this.shortcuts.style.left = `${t.left + t.width / 2}px`, this.shortcuts.style.bottom = `${window.innerHeight - t.top + 10}px`, this.shortcuts.classList.add("open");
  }
  togglePanel() {
    this.panelOpen = !this.panelOpen, this.panel.classList.toggle("open", this.panelOpen), this.panelOpen && this.renderPanel();
  }
  update(t, s) {
    this.records = s, this.active = t, this.bar.classList.toggle("collapsed", !t), this.brandEl.setAttribute("tabindex", t ? "-1" : "0"), this.brandEl.title = t ? "" : "开始编辑", this.toggleBtn.textContent = t ? "完成" : "开始编辑", this.toggleBtn.classList.toggle("active", t), this.kbdBtn.style.display = t ? "" : "none", t || this.shortcuts.classList.remove("open"), this.editsBtn.textContent = `修改 ${s.length}`;
    const e = s.length === 0;
    this.editsBtn.disabled = e, this.resetBtn.disabled = e, this.mdBtn.disabled = e, this.cssBtn.disabled = e, this.syncBtn && (this.syncBtn.disabled = e), e && this.panelOpen ? this.togglePanel() : this.panelOpen && this.renderPanel();
  }
  renderPanel() {
    if (this.panel.replaceChildren(), this.records.length === 0) {
      const t = document.createElement("div");
      t.className = "panel-empty", t.textContent = "还没有修改", this.panel.append(t);
      return;
    }
    for (const t of this.records) {
      const s = document.createElement("div");
      s.className = "edit-row", s.append(this.buildThumbs(t));
      const e = [];
      t.deleted && e.push("删除"), t.moved && e.push(`移动 Δx ${B(t.dx)} / Δy ${B(t.dy)}`), t.resized && e.push(
        `尺寸 ${B(t.startSize.w)}×${B(t.startSize.h)} → ${B(t.size.w)}×${B(t.size.h)}`
      );
      const o = Object.keys(t.props).length;
      o && e.push(`样式 ×${o}`), t.text !== null && e.push("文字");
      const r = document.createElement("div");
      r.className = "edit-info";
      const n = document.createElement("div");
      n.className = "edit-sel", n.textContent = t.selector;
      const l = document.createElement("div");
      l.className = "edit-delta", l.textContent = e.join(" · "), r.append(n, l), s.append(r);
      const a = document.createElement("button");
      a.textContent = "撤销", a.addEventListener("click", () => this.cb.onRevert(t.id)), s.append(a), this.panel.append(s);
    }
  }
}
const I = ["flex-start", "center", "flex-end"], H = (i) => Math.round(parseFloat(i) || 0), F = (i) => Math.round(i).toString(16).padStart(2, "0");
function st(i) {
  const t = i.match(/rgba?\(([^)]+)\)/);
  if (!t) return { hex: "#000000", alpha: i && i !== "transparent" ? 1 : 0 };
  const s = t[1].split(",").map((e) => parseFloat(e));
  return { hex: `#${F(s[0])}${F(s[1])}${F(s[2])}`, alpha: s[3] ?? 1 };
}
function Ct(i, t) {
  if (t >= 1) return i;
  const s = parseInt(i.slice(1, 3), 16), e = parseInt(i.slice(3, 5), 16), o = parseInt(i.slice(5, 7), 16);
  return `rgba(${s}, ${e}, ${o}, ${+t.toFixed(3)})`;
}
function ot(i) {
  return i.includes("center") ? 1 : i.includes("end") ? 2 : 0;
}
class Pt {
  constructor(t, s) {
    this.root = t, this.host = s, this.el = null, this.flow = "none", this.cssOpen = !1, this.flowBtns = [], this.alignBtns = [], this.padSides = [], this.padIndependent = !1, this.layoutOnly = [], this.build();
  }
  // ---------- DOM construction ----------
  section(t) {
    const s = document.createElement("div");
    s.className = "props-section";
    const e = document.createElement("div");
    return e.className = "props-title", e.textContent = t, s.append(e), this.root.append(s), s;
  }
  row(t, s) {
    const e = document.createElement("div");
    if (e.className = "props-row", s) {
      const o = document.createElement("div");
      o.className = "props-label", o.textContent = s, e.append(o);
    }
    return t.append(e), e;
  }
  num(t, s, e = 0) {
    const o = document.createElement("input");
    o.type = "number", o.min = String(e);
    const r = () => {
      const n = parseFloat(o.value);
      Number.isNaN(n) || s(n);
    };
    return o.addEventListener("change", r), o.addEventListener("keydown", (n) => {
      n.key === "Enter" && (r(), o.blur());
    }), t.append(o), o;
  }
  color(t, s) {
    const e = document.createElement("input");
    return e.type = "color", e.addEventListener("change", () => s(e.value)), t.append(e), e;
  }
  build() {
    const t = document.createElement("div");
    t.className = "props-section css-section";
    const s = document.createElement("div");
    s.className = "props-title css-title", this.cssArrowEl = document.createElement("span"), this.cssArrowEl.className = "css-arrow", this.cssArrowEl.textContent = "▶", s.append(this.cssArrowEl, " CSS"), s.addEventListener("click", () => this.toggleCssViewer()), this.cssBody = document.createElement("div"), this.cssBody.className = "css-body", t.append(s, this.cssBody), this.root.append(t);
    const e = this.section("Auto layout"), o = this.row(e, "Flow"), r = document.createElement("div");
    r.className = "seg";
    const n = [
      ["none", "✕", "不使用 flex"],
      ["col", "↓", "纵向排列 (column)"],
      ["row", "→", "横向排列 (row)"],
      ["wrap", "⤸", "横向换行 (wrap)"]
    ];
    for (const [m, v, E] of n) {
      const z = document.createElement("button");
      z.textContent = v, z.title = E, z.addEventListener("click", () => this.applyFlow(m)), r.append(z), this.flowBtns.push(z);
    }
    o.append(r);
    const l = this.row(e, "W / H");
    this.wInput = this.num(l, (m) => this.host.setSize(m, null), 8), this.hInput = this.num(l, (m) => this.host.setSize(null, m), 8);
    const a = this.row(e, "Align"), c = document.createElement("div");
    c.className = "align-grid";
    for (let m = 0; m < 3; m++)
      for (let v = 0; v < 3; v++) {
        const E = document.createElement("button");
        E.addEventListener("click", () => this.applyAlign(m, v)), c.append(E), this.alignBtns.push(E);
      }
    a.append(c);
    const h = document.createElement("div");
    h.style.flex = "1";
    const d = document.createElement("div");
    d.className = "props-label", d.textContent = "Gap", h.append(d), this.gapInput = this.num(h, (m) => this.host.setProps({ gap: `${m}px` })), a.append(h), this.layoutOnly.push(c, h), this.padLinkedRow = this.row(e, "Padding"), this.padXInput = this.num(this.padLinkedRow, () => this.applyPadding()), this.padYInput = this.num(this.padLinkedRow, () => this.applyPadding()), this.padXInput.title = "水平 padding", this.padYInput.title = "垂直 padding", this.padToggle = document.createElement("button"), this.padToggle.className = "pad-toggle", this.padToggle.textContent = "⊞", this.padToggle.title = "四边独立 padding", this.padToggle.addEventListener("click", () => this.togglePadMode()), this.padLinkedRow.append(this.padToggle), this.padGridRow = this.row(e, ""), this.padGridRow.style.display = "none";
    const p = document.createElement("div");
    p.className = "pad-grid";
    const g = ["左 padding", "上 padding", "右 padding", "下 padding"];
    for (let m = 0; m < 4; m++) {
      const v = this.num(p, () => this.applyPadding());
      v.title = g[m], this.padSides.push(v);
    }
    this.padGridRow.append(p);
    const b = this.row(e), x = document.createElement("label");
    x.className = "check", this.clipInput = document.createElement("input"), this.clipInput.type = "checkbox", this.clipInput.addEventListener(
      "change",
      () => this.host.setProps({ overflow: this.clipInput.checked ? "hidden" : "visible" })
    ), x.append(this.clipInput, "Clip content"), b.append(x);
    const S = this.section("Appearance"), k = this.row(S, "Opacity %");
    this.opacityInput = this.num(
      k,
      (m) => this.host.setProps({ opacity: String(Math.min(100, Math.max(0, m)) / 100) })
    );
    const C = this.row(S, "Radius");
    this.radiusInput = this.num(C, (m) => this.host.setProps({ "border-radius": `${m}px` }));
    const L = this.section("Fill"), R = this.row(L, "Color");
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
  applyAlign(t, s) {
    const e = this.flow === "col" ? I[t] : I[s], o = this.flow === "col" ? I[s] : I[t];
    this.host.setProps({ "justify-content": e, "align-items": o }), this.markAlign(t, s);
  }
  applyPadding() {
    if (this.padIndependent) {
      const [t, s, e, o] = this.padSides.map((r) => parseFloat(r.value) || 0);
      this.host.setProps({ padding: `${s}px ${e}px ${o}px ${t}px` });
    } else {
      const t = parseFloat(this.padXInput.value) || 0, s = parseFloat(this.padYInput.value) || 0;
      this.host.setProps({ padding: `${s}px ${t}px` });
    }
  }
  setPadMode(t) {
    this.padIndependent = t, this.padXInput.style.display = t ? "none" : "", this.padYInput.style.display = t ? "none" : "", this.padGridRow.style.display = t ? "" : "none", this.padToggle.classList.toggle("on", t);
  }
  togglePadMode() {
    const t = !this.padIndependent;
    if (t) {
      const s = this.padXInput.value || "0", e = this.padYInput.value || "0", o = [s, e, s, e];
      this.padSides.forEach((r, n) => r.value = o[n]);
    } else
      this.padXInput.value = this.padSides[0].value || "0", this.padYInput.value = this.padSides[1].value || "0", this.applyPadding();
    this.setPadMode(t);
  }
  applyFill() {
    const t = Math.min(100, Math.max(0, parseFloat(this.fillPct.value) || 0));
    this.host.setProps({ "background-color": Ct(this.fillColor.value, t / 100) });
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
    const s = getComputedStyle(t), e = (f) => s.getPropertyValue(f).trim(), o = (f, y, w, P) => f === y && y === w && w === P ? f : f === w && y === P ? `${f} ${y}` : `${f} ${y} ${w} ${P}`, r = [], n = (f, y, w) => {
      w && r.push([f, y, w]);
    };
    if (n("定位", "position", e("position")), e("position") !== "static") {
      for (const y of ["top", "right", "bottom", "left"]) {
        const w = e(y);
        w !== "auto" && n("定位", y, w);
      }
      const f = e("z-index");
      f !== "auto" && n("定位", "z-index", f);
    }
    const l = e("float");
    l !== "none" && n("定位", "float", l), n("盒模型", "display", e("display")), n("盒模型", "box-sizing", e("box-sizing")), n("盒模型", "width", e("width")), n("盒模型", "height", e("height"));
    const a = e("min-width");
    a !== "0px" && n("盒模型", "min-width", a);
    const c = e("max-width");
    c !== "none" && n("盒模型", "max-width", c);
    const h = e("min-height");
    h !== "0px" && n("盒模型", "min-height", h);
    const d = e("max-height");
    d !== "none" && n("盒模型", "max-height", d);
    const p = e("overflow-x"), g = e("overflow-y");
    n("盒模型", "overflow", p === g ? p : `${p} / ${g}`), n("间距", "margin", o(e("margin-top"), e("margin-right"), e("margin-bottom"), e("margin-left"))), n("间距", "padding", o(e("padding-top"), e("padding-right"), e("padding-bottom"), e("padding-left"))), n("字体", "font-family", e("font-family")), n("字体", "font-size", e("font-size")), n("字体", "font-weight", e("font-weight")), n("字体", "line-height", e("line-height"));
    const b = e("letter-spacing");
    b !== "normal" && n("字体", "letter-spacing", b), n("字体", "color", e("color")), n("字体", "text-align", e("text-align"));
    const x = e("text-decoration-line");
    x !== "none" && n("字体", "text-decoration", `${x} ${e("text-decoration-color")}`.trim());
    const S = e("text-transform");
    S !== "none" && n("字体", "text-transform", S);
    const k = e("white-space");
    k !== "normal" && n("字体", "white-space", k), n("背景", "background-color", e("background-color"));
    const C = e("background-image");
    C !== "none" && n("背景", "background-image", C);
    const L = e("background-size");
    L !== "auto" && n("背景", "background-size", L);
    const R = e("border-top-width"), A = e("border-top-style"), M = e("border-top-color");
    A !== "none" && n("边框", "border", `${R} ${A} ${M}`);
    const m = o(
      e("border-top-left-radius"),
      e("border-top-right-radius"),
      e("border-bottom-right-radius"),
      e("border-bottom-left-radius")
    );
    m !== "0px" && n("边框", "border-radius", m);
    const v = e("outline");
    v.startsWith("0px") || n("边框", "outline", v);
    const E = e("display");
    if (E.includes("flex")) {
      n("Flex", "flex-direction", e("flex-direction")), n("Flex", "flex-wrap", e("flex-wrap")), n("Flex", "justify-content", e("justify-content")), n("Flex", "align-items", e("align-items"));
      const f = e("row-gap"), y = e("column-gap");
      f !== "normal" && f !== "0px" && n("Flex", "gap", f === y ? f : `${f} ${y}`);
    }
    E.includes("grid") && (n("Grid", "grid-template-columns", e("grid-template-columns")), n("Grid", "grid-template-rows", e("grid-template-rows")), n("Grid", "grid-auto-flow", e("grid-auto-flow")));
    const z = e("align-self");
    z !== "auto" && n("Flex", "align-self", z);
    const U = e("flex-grow");
    U !== "0" && n("Flex", "flex-grow", U);
    const K = e("flex-shrink");
    K !== "1" && n("Flex", "flex-shrink", K);
    const _ = e("opacity");
    _ !== "1" && n("效果", "opacity", _);
    const q = e("box-shadow");
    q !== "none" && n("效果", "box-shadow", q);
    const Z = e("transform");
    Z !== "none" && n("效果", "transform", Z);
    const N = e("transition");
    N && !N.startsWith("all 0s") && n("效果", "transition", N), n("效果", "cursor", e("cursor"));
    const J = e("pointer-events");
    if (J !== "auto" && n("效果", "pointer-events", J), r.length === 0) {
      const f = document.createElement("div");
      f.className = "css-empty", f.textContent = "暂无样式", this.cssBody.append(f);
      return;
    }
    let Q = "";
    for (const [f, y, w] of r) {
      if (f !== Q) {
        const j = document.createElement("div");
        j.className = "css-group-title", j.textContent = f, this.cssBody.append(j), Q = f;
      }
      const P = document.createElement("div");
      P.className = "css-entry";
      const O = document.createElement("span");
      O.className = "css-prop", O.textContent = y;
      const D = document.createElement("span");
      D.className = "css-val", D.textContent = w, D.title = w, P.append(O, D), this.cssBody.append(P);
    }
  }
  // ---------- reads ----------
  markFlow() {
    const t = ["none", "col", "row", "wrap"].indexOf(this.flow);
    this.flowBtns.forEach((s, e) => s.classList.toggle("on", e === t));
    for (const s of this.layoutOnly) s.classList.toggle("disabled", this.flow === "none");
  }
  markAlign(t, s) {
    this.alignBtns.forEach((e, o) => e.classList.toggle("on", o === t * 3 + s));
  }
  focusWithin() {
    const t = this.root.getRootNode();
    return t instanceof ShadowRoot && this.root.contains(t.activeElement);
  }
  populate(t) {
    const s = getComputedStyle(t), e = t.getBoundingClientRect();
    s.display.includes("flex") ? this.flow = s.flexDirection.startsWith("column") ? "col" : s.flexWrap === "wrap" ? "wrap" : "row" : this.flow = "none", this.markFlow(), this.wInput.value = String(Math.round(e.width)), this.hInput.value = String(Math.round(e.height));
    const o = ot(s.justifyContent), r = ot(s.alignItems);
    this.markAlign(this.flow === "col" ? o : r, this.flow === "col" ? r : o), this.gapInput.value = String(s.columnGap === "normal" ? 0 : H(s.columnGap));
    const n = [s.paddingLeft, s.paddingTop, s.paddingRight, s.paddingBottom].map(H), l = n[0] === n[2] && n[1] === n[3];
    this.setPadMode(!l), this.padXInput.value = String(n[0]), this.padYInput.value = String(n[1]), this.padSides.forEach((h, d) => h.value = String(n[d])), this.clipInput.checked = s.overflowX !== "visible", this.opacityInput.value = String(Math.round(parseFloat(s.opacity) * 100)), this.radiusInput.value = String(H(s.borderTopLeftRadius));
    const a = st(s.backgroundColor);
    this.fillColor.value = a.hex, this.fillPct.value = String(Math.round(a.alpha * 100));
    const c = st(s.borderTopColor);
    this.strokeColor.value = c.hex, this.strokeWidth.value = String(parseFloat(s.borderTopWidth) || 0), this.cssOpen && this.renderCSS(t);
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
function Bt(i, t, s) {
  const e = [], o = [], r = (p) => {
    e.push(p.left, p.right, p.left + p.width / 2), o.push(p.top, p.bottom, p.top + p.height / 2);
  }, n = i.parentElement;
  if (n && n !== document.body && r(n.getBoundingClientRect()), n) {
    let p = 0;
    for (const g of Array.from(n.children)) {
      if (g === i || !(g instanceof HTMLElement)) continue;
      const b = g.getBoundingClientRect();
      if (!(b.width === 0 && b.height === 0) && (r(b), ++p >= 30))
        break;
    }
  }
  const l = [t.left, t.left + t.width, t.left + t.width / 2], a = [t.top, t.top + t.height, t.top + t.height / 2], c = (p, g) => {
    let b = s + 1, x = null;
    for (const S of p)
      for (const k of g) {
        const C = Math.abs(k - S);
        C < b && (b = C, x = { adj: k - S, guide: k });
      }
    return x;
  }, h = c(l, e), d = c(a, o);
  return {
    adjX: (h == null ? void 0 : h.adj) ?? 0,
    adjY: (d == null ? void 0 : d.adj) ?? 0,
    guideV: (h == null ? void 0 : h.guide) ?? null,
    guideH: (d == null ? void 0 : d.guide) ?? null
  };
}
const u = Math.round;
function ct(i) {
  const t = i.el.getBoundingClientRect();
  return { x: t.left + window.scrollX, y: t.top + window.scrollY, w: t.width, h: t.height };
}
function nt(i) {
  const t = u(i);
  return t > 0 ? `+${t}` : `${t}`;
}
function X(i) {
  const t = i.filter((e) => e.el.isConnected), s = [
    `# Sidetation 视觉修改记录（${t.length} 处）`,
    "",
    `- 页面：${location.href}`,
    `- 视口：${window.innerWidth}×${window.innerHeight}`,
    ""
  ];
  return t.forEach((e, o) => {
    const r = e.originalRect;
    if (s.push(`## ${o + 1}. \`${e.selector}\``), s.push(`- 元素：\`<${e.tag}>\``), e.deleted) {
      s.push("- **删除该元素**"), s.push(`- 原始盒（页面坐标）：x ${u(r.x)}，y ${u(r.y)}，w ${u(r.w)}，h ${u(r.h)}`), s.push("");
      return;
    }
    const n = ct(e);
    e.moved && s.push(`- 移动：Δx ${nt(e.dx)}px，Δy ${nt(e.dy)}px`), e.resized && s.push(
      `- 尺寸：${u(e.startSize.w)}×${u(e.startSize.h)} → ${u(e.size.w)}×${u(e.size.h)}`
    );
    const l = Object.entries(e.props);
    if (l.length && s.push(`- 样式：${l.map(([a, c]) => `\`${a}: ${c}\``).join("，")}`), e.text !== null) {
      const a = (c) => (c ?? "").trim().replace(/\s+/g, " ").slice(0, 80);
      s.push(`- 文字："${a(e.savedText)}" → "${a(e.text)}"`);
    }
    s.push(`- 原始盒（页面坐标）：x ${u(r.x)}，y ${u(r.y)}，w ${u(r.w)}，h ${u(r.h)}`), s.push(`- 修改后：x ${u(n.x)}，y ${u(n.y)}，w ${u(n.w)}，h ${u(n.h)}`), s.push("");
  }), s.push("---"), s.push(
    "请把以上视觉改动落实到源码中：根据元素所在布局选择合适的方式（margin / padding / flex / grid / gap / width / height 等），不要直接照抄 transform 位移，那只是编辑器里的临时表现。"
  ), s.join(`
`);
}
function Tt(i) {
  return { x: u(i.x), y: u(i.y), w: u(i.w), h: u(i.h) };
}
function Lt(i) {
  const s = i.filter((e) => e.el.isConnected).map((e) => {
    const o = e.originalRect;
    return {
      selector: e.selector,
      tag: e.tag,
      deleted: e.deleted,
      moved: e.moved,
      dx: u(e.dx),
      dy: u(e.dy),
      resized: e.resized,
      startSize: { w: u(e.startSize.w), h: u(e.startSize.h) },
      size: { w: u(e.size.w), h: u(e.size.h) },
      props: { ...e.props },
      text: e.text === null ? null : { before: e.savedText, after: e.text },
      originalRect: { x: u(o.x), y: u(o.y), w: u(o.w), h: u(o.h) },
      currentRect: e.deleted ? null : Tt(ct(e))
    };
  });
  return {
    version: 1,
    page: {
      url: location.href,
      origin: location.origin,
      path: location.pathname,
      title: document.title
    },
    viewport: { w: window.innerWidth, h: window.innerHeight },
    count: s.length,
    markdown: X(i),
    css: Y(i),
    edits: s
  };
}
function Y(i) {
  return i.filter((e) => e.el.isConnected).map((e) => {
    const o = [];
    if (e.deleted)
      o.push("  display: none;");
    else {
      e.moved && o.push(`  transform: translate(${u(e.dx)}px, ${u(e.dy)}px);`), e.resized && (o.push(`  width: ${u(e.size.w - e.sizeAdj.w)}px;`), o.push(`  height: ${u(e.size.h - e.sizeAdj.h)}px;`));
      for (const [n, l] of Object.entries(e.props)) o.push(`  ${n}: ${l};`);
    }
    return `${`/* ${e.tag}: ${u(e.startSize.w)}×${u(e.startSize.h)} @ (${u(
      e.originalRect.x
    )}, ${u(e.originalRect.y)}) */`}
${e.selector} {
${o.join(`
`)}
}`;
  }).join(`

`) + `
`;
}
function V() {
  return `sidetation:${location.origin}${location.pathname}`;
}
function Rt(i) {
  const t = i.filter((s) => s.el.isConnected);
  try {
    if (t.length === 0) {
      localStorage.removeItem(V());
      return;
    }
    const s = t.map((e) => ({
      selector: e.selector,
      dx: e.dx,
      dy: e.dy,
      moved: e.moved,
      resized: e.resized,
      deleted: e.deleted,
      startSize: e.startSize,
      size: e.size,
      savedText: e.savedText,
      text: e.text,
      props: e.props,
      savedProps: e.savedProps
    }));
    localStorage.setItem(V(), JSON.stringify(s));
  } catch {
  }
}
function At() {
  try {
    const i = localStorage.getItem(V());
    return i ? JSON.parse(i) : null;
  } catch {
    return null;
  }
}
class Mt {
  constructor(t, s) {
    this.root = t, this.host = s, this.countEl = document.createElement("div"), this.countEl.className = "align-title", this.root.append(this.countEl), this.buildAlignRow(), this.buildDistributeRow();
  }
  buildAlignRow() {
    const t = document.createElement("div");
    t.className = "align-row";
    const s = [
      ["left", "⇤", "左对齐"],
      ["hcenter", "↔", "水平居中对齐"],
      ["right", "⇥", "右对齐"],
      ["top", "⤒", "顶对齐"],
      ["vcenter", "↕", "垂直居中对齐"],
      ["bottom", "⤓", "底对齐"]
    ];
    for (const [e, o, r] of s) {
      const n = document.createElement("button");
      n.textContent = o, n.title = r, n.addEventListener("click", () => this.host.align(e)), t.append(n);
    }
    this.root.append(t);
  }
  buildDistributeRow() {
    const t = document.createElement("div");
    t.className = "align-row", this.distHBtn = document.createElement("button"), this.distHBtn.textContent = "⇹", this.distHBtn.title = "水平等距分布", this.distHBtn.addEventListener("click", () => this.host.distribute("h")), this.distVBtn = document.createElement("button"), this.distVBtn.textContent = "⇳", this.distVBtn.title = "垂直等距分布", this.distVBtn.addEventListener("click", () => this.host.distribute("v")), t.append(this.distHBtn, this.distVBtn), this.root.append(t);
  }
  show(t) {
    this.root.classList.add("open"), this.countEl.textContent = `已选 ${t} 个`;
    const s = t >= 3;
    this.distHBtn.disabled = !s, this.distVBtn.disabled = !s;
  }
  hide() {
    this.root.classList.remove("open");
  }
}
const Dt = 3;
class It {
  constructor(t = {}) {
    this.overlay = new ut(), this.history = new Et(), this.active = !1, this.hovered = null, this.selected = [], this.drag = null, this.resize = null, this.textEdit = null, this.lastDownAt = 0, this.lastDownTarget = null, this.rafId = 0, this.savedUserSelect = "", this.loop = () => {
      if (this.selected.length > 0) {
        const s = this.selected.filter((e) => e.isConnected);
        s.length !== this.selected.length && (this.selected = s);
      }
      if (this.selected.length === 1) {
        const e = this.selected[0].getBoundingClientRect();
        this.overlay.setSelection(e, this.selectionLabel()), this.propsPanel.refreshRect(e), this.overlay.setMultiSelection([]), this.alignPanel.hide();
      } else if (this.selected.length > 1) {
        const s = this.selected.map((e) => e.getBoundingClientRect());
        this.overlay.setSelection(null), this.overlay.setMultiSelection(s), this.overlay.positionAlignPanel(s), this.alignPanel.show(this.selected.length);
      } else
        this.overlay.setSelection(null), this.overlay.setMultiSelection([]), this.alignPanel.hide();
      this.hovered && this.hovered.isConnected && !this.selected.includes(this.hovered) ? this.overlay.setHover(this.hovered.getBoundingClientRect()) : this.overlay.setHover(null), this.rafId = requestAnimationFrame(this.loop);
    }, this.onPointerMove = (s) => {
      if (this.resize) {
        this.moveResize(s);
        return;
      }
      if (this.drag) {
        this.moveDrag(s);
        return;
      }
      if (this.inOverlay(s)) {
        this.hovered = null;
        return;
      }
      this.hovered = this.pageElementAt(s.clientX, s.clientY);
    }, this.onPointerDown = (s) => {
      if (this.inOverlay(s)) return;
      if (this.textEdit) {
        if (s.composedPath().includes(this.textEdit.el)) return;
        this.commitTextEdit();
      }
      if (s.preventDefault(), s.stopPropagation(), s.altKey && this.selected.length === 1) {
        const a = this.selected[0].parentElement;
        this.isSelectable(a) && this.select([a]);
        return;
      }
      const e = this.pageElementAt(s.clientX, s.clientY);
      if (!e) {
        this.select([]);
        return;
      }
      if (s.shiftKey) {
        this.toggleSelect(e);
        return;
      }
      const o = Date.now();
      if (e === this.lastDownTarget && o - this.lastDownAt < 400) {
        this.lastDownAt = 0, this.startTextEdit(e);
        return;
      }
      this.lastDownAt = o, this.lastDownTarget = e;
      const r = this.selected.length === 1 ? this.selected[0] : null, n = r !== null && (e === r || r.contains(e)), l = this.selected.length > 1 && this.selected.includes(e);
      !n && !l && this.select([e]), this.drag = {
        els: this.selected,
        startX: s.clientX,
        startY: s.clientY,
        items: null,
        moved: !1,
        downTarget: e
      };
    }, this.onPointerUp = (s) => {
      if (this.resize) {
        const e = this.resize;
        this.resize = null, document.documentElement.style.cursor = "", this.history.commit(e.rec, e.before);
        return;
      }
      if (this.drag) {
        const e = this.drag;
        this.drag = null, this.overlay.setGuides(null, null), document.documentElement.style.cursor = "", e.moved && e.items ? this.history.commitBatch(e.items.map(({ rec: o, before: r }) => ({ rec: o, before: r }))) : this.selected.length === 1 && this.selected[0] === e.downTarget || this.select([e.downTarget]), s.preventDefault(), s.stopPropagation();
      }
    }, this.blockEvent = (s) => {
      this.inOverlay(s) || this.textEdit && s.composedPath().includes(this.textEdit.el) || (s.preventDefault(), s.stopImmediatePropagation());
    }, this.onKeyDown = (s) => {
      if (this.inOverlay(s)) return;
      if (this.textEdit) {
        s.key === "Escape" && (s.preventDefault(), s.stopPropagation(), this.commitTextEdit());
        return;
      }
      const e = s.metaKey || s.ctrlKey;
      if (s.key === "Escape") {
        s.preventDefault(), s.stopPropagation(), this.selected.length > 0 ? this.select([]) : this.deactivate();
        return;
      }
      if (e && (s.key === "z" || s.key === "Z")) {
        s.preventDefault(), s.stopPropagation(), (s.shiftKey ? this.history.redo() : this.history.undo()) && this.overlay.toast(s.shiftKey ? "重做" : "撤销");
        return;
      }
      if (this.selected.length === 0) return;
      if (s.key === "Delete" || s.key === "Backspace") {
        s.preventDefault(), s.stopPropagation();
        const a = this.selected.length, c = this.selected.map((h) => {
          const d = this.history.ensure(h), p = this.history.snapshot(d);
          return d.deleted = !0, { rec: d, before: p };
        });
        this.select([]), this.history.commitBatch(c), this.overlay.toast(a > 1 ? `已删除 ${a} 个元素（⌘Z 撤销）` : "已删除（⌘Z 撤销）");
        return;
      }
      if (this.selected.length === 1) {
        const a = this.selected[0];
        if (s.key === "Enter") {
          s.preventDefault(), s.stopPropagation();
          const c = s.shiftKey ? a.parentElement : a.firstElementChild;
          this.isSelectable(c) && this.select([c]);
          return;
        }
        if (s.key === "Tab") {
          s.preventDefault(), s.stopPropagation();
          const c = s.shiftKey ? a.previousElementSibling : a.nextElementSibling;
          this.isSelectable(c) && this.select([c]);
          return;
        }
      }
      const o = s.shiftKey ? 10 : 1, n = {
        ArrowLeft: [-o, 0],
        ArrowRight: [o, 0],
        ArrowUp: [0, -o],
        ArrowDown: [0, o]
      }[s.key];
      if (!n) return;
      s.preventDefault(), s.stopPropagation();
      const l = this.selected.map((a) => {
        const c = this.history.ensure(a), h = this.history.snapshot(c);
        return c.dx += n[0], c.dy += n[1], c.moved = !0, { rec: c, before: h };
      });
      this.history.commitBatch(l, { coalesce: "nudge" });
    }, this.opts = {
      autoStart: !1,
      snapThreshold: 6,
      enableMcpSync: !1,
      mcpEndpoint: "http://127.0.0.1:8787",
      ...t
    }, this.toolbar = new $t(this.overlay.toolbarEl, this.overlay.panelEl, this.overlay.shortcutsEl, {
      onToggle: () => this.active ? this.deactivate() : this.activate(),
      onCopyMd: () => this.copy(X(this.history.all()), "已复制 Markdown"),
      onCopyCss: () => this.copy(Y(this.history.all()), "已复制 CSS"),
      onSync: () => this.syncToMcp(),
      onReset: () => this.history.resetAll(),
      onRevert: (s) => this.history.revert(s)
    }, this.opts.enableMcpSync), this.propsPanel = new Pt(this.overlay.propsEl, {
      setProps: (s) => this.panelSetProps(s),
      setSize: (s, e) => this.panelSetSize(s, e)
    }), this.alignPanel = new Mt(this.overlay.alignEl, {
      align: (s) => this.alignSelected(s),
      distribute: (s) => this.distributeSelected(s)
    }), this.history.onChange = () => {
      this.syncUI(), Rt(this.history.all());
    }, this.overlay.onHandleDown = (s, e) => this.startResize(s, e), this.restoreSession(), this.syncUI(), this.opts.autoStart && this.activate();
  }
  /** re-apply edits saved from a previous session on this page, if any */
  restoreSession() {
    const t = At();
    if (!t || t.length === 0) return;
    const s = this.history.restore(t);
    s > 0 && this.overlay.toast(`${s} 处修改因页面结构变化未能恢复`);
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
    const t = this.selected[0], s = t.getBoundingClientRect();
    return `${xt(t)}  ${Math.round(s.width)}×${Math.round(s.height)}`;
  }
  // ---------- element picking ----------
  pageElementAt(t, s) {
    let e = document.elementFromPoint(t, s);
    for (; e && !(e instanceof HTMLElement); ) e = e.parentElement;
    return !e || e === document.body || e === document.documentElement || e.closest("[data-sidetation]") ? null : e;
  }
  inOverlay(t) {
    return t.composedPath().includes(this.overlay.host);
  }
  select(t) {
    this.selected = t, this.hovered = null, this.propsPanel.setTarget(t.length === 1 ? t[0] : null);
  }
  /** Shift+click: add/remove one element from the current selection */
  toggleSelect(t) {
    const s = this.selected.indexOf(t);
    if (s >= 0) {
      const e = this.selected.slice();
      e.splice(s, 1), this.select(e);
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
    const s = this.history.ensure(t);
    this.textEdit = {
      el: t,
      rec: s,
      before: this.history.snapshot(s),
      savedUserSelect: t.style.getPropertyValue("user-select")
    }, t.setAttribute("contenteditable", "plaintext-only"), t.isContentEditable || t.setAttribute("contenteditable", "true"), t.style.setProperty("user-select", "text"), t.focus();
    const e = document.createRange();
    e.selectNodeContents(t);
    const o = window.getSelection();
    o == null || o.removeAllRanges(), o == null || o.addRange(e);
  }
  commitTextEdit() {
    var e;
    const t = this.textEdit;
    if (!t) return;
    this.textEdit = null, t.el.removeAttribute("contenteditable"), t.savedUserSelect ? t.el.style.setProperty("user-select", t.savedUserSelect) : t.el.style.removeProperty("user-select"), (e = window.getSelection()) == null || e.removeAllRanges();
    const s = t.el.textContent ?? "";
    t.rec.text = s === t.rec.savedText ? null : s, this.history.commit(t.rec, t.before);
  }
  // ---------- drag ----------
  moveDrag(t) {
    const s = this.drag, e = t.clientX - s.startX, o = t.clientY - s.startY;
    if (!s.moved) {
      if (Math.hypot(e, o) < Dt) return;
      s.moved = !0, s.items = s.els.map((n) => {
        const l = this.history.ensure(n);
        return { rec: l, before: this.history.snapshot(l), baseDx: l.dx, baseDy: l.dy };
      }), document.documentElement.style.cursor = "move";
    }
    const r = s.items;
    if (r.length === 1) {
      const { rec: n, baseDx: l, baseDy: a } = r[0];
      let c = l + e, h = a + o;
      const d = s.els[0].getBoundingClientRect(), p = {
        left: d.left + (c - n.dx),
        top: d.top + (h - n.dy),
        width: d.width,
        height: d.height
      }, g = Bt(s.els[0], p, this.opts.snapThreshold);
      c += g.adjX, h += g.adjY, this.overlay.setGuides(g.guideV, g.guideH), n.dx = c, n.dy = h, n.moved = !0, $(n);
    } else {
      this.overlay.setGuides(null, null);
      for (const { rec: n, baseDx: l, baseDy: a } of r)
        n.dx = l + e, n.dy = a + o, n.moved = !0, $(n);
    }
  }
  // ---------- resize ----------
  startResize(t, s) {
    if (this.selected.length !== 1) return;
    const e = this.selected[0];
    s.preventDefault(), s.stopPropagation();
    const o = this.history.ensure(e), r = e.getBoundingClientRect();
    this.resize = {
      rec: o,
      before: this.history.snapshot(o),
      dir: t,
      startX: s.clientX,
      startY: s.clientY,
      startW: r.width,
      startH: r.height,
      baseDx: o.dx,
      baseDy: o.dy
    };
  }
  moveResize(t) {
    const s = this.resize, { rec: e, dir: o } = s, r = t.clientX - s.startX, n = t.clientY - s.startY;
    let l = s.startW, a = s.startH;
    if (o.includes("e") && (l = s.startW + r), o.includes("w") && (l = s.startW - r), o.includes("s") && (a = s.startH + n), o.includes("n") && (a = s.startH - n), t.shiftKey && s.startH > 0 && s.startW > 0) {
      const c = s.startW / s.startH;
      o === "e" || o === "w" ? a = l / c : o === "n" || o === "s" ? l = a * c : Math.abs(r) > Math.abs(n) ? a = l / c : l = a * c;
    }
    l = Math.max(8, Math.round(l)), a = Math.max(8, Math.round(a)), e.dx = o.includes("w") ? s.baseDx + (s.startW - l) : s.baseDx, e.dy = o.includes("n") ? s.baseDy + (s.startH - a) : s.baseDy, (e.dx !== s.baseDx || e.dy !== s.baseDy) && (e.moved = !0), e.size = { w: l, h: a }, e.resized = !0, $(e);
  }
  // ---------- properties panel ----------
  panelSetProps(t) {
    if (this.selected.length !== 1) return;
    const s = this.selected[0];
    this.commitTextEdit();
    const e = this.history.ensure(s), o = this.history.snapshot(e);
    for (const [r, n] of Object.entries(t))
      r in e.savedProps || (e.savedProps[r] = s.style.getPropertyValue(r)), n === null ? delete e.props[r] : e.props[r] = n;
    this.history.commit(e, o, { coalesce: `props:${Object.keys(t).sort().join(",")}` });
  }
  panelSetSize(t, s) {
    if (this.selected.length !== 1) return;
    this.commitTextEdit();
    const e = this.history.ensure(this.selected[0]), o = this.history.snapshot(e);
    t !== null && (e.size.w = Math.max(8, t)), s !== null && (e.size.h = Math.max(8, s)), e.resized = !0, this.history.commit(e, o, { coalesce: "size" });
  }
  // ---------- multi-select: align / distribute ----------
  alignSelected(t) {
    if (this.selected.length < 2) return;
    const s = this.selected.map((h) => ({
      rec: this.history.ensure(h),
      rect: h.getBoundingClientRect()
    })), e = s.map(({ rec: h }) => ({ rec: h, before: this.history.snapshot(h) })), o = Math.min(...s.map((h) => h.rect.left)), r = Math.max(...s.map((h) => h.rect.right)), n = Math.min(...s.map((h) => h.rect.top)), l = Math.max(...s.map((h) => h.rect.bottom)), a = (o + r) / 2, c = (n + l) / 2;
    for (const { rec: h, rect: d } of s) {
      let p = 0, g = 0;
      switch (t) {
        case "left":
          p = o - d.left;
          break;
        case "right":
          p = r - d.right;
          break;
        case "hcenter":
          p = a - (d.left + d.width / 2);
          break;
        case "top":
          g = n - d.top;
          break;
        case "bottom":
          g = l - d.bottom;
          break;
        case "vcenter":
          g = c - (d.top + d.height / 2);
          break;
      }
      (p !== 0 || g !== 0) && (h.dx += p, h.dy += g, h.moved = !0, $(h));
    }
    this.history.commitBatch(e);
  }
  distributeSelected(t) {
    if (this.selected.length < 3) return;
    const s = this.selected.map((d) => ({
      rec: this.history.ensure(d),
      rect: d.getBoundingClientRect()
    })), e = s.map(({ rec: d }) => ({ rec: d, before: this.history.snapshot(d) })), o = [...s].sort(
      (d, p) => t === "h" ? d.rect.left - p.rect.left : d.rect.top - p.rect.top
    ), r = o[0].rect, n = o[o.length - 1].rect, l = t === "h" ? n.right - r.left : n.bottom - r.top, a = o.reduce(
      (d, p) => d + (t === "h" ? p.rect.width : p.rect.height),
      0
    ), c = (l - a) / (o.length - 1);
    let h = t === "h" ? r.left : r.top;
    for (const { rec: d, rect: p } of o) {
      const g = t === "h" ? p.width : p.height, b = t === "h" ? p.left : p.top, x = h - b;
      x !== 0 && (t === "h" ? d.dx += x : d.dy += x, d.moved = !0, $(d)), h += g + c;
    }
    this.history.commitBatch(e);
  }
  // ---------- output ----------
  copy(t, s) {
    var o;
    const e = () => {
      const r = document.createElement("textarea");
      r.value = t, r.style.position = "fixed", r.style.opacity = "0", document.body.append(r), r.select(), document.execCommand("copy"), r.remove(), this.overlay.toast(s);
    };
    (o = navigator.clipboard) != null && o.writeText ? navigator.clipboard.writeText(t).then(
      () => this.overlay.toast(s),
      () => e()
    ) : e();
  }
  /** POST the current edits to the local MCP bridge so an AI agent can read them */
  async syncToMcp() {
    const t = Lt(this.history.all());
    if (t.count === 0) {
      this.overlay.toast("没有可同步的修改");
      return;
    }
    const s = `${this.opts.mcpEndpoint.replace(/\/$/, "")}/ingest`;
    this.toolbar.setSyncState("syncing");
    try {
      const e = await fetch(s, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(t)
      });
      if (!e.ok) throw new Error(`HTTP ${e.status}`);
      this.toolbar.setSyncState("idle"), this.overlay.toast(`已同步 ${t.count} 处修改到 MCP`);
    } catch (e) {
      this.toolbar.setSyncState("idle"), this.overlay.toast(`同步失败：本地 MCP 服务未启动？(${String(e)})`);
    }
  }
  getMarkdown() {
    return X(this.history.all());
  }
  getCSS() {
    return Y(this.history.all());
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
function Nt(i) {
  return new It(i);
}
export {
  It as Sidetation,
  Nt as init
};
