const K = `
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
`, _ = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
class q {
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
    e.textContent = K, t.append(e);
    const s = (n) => {
      const i = document.createElement("div");
      return i.className = n, t.append(i), i;
    };
    this.hoverBox = s("hover-box"), this.selBox = s("sel-box"), this.selLabel = document.createElement("div"), this.selLabel.className = "sel-label", this.selBox.append(this.selLabel);
    for (const n of _) {
      const i = document.createElement("div");
      i.className = "handle", i.dataset.dir = n, i.addEventListener("pointerdown", (r) => {
        var l;
        return (l = this.onHandleDown) == null ? void 0 : l.call(this, n, r);
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
    const e = Math.min(...t.map((i) => i.left)), s = Math.max(...t.map((i) => i.right)), n = Math.min(...t.map((i) => i.top));
    this.alignEl.style.left = `${(e + s) / 2}px`, this.alignEl.style.top = `${Math.max(0, n)}px`;
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
const Z = /(^|[-_])[0-9a-f]{5,}([-_]|$)|^(css|sc|jss|emotion)-|__[A-Za-z0-9]{5,}$/i, J = ["data-testid", "data-test", "data-cy"];
function F(o) {
  return Array.from(o.classList).filter((t) => t.length <= 24 && !Z.test(t) && !/\d{3,}/.test(t)).slice(0, 2);
}
function A(o) {
  return !o.id || /\d{3,}/.test(o.id) || /^[0-9a-f-]{8,}$/i.test(o.id) ? null : o.id;
}
function W(o) {
  const t = o.tagName.toLowerCase();
  for (const s of J) {
    const n = o.getAttribute(s);
    if (n) return `${t}[${s}="${n}"]`;
  }
  const e = F(o).map((s) => `.${CSS.escape(s)}`).join("");
  return t + e;
}
function B(o, t) {
  try {
    const e = document.querySelectorAll(o);
    return e.length === 1 && e[0] === t;
  } catch {
    return !1;
  }
}
function X(o) {
  const t = W(o), e = o.parentElement;
  if (!e) return t;
  const s = Array.from(e.children).filter((n) => n.tagName === o.tagName);
  return s.length <= 1 ? t : `${t}:nth-of-type(${s.indexOf(o) + 1})`;
}
function I(o, t) {
  const e = [];
  let s = o;
  for (; s && s !== document.body && s !== document.documentElement && e.length < 5; ) {
    const n = A(s);
    if (n && s !== o) {
      e.unshift(`#${CSS.escape(n)}`);
      const r = e.join(" > ");
      if (B(r, o)) return r;
      break;
    }
    e.unshift(t ? X(s) : W(s));
    const i = e.join(" > ");
    if (B(i, o)) return i;
    s = s.parentElement;
  }
  return null;
}
function Q(o) {
  const t = A(o);
  if (t) {
    const r = `#${CSS.escape(t)}`;
    if (B(r, o)) return r;
  }
  const e = I(o, !1);
  if (e) return e;
  const s = I(o, !0);
  if (s) return s;
  const n = [];
  let i = o;
  for (; i && i !== document.body && i !== document.documentElement && n.length < 5; )
    n.unshift(X(i)), i = i.parentElement;
  return n.join(" > ");
}
function tt(o) {
  const t = o.tagName.toLowerCase(), e = A(o);
  if (e) return `${t}#${e}`;
  const s = F(o);
  return s.length ? `${t}.${s[0]}` : t;
}
function z(o, t, e) {
  e ? o.style.setProperty(t, e) : o.style.removeProperty(t);
}
function y(o) {
  const { el: t, savedInline: e } = o;
  if (o.deleted ? t.style.display = "none" : o.resized && o.baseDisplay === "inline" ? t.style.display = "inline-block" : z(t, "display", e.display), o.moved && (o.dx !== 0 || o.dy !== 0)) {
    const n = `translate(${o.dx}px, ${o.dy}px)`;
    t.style.transform = o.baseTransform === "none" ? n : `${n} ${o.baseTransform}`;
  } else
    z(t, "transform", e.transform);
  o.resized ? (t.style.width = `${o.size.w - o.sizeAdj.w}px`, t.style.height = `${o.size.h - o.sizeAdj.h}px`) : (z(t, "width", e.width), z(t, "height", e.height));
  const s = /* @__PURE__ */ new Set([...Object.keys(o.savedProps), ...Object.keys(o.props)]);
  for (const n of s)
    n in o.props ? t.style.setProperty(n, o.props[n]) : z(t, n, o.savedProps[n] ?? "");
  if (o.savedText !== null && !t.hasAttribute("contenteditable")) {
    const n = o.text ?? o.savedText;
    t.textContent !== n && (t.textContent = n);
  }
}
const et = [
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
], st = 120;
function Y(o, t, e) {
  if (e.n++ > st) {
    t.replaceChildren();
    return;
  }
  const s = getComputedStyle(o);
  let n = "";
  for (const l of et) n += `${l}:${s.getPropertyValue(l)};`;
  t.setAttribute("style", n);
  const i = Array.from(o.children), r = Array.from(t.children);
  for (let l = 0; l < r.length; l++) {
    const a = r[l].tagName.toLowerCase();
    if (a === "script" || a === "iframe" || a === "video" || a === "canvas") {
      r[l].remove();
      continue;
    }
    Y(i[l], r[l], e);
  }
}
function U(o) {
  const t = o.getBoundingClientRect();
  if (t.width < 1 || t.height < 1) return null;
  try {
    const e = o.cloneNode(!0);
    Y(o, e, { n: 0 }), e.style.margin = "0", e.style.transform = "none", e.style.maxWidth = "none", e.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
    const s = new XMLSerializer().serializeToString(e), n = Math.ceil(t.width), i = Math.ceil(t.height), r = `<svg xmlns="http://www.w3.org/2000/svg" width="${n}" height="${i}"><foreignObject width="100%" height="100%">${s}</foreignObject></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(r)}`;
  } catch {
    return null;
  }
}
const nt = 800;
function N(o) {
  return !o.moved && !o.resized && !o.deleted && Object.keys(o.props).length === 0 && o.text === null;
}
function ot(o, t) {
  const e = Object.keys(o);
  return e.length === Object.keys(t).length && e.every((s) => o[s] === t[s]);
}
function it(o, t) {
  return o.dx === t.dx && o.dy === t.dy && o.size.w === t.size.w && o.size.h === t.size.h && o.moved === t.moved && o.resized === t.resized && o.deleted === t.deleted && o.text === t.text && ot(o.props, t.props);
}
const rt = {
  dx: 0,
  dy: 0,
  moved: !1,
  resized: !1,
  deleted: !1,
  text: null
};
class at {
  constructor() {
    this.records = /* @__PURE__ */ new Map(), this.undoStack = [], this.redoStack = [], this.seq = 1, this.onChange = null;
  }
  ensure(t) {
    let e = this.records.get(t);
    if (e) return e;
    const s = t.getBoundingClientRect(), n = getComputedStyle(t), i = n.boxSizing === "content-box", r = (l) => parseFloat(l) || 0;
    return e = {
      id: this.seq++,
      el: t,
      selector: Q(t),
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
      baseTransform: n.transform,
      baseDisplay: n.display,
      sizeAdj: i ? {
        w: r(n.paddingLeft) + r(n.paddingRight) + r(n.borderLeftWidth) + r(n.borderRightWidth),
        h: r(n.paddingTop) + r(n.paddingBottom) + r(n.borderTopWidth) + r(n.borderBottomWidth)
      } : { w: 0, h: 0 },
      dx: 0,
      dy: 0,
      moved: !1,
      resized: !1,
      deleted: !1,
      startSize: { w: s.width, h: s.height },
      size: { w: s.width, h: s.height },
      beforeSnap: U(t),
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
    for (const { rec: l, before: a } of t) {
      l.dx === 0 && l.dy === 0 && (l.moved = !1), y(l);
      const h = this.snapshot(l);
      it(a, h) || s.push({ rec: l, before: a, after: h }), this.cleanup(l);
    }
    if (s.length === 0) {
      this.emit();
      return;
    }
    const n = (e == null ? void 0 : e.coalesce) ?? null, i = this.undoStack[this.undoStack.length - 1];
    n !== null && i !== void 0 && i.coalesce === n && Date.now() - i.at < nt && i.entries.length === s.length && i.entries.every((l, a) => l.rec === s[a].rec) ? (s.forEach((l, a) => i.entries[a].after = l.after), i.at = Date.now()) : this.undoStack.push({ entries: s, coalesce: n, at: Date.now() }), this.redoStack.length = 0, this.emit();
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
    const e = this.all().find((n) => n.id === t);
    if (!e) return;
    const s = this.snapshot(e);
    this.applySnap(e, { ...rt, size: { ...e.startSize }, props: {} }), this.undoStack.push({
      entries: [{ rec: e, before: s, after: this.snapshot(e) }],
      coalesce: null,
      at: Date.now()
    }), this.redoStack.length = 0, this.emit();
  }
  resetAll() {
    for (const t of this.all()) this.revert(t.id);
  }
  applySnap(t, e) {
    t.dx = e.dx, t.dy = e.dy, t.size = { ...e.size }, t.moved = e.moved, t.resized = e.resized, t.deleted = e.deleted, t.props = { ...e.props }, t.text = e.text, y(t), this.cleanup(t);
  }
  /** keep the consolidated map in sync: pristine records drop out, edited ones stay */
  cleanup(t) {
    N(t) ? this.records.delete(t.el) : this.records.set(t.el, t);
  }
  /**
   * Re-apply a previously saved session after a page refresh: re-resolve each
   * selector, splice the persisted state onto a freshly `ensure()`d record.
   * Returns the count of entries whose selector no longer resolves uniquely.
   */
  restore(t) {
    let e = 0;
    for (const s of t) {
      let n;
      try {
        n = document.querySelectorAll(s.selector);
      } catch {
        e++;
        continue;
      }
      if (n.length !== 1) {
        e++;
        continue;
      }
      const i = this.ensure(n[0]);
      i.dx = s.dx, i.dy = s.dy, i.moved = s.moved, i.resized = s.resized, i.deleted = s.deleted, i.startSize = { ...s.startSize }, i.size = { ...s.size }, i.text = s.text, i.props = { ...s.props }, i.savedProps = { ...s.savedProps }, y(i), this.cleanup(i);
    }
    return e;
  }
  /** drop records that were ensure()d but never turned into a real edit */
  prune() {
    for (const [t, e] of this.records)
      N(e) && this.records.delete(t);
  }
  emit() {
    var t;
    (t = this.onChange) == null || t.call(this);
  }
}
const w = Math.round, lt = [
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
class dt {
  constructor(t, e, s, n, i = !1) {
    this.bar = t, this.panel = e, this.shortcuts = s, this.cb = n, this.panelOpen = !1, this.active = !1, this.records = [];
    const r = document.createElement("div");
    r.className = "brand", r.setAttribute("role", "button");
    const l = document.createElement("span");
    l.className = "brand-dot", r.append(l, "Sidetation"), t.append(r), this.brandEl = r, r.addEventListener("click", () => {
      this.active || this.cb.onToggle();
    }), r.addEventListener("keydown", (g) => {
      !this.active && (g.key === "Enter" || g.key === " ") && (g.preventDefault(), this.cb.onToggle());
    });
    const a = (g, m) => {
      const b = document.createElement("button");
      return b.textContent = g, b.addEventListener("click", m), t.append(b), b;
    }, h = () => {
      const g = document.createElement("div");
      g.className = "divider", t.append(g);
    };
    this.toggleBtn = a("开始编辑", () => n.onToggle()), this.toggleBtn.classList.add("primary"), this.kbdBtn = a("", () => {
    }), this.kbdBtn.classList.add("kbd-btn"), this.kbdBtn.title = "快捷键";
    const c = "http://www.w3.org/2000/svg", d = document.createElementNS(c, "svg");
    d.setAttribute("viewBox", "0 0 24 24"), d.setAttribute("fill", "none"), d.setAttribute("stroke", "currentColor"), d.setAttribute("stroke-width", "2"), d.setAttribute("stroke-linecap", "round"), d.setAttribute("stroke-linejoin", "round");
    const u = document.createElementNS(c, "path");
    u.setAttribute("d", "M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"), d.append(u), this.kbdBtn.append(d), this.buildShortcuts(), this.kbdBtn.addEventListener("mouseenter", () => this.showShortcuts()), this.kbdBtn.addEventListener("mouseleave", () => this.shortcuts.classList.remove("open")), h(), this.editsBtn = a("修改 0", () => this.togglePanel()), this.resetBtn = a("重置", () => n.onReset()), h(), this.mdBtn = a("复制 Markdown", () => n.onCopyMd()), this.cssBtn = a("复制 CSS", () => n.onCopyCss()), i && (this.syncBtn = a("同步 MCP", () => n.onSync()), this.syncBtn.title = "把当前修改推送到本地 MCP 服务，供 AI 编码助手读取");
  }
  /** reflect the in-flight sync request on the button */
  setSyncState(t) {
    if (!this.syncBtn) return;
    const e = t === "syncing";
    this.syncBtn.textContent = e ? "同步中…" : "同步 MCP", this.syncBtn.disabled = e || this.records.length === 0;
  }
  buildShortcuts() {
    const t = document.createElement("div");
    t.className = "shortcuts-title", t.textContent = "快捷键", this.shortcuts.append(t);
    for (const [e, s] of lt) {
      const n = document.createElement("div");
      n.className = "shortcut-row";
      const i = document.createElement("span");
      i.className = "kbd", i.textContent = e;
      const r = document.createElement("span");
      r.className = "shortcut-desc", r.textContent = s, n.append(i, r), this.shortcuts.append(n);
    }
  }
  /** before -> after square thumbnails so the user can see what changed */
  buildThumbs(t) {
    const e = document.createElement("div");
    e.className = "edit-thumbs";
    const s = (r, l = !1) => {
      const a = document.createElement("div");
      if (a.className = "thumb", l)
        a.classList.add("deleted"), a.textContent = "✕";
      else if (r) {
        const h = document.createElement("img");
        h.src = r, h.alt = "", a.append(h);
      } else
        a.textContent = "?", a.classList.add("empty");
      return a;
    }, n = document.createElement("span");
    n.className = "thumb-arrow", n.textContent = "→";
    const i = t.deleted || !t.el.isConnected ? s(null, !0) : s(U(t.el));
    return e.append(s(t.beforeSnap), n, i), e;
  }
  showShortcuts() {
    const t = this.kbdBtn.getBoundingClientRect();
    this.shortcuts.style.left = `${t.left + t.width / 2}px`, this.shortcuts.style.bottom = `${window.innerHeight - t.top + 10}px`, this.shortcuts.classList.add("open");
  }
  togglePanel() {
    this.panelOpen = !this.panelOpen, this.panel.classList.toggle("open", this.panelOpen), this.panelOpen && this.renderPanel();
  }
  update(t, e) {
    this.records = e, this.active = t, this.bar.classList.toggle("collapsed", !t), this.brandEl.setAttribute("tabindex", t ? "-1" : "0"), this.brandEl.title = t ? "" : "开始编辑", this.toggleBtn.textContent = t ? "完成" : "开始编辑", this.toggleBtn.classList.toggle("active", t), this.kbdBtn.style.display = t ? "" : "none", t || this.shortcuts.classList.remove("open"), this.editsBtn.textContent = `修改 ${e.length}`;
    const s = e.length === 0;
    this.editsBtn.disabled = s, this.resetBtn.disabled = s, this.mdBtn.disabled = s, this.cssBtn.disabled = s, this.syncBtn && (this.syncBtn.disabled = s), s && this.panelOpen ? this.togglePanel() : this.panelOpen && this.renderPanel();
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
      t.deleted && s.push("删除"), t.moved && s.push(`移动 Δx ${w(t.dx)} / Δy ${w(t.dy)}`), t.resized && s.push(
        `尺寸 ${w(t.startSize.w)}×${w(t.startSize.h)} → ${w(t.size.w)}×${w(t.size.h)}`
      );
      const n = Object.keys(t.props).length;
      n && s.push(`样式 ×${n}`), t.text !== null && s.push("文字");
      const i = document.createElement("div");
      i.className = "edit-info";
      const r = document.createElement("div");
      r.className = "edit-sel", r.textContent = t.selector;
      const l = document.createElement("div");
      l.className = "edit-delta", l.textContent = s.join(" · "), i.append(r, l), e.append(i);
      const a = document.createElement("button");
      a.textContent = "撤销", a.addEventListener("click", () => this.cb.onRevert(t.id)), e.append(a), this.panel.append(e);
    }
  }
}
const C = ["flex-start", "center", "flex-end"], P = (o) => Math.round(parseFloat(o) || 0), T = (o) => Math.round(o).toString(16).padStart(2, "0");
function j(o) {
  const t = o.match(/rgba?\(([^)]+)\)/);
  if (!t) return { hex: "#000000", alpha: o && o !== "transparent" ? 1 : 0 };
  const e = t[1].split(",").map((s) => parseFloat(s));
  return { hex: `#${T(e[0])}${T(e[1])}${T(e[2])}`, alpha: e[3] ?? 1 };
}
function ht(o, t) {
  if (t >= 1) return o;
  const e = parseInt(o.slice(1, 3), 16), s = parseInt(o.slice(3, 5), 16), n = parseInt(o.slice(5, 7), 16);
  return `rgba(${e}, ${s}, ${n}, ${+t.toFixed(3)})`;
}
function O(o) {
  return o.includes("center") ? 1 : o.includes("end") ? 2 : 0;
}
class ct {
  constructor(t, e) {
    this.root = t, this.host = e, this.el = null, this.flow = "none", this.flowBtns = [], this.alignBtns = [], this.padSides = [], this.padIndependent = !1, this.layoutOnly = [], this.build();
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
      const n = document.createElement("div");
      n.className = "props-label", n.textContent = e, s.append(n);
    }
    return t.append(s), s;
  }
  num(t, e, s = 0) {
    const n = document.createElement("input");
    n.type = "number", n.min = String(s);
    const i = () => {
      const r = parseFloat(n.value);
      Number.isNaN(r) || e(r);
    };
    return n.addEventListener("change", i), n.addEventListener("keydown", (r) => {
      r.key === "Enter" && (i(), n.blur());
    }), t.append(n), n;
  }
  color(t, e) {
    const s = document.createElement("input");
    return s.type = "color", s.addEventListener("change", () => e(s.value)), t.append(s), s;
  }
  build() {
    const t = this.section("Auto layout"), e = this.row(t, "Flow"), s = document.createElement("div");
    s.className = "seg";
    const n = [
      ["none", "✕", "不使用 flex"],
      ["col", "↓", "纵向排列 (column)"],
      ["row", "→", "横向排列 (row)"],
      ["wrap", "⤸", "横向换行 (wrap)"]
    ];
    for (const [f, x, k] of n) {
      const E = document.createElement("button");
      E.textContent = x, E.title = k, E.addEventListener("click", () => this.applyFlow(f)), s.append(E), this.flowBtns.push(E);
    }
    e.append(s);
    const i = this.row(t, "W / H");
    this.wInput = this.num(i, (f) => this.host.setSize(f, null), 8), this.hInput = this.num(i, (f) => this.host.setSize(null, f), 8);
    const r = this.row(t, "Align"), l = document.createElement("div");
    l.className = "align-grid";
    for (let f = 0; f < 3; f++)
      for (let x = 0; x < 3; x++) {
        const k = document.createElement("button");
        k.addEventListener("click", () => this.applyAlign(f, x)), l.append(k), this.alignBtns.push(k);
      }
    r.append(l);
    const a = document.createElement("div");
    a.style.flex = "1";
    const h = document.createElement("div");
    h.className = "props-label", h.textContent = "Gap", a.append(h), this.gapInput = this.num(a, (f) => this.host.setProps({ gap: `${f}px` })), r.append(a), this.layoutOnly.push(l, a), this.padLinkedRow = this.row(t, "Padding"), this.padXInput = this.num(this.padLinkedRow, () => this.applyPadding()), this.padYInput = this.num(this.padLinkedRow, () => this.applyPadding()), this.padXInput.title = "水平 padding", this.padYInput.title = "垂直 padding", this.padToggle = document.createElement("button"), this.padToggle.className = "pad-toggle", this.padToggle.textContent = "⊞", this.padToggle.title = "四边独立 padding", this.padToggle.addEventListener("click", () => this.togglePadMode()), this.padLinkedRow.append(this.padToggle), this.padGridRow = this.row(t, ""), this.padGridRow.style.display = "none";
    const c = document.createElement("div");
    c.className = "pad-grid";
    const d = ["左 padding", "上 padding", "右 padding", "下 padding"];
    for (let f = 0; f < 4; f++) {
      const x = this.num(c, () => this.applyPadding());
      x.title = d[f], this.padSides.push(x);
    }
    this.padGridRow.append(c);
    const u = this.row(t), g = document.createElement("label");
    g.className = "check", this.clipInput = document.createElement("input"), this.clipInput.type = "checkbox", this.clipInput.addEventListener(
      "change",
      () => this.host.setProps({ overflow: this.clipInput.checked ? "hidden" : "visible" })
    ), g.append(this.clipInput, "Clip content"), u.append(g);
    const m = this.section("Appearance"), b = this.row(m, "Opacity %");
    this.opacityInput = this.num(
      b,
      (f) => this.host.setProps({ opacity: String(Math.min(100, Math.max(0, f)) / 100) })
    );
    const $ = this.row(m, "Radius");
    this.radiusInput = this.num($, (f) => this.host.setProps({ "border-radius": `${f}px` }));
    const v = this.section("Fill"), S = this.row(v, "Color");
    this.fillColor = this.color(S, () => this.applyFill()), this.fillPct = this.num(S, () => this.applyFill()), this.fillPct.title = "不透明度 %";
    const G = this.section("Stroke"), D = this.row(G, "Color / W");
    this.strokeColor = this.color(D, () => this.applyStroke()), this.strokeWidth = this.num(D, () => this.applyStroke()), this.strokeWidth.step = "0.5", this.strokeWidth.title = "描边宽度 px";
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
    const s = this.flow === "col" ? C[t] : C[e], n = this.flow === "col" ? C[e] : C[t];
    this.host.setProps({ "justify-content": s, "align-items": n }), this.markAlign(t, e);
  }
  applyPadding() {
    if (this.padIndependent) {
      const [t, e, s, n] = this.padSides.map((i) => parseFloat(i.value) || 0);
      this.host.setProps({ padding: `${e}px ${s}px ${n}px ${t}px` });
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
      const e = this.padXInput.value || "0", s = this.padYInput.value || "0", n = [e, s, e, s];
      this.padSides.forEach((i, r) => i.value = n[r]);
    } else
      this.padXInput.value = this.padSides[0].value || "0", this.padYInput.value = this.padSides[1].value || "0", this.applyPadding();
    this.setPadMode(t);
  }
  applyFill() {
    const t = Math.min(100, Math.max(0, parseFloat(this.fillPct.value) || 0));
    this.host.setProps({ "background-color": ht(this.fillColor.value, t / 100) });
  }
  applyStroke() {
    const t = Math.max(0, parseFloat(this.strokeWidth.value) || 0);
    this.host.setProps({
      "border-width": `${t}px`,
      "border-style": "solid",
      "border-color": this.strokeColor.value
    });
  }
  // ---------- reads ----------
  markFlow() {
    const t = ["none", "col", "row", "wrap"].indexOf(this.flow);
    this.flowBtns.forEach((e, s) => e.classList.toggle("on", s === t));
    for (const e of this.layoutOnly) e.classList.toggle("disabled", this.flow === "none");
  }
  markAlign(t, e) {
    this.alignBtns.forEach((s, n) => s.classList.toggle("on", n === t * 3 + e));
  }
  focusWithin() {
    const t = this.root.getRootNode();
    return t instanceof ShadowRoot && this.root.contains(t.activeElement);
  }
  populate(t) {
    const e = getComputedStyle(t), s = t.getBoundingClientRect();
    e.display.includes("flex") ? this.flow = e.flexDirection.startsWith("column") ? "col" : e.flexWrap === "wrap" ? "wrap" : "row" : this.flow = "none", this.markFlow(), this.wInput.value = String(Math.round(s.width)), this.hInput.value = String(Math.round(s.height));
    const n = O(e.justifyContent), i = O(e.alignItems);
    this.markAlign(this.flow === "col" ? n : i, this.flow === "col" ? i : n), this.gapInput.value = String(e.columnGap === "normal" ? 0 : P(e.columnGap));
    const r = [e.paddingLeft, e.paddingTop, e.paddingRight, e.paddingBottom].map(P), l = r[0] === r[2] && r[1] === r[3];
    this.setPadMode(!l), this.padXInput.value = String(r[0]), this.padYInput.value = String(r[1]), this.padSides.forEach((c, d) => c.value = String(r[d])), this.clipInput.checked = e.overflowX !== "visible", this.opacityInput.value = String(Math.round(parseFloat(e.opacity) * 100)), this.radiusInput.value = String(P(e.borderTopLeftRadius));
    const a = j(e.backgroundColor);
    this.fillColor.value = a.hex, this.fillPct.value = String(Math.round(a.alpha * 100));
    const h = j(e.borderTopColor);
    this.strokeColor.value = h.hex, this.strokeWidth.value = String(parseFloat(e.borderTopWidth) || 0);
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
function pt(o, t, e) {
  const s = [], n = [], i = (u) => {
    s.push(u.left, u.right, u.left + u.width / 2), n.push(u.top, u.bottom, u.top + u.height / 2);
  }, r = o.parentElement;
  if (r && r !== document.body && i(r.getBoundingClientRect()), r) {
    let u = 0;
    for (const g of Array.from(r.children)) {
      if (g === o || !(g instanceof HTMLElement)) continue;
      const m = g.getBoundingClientRect();
      if (!(m.width === 0 && m.height === 0) && (i(m), ++u >= 30))
        break;
    }
  }
  const l = [t.left, t.left + t.width, t.left + t.width / 2], a = [t.top, t.top + t.height, t.top + t.height / 2], h = (u, g) => {
    let m = e + 1, b = null;
    for (const $ of u)
      for (const v of g) {
        const S = Math.abs(v - $);
        S < m && (m = S, b = { adj: v - $, guide: v });
      }
    return b;
  }, c = h(l, s), d = h(a, n);
  return {
    adjX: (c == null ? void 0 : c.adj) ?? 0,
    adjY: (d == null ? void 0 : d.adj) ?? 0,
    guideV: (c == null ? void 0 : c.guide) ?? null,
    guideH: (d == null ? void 0 : d.guide) ?? null
  };
}
const p = Math.round;
function V(o) {
  const t = o.el.getBoundingClientRect();
  return { x: t.left + window.scrollX, y: t.top + window.scrollY, w: t.width, h: t.height };
}
function H(o) {
  const t = p(o);
  return t > 0 ? `+${t}` : `${t}`;
}
function L(o) {
  const t = o.filter((s) => s.el.isConnected), e = [
    `# Sidetation 视觉修改记录（${t.length} 处）`,
    "",
    `- 页面：${location.href}`,
    `- 视口：${window.innerWidth}×${window.innerHeight}`,
    ""
  ];
  return t.forEach((s, n) => {
    const i = s.originalRect;
    if (e.push(`## ${n + 1}. \`${s.selector}\``), e.push(`- 元素：\`<${s.tag}>\``), s.deleted) {
      e.push("- **删除该元素**"), e.push(`- 原始盒（页面坐标）：x ${p(i.x)}，y ${p(i.y)}，w ${p(i.w)}，h ${p(i.h)}`), e.push("");
      return;
    }
    const r = V(s);
    s.moved && e.push(`- 移动：Δx ${H(s.dx)}px，Δy ${H(s.dy)}px`), s.resized && e.push(
      `- 尺寸：${p(s.startSize.w)}×${p(s.startSize.h)} → ${p(s.size.w)}×${p(s.size.h)}`
    );
    const l = Object.entries(s.props);
    if (l.length && e.push(`- 样式：${l.map(([a, h]) => `\`${a}: ${h}\``).join("，")}`), s.text !== null) {
      const a = (h) => (h ?? "").trim().replace(/\s+/g, " ").slice(0, 80);
      e.push(`- 文字："${a(s.savedText)}" → "${a(s.text)}"`);
    }
    e.push(`- 原始盒（页面坐标）：x ${p(i.x)}，y ${p(i.y)}，w ${p(i.w)}，h ${p(i.h)}`), e.push(`- 修改后：x ${p(r.x)}，y ${p(r.y)}，w ${p(r.w)}，h ${p(r.h)}`), e.push("");
  }), e.push("---"), e.push(
    "请把以上视觉改动落实到源码中：根据元素所在布局选择合适的方式（margin / padding / flex / grid / gap / width / height 等），不要直接照抄 transform 位移，那只是编辑器里的临时表现。"
  ), e.join(`
`);
}
function ut(o) {
  return { x: p(o.x), y: p(o.y), w: p(o.w), h: p(o.h) };
}
function gt(o) {
  const e = o.filter((s) => s.el.isConnected).map((s) => {
    const n = s.originalRect;
    return {
      selector: s.selector,
      tag: s.tag,
      deleted: s.deleted,
      moved: s.moved,
      dx: p(s.dx),
      dy: p(s.dy),
      resized: s.resized,
      startSize: { w: p(s.startSize.w), h: p(s.startSize.h) },
      size: { w: p(s.size.w), h: p(s.size.h) },
      props: { ...s.props },
      text: s.text === null ? null : { before: s.savedText, after: s.text },
      originalRect: { x: p(n.x), y: p(n.y), w: p(n.w), h: p(n.h) },
      currentRect: s.deleted ? null : ut(V(s))
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
    count: e.length,
    markdown: L(o),
    css: R(o),
    edits: e
  };
}
function R(o) {
  return o.filter((s) => s.el.isConnected).map((s) => {
    const n = [];
    if (s.deleted)
      n.push("  display: none;");
    else {
      s.moved && n.push(`  transform: translate(${p(s.dx)}px, ${p(s.dy)}px);`), s.resized && (n.push(`  width: ${p(s.size.w - s.sizeAdj.w)}px;`), n.push(`  height: ${p(s.size.h - s.sizeAdj.h)}px;`));
      for (const [r, l] of Object.entries(s.props)) n.push(`  ${r}: ${l};`);
    }
    return `${`/* ${s.tag}: ${p(s.startSize.w)}×${p(s.startSize.h)} @ (${p(
      s.originalRect.x
    )}, ${p(s.originalRect.y)}) */`}
${s.selector} {
${n.join(`
`)}
}`;
  }).join(`

`) + `
`;
}
function M() {
  return `sidetation:${location.origin}${location.pathname}`;
}
function ft(o) {
  const t = o.filter((e) => e.el.isConnected);
  try {
    if (t.length === 0) {
      localStorage.removeItem(M());
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
    localStorage.setItem(M(), JSON.stringify(e));
  } catch {
  }
}
function mt() {
  try {
    const o = localStorage.getItem(M());
    return o ? JSON.parse(o) : null;
  } catch {
    return null;
  }
}
class bt {
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
    for (const [s, n, i] of e) {
      const r = document.createElement("button");
      r.textContent = n, r.title = i, r.addEventListener("click", () => this.host.align(s)), t.append(r);
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
const xt = 3;
class yt {
  constructor(t = {}) {
    this.overlay = new q(), this.history = new at(), this.active = !1, this.hovered = null, this.selected = [], this.drag = null, this.resize = null, this.textEdit = null, this.lastDownAt = 0, this.lastDownTarget = null, this.rafId = 0, this.savedUserSelect = "", this.loop = () => {
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
        const a = this.selected[0].parentElement;
        this.isSelectable(a) && this.select([a]);
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
      const n = Date.now();
      if (s === this.lastDownTarget && n - this.lastDownAt < 400) {
        this.lastDownAt = 0, this.startTextEdit(s);
        return;
      }
      this.lastDownAt = n, this.lastDownTarget = s;
      const i = this.selected.length === 1 ? this.selected[0] : null, r = i !== null && (s === i || i.contains(s)), l = this.selected.length > 1 && this.selected.includes(s);
      !r && !l && this.select([s]), this.drag = {
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
        this.drag = null, this.overlay.setGuides(null, null), document.documentElement.style.cursor = "", s.moved && s.items ? this.history.commitBatch(s.items.map(({ rec: n, before: i }) => ({ rec: n, before: i }))) : this.selected.length === 1 && this.selected[0] === s.downTarget || this.select([s.downTarget]), e.preventDefault(), e.stopPropagation();
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
        const a = this.selected.length, h = this.selected.map((c) => {
          const d = this.history.ensure(c), u = this.history.snapshot(d);
          return d.deleted = !0, { rec: d, before: u };
        });
        this.select([]), this.history.commitBatch(h), this.overlay.toast(a > 1 ? `已删除 ${a} 个元素（⌘Z 撤销）` : "已删除（⌘Z 撤销）");
        return;
      }
      if (this.selected.length === 1) {
        const a = this.selected[0];
        if (e.key === "Enter") {
          e.preventDefault(), e.stopPropagation();
          const h = e.shiftKey ? a.parentElement : a.firstElementChild;
          this.isSelectable(h) && this.select([h]);
          return;
        }
        if (e.key === "Tab") {
          e.preventDefault(), e.stopPropagation();
          const h = e.shiftKey ? a.previousElementSibling : a.nextElementSibling;
          this.isSelectable(h) && this.select([h]);
          return;
        }
      }
      const n = e.shiftKey ? 10 : 1, r = {
        ArrowLeft: [-n, 0],
        ArrowRight: [n, 0],
        ArrowUp: [0, -n],
        ArrowDown: [0, n]
      }[e.key];
      if (!r) return;
      e.preventDefault(), e.stopPropagation();
      const l = this.selected.map((a) => {
        const h = this.history.ensure(a), c = this.history.snapshot(h);
        return h.dx += r[0], h.dy += r[1], h.moved = !0, { rec: h, before: c };
      });
      this.history.commitBatch(l, { coalesce: "nudge" });
    }, this.opts = {
      autoStart: !1,
      snapThreshold: 6,
      enableMcpSync: !1,
      mcpEndpoint: "http://127.0.0.1:8787",
      ...t
    }, this.toolbar = new dt(this.overlay.toolbarEl, this.overlay.panelEl, this.overlay.shortcutsEl, {
      onToggle: () => this.active ? this.deactivate() : this.activate(),
      onCopyMd: () => this.copy(L(this.history.all()), "已复制 Markdown"),
      onCopyCss: () => this.copy(R(this.history.all()), "已复制 CSS"),
      onSync: () => this.syncToMcp(),
      onReset: () => this.history.resetAll(),
      onRevert: (e) => this.history.revert(e)
    }, this.opts.enableMcpSync), this.propsPanel = new ct(this.overlay.propsEl, {
      setProps: (e) => this.panelSetProps(e),
      setSize: (e, s) => this.panelSetSize(e, s)
    }), this.alignPanel = new bt(this.overlay.alignEl, {
      align: (e) => this.alignSelected(e),
      distribute: (e) => this.distributeSelected(e)
    }), this.history.onChange = () => {
      this.syncUI(), ft(this.history.all());
    }, this.overlay.onHandleDown = (e, s) => this.startResize(e, s), this.restoreSession(), this.syncUI(), this.opts.autoStart && this.activate();
  }
  /** re-apply edits saved from a previous session on this page, if any */
  restoreSession() {
    const t = mt();
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
    return `${tt(t)}  ${Math.round(e.width)}×${Math.round(e.height)}`;
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
    const n = window.getSelection();
    n == null || n.removeAllRanges(), n == null || n.addRange(s);
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
    const e = this.drag, s = t.clientX - e.startX, n = t.clientY - e.startY;
    if (!e.moved) {
      if (Math.hypot(s, n) < xt) return;
      e.moved = !0, e.items = e.els.map((r) => {
        const l = this.history.ensure(r);
        return { rec: l, before: this.history.snapshot(l), baseDx: l.dx, baseDy: l.dy };
      }), document.documentElement.style.cursor = "move";
    }
    const i = e.items;
    if (i.length === 1) {
      const { rec: r, baseDx: l, baseDy: a } = i[0];
      let h = l + s, c = a + n;
      const d = e.els[0].getBoundingClientRect(), u = {
        left: d.left + (h - r.dx),
        top: d.top + (c - r.dy),
        width: d.width,
        height: d.height
      }, g = pt(e.els[0], u, this.opts.snapThreshold);
      h += g.adjX, c += g.adjY, this.overlay.setGuides(g.guideV, g.guideH), r.dx = h, r.dy = c, r.moved = !0, y(r);
    } else {
      this.overlay.setGuides(null, null);
      for (const { rec: r, baseDx: l, baseDy: a } of i)
        r.dx = l + s, r.dy = a + n, r.moved = !0, y(r);
    }
  }
  // ---------- resize ----------
  startResize(t, e) {
    if (this.selected.length !== 1) return;
    const s = this.selected[0];
    e.preventDefault(), e.stopPropagation();
    const n = this.history.ensure(s), i = s.getBoundingClientRect();
    this.resize = {
      rec: n,
      before: this.history.snapshot(n),
      dir: t,
      startX: e.clientX,
      startY: e.clientY,
      startW: i.width,
      startH: i.height,
      baseDx: n.dx,
      baseDy: n.dy
    };
  }
  moveResize(t) {
    const e = this.resize, { rec: s, dir: n } = e, i = t.clientX - e.startX, r = t.clientY - e.startY;
    let l = e.startW, a = e.startH;
    if (n.includes("e") && (l = e.startW + i), n.includes("w") && (l = e.startW - i), n.includes("s") && (a = e.startH + r), n.includes("n") && (a = e.startH - r), t.shiftKey && e.startH > 0 && e.startW > 0) {
      const h = e.startW / e.startH;
      n === "e" || n === "w" ? a = l / h : n === "n" || n === "s" ? l = a * h : Math.abs(i) > Math.abs(r) ? a = l / h : l = a * h;
    }
    l = Math.max(8, Math.round(l)), a = Math.max(8, Math.round(a)), s.dx = n.includes("w") ? e.baseDx + (e.startW - l) : e.baseDx, s.dy = n.includes("n") ? e.baseDy + (e.startH - a) : e.baseDy, (s.dx !== e.baseDx || s.dy !== e.baseDy) && (s.moved = !0), s.size = { w: l, h: a }, s.resized = !0, y(s);
  }
  // ---------- properties panel ----------
  panelSetProps(t) {
    if (this.selected.length !== 1) return;
    const e = this.selected[0];
    this.commitTextEdit();
    const s = this.history.ensure(e), n = this.history.snapshot(s);
    for (const [i, r] of Object.entries(t))
      i in s.savedProps || (s.savedProps[i] = e.style.getPropertyValue(i)), r === null ? delete s.props[i] : s.props[i] = r;
    this.history.commit(s, n, { coalesce: `props:${Object.keys(t).sort().join(",")}` });
  }
  panelSetSize(t, e) {
    if (this.selected.length !== 1) return;
    this.commitTextEdit();
    const s = this.history.ensure(this.selected[0]), n = this.history.snapshot(s);
    t !== null && (s.size.w = Math.max(8, t)), e !== null && (s.size.h = Math.max(8, e)), s.resized = !0, this.history.commit(s, n, { coalesce: "size" });
  }
  // ---------- multi-select: align / distribute ----------
  alignSelected(t) {
    if (this.selected.length < 2) return;
    const e = this.selected.map((c) => ({
      rec: this.history.ensure(c),
      rect: c.getBoundingClientRect()
    })), s = e.map(({ rec: c }) => ({ rec: c, before: this.history.snapshot(c) })), n = Math.min(...e.map((c) => c.rect.left)), i = Math.max(...e.map((c) => c.rect.right)), r = Math.min(...e.map((c) => c.rect.top)), l = Math.max(...e.map((c) => c.rect.bottom)), a = (n + i) / 2, h = (r + l) / 2;
    for (const { rec: c, rect: d } of e) {
      let u = 0, g = 0;
      switch (t) {
        case "left":
          u = n - d.left;
          break;
        case "right":
          u = i - d.right;
          break;
        case "hcenter":
          u = a - (d.left + d.width / 2);
          break;
        case "top":
          g = r - d.top;
          break;
        case "bottom":
          g = l - d.bottom;
          break;
        case "vcenter":
          g = h - (d.top + d.height / 2);
          break;
      }
      (u !== 0 || g !== 0) && (c.dx += u, c.dy += g, c.moved = !0, y(c));
    }
    this.history.commitBatch(s);
  }
  distributeSelected(t) {
    if (this.selected.length < 3) return;
    const e = this.selected.map((d) => ({
      rec: this.history.ensure(d),
      rect: d.getBoundingClientRect()
    })), s = e.map(({ rec: d }) => ({ rec: d, before: this.history.snapshot(d) })), n = [...e].sort(
      (d, u) => t === "h" ? d.rect.left - u.rect.left : d.rect.top - u.rect.top
    ), i = n[0].rect, r = n[n.length - 1].rect, l = t === "h" ? r.right - i.left : r.bottom - i.top, a = n.reduce(
      (d, u) => d + (t === "h" ? u.rect.width : u.rect.height),
      0
    ), h = (l - a) / (n.length - 1);
    let c = t === "h" ? i.left : i.top;
    for (const { rec: d, rect: u } of n) {
      const g = t === "h" ? u.width : u.height, m = t === "h" ? u.left : u.top, b = c - m;
      b !== 0 && (t === "h" ? d.dx += b : d.dy += b, d.moved = !0, y(d)), c += g + h;
    }
    this.history.commitBatch(s);
  }
  // ---------- output ----------
  copy(t, e) {
    var n;
    const s = () => {
      const i = document.createElement("textarea");
      i.value = t, i.style.position = "fixed", i.style.opacity = "0", document.body.append(i), i.select(), document.execCommand("copy"), i.remove(), this.overlay.toast(e);
    };
    (n = navigator.clipboard) != null && n.writeText ? navigator.clipboard.writeText(t).then(
      () => this.overlay.toast(e),
      () => s()
    ) : s();
  }
  /** POST the current edits to the local MCP bridge so an AI agent can read them */
  async syncToMcp() {
    const t = gt(this.history.all());
    if (t.count === 0) {
      this.overlay.toast("没有可同步的修改");
      return;
    }
    const e = `${this.opts.mcpEndpoint.replace(/\/$/, "")}/ingest`;
    this.toolbar.setSyncState("syncing");
    try {
      const s = await fetch(e, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(t)
      });
      if (!s.ok) throw new Error(`HTTP ${s.status}`);
      this.toolbar.setSyncState("idle"), this.overlay.toast(`已同步 ${t.count} 处修改到 MCP`);
    } catch (s) {
      this.toolbar.setSyncState("idle"), this.overlay.toast(`同步失败：本地 MCP 服务未启动？(${String(s)})`);
    }
  }
  getMarkdown() {
    return L(this.history.all());
  }
  getCSS() {
    return R(this.history.all());
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
function wt(o) {
  return new yt(o);
}
export {
  yt as Sidetation,
  wt as init
};
