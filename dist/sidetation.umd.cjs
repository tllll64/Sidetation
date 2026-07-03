(function(b,w){typeof exports=="object"&&typeof module<"u"?w(exports):typeof define=="function"&&define.amd?define(["exports"],w):(b=typeof globalThis<"u"?globalThis:b||self,w(b.Sidetation={}))})(this,function(b){"use strict";const w=`
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
`,G=["nw","n","ne","e","se","s","sw","w"];class V{constructor(){this.host=document.createElement("div"),this.onHandleDown=null,this.toastTimer=0,this.host.setAttribute("data-sidetation",""),Object.assign(this.host.style,{position:"fixed",inset:"0",zIndex:"2147483647",pointerEvents:"none"});const t=this.host.attachShadow({mode:"open"}),e=document.createElement("style");e.textContent=w,t.append(e);const s=n=>{const i=document.createElement("div");return i.className=n,t.append(i),i};this.hoverBox=s("hover-box"),this.selBox=s("sel-box"),this.selLabel=document.createElement("div"),this.selLabel.className="sel-label",this.selBox.append(this.selLabel);for(const n of G){const i=document.createElement("div");i.className="handle",i.dataset.dir=n,i.addEventListener("pointerdown",a=>{var r;return(r=this.onHandleDown)==null?void 0:r.call(this,n,a)}),this.selBox.append(i)}this.guideV=s("guide guide-v"),this.guideH=s("guide guide-h"),this.panelEl=s("panel"),this.propsEl=s("props"),this.shortcutsEl=s("shortcuts"),this.toolbarEl=s("toolbar"),this.toastEl=s("toast"),document.documentElement.appendChild(this.host)}place(t,e){if(!e){t.style.display="none";return}t.style.display="block",t.style.left=`${e.left}px`,t.style.top=`${e.top}px`,t.style.width=`${e.width}px`,t.style.height=`${e.height}px`}setHover(t){this.place(this.hoverBox,t)}setSelection(t,e=""){this.place(this.selBox,t),t&&(this.selLabel.textContent=e)}setGuides(t,e){this.guideV.style.display=t===null?"none":"block",t!==null&&(this.guideV.style.left=`${t}px`),this.guideH.style.display=e===null?"none":"block",e!==null&&(this.guideH.style.top=`${e}px`)}toast(t){this.toastEl.textContent=t,this.toastEl.classList.add("show"),clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>this.toastEl.classList.remove("show"),1600)}destroy(){clearTimeout(this.toastTimer),this.host.remove()}}const K=/(^|[-_])[0-9a-f]{5,}([-_]|$)|^(css|sc|jss|emotion)-|__[A-Za-z0-9]{5,}$/i,_=["data-testid","data-test","data-cy"];function I(o){return Array.from(o.classList).filter(t=>t.length<=24&&!K.test(t)&&!/\d{3,}/.test(t)).slice(0,2)}function R(o){return!o.id||/\d{3,}/.test(o.id)||/^[0-9a-f-]{8,}$/i.test(o.id)?null:o.id}function M(o){const t=o.tagName.toLowerCase();for(const s of _){const n=o.getAttribute(s);if(n)return`${t}[${s}="${n}"]`}const e=I(o).map(s=>`.${CSS.escape(s)}`).join("");return t+e}function $(o,t){try{const e=document.querySelectorAll(o);return e.length===1&&e[0]===t}catch{return!1}}function q(o){const t=R(o);if(t){const i=`#${CSS.escape(t)}`;if($(i,o))return i}const e=[];let s=o;for(;s&&s!==document.body&&s!==document.documentElement&&e.length<5;){const i=R(s);if(i&&s!==o){e.unshift(`#${CSS.escape(i)}`);const r=e.join(" > ");if($(r,o))return r;break}e.unshift(M(s));const a=e.join(" > ");if($(a,o))return a;s=s.parentElement}const n=o.parentElement;if(n){const a=Array.from(n.children).filter(l=>l.tagName===o.tagName).indexOf(o)+1,r=[...e.slice(0,-1),`${M(o)}:nth-of-type(${a})`].join(" > ");return $(r,o),r}return e.join(" > ")}function Z(o){const t=o.tagName.toLowerCase(),e=R(o);if(e)return`${t}#${e}`;const s=I(o);return s.length?`${t}.${s[0]}`:t}function v(o,t,e){e?o.style.setProperty(t,e):o.style.removeProperty(t)}function C(o){const{el:t,savedInline:e}=o;if(o.deleted?t.style.display="none":o.resized&&o.baseDisplay==="inline"?t.style.display="inline-block":v(t,"display",e.display),o.moved&&(o.dx!==0||o.dy!==0)){const n=`translate(${o.dx}px, ${o.dy}px)`;t.style.transform=o.baseTransform==="none"?n:`${n} ${o.baseTransform}`}else v(t,"transform",e.transform);o.resized?(t.style.width=`${o.size.w-o.sizeAdj.w}px`,t.style.height=`${o.size.h-o.sizeAdj.h}px`):(v(t,"width",e.width),v(t,"height",e.height));const s=new Set([...Object.keys(o.savedProps),...Object.keys(o.props)]);for(const n of s)n in o.props?t.style.setProperty(n,o.props[n]):v(t,n,o.savedProps[n]??"");if(o.savedText!==null&&!t.hasAttribute("contenteditable")){const n=o.text??o.savedText;t.textContent!==n&&(t.textContent=n)}}const J=["display","position","flex-direction","flex-wrap","flex","justify-content","align-items","align-self","order","gap","grid-template-columns","width","height","box-sizing","padding","margin","border-width","border-style","border-color","border-radius","background-color","background-image","background-size","background-position","background-repeat","color","font-family","font-size","font-weight","font-style","line-height","text-align","text-decoration","letter-spacing","white-space","vertical-align","list-style","overflow","opacity","box-shadow","transform","object-fit"],Q=120;function B(o,t,e){if(e.n++>Q){t.replaceChildren();return}const s=getComputedStyle(o);let n="";for(const r of J)n+=`${r}:${s.getPropertyValue(r)};`;t.setAttribute("style",n);const i=Array.from(o.children),a=Array.from(t.children);for(let r=0;r<a.length;r++){const l=a[r].tagName.toLowerCase();if(l==="script"||l==="iframe"||l==="video"||l==="canvas"){a[r].remove();continue}B(i[r],a[r],e)}}function j(o){const t=o.getBoundingClientRect();if(t.width<1||t.height<1)return null;try{const e=o.cloneNode(!0);B(o,e,{n:0}),e.style.margin="0",e.style.transform="none",e.style.maxWidth="none",e.setAttribute("xmlns","http://www.w3.org/1999/xhtml");const s=new XMLSerializer().serializeToString(e),n=Math.ceil(t.width),i=Math.ceil(t.height),a=`<svg xmlns="http://www.w3.org/2000/svg" width="${n}" height="${i}"><foreignObject width="100%" height="100%">${s}</foreignObject></svg>`;return`data:image/svg+xml;charset=utf-8,${encodeURIComponent(a)}`}catch{return null}}const tt=800;function N(o){return!o.moved&&!o.resized&&!o.deleted&&Object.keys(o.props).length===0&&o.text===null}function et(o,t){const e=Object.keys(o);return e.length===Object.keys(t).length&&e.every(s=>o[s]===t[s])}function st(o,t){return o.dx===t.dx&&o.dy===t.dy&&o.size.w===t.size.w&&o.size.h===t.size.h&&o.moved===t.moved&&o.resized===t.resized&&o.deleted===t.deleted&&o.text===t.text&&et(o.props,t.props)}const nt={dx:0,dy:0,moved:!1,resized:!1,deleted:!1,text:null};class ot{constructor(){this.records=new Map,this.undoStack=[],this.redoStack=[],this.seq=1,this.onChange=null}ensure(t){let e=this.records.get(t);if(e)return e;const s=t.getBoundingClientRect(),n=getComputedStyle(t),i=n.boxSizing==="content-box",a=r=>parseFloat(r)||0;return e={id:this.seq++,el:t,selector:q(t),tag:t.tagName.toLowerCase(),originalRect:{x:s.left+window.scrollX,y:s.top+window.scrollY,w:s.width,h:s.height},savedInline:{transform:t.style.getPropertyValue("transform"),width:t.style.getPropertyValue("width"),height:t.style.getPropertyValue("height"),display:t.style.getPropertyValue("display")},baseTransform:n.transform,baseDisplay:n.display,sizeAdj:i?{w:a(n.paddingLeft)+a(n.paddingRight)+a(n.borderLeftWidth)+a(n.borderRightWidth),h:a(n.paddingTop)+a(n.paddingBottom)+a(n.borderTopWidth)+a(n.borderBottomWidth)}:{w:0,h:0},dx:0,dy:0,moved:!1,resized:!1,deleted:!1,startSize:{w:s.width,h:s.height},size:{w:s.width,h:s.height},beforeSnap:j(t),savedText:t.childElementCount===0?t.textContent:null,text:null,props:{},savedProps:{}},this.records.set(t,e),e}get(t){return this.records.get(t)}all(){return Array.from(this.records.values())}snapshot(t){return{dx:t.dx,dy:t.dy,size:{...t.size},moved:t.moved,resized:t.resized,deleted:t.deleted,props:{...t.props},text:t.text}}commit(t,e,s){this.commitBatch([{rec:t,before:e}],s)}commitBatch(t,e){const s=[];for(const{rec:r,before:l}of t){r.dx===0&&r.dy===0&&(r.moved=!1),C(r);const d=this.snapshot(r);st(l,d)||s.push({rec:r,before:l,after:d}),this.cleanup(r)}if(s.length===0){this.emit();return}const n=(e==null?void 0:e.coalesce)??null,i=this.undoStack[this.undoStack.length-1];n!==null&&i!==void 0&&i.coalesce===n&&Date.now()-i.at<tt&&i.entries.length===s.length&&i.entries.every((r,l)=>r.rec===s[l].rec)?(s.forEach((r,l)=>i.entries[l].after=r.after),i.at=Date.now()):this.undoStack.push({entries:s,coalesce:n,at:Date.now()}),this.redoStack.length=0,this.emit()}undo(){const t=this.undoStack.pop();if(!t)return!1;for(const e of t.entries)this.applySnap(e.rec,e.before);return this.redoStack.push(t),this.emit(),!0}redo(){const t=this.redoStack.pop();if(!t)return!1;for(const e of t.entries)this.applySnap(e.rec,e.after);return this.undoStack.push(t),this.emit(),!0}revert(t){const e=this.all().find(n=>n.id===t);if(!e)return;const s=this.snapshot(e);this.applySnap(e,{...nt,size:{...e.startSize},props:{}}),this.undoStack.push({entries:[{rec:e,before:s,after:this.snapshot(e)}],coalesce:null,at:Date.now()}),this.redoStack.length=0,this.emit()}resetAll(){for(const t of this.all())this.revert(t.id)}applySnap(t,e){t.dx=e.dx,t.dy=e.dy,t.size={...e.size},t.moved=e.moved,t.resized=e.resized,t.deleted=e.deleted,t.props={...e.props},t.text=e.text,C(t),this.cleanup(t)}cleanup(t){N(t)?this.records.delete(t.el):this.records.set(t.el,t)}prune(){for(const[t,e]of this.records)N(e)&&this.records.delete(t)}emit(){var t;(t=this.onChange)==null||t.call(this)}}const y=Math.round,it=[["点击","选中元素，点子元素可下钻"],["双击","编辑文字内容（纯文本元素）"],["⌥ 点击","选中父级元素"],["拖拽","移动元素，自动对齐吸附"],["拖拽手柄 / ⇧","缩放 / 等比缩放"],["方向键 / ⇧方向键","微调 1px / 10px"],["Delete / ⌫","删除元素"],["⌘Z / ⌘⇧Z","撤销 / 重做"],["Enter / ⇧Enter","进入子级 / 返回父级"],["Tab / ⇧Tab","下一个 / 上一个兄弟元素"],["Esc","取消选中，再按退出编辑"]];class rt{constructor(t,e,s,n){this.panel=e,this.shortcuts=s,this.cb=n,this.panelOpen=!1,this.records=[];const i=document.createElement("div");i.className="brand";const a=document.createElement("span");a.className="brand-dot",i.append(a,"Sidetation"),t.append(i);const r=(c,m)=>{const f=document.createElement("button");return f.textContent=c,f.addEventListener("click",m),t.append(f),f},l=()=>{const c=document.createElement("div");c.className="divider",t.append(c)};this.toggleBtn=r("开始编辑",()=>n.onToggle()),this.toggleBtn.classList.add("primary"),this.kbdBtn=r("",()=>{}),this.kbdBtn.classList.add("kbd-btn"),this.kbdBtn.title="快捷键";const d="http://www.w3.org/2000/svg",p=document.createElementNS(d,"svg");p.setAttribute("viewBox","0 0 24 24"),p.setAttribute("fill","none"),p.setAttribute("stroke","currentColor"),p.setAttribute("stroke-width","2"),p.setAttribute("stroke-linecap","round"),p.setAttribute("stroke-linejoin","round");const g=document.createElementNS(d,"path");g.setAttribute("d","M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"),p.append(g),this.kbdBtn.append(p),this.buildShortcuts(),this.kbdBtn.addEventListener("mouseenter",()=>this.showShortcuts()),this.kbdBtn.addEventListener("mouseleave",()=>this.shortcuts.classList.remove("open")),l(),this.editsBtn=r("修改 0",()=>this.togglePanel()),this.resetBtn=r("重置",()=>n.onReset()),l(),this.mdBtn=r("复制 Markdown",()=>n.onCopyMd()),this.cssBtn=r("复制 CSS",()=>n.onCopyCss())}buildShortcuts(){const t=document.createElement("div");t.className="shortcuts-title",t.textContent="快捷键",this.shortcuts.append(t);for(const[e,s]of it){const n=document.createElement("div");n.className="shortcut-row";const i=document.createElement("span");i.className="kbd",i.textContent=e;const a=document.createElement("span");a.className="shortcut-desc",a.textContent=s,n.append(i,a),this.shortcuts.append(n)}}buildThumbs(t){const e=document.createElement("div");e.className="edit-thumbs";const s=(a,r=!1)=>{const l=document.createElement("div");if(l.className="thumb",r)l.classList.add("deleted"),l.textContent="✕";else if(a){const d=document.createElement("img");d.src=a,d.alt="",l.append(d)}else l.textContent="?",l.classList.add("empty");return l},n=document.createElement("span");n.className="thumb-arrow",n.textContent="→";const i=t.deleted||!t.el.isConnected?s(null,!0):s(j(t.el));return e.append(s(t.beforeSnap),n,i),e}showShortcuts(){const t=this.kbdBtn.getBoundingClientRect();this.shortcuts.style.left=`${t.left+t.width/2}px`,this.shortcuts.style.bottom=`${window.innerHeight-t.top+10}px`,this.shortcuts.classList.add("open")}togglePanel(){this.panelOpen=!this.panelOpen,this.panel.classList.toggle("open",this.panelOpen),this.panelOpen&&this.renderPanel()}update(t,e){this.records=e,this.toggleBtn.textContent=t?"完成":"开始编辑",this.toggleBtn.classList.toggle("active",t),this.kbdBtn.style.display=t?"":"none",t||this.shortcuts.classList.remove("open"),this.editsBtn.textContent=`修改 ${e.length}`;const s=e.length===0;this.editsBtn.disabled=s,this.resetBtn.disabled=s,this.mdBtn.disabled=s,this.cssBtn.disabled=s,s&&this.panelOpen?this.togglePanel():this.panelOpen&&this.renderPanel()}renderPanel(){if(this.panel.replaceChildren(),this.records.length===0){const t=document.createElement("div");t.className="panel-empty",t.textContent="还没有修改",this.panel.append(t);return}for(const t of this.records){const e=document.createElement("div");e.className="edit-row",e.append(this.buildThumbs(t));const s=[];t.deleted&&s.push("删除"),t.moved&&s.push(`移动 Δx ${y(t.dx)} / Δy ${y(t.dy)}`),t.resized&&s.push(`尺寸 ${y(t.startSize.w)}×${y(t.startSize.h)} → ${y(t.size.w)}×${y(t.size.h)}`);const n=Object.keys(t.props).length;n&&s.push(`样式 ×${n}`),t.text!==null&&s.push("文字");const i=document.createElement("div");i.className="edit-info";const a=document.createElement("div");a.className="edit-sel",a.textContent=t.selector;const r=document.createElement("div");r.className="edit-delta",r.textContent=s.join(" · "),i.append(a,r),e.append(i);const l=document.createElement("button");l.textContent="撤销",l.addEventListener("click",()=>this.cb.onRevert(t.id)),e.append(l),this.panel.append(e)}}}const P=["flex-start","center","flex-end"],A=o=>Math.round(parseFloat(o)||0),D=o=>Math.round(o).toString(16).padStart(2,"0");function O(o){const t=o.match(/rgba?\(([^)]+)\)/);if(!t)return{hex:"#000000",alpha:o&&o!=="transparent"?1:0};const e=t[1].split(",").map(s=>parseFloat(s));return{hex:`#${D(e[0])}${D(e[1])}${D(e[2])}`,alpha:e[3]??1}}function at(o,t){if(t>=1)return o;const e=parseInt(o.slice(1,3),16),s=parseInt(o.slice(3,5),16),n=parseInt(o.slice(5,7),16);return`rgba(${e}, ${s}, ${n}, ${+t.toFixed(3)})`}function H(o){return o.includes("center")?1:o.includes("end")?2:0}class lt{constructor(t,e){this.root=t,this.host=e,this.el=null,this.flow="none",this.flowBtns=[],this.alignBtns=[],this.padSides=[],this.padIndependent=!1,this.layoutOnly=[],this.build()}section(t){const e=document.createElement("div");e.className="props-section";const s=document.createElement("div");return s.className="props-title",s.textContent=t,e.append(s),this.root.append(e),e}row(t,e){const s=document.createElement("div");if(s.className="props-row",e){const n=document.createElement("div");n.className="props-label",n.textContent=e,s.append(n)}return t.append(s),s}num(t,e,s=0){const n=document.createElement("input");return n.type="number",n.min=String(s),n.addEventListener("input",()=>{const i=parseFloat(n.value);Number.isNaN(i)||e(i)}),t.append(n),n}color(t,e){const s=document.createElement("input");return s.type="color",s.addEventListener("input",()=>e(s.value)),t.append(s),s}build(){const t=this.section("Auto layout"),e=this.row(t,"Flow"),s=document.createElement("div");s.className="seg";const n=[["none","✕","不使用 flex"],["col","↓","纵向排列 (column)"],["row","→","横向排列 (row)"],["wrap","⤸","横向换行 (wrap)"]];for(const[u,x,E]of n){const z=document.createElement("button");z.textContent=x,z.title=E,z.addEventListener("click",()=>this.applyFlow(u)),s.append(z),this.flowBtns.push(z)}e.append(s);const i=this.row(t,"W / H");this.wInput=this.num(i,u=>this.host.setSize(u,null),8),this.hInput=this.num(i,u=>this.host.setSize(null,u),8);const a=this.row(t,"Align"),r=document.createElement("div");r.className="align-grid";for(let u=0;u<3;u++)for(let x=0;x<3;x++){const E=document.createElement("button");E.addEventListener("click",()=>this.applyAlign(u,x)),r.append(E),this.alignBtns.push(E)}a.append(r);const l=document.createElement("div");l.style.flex="1";const d=document.createElement("div");d.className="props-label",d.textContent="Gap",l.append(d),this.gapInput=this.num(l,u=>this.host.setProps({gap:`${u}px`})),a.append(l),this.layoutOnly.push(r,l),this.padLinkedRow=this.row(t,"Padding"),this.padXInput=this.num(this.padLinkedRow,()=>this.applyPadding()),this.padYInput=this.num(this.padLinkedRow,()=>this.applyPadding()),this.padXInput.title="水平 padding",this.padYInput.title="垂直 padding",this.padToggle=document.createElement("button"),this.padToggle.className="pad-toggle",this.padToggle.textContent="⊞",this.padToggle.title="四边独立 padding",this.padToggle.addEventListener("click",()=>this.togglePadMode()),this.padLinkedRow.append(this.padToggle),this.padGridRow=this.row(t,""),this.padGridRow.style.display="none";const p=document.createElement("div");p.className="pad-grid";const g=["左 padding","上 padding","右 padding","下 padding"];for(let u=0;u<4;u++){const x=this.num(p,()=>this.applyPadding());x.title=g[u],this.padSides.push(x)}this.padGridRow.append(p);const c=this.row(t),m=document.createElement("label");m.className="check",this.clipInput=document.createElement("input"),this.clipInput.type="checkbox",this.clipInput.addEventListener("change",()=>this.host.setProps({overflow:this.clipInput.checked?"hidden":"visible"})),m.append(this.clipInput,"Clip content"),c.append(m);const f=this.section("Appearance"),T=this.row(f,"Opacity %");this.opacityInput=this.num(T,u=>this.host.setProps({opacity:String(Math.min(100,Math.max(0,u))/100)}));const L=this.row(f,"Radius");this.radiusInput=this.num(L,u=>this.host.setProps({"border-radius":`${u}px`}));const k=this.section("Fill"),S=this.row(k,"Color");this.fillColor=this.color(S,()=>this.applyFill()),this.fillPct=this.num(S,()=>this.applyFill()),this.fillPct.title="不透明度 %";const ut=this.section("Stroke"),U=this.row(ut,"Color / W");this.strokeColor=this.color(U,()=>this.applyStroke()),this.strokeWidth=this.num(U,()=>this.applyStroke()),this.strokeWidth.step="0.5",this.strokeWidth.title="描边宽度 px"}applyFlow(t){this.flow=t,t==="none"?this.host.setProps({display:"block","flex-direction":null,"flex-wrap":null}):this.host.setProps({display:"flex","flex-direction":t==="col"?"column":"row","flex-wrap":t==="wrap"?"wrap":"nowrap"}),this.markFlow()}applyAlign(t,e){const s=this.flow==="col"?P[t]:P[e],n=this.flow==="col"?P[e]:P[t];this.host.setProps({"justify-content":s,"align-items":n}),this.markAlign(t,e)}applyPadding(){if(this.padIndependent){const[t,e,s,n]=this.padSides.map(i=>parseFloat(i.value)||0);this.host.setProps({padding:`${e}px ${s}px ${n}px ${t}px`})}else{const t=parseFloat(this.padXInput.value)||0,e=parseFloat(this.padYInput.value)||0;this.host.setProps({padding:`${e}px ${t}px`})}}setPadMode(t){this.padIndependent=t,this.padXInput.style.display=t?"none":"",this.padYInput.style.display=t?"none":"",this.padGridRow.style.display=t?"":"none",this.padToggle.classList.toggle("on",t)}togglePadMode(){const t=!this.padIndependent;if(t){const e=this.padXInput.value||"0",s=this.padYInput.value||"0",n=[e,s,e,s];this.padSides.forEach((i,a)=>i.value=n[a])}else this.padXInput.value=this.padSides[0].value||"0",this.padYInput.value=this.padSides[1].value||"0",this.applyPadding();this.setPadMode(t)}applyFill(){const t=Math.min(100,Math.max(0,parseFloat(this.fillPct.value)||0));this.host.setProps({"background-color":at(this.fillColor.value,t/100)})}applyStroke(){const t=Math.max(0,parseFloat(this.strokeWidth.value)||0);this.host.setProps({"border-width":`${t}px`,"border-style":"solid","border-color":this.strokeColor.value})}markFlow(){const t=["none","col","row","wrap"].indexOf(this.flow);this.flowBtns.forEach((e,s)=>e.classList.toggle("on",s===t));for(const e of this.layoutOnly)e.classList.toggle("disabled",this.flow==="none")}markAlign(t,e){this.alignBtns.forEach((s,n)=>s.classList.toggle("on",n===t*3+e))}focusWithin(){const t=this.root.getRootNode();return t instanceof ShadowRoot&&this.root.contains(t.activeElement)}populate(t){const e=getComputedStyle(t),s=t.getBoundingClientRect();e.display.includes("flex")?this.flow=e.flexDirection.startsWith("column")?"col":e.flexWrap==="wrap"?"wrap":"row":this.flow="none",this.markFlow(),this.wInput.value=String(Math.round(s.width)),this.hInput.value=String(Math.round(s.height));const n=H(e.justifyContent),i=H(e.alignItems);this.markAlign(this.flow==="col"?n:i,this.flow==="col"?i:n),this.gapInput.value=String(e.columnGap==="normal"?0:A(e.columnGap));const a=[e.paddingLeft,e.paddingTop,e.paddingRight,e.paddingBottom].map(A),r=a[0]===a[2]&&a[1]===a[3];this.setPadMode(!r),this.padXInput.value=String(a[0]),this.padYInput.value=String(a[1]),this.padSides.forEach((p,g)=>p.value=String(a[g])),this.clipInput.checked=e.overflowX!=="visible",this.opacityInput.value=String(Math.round(parseFloat(e.opacity)*100)),this.radiusInput.value=String(A(e.borderTopLeftRadius));const l=O(e.backgroundColor);this.fillColor.value=l.hex,this.fillPct.value=String(Math.round(l.alpha*100));const d=O(e.borderTopColor);this.strokeColor.value=d.hex,this.strokeWidth.value=String(parseFloat(e.borderTopWidth)||0)}setTarget(t){this.el=t,this.root.classList.toggle("open",t!==null),t&&!this.focusWithin()&&this.populate(t)}sync(){this.el&&this.el.isConnected&&!this.focusWithin()&&this.populate(this.el)}refreshRect(t){this.focusWithin()||(this.wInput.value=String(Math.round(t.width)),this.hInput.value=String(Math.round(t.height)))}}function dt(o,t,e){const s=[],n=[],i=c=>{s.push(c.left,c.right,c.left+c.width/2),n.push(c.top,c.bottom,c.top+c.height/2)},a=o.parentElement;if(a&&a!==document.body&&i(a.getBoundingClientRect()),a){let c=0;for(const m of Array.from(a.children)){if(m===o||!(m instanceof HTMLElement))continue;const f=m.getBoundingClientRect();if(!(f.width===0&&f.height===0)&&(i(f),++c>=30))break}}const r=[t.left,t.left+t.width,t.left+t.width/2],l=[t.top,t.top+t.height,t.top+t.height/2],d=(c,m)=>{let f=e+1,T=null;for(const L of c)for(const k of m){const S=Math.abs(k-L);S<f&&(f=S,T={adj:k-L,guide:k})}return T},p=d(r,s),g=d(l,n);return{adjX:(p==null?void 0:p.adj)??0,adjY:(g==null?void 0:g.adj)??0,guideV:(p==null?void 0:p.guide)??null,guideH:(g==null?void 0:g.guide)??null}}const h=Math.round;function pt(o){const t=o.el.getBoundingClientRect();return{x:t.left+window.scrollX,y:t.top+window.scrollY,w:t.width,h:t.height}}function F(o){const t=h(o);return t>0?`+${t}`:`${t}`}function X(o){const t=o.filter(s=>s.el.isConnected),e=[`# Sidetation 视觉修改记录（${t.length} 处）`,"",`- 页面：${location.href}`,`- 视口：${window.innerWidth}×${window.innerHeight}`,""];return t.forEach((s,n)=>{const i=s.originalRect;if(e.push(`## ${n+1}. \`${s.selector}\``),e.push(`- 元素：\`<${s.tag}>\``),s.deleted){e.push("- **删除该元素**"),e.push(`- 原始盒（页面坐标）：x ${h(i.x)}，y ${h(i.y)}，w ${h(i.w)}，h ${h(i.h)}`),e.push("");return}const a=pt(s);s.moved&&e.push(`- 移动：Δx ${F(s.dx)}px，Δy ${F(s.dy)}px`),s.resized&&e.push(`- 尺寸：${h(s.startSize.w)}×${h(s.startSize.h)} → ${h(s.size.w)}×${h(s.size.h)}`);const r=Object.entries(s.props);if(r.length&&e.push(`- 样式：${r.map(([l,d])=>`\`${l}: ${d}\``).join("，")}`),s.text!==null){const l=d=>(d??"").trim().replace(/\s+/g," ").slice(0,80);e.push(`- 文字："${l(s.savedText)}" → "${l(s.text)}"`)}e.push(`- 原始盒（页面坐标）：x ${h(i.x)}，y ${h(i.y)}，w ${h(i.w)}，h ${h(i.h)}`),e.push(`- 修改后：x ${h(a.x)}，y ${h(a.y)}，w ${h(a.w)}，h ${h(a.h)}`),e.push("")}),e.push("---"),e.push("请把以上视觉改动落实到源码中：根据元素所在布局选择合适的方式（margin / padding / flex / grid / gap / width / height 等），不要直接照抄 transform 位移，那只是编辑器里的临时表现。"),e.join(`
`)}function W(o){return o.filter(s=>s.el.isConnected).map(s=>{const n=[];if(s.deleted)n.push("  display: none;");else{s.moved&&n.push(`  transform: translate(${h(s.dx)}px, ${h(s.dy)}px);`),s.resized&&(n.push(`  width: ${h(s.size.w-s.sizeAdj.w)}px;`),n.push(`  height: ${h(s.size.h-s.sizeAdj.h)}px;`));for(const[a,r]of Object.entries(s.props))n.push(`  ${a}: ${r};`)}return`${`/* ${s.tag}: ${h(s.startSize.w)}×${h(s.startSize.h)} @ (${h(s.originalRect.x)}, ${h(s.originalRect.y)}) */`}
${s.selector} {
${n.join(`
`)}
}`}).join(`

`)+`
`}const ht=3;class Y{constructor(t={}){this.overlay=new V,this.history=new ot,this.active=!1,this.hovered=null,this.selected=null,this.drag=null,this.resize=null,this.textEdit=null,this.lastDownAt=0,this.lastDownTarget=null,this.rafId=0,this.savedUserSelect="",this.loop=()=>{if(this.selected&&this.selected.isConnected){const e=this.selected.getBoundingClientRect();this.overlay.setSelection(e,this.selectionLabel()),this.propsPanel.refreshRect(e)}else this.selected&&(this.selected=null),this.overlay.setSelection(null);this.hovered&&this.hovered.isConnected&&this.hovered!==this.selected?this.overlay.setHover(this.hovered.getBoundingClientRect()):this.overlay.setHover(null),this.rafId=requestAnimationFrame(this.loop)},this.onPointerMove=e=>{if(this.resize){this.moveResize(e);return}if(this.drag){this.moveDrag(e);return}if(this.inOverlay(e)){this.hovered=null;return}this.hovered=this.pageElementAt(e.clientX,e.clientY)},this.onPointerDown=e=>{if(this.inOverlay(e))return;if(this.textEdit){if(e.composedPath().includes(this.textEdit.el))return;this.commitTextEdit()}if(e.preventDefault(),e.stopPropagation(),e.altKey&&this.selected){this.isSelectable(this.selected.parentElement)&&this.select(this.selected.parentElement);return}const s=this.pageElementAt(e.clientX,e.clientY);if(!s){this.select(null);return}const n=Date.now();if(s===this.lastDownTarget&&n-this.lastDownAt<400){this.lastDownAt=0,this.startTextEdit(s);return}this.lastDownAt=n,this.lastDownTarget=s,this.selected!==null&&(s===this.selected||this.selected.contains(s))||this.select(s);const a=this.selected;this.drag={el:a,startX:e.clientX,startY:e.clientY,rec:null,before:null,baseDx:0,baseDy:0,moved:!1,downTarget:s}},this.onPointerUp=e=>{if(this.resize){const s=this.resize;this.resize=null,document.documentElement.style.cursor="",this.history.commit(s.rec,s.before);return}if(this.drag){const s=this.drag;this.drag=null,this.overlay.setGuides(null,null),document.documentElement.style.cursor="",s.moved&&s.rec&&s.before?this.history.commit(s.rec,s.before):s.downTarget!==this.selected&&this.select(s.downTarget),e.preventDefault(),e.stopPropagation()}},this.blockEvent=e=>{this.inOverlay(e)||this.textEdit&&e.composedPath().includes(this.textEdit.el)||(e.preventDefault(),e.stopImmediatePropagation())},this.onKeyDown=e=>{if(this.inOverlay(e))return;if(this.textEdit){e.key==="Escape"&&(e.preventDefault(),e.stopPropagation(),this.commitTextEdit());return}const s=e.metaKey||e.ctrlKey;if(e.key==="Escape"){e.preventDefault(),e.stopPropagation(),this.selected?this.select(null):this.deactivate();return}if(s&&(e.key==="z"||e.key==="Z")){e.preventDefault(),e.stopPropagation(),(e.shiftKey?this.history.redo():this.history.undo())&&this.overlay.toast(e.shiftKey?"重做":"撤销");return}if(!this.selected)return;if(e.key==="Delete"||e.key==="Backspace"){e.preventDefault(),e.stopPropagation();const d=this.history.ensure(this.selected),p=this.history.snapshot(d);d.deleted=!0,this.select(null),this.history.commit(d,p),this.overlay.toast("已删除（⌘Z 撤销）");return}if(e.key==="Enter"){e.preventDefault(),e.stopPropagation();const d=e.shiftKey?this.selected.parentElement:this.selected.firstElementChild;this.isSelectable(d)&&this.select(d);return}if(e.key==="Tab"){e.preventDefault(),e.stopPropagation();const d=e.shiftKey?this.selected.previousElementSibling:this.selected.nextElementSibling;this.isSelectable(d)&&this.select(d);return}const n=e.shiftKey?10:1,a={ArrowLeft:[-n,0],ArrowRight:[n,0],ArrowUp:[0,-n],ArrowDown:[0,n]}[e.key];if(!a)return;e.preventDefault(),e.stopPropagation();const r=this.history.ensure(this.selected),l=this.history.snapshot(r);r.dx+=a[0],r.dy+=a[1],r.moved=!0,this.history.commit(r,l,{coalesce:"nudge"})},this.opts={autoStart:!1,snapThreshold:6,...t},this.toolbar=new rt(this.overlay.toolbarEl,this.overlay.panelEl,this.overlay.shortcutsEl,{onToggle:()=>this.active?this.deactivate():this.activate(),onCopyMd:()=>this.copy(X(this.history.all()),"已复制 Markdown"),onCopyCss:()=>this.copy(W(this.history.all()),"已复制 CSS"),onReset:()=>this.history.resetAll(),onRevert:e=>this.history.revert(e)}),this.propsPanel=new lt(this.overlay.propsEl,{setProps:e=>this.panelSetProps(e),setSize:(e,s)=>this.panelSetSize(e,s)}),this.history.onChange=()=>this.syncUI(),this.overlay.onHandleDown=(e,s)=>this.startResize(e,s),this.syncUI(),this.opts.autoStart&&this.activate()}activate(){this.active||(this.active=!0,this.savedUserSelect=document.documentElement.style.userSelect,document.documentElement.style.userSelect="none",window.addEventListener("pointermove",this.onPointerMove,!0),window.addEventListener("pointerdown",this.onPointerDown,!0),window.addEventListener("pointerup",this.onPointerUp,!0),window.addEventListener("pointercancel",this.onPointerUp,!0),window.addEventListener("click",this.blockEvent,!0),window.addEventListener("keydown",this.onKeyDown,!0),this.rafId=requestAnimationFrame(this.loop),this.syncUI())}deactivate(){this.active&&(this.commitTextEdit(),this.active=!1,document.documentElement.style.userSelect=this.savedUserSelect,document.documentElement.style.cursor="",window.removeEventListener("pointermove",this.onPointerMove,!0),window.removeEventListener("pointerdown",this.onPointerDown,!0),window.removeEventListener("pointerup",this.onPointerUp,!0),window.removeEventListener("pointercancel",this.onPointerUp,!0),window.removeEventListener("click",this.blockEvent,!0),window.removeEventListener("keydown",this.onKeyDown,!0),cancelAnimationFrame(this.rafId),this.hovered=null,this.selected=null,this.drag=null,this.resize=null,this.propsPanel.setTarget(null),this.overlay.setHover(null),this.overlay.setSelection(null),this.overlay.setGuides(null,null),this.syncUI())}destroy(){this.deactivate(),this.overlay.destroy()}selectionLabel(){if(!this.selected)return"";const t=this.selected.getBoundingClientRect();return`${Z(this.selected)}  ${Math.round(t.width)}×${Math.round(t.height)}`}pageElementAt(t,e){let s=document.elementFromPoint(t,e);for(;s&&!(s instanceof HTMLElement);)s=s.parentElement;return!s||s===document.body||s===document.documentElement||s.closest("[data-sidetation]")?null:s}inOverlay(t){return t.composedPath().includes(this.overlay.host)}select(t){this.selected=t,this.hovered=null,this.propsPanel.setTarget(t)}isSelectable(t){return t instanceof HTMLElement&&t!==document.body&&t!==document.documentElement&&!t.closest("[data-sidetation]")}startTextEdit(t){if(t.childElementCount>0||!(t.textContent??"").trim()){this.overlay.toast("仅支持纯文本元素（无子元素）");return}this.select(t);const e=this.history.ensure(t);this.textEdit={el:t,rec:e,before:this.history.snapshot(e),savedUserSelect:t.style.getPropertyValue("user-select")},t.setAttribute("contenteditable","plaintext-only"),t.isContentEditable||t.setAttribute("contenteditable","true"),t.style.setProperty("user-select","text"),t.focus();const s=document.createRange();s.selectNodeContents(t);const n=window.getSelection();n==null||n.removeAllRanges(),n==null||n.addRange(s)}commitTextEdit(){var s;const t=this.textEdit;if(!t)return;this.textEdit=null,t.el.removeAttribute("contenteditable"),t.savedUserSelect?t.el.style.setProperty("user-select",t.savedUserSelect):t.el.style.removeProperty("user-select"),(s=window.getSelection())==null||s.removeAllRanges();const e=t.el.textContent??"";t.rec.text=e===t.rec.savedText?null:e,this.history.commit(t.rec,t.before)}moveDrag(t){const e=this.drag,s=t.clientX-e.startX,n=t.clientY-e.startY;if(!e.moved){if(Math.hypot(s,n)<ht)return;e.moved=!0,e.rec=this.history.ensure(e.el),e.before=this.history.snapshot(e.rec),e.baseDx=e.rec.dx,e.baseDy=e.rec.dy,document.documentElement.style.cursor="move"}const i=e.rec;let a=e.baseDx+s,r=e.baseDy+n;const l=e.el.getBoundingClientRect(),d={left:l.left+(a-i.dx),top:l.top+(r-i.dy),width:l.width,height:l.height},p=dt(e.el,d,this.opts.snapThreshold);a+=p.adjX,r+=p.adjY,this.overlay.setGuides(p.guideV,p.guideH),i.dx=a,i.dy=r,i.moved=!0,C(i)}startResize(t,e){if(!this.selected)return;e.preventDefault(),e.stopPropagation();const s=this.history.ensure(this.selected),n=this.selected.getBoundingClientRect();this.resize={rec:s,before:this.history.snapshot(s),dir:t,startX:e.clientX,startY:e.clientY,startW:n.width,startH:n.height,baseDx:s.dx,baseDy:s.dy}}moveResize(t){const e=this.resize,{rec:s,dir:n}=e,i=t.clientX-e.startX,a=t.clientY-e.startY;let r=e.startW,l=e.startH;if(n.includes("e")&&(r=e.startW+i),n.includes("w")&&(r=e.startW-i),n.includes("s")&&(l=e.startH+a),n.includes("n")&&(l=e.startH-a),t.shiftKey&&e.startH>0&&e.startW>0){const d=e.startW/e.startH;n==="e"||n==="w"?l=r/d:n==="n"||n==="s"?r=l*d:Math.abs(i)>Math.abs(a)?l=r/d:r=l*d}r=Math.max(8,Math.round(r)),l=Math.max(8,Math.round(l)),s.dx=n.includes("w")?e.baseDx+(e.startW-r):e.baseDx,s.dy=n.includes("n")?e.baseDy+(e.startH-l):e.baseDy,(s.dx!==e.baseDx||s.dy!==e.baseDy)&&(s.moved=!0),s.size={w:r,h:l},s.resized=!0,C(s)}panelSetProps(t){if(!this.selected)return;this.commitTextEdit();const e=this.history.ensure(this.selected),s=this.history.snapshot(e);for(const[n,i]of Object.entries(t))n in e.savedProps||(e.savedProps[n]=this.selected.style.getPropertyValue(n)),i===null?delete e.props[n]:e.props[n]=i;this.history.commit(e,s,{coalesce:`props:${Object.keys(t).sort().join(",")}`})}panelSetSize(t,e){if(!this.selected)return;this.commitTextEdit();const s=this.history.ensure(this.selected),n=this.history.snapshot(s);t!==null&&(s.size.w=Math.max(8,t)),e!==null&&(s.size.h=Math.max(8,e)),s.resized=!0,this.history.commit(s,n,{coalesce:"size"})}copy(t,e){var n;const s=()=>{const i=document.createElement("textarea");i.value=t,i.style.position="fixed",i.style.opacity="0",document.body.append(i),i.select(),document.execCommand("copy"),i.remove(),this.overlay.toast(e)};(n=navigator.clipboard)!=null&&n.writeText?navigator.clipboard.writeText(t).then(()=>this.overlay.toast(e),()=>s()):s()}getMarkdown(){return X(this.history.all())}getCSS(){return W(this.history.all())}undo(){return this.history.undo()}redo(){return this.history.redo()}syncUI(){this.history.prune(),this.toolbar.update(this.active,this.history.all()),this.propsPanel.sync()}}function ct(o){return new Y(o)}b.Sidetation=Y,b.init=ct,Object.defineProperty(b,Symbol.toStringTag,{value:"Module"})});
