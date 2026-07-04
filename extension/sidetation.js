(function(w,k){typeof exports=="object"&&typeof module<"u"?k(exports):typeof define=="function"&&define.amd?define(["exports"],k):(w=typeof globalThis<"u"?globalThis:w||self,k(w.Sidetation={}))})(this,function(w){"use strict";const k=`
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
`,_=["nw","n","ne","e","se","s","sw","w"];class q{constructor(){this.host=document.createElement("div"),this.multiBoxes=[],this.onHandleDown=null,this.toastTimer=0,this.host.setAttribute("data-sidetation",""),Object.assign(this.host.style,{position:"fixed",inset:"0",zIndex:"2147483647",pointerEvents:"none"});const t=this.host.attachShadow({mode:"open"});this.shadow=t;const e=document.createElement("style");e.textContent=k,t.append(e);const s=n=>{const i=document.createElement("div");return i.className=n,t.append(i),i};this.hoverBox=s("hover-box"),this.selBox=s("sel-box"),this.selLabel=document.createElement("div"),this.selLabel.className="sel-label",this.selBox.append(this.selLabel);for(const n of _){const i=document.createElement("div");i.className="handle",i.dataset.dir=n,i.addEventListener("pointerdown",r=>{var a;return(a=this.onHandleDown)==null?void 0:a.call(this,n,r)}),this.selBox.append(i)}this.guideV=s("guide guide-v"),this.guideH=s("guide guide-h"),this.panelEl=s("panel"),this.propsEl=s("props"),this.alignEl=s("align-panel"),this.shortcutsEl=s("shortcuts"),this.toolbarEl=s("toolbar"),this.toastEl=s("toast"),document.documentElement.appendChild(this.host)}place(t,e){if(!e){t.style.display="none";return}t.style.display="block",t.style.left=`${e.left}px`,t.style.top=`${e.top}px`,t.style.width=`${e.width}px`,t.style.height=`${e.height}px`}setHover(t){this.place(this.hoverBox,t)}setSelection(t,e=""){this.place(this.selBox,t),t&&(this.selLabel.textContent=e)}setMultiSelection(t){for(;this.multiBoxes.length<t.length;){const e=document.createElement("div");e.className="multi-box",this.shadow.append(e),this.multiBoxes.push(e)}this.multiBoxes.forEach((e,s)=>this.place(e,t[s]??null))}positionAlignPanel(t){if(t.length===0)return;const e=Math.min(...t.map(i=>i.left)),s=Math.max(...t.map(i=>i.right)),n=Math.min(...t.map(i=>i.top));this.alignEl.style.left=`${(e+s)/2}px`,this.alignEl.style.top=`${Math.max(0,n)}px`}setGuides(t,e){this.guideV.style.display=t===null?"none":"block",t!==null&&(this.guideV.style.left=`${t}px`),this.guideH.style.display=e===null?"none":"block",e!==null&&(this.guideH.style.top=`${e}px`)}toast(t){this.toastEl.textContent=t,this.toastEl.classList.add("show"),clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>this.toastEl.classList.remove("show"),1600)}destroy(){clearTimeout(this.toastTimer),this.host.remove()}}const Z=/(^|[-_])[0-9a-f]{5,}([-_]|$)|^(css|sc|jss|emotion)-|__[A-Za-z0-9]{5,}$/i,J=["data-testid","data-test","data-cy"];function D(o){return Array.from(o.classList).filter(t=>t.length<=24&&!Z.test(t)&&!/\d{3,}/.test(t)).slice(0,2)}function B(o){return!o.id||/\d{3,}/.test(o.id)||/^[0-9a-f-]{8,}$/i.test(o.id)?null:o.id}function I(o){const t=o.tagName.toLowerCase();for(const s of J){const n=o.getAttribute(s);if(n)return`${t}[${s}="${n}"]`}const e=D(o).map(s=>`.${CSS.escape(s)}`).join("");return t+e}function L(o,t){try{const e=document.querySelectorAll(o);return e.length===1&&e[0]===t}catch{return!1}}function N(o){const t=I(o),e=o.parentElement;if(!e)return t;const s=Array.from(e.children).filter(n=>n.tagName===o.tagName);return s.length<=1?t:`${t}:nth-of-type(${s.indexOf(o)+1})`}function j(o,t){const e=[];let s=o;for(;s&&s!==document.body&&s!==document.documentElement&&e.length<5;){const n=B(s);if(n&&s!==o){e.unshift(`#${CSS.escape(n)}`);const r=e.join(" > ");if(L(r,o))return r;break}e.unshift(t?N(s):I(s));const i=e.join(" > ");if(L(i,o))return i;s=s.parentElement}return null}function Q(o){const t=B(o);if(t){const r=`#${CSS.escape(t)}`;if(L(r,o))return r}const e=j(o,!1);if(e)return e;const s=j(o,!0);if(s)return s;const n=[];let i=o;for(;i&&i!==document.body&&i!==document.documentElement&&n.length<5;)n.unshift(N(i)),i=i.parentElement;return n.join(" > ")}function tt(o){const t=o.tagName.toLowerCase(),e=B(o);if(e)return`${t}#${e}`;const s=D(o);return s.length?`${t}.${s[0]}`:t}function S(o,t,e){e?o.style.setProperty(t,e):o.style.removeProperty(t)}function x(o){const{el:t,savedInline:e}=o;if(o.deleted?t.style.display="none":o.resized&&o.baseDisplay==="inline"?t.style.display="inline-block":S(t,"display",e.display),o.moved&&(o.dx!==0||o.dy!==0)){const n=`translate(${o.dx}px, ${o.dy}px)`;t.style.transform=o.baseTransform==="none"?n:`${n} ${o.baseTransform}`}else S(t,"transform",e.transform);o.resized?(t.style.width=`${o.size.w-o.sizeAdj.w}px`,t.style.height=`${o.size.h-o.sizeAdj.h}px`):(S(t,"width",e.width),S(t,"height",e.height));const s=new Set([...Object.keys(o.savedProps),...Object.keys(o.props)]);for(const n of s)n in o.props?t.style.setProperty(n,o.props[n]):S(t,n,o.savedProps[n]??"");if(o.savedText!==null&&!t.hasAttribute("contenteditable")){const n=o.text??o.savedText;t.textContent!==n&&(t.textContent=n)}}const et=["display","position","flex-direction","flex-wrap","flex","justify-content","align-items","align-self","order","gap","grid-template-columns","width","height","box-sizing","padding","margin","border-width","border-style","border-color","border-radius","background-color","background-image","background-size","background-position","background-repeat","color","font-family","font-size","font-weight","font-style","line-height","text-align","text-decoration","letter-spacing","white-space","vertical-align","list-style","overflow","opacity","box-shadow","transform","object-fit"],st=120;function O(o,t,e){if(e.n++>st){t.replaceChildren();return}const s=getComputedStyle(o);let n="";for(const a of et)n+=`${a}:${s.getPropertyValue(a)};`;t.setAttribute("style",n);const i=Array.from(o.children),r=Array.from(t.children);for(let a=0;a<r.length;a++){const l=r[a].tagName.toLowerCase();if(l==="script"||l==="iframe"||l==="video"||l==="canvas"){r[a].remove();continue}O(i[a],r[a],e)}}function H(o){const t=o.getBoundingClientRect();if(t.width<1||t.height<1)return null;try{const e=o.cloneNode(!0);O(o,e,{n:0}),e.style.margin="0",e.style.transform="none",e.style.maxWidth="none",e.setAttribute("xmlns","http://www.w3.org/1999/xhtml");const s=new XMLSerializer().serializeToString(e),n=Math.ceil(t.width),i=Math.ceil(t.height),r=`<svg xmlns="http://www.w3.org/2000/svg" width="${n}" height="${i}"><foreignObject width="100%" height="100%">${s}</foreignObject></svg>`;return`data:image/svg+xml;charset=utf-8,${encodeURIComponent(r)}`}catch{return null}}const nt=800;function F(o){return!o.moved&&!o.resized&&!o.deleted&&Object.keys(o.props).length===0&&o.text===null}function it(o,t){const e=Object.keys(o);return e.length===Object.keys(t).length&&e.every(s=>o[s]===t[s])}function ot(o,t){return o.dx===t.dx&&o.dy===t.dy&&o.size.w===t.size.w&&o.size.h===t.size.h&&o.moved===t.moved&&o.resized===t.resized&&o.deleted===t.deleted&&o.text===t.text&&it(o.props,t.props)}const rt={dx:0,dy:0,moved:!1,resized:!1,deleted:!1,text:null};class at{constructor(){this.records=new Map,this.undoStack=[],this.redoStack=[],this.seq=1,this.onChange=null}ensure(t){let e=this.records.get(t);if(e)return e;const s=t.getBoundingClientRect(),n=getComputedStyle(t),i=n.boxSizing==="content-box",r=a=>parseFloat(a)||0;return e={id:this.seq++,el:t,selector:Q(t),tag:t.tagName.toLowerCase(),originalRect:{x:s.left+window.scrollX,y:s.top+window.scrollY,w:s.width,h:s.height},savedInline:{transform:t.style.getPropertyValue("transform"),width:t.style.getPropertyValue("width"),height:t.style.getPropertyValue("height"),display:t.style.getPropertyValue("display")},baseTransform:n.transform,baseDisplay:n.display,sizeAdj:i?{w:r(n.paddingLeft)+r(n.paddingRight)+r(n.borderLeftWidth)+r(n.borderRightWidth),h:r(n.paddingTop)+r(n.paddingBottom)+r(n.borderTopWidth)+r(n.borderBottomWidth)}:{w:0,h:0},dx:0,dy:0,moved:!1,resized:!1,deleted:!1,startSize:{w:s.width,h:s.height},size:{w:s.width,h:s.height},beforeSnap:H(t),savedText:t.childElementCount===0?t.textContent:null,text:null,props:{},savedProps:{}},this.records.set(t,e),e}get(t){return this.records.get(t)}all(){return Array.from(this.records.values())}snapshot(t){return{dx:t.dx,dy:t.dy,size:{...t.size},moved:t.moved,resized:t.resized,deleted:t.deleted,props:{...t.props},text:t.text}}commit(t,e,s){this.commitBatch([{rec:t,before:e}],s)}commitBatch(t,e){const s=[];for(const{rec:a,before:l}of t){a.dx===0&&a.dy===0&&(a.moved=!1),x(a);const h=this.snapshot(a);ot(l,h)||s.push({rec:a,before:l,after:h}),this.cleanup(a)}if(s.length===0){this.emit();return}const n=(e==null?void 0:e.coalesce)??null,i=this.undoStack[this.undoStack.length-1];n!==null&&i!==void 0&&i.coalesce===n&&Date.now()-i.at<nt&&i.entries.length===s.length&&i.entries.every((a,l)=>a.rec===s[l].rec)?(s.forEach((a,l)=>i.entries[l].after=a.after),i.at=Date.now()):this.undoStack.push({entries:s,coalesce:n,at:Date.now()}),this.redoStack.length=0,this.emit()}undo(){const t=this.undoStack.pop();if(!t)return!1;for(const e of t.entries)this.applySnap(e.rec,e.before);return this.redoStack.push(t),this.emit(),!0}redo(){const t=this.redoStack.pop();if(!t)return!1;for(const e of t.entries)this.applySnap(e.rec,e.after);return this.undoStack.push(t),this.emit(),!0}revert(t){const e=this.all().find(n=>n.id===t);if(!e)return;const s=this.snapshot(e);this.applySnap(e,{...rt,size:{...e.startSize},props:{}}),this.undoStack.push({entries:[{rec:e,before:s,after:this.snapshot(e)}],coalesce:null,at:Date.now()}),this.redoStack.length=0,this.emit()}resetAll(){for(const t of this.all())this.revert(t.id)}applySnap(t,e){t.dx=e.dx,t.dy=e.dy,t.size={...e.size},t.moved=e.moved,t.resized=e.resized,t.deleted=e.deleted,t.props={...e.props},t.text=e.text,x(t),this.cleanup(t)}cleanup(t){F(t)?this.records.delete(t.el):this.records.set(t.el,t)}restore(t){let e=0;for(const s of t){let n;try{n=document.querySelectorAll(s.selector)}catch{e++;continue}if(n.length!==1){e++;continue}const i=this.ensure(n[0]);i.dx=s.dx,i.dy=s.dy,i.moved=s.moved,i.resized=s.resized,i.deleted=s.deleted,i.startSize={...s.startSize},i.size={...s.size},i.text=s.text,i.props={...s.props},i.savedProps={...s.savedProps},x(i),this.cleanup(i)}return e}prune(){for(const[t,e]of this.records)F(e)&&this.records.delete(t)}emit(){var t;(t=this.onChange)==null||t.call(this)}}const v=Math.round,lt=[["点击","选中元素，点子元素可下钻"],["⇧ 点击","多选 / 取消多选元素"],["双击","编辑文字内容（纯文本元素）"],["⌥ 点击","选中父级元素"],["拖拽","移动元素（多选时整体移动），自动对齐吸附"],["拖拽手柄 / ⇧","缩放 / 等比缩放"],["方向键 / ⇧方向键","微调 1px / 10px"],["Delete / ⌫","删除元素"],["⌘Z / ⌘⇧Z","撤销 / 重做"],["Enter / ⇧Enter","进入子级 / 返回父级"],["Tab / ⇧Tab","下一个 / 上一个兄弟元素"],["Esc","取消选中，再按退出编辑"]];class dt{constructor(t,e,s,n){this.panel=e,this.shortcuts=s,this.cb=n,this.panelOpen=!1,this.records=[];const i=document.createElement("div");i.className="brand";const r=document.createElement("span");r.className="brand-dot",i.append(r,"Sidetation"),t.append(i);const a=(p,f)=>{const m=document.createElement("button");return m.textContent=p,m.addEventListener("click",f),t.append(m),m},l=()=>{const p=document.createElement("div");p.className="divider",t.append(p)};this.toggleBtn=a("开始编辑",()=>n.onToggle()),this.toggleBtn.classList.add("primary"),this.kbdBtn=a("",()=>{}),this.kbdBtn.classList.add("kbd-btn"),this.kbdBtn.title="快捷键";const h="http://www.w3.org/2000/svg",d=document.createElementNS(h,"svg");d.setAttribute("viewBox","0 0 24 24"),d.setAttribute("fill","none"),d.setAttribute("stroke","currentColor"),d.setAttribute("stroke-width","2"),d.setAttribute("stroke-linecap","round"),d.setAttribute("stroke-linejoin","round");const c=document.createElementNS(h,"path");c.setAttribute("d","M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"),d.append(c),this.kbdBtn.append(d),this.buildShortcuts(),this.kbdBtn.addEventListener("mouseenter",()=>this.showShortcuts()),this.kbdBtn.addEventListener("mouseleave",()=>this.shortcuts.classList.remove("open")),l(),this.editsBtn=a("修改 0",()=>this.togglePanel()),this.resetBtn=a("重置",()=>n.onReset()),l(),this.mdBtn=a("复制 Markdown",()=>n.onCopyMd()),this.cssBtn=a("复制 CSS",()=>n.onCopyCss())}buildShortcuts(){const t=document.createElement("div");t.className="shortcuts-title",t.textContent="快捷键",this.shortcuts.append(t);for(const[e,s]of lt){const n=document.createElement("div");n.className="shortcut-row";const i=document.createElement("span");i.className="kbd",i.textContent=e;const r=document.createElement("span");r.className="shortcut-desc",r.textContent=s,n.append(i,r),this.shortcuts.append(n)}}buildThumbs(t){const e=document.createElement("div");e.className="edit-thumbs";const s=(r,a=!1)=>{const l=document.createElement("div");if(l.className="thumb",a)l.classList.add("deleted"),l.textContent="✕";else if(r){const h=document.createElement("img");h.src=r,h.alt="",l.append(h)}else l.textContent="?",l.classList.add("empty");return l},n=document.createElement("span");n.className="thumb-arrow",n.textContent="→";const i=t.deleted||!t.el.isConnected?s(null,!0):s(H(t.el));return e.append(s(t.beforeSnap),n,i),e}showShortcuts(){const t=this.kbdBtn.getBoundingClientRect();this.shortcuts.style.left=`${t.left+t.width/2}px`,this.shortcuts.style.bottom=`${window.innerHeight-t.top+10}px`,this.shortcuts.classList.add("open")}togglePanel(){this.panelOpen=!this.panelOpen,this.panel.classList.toggle("open",this.panelOpen),this.panelOpen&&this.renderPanel()}update(t,e){this.records=e,this.toggleBtn.textContent=t?"完成":"开始编辑",this.toggleBtn.classList.toggle("active",t),this.kbdBtn.style.display=t?"":"none",t||this.shortcuts.classList.remove("open"),this.editsBtn.textContent=`修改 ${e.length}`;const s=e.length===0;this.editsBtn.disabled=s,this.resetBtn.disabled=s,this.mdBtn.disabled=s,this.cssBtn.disabled=s,s&&this.panelOpen?this.togglePanel():this.panelOpen&&this.renderPanel()}renderPanel(){if(this.panel.replaceChildren(),this.records.length===0){const t=document.createElement("div");t.className="panel-empty",t.textContent="还没有修改",this.panel.append(t);return}for(const t of this.records){const e=document.createElement("div");e.className="edit-row",e.append(this.buildThumbs(t));const s=[];t.deleted&&s.push("删除"),t.moved&&s.push(`移动 Δx ${v(t.dx)} / Δy ${v(t.dy)}`),t.resized&&s.push(`尺寸 ${v(t.startSize.w)}×${v(t.startSize.h)} → ${v(t.size.w)}×${v(t.size.h)}`);const n=Object.keys(t.props).length;n&&s.push(`样式 ×${n}`),t.text!==null&&s.push("文字");const i=document.createElement("div");i.className="edit-info";const r=document.createElement("div");r.className="edit-sel",r.textContent=t.selector;const a=document.createElement("div");a.className="edit-delta",a.textContent=s.join(" · "),i.append(r,a),e.append(i);const l=document.createElement("button");l.textContent="撤销",l.addEventListener("click",()=>this.cb.onRevert(t.id)),e.append(l),this.panel.append(e)}}}const P=["flex-start","center","flex-end"],R=o=>Math.round(parseFloat(o)||0),A=o=>Math.round(o).toString(16).padStart(2,"0");function X(o){const t=o.match(/rgba?\(([^)]+)\)/);if(!t)return{hex:"#000000",alpha:o&&o!=="transparent"?1:0};const e=t[1].split(",").map(s=>parseFloat(s));return{hex:`#${A(e[0])}${A(e[1])}${A(e[2])}`,alpha:e[3]??1}}function ht(o,t){if(t>=1)return o;const e=parseInt(o.slice(1,3),16),s=parseInt(o.slice(3,5),16),n=parseInt(o.slice(5,7),16);return`rgba(${e}, ${s}, ${n}, ${+t.toFixed(3)})`}function W(o){return o.includes("center")?1:o.includes("end")?2:0}class ct{constructor(t,e){this.root=t,this.host=e,this.el=null,this.flow="none",this.flowBtns=[],this.alignBtns=[],this.padSides=[],this.padIndependent=!1,this.layoutOnly=[],this.build()}section(t){const e=document.createElement("div");e.className="props-section";const s=document.createElement("div");return s.className="props-title",s.textContent=t,e.append(s),this.root.append(e),e}row(t,e){const s=document.createElement("div");if(s.className="props-row",e){const n=document.createElement("div");n.className="props-label",n.textContent=e,s.append(n)}return t.append(s),s}num(t,e,s=0){const n=document.createElement("input");n.type="number",n.min=String(s);const i=()=>{const r=parseFloat(n.value);Number.isNaN(r)||e(r)};return n.addEventListener("change",i),n.addEventListener("keydown",r=>{r.key==="Enter"&&(i(),n.blur())}),t.append(n),n}color(t,e){const s=document.createElement("input");return s.type="color",s.addEventListener("change",()=>e(s.value)),t.append(s),s}build(){const t=this.section("Auto layout"),e=this.row(t,"Flow"),s=document.createElement("div");s.className="seg";const n=[["none","✕","不使用 flex"],["col","↓","纵向排列 (column)"],["row","→","横向排列 (row)"],["wrap","⤸","横向换行 (wrap)"]];for(const[g,y,$]of n){const C=document.createElement("button");C.textContent=y,C.title=$,C.addEventListener("click",()=>this.applyFlow(g)),s.append(C),this.flowBtns.push(C)}e.append(s);const i=this.row(t,"W / H");this.wInput=this.num(i,g=>this.host.setSize(g,null),8),this.hInput=this.num(i,g=>this.host.setSize(null,g),8);const r=this.row(t,"Align"),a=document.createElement("div");a.className="align-grid";for(let g=0;g<3;g++)for(let y=0;y<3;y++){const $=document.createElement("button");$.addEventListener("click",()=>this.applyAlign(g,y)),a.append($),this.alignBtns.push($)}r.append(a);const l=document.createElement("div");l.style.flex="1";const h=document.createElement("div");h.className="props-label",h.textContent="Gap",l.append(h),this.gapInput=this.num(l,g=>this.host.setProps({gap:`${g}px`})),r.append(l),this.layoutOnly.push(a,l),this.padLinkedRow=this.row(t,"Padding"),this.padXInput=this.num(this.padLinkedRow,()=>this.applyPadding()),this.padYInput=this.num(this.padLinkedRow,()=>this.applyPadding()),this.padXInput.title="水平 padding",this.padYInput.title="垂直 padding",this.padToggle=document.createElement("button"),this.padToggle.className="pad-toggle",this.padToggle.textContent="⊞",this.padToggle.title="四边独立 padding",this.padToggle.addEventListener("click",()=>this.togglePadMode()),this.padLinkedRow.append(this.padToggle),this.padGridRow=this.row(t,""),this.padGridRow.style.display="none";const d=document.createElement("div");d.className="pad-grid";const c=["左 padding","上 padding","右 padding","下 padding"];for(let g=0;g<4;g++){const y=this.num(d,()=>this.applyPadding());y.title=c[g],this.padSides.push(y)}this.padGridRow.append(d);const p=this.row(t),f=document.createElement("label");f.className="check",this.clipInput=document.createElement("input"),this.clipInput.type="checkbox",this.clipInput.addEventListener("change",()=>this.host.setProps({overflow:this.clipInput.checked?"hidden":"visible"})),f.append(this.clipInput,"Clip content"),p.append(f);const m=this.section("Appearance"),b=this.row(m,"Opacity %");this.opacityInput=this.num(b,g=>this.host.setProps({opacity:String(Math.min(100,Math.max(0,g))/100)}));const T=this.row(m,"Radius");this.radiusInput=this.num(T,g=>this.host.setProps({"border-radius":`${g}px`}));const E=this.section("Fill"),z=this.row(E,"Color");this.fillColor=this.color(z,()=>this.applyFill()),this.fillPct=this.num(z,()=>this.applyFill()),this.fillPct.title="不透明度 %";const yt=this.section("Stroke"),K=this.row(yt,"Color / W");this.strokeColor=this.color(K,()=>this.applyStroke()),this.strokeWidth=this.num(K,()=>this.applyStroke()),this.strokeWidth.step="0.5",this.strokeWidth.title="描边宽度 px"}applyFlow(t){this.flow=t,t==="none"?this.host.setProps({display:"block","flex-direction":null,"flex-wrap":null}):this.host.setProps({display:"flex","flex-direction":t==="col"?"column":"row","flex-wrap":t==="wrap"?"wrap":"nowrap"}),this.markFlow()}applyAlign(t,e){const s=this.flow==="col"?P[t]:P[e],n=this.flow==="col"?P[e]:P[t];this.host.setProps({"justify-content":s,"align-items":n}),this.markAlign(t,e)}applyPadding(){if(this.padIndependent){const[t,e,s,n]=this.padSides.map(i=>parseFloat(i.value)||0);this.host.setProps({padding:`${e}px ${s}px ${n}px ${t}px`})}else{const t=parseFloat(this.padXInput.value)||0,e=parseFloat(this.padYInput.value)||0;this.host.setProps({padding:`${e}px ${t}px`})}}setPadMode(t){this.padIndependent=t,this.padXInput.style.display=t?"none":"",this.padYInput.style.display=t?"none":"",this.padGridRow.style.display=t?"":"none",this.padToggle.classList.toggle("on",t)}togglePadMode(){const t=!this.padIndependent;if(t){const e=this.padXInput.value||"0",s=this.padYInput.value||"0",n=[e,s,e,s];this.padSides.forEach((i,r)=>i.value=n[r])}else this.padXInput.value=this.padSides[0].value||"0",this.padYInput.value=this.padSides[1].value||"0",this.applyPadding();this.setPadMode(t)}applyFill(){const t=Math.min(100,Math.max(0,parseFloat(this.fillPct.value)||0));this.host.setProps({"background-color":ht(this.fillColor.value,t/100)})}applyStroke(){const t=Math.max(0,parseFloat(this.strokeWidth.value)||0);this.host.setProps({"border-width":`${t}px`,"border-style":"solid","border-color":this.strokeColor.value})}markFlow(){const t=["none","col","row","wrap"].indexOf(this.flow);this.flowBtns.forEach((e,s)=>e.classList.toggle("on",s===t));for(const e of this.layoutOnly)e.classList.toggle("disabled",this.flow==="none")}markAlign(t,e){this.alignBtns.forEach((s,n)=>s.classList.toggle("on",n===t*3+e))}focusWithin(){const t=this.root.getRootNode();return t instanceof ShadowRoot&&this.root.contains(t.activeElement)}populate(t){const e=getComputedStyle(t),s=t.getBoundingClientRect();e.display.includes("flex")?this.flow=e.flexDirection.startsWith("column")?"col":e.flexWrap==="wrap"?"wrap":"row":this.flow="none",this.markFlow(),this.wInput.value=String(Math.round(s.width)),this.hInput.value=String(Math.round(s.height));const n=W(e.justifyContent),i=W(e.alignItems);this.markAlign(this.flow==="col"?n:i,this.flow==="col"?i:n),this.gapInput.value=String(e.columnGap==="normal"?0:R(e.columnGap));const r=[e.paddingLeft,e.paddingTop,e.paddingRight,e.paddingBottom].map(R),a=r[0]===r[2]&&r[1]===r[3];this.setPadMode(!a),this.padXInput.value=String(r[0]),this.padYInput.value=String(r[1]),this.padSides.forEach((d,c)=>d.value=String(r[c])),this.clipInput.checked=e.overflowX!=="visible",this.opacityInput.value=String(Math.round(parseFloat(e.opacity)*100)),this.radiusInput.value=String(R(e.borderTopLeftRadius));const l=X(e.backgroundColor);this.fillColor.value=l.hex,this.fillPct.value=String(Math.round(l.alpha*100));const h=X(e.borderTopColor);this.strokeColor.value=h.hex,this.strokeWidth.value=String(parseFloat(e.borderTopWidth)||0)}setTarget(t){this.el=t,this.root.classList.toggle("open",t!==null),t&&!this.focusWithin()&&this.populate(t)}sync(){this.el&&this.el.isConnected&&!this.focusWithin()&&this.populate(this.el)}refreshRect(t){this.focusWithin()||(this.wInput.value=String(Math.round(t.width)),this.hInput.value=String(Math.round(t.height)))}}function pt(o,t,e){const s=[],n=[],i=p=>{s.push(p.left,p.right,p.left+p.width/2),n.push(p.top,p.bottom,p.top+p.height/2)},r=o.parentElement;if(r&&r!==document.body&&i(r.getBoundingClientRect()),r){let p=0;for(const f of Array.from(r.children)){if(f===o||!(f instanceof HTMLElement))continue;const m=f.getBoundingClientRect();if(!(m.width===0&&m.height===0)&&(i(m),++p>=30))break}}const a=[t.left,t.left+t.width,t.left+t.width/2],l=[t.top,t.top+t.height,t.top+t.height/2],h=(p,f)=>{let m=e+1,b=null;for(const T of p)for(const E of f){const z=Math.abs(E-T);z<m&&(m=z,b={adj:E-T,guide:E})}return b},d=h(a,s),c=h(l,n);return{adjX:(d==null?void 0:d.adj)??0,adjY:(c==null?void 0:c.adj)??0,guideV:(d==null?void 0:d.guide)??null,guideH:(c==null?void 0:c.guide)??null}}const u=Math.round;function ut(o){const t=o.el.getBoundingClientRect();return{x:t.left+window.scrollX,y:t.top+window.scrollY,w:t.width,h:t.height}}function Y(o){const t=u(o);return t>0?`+${t}`:`${t}`}function U(o){const t=o.filter(s=>s.el.isConnected),e=[`# Sidetation 视觉修改记录（${t.length} 处）`,"",`- 页面：${location.href}`,`- 视口：${window.innerWidth}×${window.innerHeight}`,""];return t.forEach((s,n)=>{const i=s.originalRect;if(e.push(`## ${n+1}. \`${s.selector}\``),e.push(`- 元素：\`<${s.tag}>\``),s.deleted){e.push("- **删除该元素**"),e.push(`- 原始盒（页面坐标）：x ${u(i.x)}，y ${u(i.y)}，w ${u(i.w)}，h ${u(i.h)}`),e.push("");return}const r=ut(s);s.moved&&e.push(`- 移动：Δx ${Y(s.dx)}px，Δy ${Y(s.dy)}px`),s.resized&&e.push(`- 尺寸：${u(s.startSize.w)}×${u(s.startSize.h)} → ${u(s.size.w)}×${u(s.size.h)}`);const a=Object.entries(s.props);if(a.length&&e.push(`- 样式：${a.map(([l,h])=>`\`${l}: ${h}\``).join("，")}`),s.text!==null){const l=h=>(h??"").trim().replace(/\s+/g," ").slice(0,80);e.push(`- 文字："${l(s.savedText)}" → "${l(s.text)}"`)}e.push(`- 原始盒（页面坐标）：x ${u(i.x)}，y ${u(i.y)}，w ${u(i.w)}，h ${u(i.h)}`),e.push(`- 修改后：x ${u(r.x)}，y ${u(r.y)}，w ${u(r.w)}，h ${u(r.h)}`),e.push("")}),e.push("---"),e.push("请把以上视觉改动落实到源码中：根据元素所在布局选择合适的方式（margin / padding / flex / grid / gap / width / height 等），不要直接照抄 transform 位移，那只是编辑器里的临时表现。"),e.join(`
`)}function V(o){return o.filter(s=>s.el.isConnected).map(s=>{const n=[];if(s.deleted)n.push("  display: none;");else{s.moved&&n.push(`  transform: translate(${u(s.dx)}px, ${u(s.dy)}px);`),s.resized&&(n.push(`  width: ${u(s.size.w-s.sizeAdj.w)}px;`),n.push(`  height: ${u(s.size.h-s.sizeAdj.h)}px;`));for(const[r,a]of Object.entries(s.props))n.push(`  ${r}: ${a};`)}return`${`/* ${s.tag}: ${u(s.startSize.w)}×${u(s.startSize.h)} @ (${u(s.originalRect.x)}, ${u(s.originalRect.y)}) */`}
${s.selector} {
${n.join(`
`)}
}`}).join(`

`)+`
`}function M(){return`sidetation:${location.origin}${location.pathname}`}function ft(o){const t=o.filter(e=>e.el.isConnected);try{if(t.length===0){localStorage.removeItem(M());return}const e=t.map(s=>({selector:s.selector,dx:s.dx,dy:s.dy,moved:s.moved,resized:s.resized,deleted:s.deleted,startSize:s.startSize,size:s.size,savedText:s.savedText,text:s.text,props:s.props,savedProps:s.savedProps}));localStorage.setItem(M(),JSON.stringify(e))}catch{}}function gt(){try{const o=localStorage.getItem(M());return o?JSON.parse(o):null}catch{return null}}class mt{constructor(t,e){this.root=t,this.host=e,this.countEl=document.createElement("div"),this.countEl.className="align-title",this.root.append(this.countEl),this.buildAlignRow(),this.buildDistributeRow()}buildAlignRow(){const t=document.createElement("div");t.className="align-row";const e=[["left","⇤","左对齐"],["hcenter","↔","水平居中对齐"],["right","⇥","右对齐"],["top","⤒","顶对齐"],["vcenter","↕","垂直居中对齐"],["bottom","⤓","底对齐"]];for(const[s,n,i]of e){const r=document.createElement("button");r.textContent=n,r.title=i,r.addEventListener("click",()=>this.host.align(s)),t.append(r)}this.root.append(t)}buildDistributeRow(){const t=document.createElement("div");t.className="align-row",this.distHBtn=document.createElement("button"),this.distHBtn.textContent="⇹",this.distHBtn.title="水平等距分布",this.distHBtn.addEventListener("click",()=>this.host.distribute("h")),this.distVBtn=document.createElement("button"),this.distVBtn.textContent="⇳",this.distVBtn.title="垂直等距分布",this.distVBtn.addEventListener("click",()=>this.host.distribute("v")),t.append(this.distHBtn,this.distVBtn),this.root.append(t)}show(t){this.root.classList.add("open"),this.countEl.textContent=`已选 ${t} 个`;const e=t>=3;this.distHBtn.disabled=!e,this.distVBtn.disabled=!e}hide(){this.root.classList.remove("open")}}const xt=3;class G{constructor(t={}){this.overlay=new q,this.history=new at,this.active=!1,this.hovered=null,this.selected=[],this.drag=null,this.resize=null,this.textEdit=null,this.lastDownAt=0,this.lastDownTarget=null,this.rafId=0,this.savedUserSelect="",this.loop=()=>{if(this.selected.length>0){const e=this.selected.filter(s=>s.isConnected);e.length!==this.selected.length&&(this.selected=e)}if(this.selected.length===1){const s=this.selected[0].getBoundingClientRect();this.overlay.setSelection(s,this.selectionLabel()),this.propsPanel.refreshRect(s),this.overlay.setMultiSelection([]),this.alignPanel.hide()}else if(this.selected.length>1){const e=this.selected.map(s=>s.getBoundingClientRect());this.overlay.setSelection(null),this.overlay.setMultiSelection(e),this.overlay.positionAlignPanel(e),this.alignPanel.show(this.selected.length)}else this.overlay.setSelection(null),this.overlay.setMultiSelection([]),this.alignPanel.hide();this.hovered&&this.hovered.isConnected&&!this.selected.includes(this.hovered)?this.overlay.setHover(this.hovered.getBoundingClientRect()):this.overlay.setHover(null),this.rafId=requestAnimationFrame(this.loop)},this.onPointerMove=e=>{if(this.resize){this.moveResize(e);return}if(this.drag){this.moveDrag(e);return}if(this.inOverlay(e)){this.hovered=null;return}this.hovered=this.pageElementAt(e.clientX,e.clientY)},this.onPointerDown=e=>{if(this.inOverlay(e))return;if(this.textEdit){if(e.composedPath().includes(this.textEdit.el))return;this.commitTextEdit()}if(e.preventDefault(),e.stopPropagation(),e.altKey&&this.selected.length===1){const l=this.selected[0].parentElement;this.isSelectable(l)&&this.select([l]);return}const s=this.pageElementAt(e.clientX,e.clientY);if(!s){this.select([]);return}if(e.shiftKey){this.toggleSelect(s);return}const n=Date.now();if(s===this.lastDownTarget&&n-this.lastDownAt<400){this.lastDownAt=0,this.startTextEdit(s);return}this.lastDownAt=n,this.lastDownTarget=s;const i=this.selected.length===1?this.selected[0]:null,r=i!==null&&(s===i||i.contains(s)),a=this.selected.length>1&&this.selected.includes(s);!r&&!a&&this.select([s]),this.drag={els:this.selected,startX:e.clientX,startY:e.clientY,items:null,moved:!1,downTarget:s}},this.onPointerUp=e=>{if(this.resize){const s=this.resize;this.resize=null,document.documentElement.style.cursor="",this.history.commit(s.rec,s.before);return}if(this.drag){const s=this.drag;this.drag=null,this.overlay.setGuides(null,null),document.documentElement.style.cursor="",s.moved&&s.items?this.history.commitBatch(s.items.map(({rec:n,before:i})=>({rec:n,before:i}))):this.selected.length===1&&this.selected[0]===s.downTarget||this.select([s.downTarget]),e.preventDefault(),e.stopPropagation()}},this.blockEvent=e=>{this.inOverlay(e)||this.textEdit&&e.composedPath().includes(this.textEdit.el)||(e.preventDefault(),e.stopImmediatePropagation())},this.onKeyDown=e=>{if(this.inOverlay(e))return;if(this.textEdit){e.key==="Escape"&&(e.preventDefault(),e.stopPropagation(),this.commitTextEdit());return}const s=e.metaKey||e.ctrlKey;if(e.key==="Escape"){e.preventDefault(),e.stopPropagation(),this.selected.length>0?this.select([]):this.deactivate();return}if(s&&(e.key==="z"||e.key==="Z")){e.preventDefault(),e.stopPropagation(),(e.shiftKey?this.history.redo():this.history.undo())&&this.overlay.toast(e.shiftKey?"重做":"撤销");return}if(this.selected.length===0)return;if(e.key==="Delete"||e.key==="Backspace"){e.preventDefault(),e.stopPropagation();const l=this.selected.length,h=this.selected.map(d=>{const c=this.history.ensure(d),p=this.history.snapshot(c);return c.deleted=!0,{rec:c,before:p}});this.select([]),this.history.commitBatch(h),this.overlay.toast(l>1?`已删除 ${l} 个元素（⌘Z 撤销）`:"已删除（⌘Z 撤销）");return}if(this.selected.length===1){const l=this.selected[0];if(e.key==="Enter"){e.preventDefault(),e.stopPropagation();const h=e.shiftKey?l.parentElement:l.firstElementChild;this.isSelectable(h)&&this.select([h]);return}if(e.key==="Tab"){e.preventDefault(),e.stopPropagation();const h=e.shiftKey?l.previousElementSibling:l.nextElementSibling;this.isSelectable(h)&&this.select([h]);return}}const n=e.shiftKey?10:1,r={ArrowLeft:[-n,0],ArrowRight:[n,0],ArrowUp:[0,-n],ArrowDown:[0,n]}[e.key];if(!r)return;e.preventDefault(),e.stopPropagation();const a=this.selected.map(l=>{const h=this.history.ensure(l),d=this.history.snapshot(h);return h.dx+=r[0],h.dy+=r[1],h.moved=!0,{rec:h,before:d}});this.history.commitBatch(a,{coalesce:"nudge"})},this.opts={autoStart:!1,snapThreshold:6,...t},this.toolbar=new dt(this.overlay.toolbarEl,this.overlay.panelEl,this.overlay.shortcutsEl,{onToggle:()=>this.active?this.deactivate():this.activate(),onCopyMd:()=>this.copy(U(this.history.all()),"已复制 Markdown"),onCopyCss:()=>this.copy(V(this.history.all()),"已复制 CSS"),onReset:()=>this.history.resetAll(),onRevert:e=>this.history.revert(e)}),this.propsPanel=new ct(this.overlay.propsEl,{setProps:e=>this.panelSetProps(e),setSize:(e,s)=>this.panelSetSize(e,s)}),this.alignPanel=new mt(this.overlay.alignEl,{align:e=>this.alignSelected(e),distribute:e=>this.distributeSelected(e)}),this.history.onChange=()=>{this.syncUI(),ft(this.history.all())},this.overlay.onHandleDown=(e,s)=>this.startResize(e,s),this.restoreSession(),this.syncUI(),this.opts.autoStart&&this.activate()}restoreSession(){const t=gt();if(!t||t.length===0)return;const e=this.history.restore(t);e>0&&this.overlay.toast(`${e} 处修改因页面结构变化未能恢复`)}activate(){this.active||(this.active=!0,this.savedUserSelect=document.documentElement.style.userSelect,document.documentElement.style.userSelect="none",window.addEventListener("pointermove",this.onPointerMove,!0),window.addEventListener("pointerdown",this.onPointerDown,!0),window.addEventListener("pointerup",this.onPointerUp,!0),window.addEventListener("pointercancel",this.onPointerUp,!0),window.addEventListener("click",this.blockEvent,!0),window.addEventListener("keydown",this.onKeyDown,!0),this.rafId=requestAnimationFrame(this.loop),this.syncUI())}deactivate(){this.active&&(this.commitTextEdit(),this.active=!1,document.documentElement.style.userSelect=this.savedUserSelect,document.documentElement.style.cursor="",window.removeEventListener("pointermove",this.onPointerMove,!0),window.removeEventListener("pointerdown",this.onPointerDown,!0),window.removeEventListener("pointerup",this.onPointerUp,!0),window.removeEventListener("pointercancel",this.onPointerUp,!0),window.removeEventListener("click",this.blockEvent,!0),window.removeEventListener("keydown",this.onKeyDown,!0),cancelAnimationFrame(this.rafId),this.hovered=null,this.selected=[],this.drag=null,this.resize=null,this.propsPanel.setTarget(null),this.alignPanel.hide(),this.overlay.setHover(null),this.overlay.setSelection(null),this.overlay.setMultiSelection([]),this.overlay.setGuides(null,null),this.syncUI())}destroy(){this.deactivate(),this.overlay.destroy()}selectionLabel(){if(this.selected.length!==1)return"";const t=this.selected[0],e=t.getBoundingClientRect();return`${tt(t)}  ${Math.round(e.width)}×${Math.round(e.height)}`}pageElementAt(t,e){let s=document.elementFromPoint(t,e);for(;s&&!(s instanceof HTMLElement);)s=s.parentElement;return!s||s===document.body||s===document.documentElement||s.closest("[data-sidetation]")?null:s}inOverlay(t){return t.composedPath().includes(this.overlay.host)}select(t){this.selected=t,this.hovered=null,this.propsPanel.setTarget(t.length===1?t[0]:null)}toggleSelect(t){const e=this.selected.indexOf(t);if(e>=0){const s=this.selected.slice();s.splice(e,1),this.select(s)}else this.select([...this.selected,t])}isSelectable(t){return t instanceof HTMLElement&&t!==document.body&&t!==document.documentElement&&!t.closest("[data-sidetation]")}startTextEdit(t){if(t.childElementCount>0||!(t.textContent??"").trim()){this.overlay.toast("仅支持纯文本元素（无子元素）");return}this.select([t]);const e=this.history.ensure(t);this.textEdit={el:t,rec:e,before:this.history.snapshot(e),savedUserSelect:t.style.getPropertyValue("user-select")},t.setAttribute("contenteditable","plaintext-only"),t.isContentEditable||t.setAttribute("contenteditable","true"),t.style.setProperty("user-select","text"),t.focus();const s=document.createRange();s.selectNodeContents(t);const n=window.getSelection();n==null||n.removeAllRanges(),n==null||n.addRange(s)}commitTextEdit(){var s;const t=this.textEdit;if(!t)return;this.textEdit=null,t.el.removeAttribute("contenteditable"),t.savedUserSelect?t.el.style.setProperty("user-select",t.savedUserSelect):t.el.style.removeProperty("user-select"),(s=window.getSelection())==null||s.removeAllRanges();const e=t.el.textContent??"";t.rec.text=e===t.rec.savedText?null:e,this.history.commit(t.rec,t.before)}moveDrag(t){const e=this.drag,s=t.clientX-e.startX,n=t.clientY-e.startY;if(!e.moved){if(Math.hypot(s,n)<xt)return;e.moved=!0,e.items=e.els.map(r=>{const a=this.history.ensure(r);return{rec:a,before:this.history.snapshot(a),baseDx:a.dx,baseDy:a.dy}}),document.documentElement.style.cursor="move"}const i=e.items;if(i.length===1){const{rec:r,baseDx:a,baseDy:l}=i[0];let h=a+s,d=l+n;const c=e.els[0].getBoundingClientRect(),p={left:c.left+(h-r.dx),top:c.top+(d-r.dy),width:c.width,height:c.height},f=pt(e.els[0],p,this.opts.snapThreshold);h+=f.adjX,d+=f.adjY,this.overlay.setGuides(f.guideV,f.guideH),r.dx=h,r.dy=d,r.moved=!0,x(r)}else{this.overlay.setGuides(null,null);for(const{rec:r,baseDx:a,baseDy:l}of i)r.dx=a+s,r.dy=l+n,r.moved=!0,x(r)}}startResize(t,e){if(this.selected.length!==1)return;const s=this.selected[0];e.preventDefault(),e.stopPropagation();const n=this.history.ensure(s),i=s.getBoundingClientRect();this.resize={rec:n,before:this.history.snapshot(n),dir:t,startX:e.clientX,startY:e.clientY,startW:i.width,startH:i.height,baseDx:n.dx,baseDy:n.dy}}moveResize(t){const e=this.resize,{rec:s,dir:n}=e,i=t.clientX-e.startX,r=t.clientY-e.startY;let a=e.startW,l=e.startH;if(n.includes("e")&&(a=e.startW+i),n.includes("w")&&(a=e.startW-i),n.includes("s")&&(l=e.startH+r),n.includes("n")&&(l=e.startH-r),t.shiftKey&&e.startH>0&&e.startW>0){const h=e.startW/e.startH;n==="e"||n==="w"?l=a/h:n==="n"||n==="s"?a=l*h:Math.abs(i)>Math.abs(r)?l=a/h:a=l*h}a=Math.max(8,Math.round(a)),l=Math.max(8,Math.round(l)),s.dx=n.includes("w")?e.baseDx+(e.startW-a):e.baseDx,s.dy=n.includes("n")?e.baseDy+(e.startH-l):e.baseDy,(s.dx!==e.baseDx||s.dy!==e.baseDy)&&(s.moved=!0),s.size={w:a,h:l},s.resized=!0,x(s)}panelSetProps(t){if(this.selected.length!==1)return;const e=this.selected[0];this.commitTextEdit();const s=this.history.ensure(e),n=this.history.snapshot(s);for(const[i,r]of Object.entries(t))i in s.savedProps||(s.savedProps[i]=e.style.getPropertyValue(i)),r===null?delete s.props[i]:s.props[i]=r;this.history.commit(s,n,{coalesce:`props:${Object.keys(t).sort().join(",")}`})}panelSetSize(t,e){if(this.selected.length!==1)return;this.commitTextEdit();const s=this.history.ensure(this.selected[0]),n=this.history.snapshot(s);t!==null&&(s.size.w=Math.max(8,t)),e!==null&&(s.size.h=Math.max(8,e)),s.resized=!0,this.history.commit(s,n,{coalesce:"size"})}alignSelected(t){if(this.selected.length<2)return;const e=this.selected.map(d=>({rec:this.history.ensure(d),rect:d.getBoundingClientRect()})),s=e.map(({rec:d})=>({rec:d,before:this.history.snapshot(d)})),n=Math.min(...e.map(d=>d.rect.left)),i=Math.max(...e.map(d=>d.rect.right)),r=Math.min(...e.map(d=>d.rect.top)),a=Math.max(...e.map(d=>d.rect.bottom)),l=(n+i)/2,h=(r+a)/2;for(const{rec:d,rect:c}of e){let p=0,f=0;switch(t){case"left":p=n-c.left;break;case"right":p=i-c.right;break;case"hcenter":p=l-(c.left+c.width/2);break;case"top":f=r-c.top;break;case"bottom":f=a-c.bottom;break;case"vcenter":f=h-(c.top+c.height/2);break}(p!==0||f!==0)&&(d.dx+=p,d.dy+=f,d.moved=!0,x(d))}this.history.commitBatch(s)}distributeSelected(t){if(this.selected.length<3)return;const e=this.selected.map(c=>({rec:this.history.ensure(c),rect:c.getBoundingClientRect()})),s=e.map(({rec:c})=>({rec:c,before:this.history.snapshot(c)})),n=[...e].sort((c,p)=>t==="h"?c.rect.left-p.rect.left:c.rect.top-p.rect.top),i=n[0].rect,r=n[n.length-1].rect,a=t==="h"?r.right-i.left:r.bottom-i.top,l=n.reduce((c,p)=>c+(t==="h"?p.rect.width:p.rect.height),0),h=(a-l)/(n.length-1);let d=t==="h"?i.left:i.top;for(const{rec:c,rect:p}of n){const f=t==="h"?p.width:p.height,m=t==="h"?p.left:p.top,b=d-m;b!==0&&(t==="h"?c.dx+=b:c.dy+=b,c.moved=!0,x(c)),d+=f+h}this.history.commitBatch(s)}copy(t,e){var n;const s=()=>{const i=document.createElement("textarea");i.value=t,i.style.position="fixed",i.style.opacity="0",document.body.append(i),i.select(),document.execCommand("copy"),i.remove(),this.overlay.toast(e)};(n=navigator.clipboard)!=null&&n.writeText?navigator.clipboard.writeText(t).then(()=>this.overlay.toast(e),()=>s()):s()}getMarkdown(){return U(this.history.all())}getCSS(){return V(this.history.all())}get isActive(){return this.active}undo(){return this.history.undo()}redo(){return this.history.redo()}syncUI(){this.history.prune(),this.toolbar.update(this.active,this.history.all()),this.propsPanel.sync()}}function bt(o){return new G(o)}w.Sidetation=G,w.init=bt,Object.defineProperty(w,Symbol.toStringTag,{value:"Module"})});
