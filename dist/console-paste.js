(function(u,y){typeof exports=="object"&&typeof module<"u"?y(exports):typeof define=="function"&&define.amd?define(["exports"],y):(u=typeof globalThis<"u"?globalThis:u||self,y(u.Sidetation={}))})(this,function(u){"use strict";const y=`
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
.hint {
  color: rgba(255, 255, 255, 0.45);
  font-size: 11px;
  padding: 0 8px 0 2px;
  white-space: nowrap;
}

/* ---- edits panel ---- */
.panel {
  position: fixed;
  left: 50%;
  bottom: 66px;
  transform: translateX(-50%);
  width: 400px;
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
`,A=["nw","n","ne","e","se","s","sw","w"];class H{constructor(){this.host=document.createElement("div"),this.onHandleDown=null,this.toastTimer=0,this.host.setAttribute("data-sidetation",""),Object.assign(this.host.style,{position:"fixed",inset:"0",zIndex:"2147483647",pointerEvents:"none"});const t=this.host.attachShadow({mode:"open"}),e=document.createElement("style");e.textContent=y,t.append(e);const s=i=>{const o=document.createElement("div");return o.className=i,t.append(o),o};this.hoverBox=s("hover-box"),this.selBox=s("sel-box"),this.selLabel=document.createElement("div"),this.selLabel.className="sel-label",this.selBox.append(this.selLabel);for(const i of A){const o=document.createElement("div");o.className="handle",o.dataset.dir=i,o.addEventListener("pointerdown",r=>{var a;return(a=this.onHandleDown)==null?void 0:a.call(this,i,r)}),this.selBox.append(o)}this.guideV=s("guide guide-v"),this.guideH=s("guide guide-h"),this.panelEl=s("panel"),this.toolbarEl=s("toolbar"),this.toastEl=s("toast"),document.documentElement.appendChild(this.host)}place(t,e){if(!e){t.style.display="none";return}t.style.display="block",t.style.left=`${e.left}px`,t.style.top=`${e.top}px`,t.style.width=`${e.width}px`,t.style.height=`${e.height}px`}setHover(t){this.place(this.hoverBox,t)}setSelection(t,e=""){this.place(this.selBox,t),t&&(this.selLabel.textContent=e)}setGuides(t,e){this.guideV.style.display=t===null?"none":"block",t!==null&&(this.guideV.style.left=`${t}px`),this.guideH.style.display=e===null?"none":"block",e!==null&&(this.guideH.style.top=`${e}px`)}toast(t){this.toastEl.textContent=t,this.toastEl.classList.add("show"),clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>this.toastEl.classList.remove("show"),1600)}destroy(){clearTimeout(this.toastTimer),this.host.remove()}}const M=/(^|[-_])[0-9a-f]{5,}([-_]|$)|^(css|sc|jss|emotion)-|__[A-Za-z0-9]{5,}$/i,j=["data-testid","data-test","data-cy"];function E(n){return Array.from(n.classList).filter(t=>t.length<=24&&!M.test(t)&&!/\d{3,}/.test(t)).slice(0,2)}function S(n){return!n.id||/\d{3,}/.test(n.id)||/^[0-9a-f-]{8,}$/i.test(n.id)?null:n.id}function $(n){const t=n.tagName.toLowerCase();for(const s of j){const i=n.getAttribute(s);if(i)return`${t}[${s}="${i}"]`}const e=E(n).map(s=>`.${CSS.escape(s)}`).join("");return t+e}function v(n,t){try{const e=document.querySelectorAll(n);return e.length===1&&e[0]===t}catch{return!1}}function I(n){const t=S(n);if(t){const o=`#${CSS.escape(t)}`;if(v(o,n))return o}const e=[];let s=n;for(;s&&s!==document.body&&s!==document.documentElement&&e.length<5;){const o=S(s);if(o&&s!==n){e.unshift(`#${CSS.escape(o)}`);const a=e.join(" > ");if(v(a,n))return a;break}e.unshift($(s));const r=e.join(" > ");if(v(r,n))return r;s=s.parentElement}const i=n.parentElement;if(i){const r=Array.from(i.children).filter(d=>d.tagName===n.tagName).indexOf(n)+1,a=[...e.slice(0,-1),`${$(n)}:nth-of-type(${r})`].join(" > ");return v(a,n),a}return e.join(" > ")}function N(n){const t=n.tagName.toLowerCase(),e=S(n);if(e)return`${t}#${e}`;const s=E(n);return s.length?`${t}.${s[0]}`:t}function w(n,t,e){e?n.style.setProperty(t,e):n.style.removeProperty(t)}function b(n){const{el:t,savedInline:e}=n;if(n.deleted?t.style.display="none":n.resized&&n.baseDisplay==="inline"?t.style.display="inline-block":w(t,"display",e.display),n.moved&&(n.dx!==0||n.dy!==0)){const s=`translate(${n.dx}px, ${n.dy}px)`;t.style.transform=n.baseTransform==="none"?s:`${s} ${n.baseTransform}`}else w(t,"transform",e.transform);n.resized?(t.style.width=`${n.size.w-n.sizeAdj.w}px`,t.style.height=`${n.size.h-n.sizeAdj.h}px`):(w(t,"width",e.width),w(t,"height",e.height))}const X=800;function k(n){return!n.moved&&!n.resized&&!n.deleted}function O(n,t){return n.dx===t.dx&&n.dy===t.dy&&n.size.w===t.size.w&&n.size.h===t.size.h&&n.moved===t.moved&&n.resized===t.resized&&n.deleted===t.deleted}const Y={dx:0,dy:0,moved:!1,resized:!1,deleted:!1};class U{constructor(){this.records=new Map,this.undoStack=[],this.redoStack=[],this.seq=1,this.onChange=null}ensure(t){let e=this.records.get(t);if(e)return e;const s=t.getBoundingClientRect(),i=getComputedStyle(t),o=i.boxSizing==="content-box",r=a=>parseFloat(a)||0;return e={id:this.seq++,el:t,selector:I(t),tag:t.tagName.toLowerCase(),originalRect:{x:s.left+window.scrollX,y:s.top+window.scrollY,w:s.width,h:s.height},savedInline:{transform:t.style.getPropertyValue("transform"),width:t.style.getPropertyValue("width"),height:t.style.getPropertyValue("height"),display:t.style.getPropertyValue("display")},baseTransform:i.transform,baseDisplay:i.display,sizeAdj:o?{w:r(i.paddingLeft)+r(i.paddingRight)+r(i.borderLeftWidth)+r(i.borderRightWidth),h:r(i.paddingTop)+r(i.paddingBottom)+r(i.borderTopWidth)+r(i.borderBottomWidth)}:{w:0,h:0},dx:0,dy:0,moved:!1,resized:!1,deleted:!1,startSize:{w:s.width,h:s.height},size:{w:s.width,h:s.height}},this.records.set(t,e),e}get(t){return this.records.get(t)}all(){return Array.from(this.records.values())}snapshot(t){return{dx:t.dx,dy:t.dy,size:{...t.size},moved:t.moved,resized:t.resized,deleted:t.deleted}}commit(t,e,s){t.dx===0&&t.dy===0&&(t.moved=!1),b(t);const i=this.snapshot(t);if(O(e,i)){this.cleanup(t),this.emit();return}const o=this.undoStack[this.undoStack.length-1];s!=null&&s.coalesce&&(o!=null&&o.coalesce)&&o.rec===t&&Date.now()-o.at<X?(o.after=i,o.at=Date.now()):this.undoStack.push({rec:t,before:e,after:i,coalesce:!!(s!=null&&s.coalesce),at:Date.now()}),this.redoStack.length=0,this.cleanup(t),this.emit()}undo(){const t=this.undoStack.pop();return t?(this.applySnap(t.rec,t.before),this.redoStack.push(t),this.emit(),!0):!1}redo(){const t=this.redoStack.pop();return t?(this.applySnap(t.rec,t.after),this.undoStack.push(t),this.emit(),!0):!1}revert(t){const e=this.all().find(i=>i.id===t);if(!e)return;const s=this.snapshot(e);this.applySnap(e,{...Y,size:{...e.startSize}}),this.undoStack.push({rec:e,before:s,after:this.snapshot(e),coalesce:!1,at:Date.now()}),this.redoStack.length=0,this.emit()}resetAll(){for(const t of this.all())this.revert(t.id)}applySnap(t,e){t.dx=e.dx,t.dy=e.dy,t.size={...e.size},t.moved=e.moved,t.resized=e.resized,t.deleted=e.deleted,b(t),this.cleanup(t)}cleanup(t){k(t)?this.records.delete(t.el):this.records.set(t.el,t)}prune(){for(const[t,e]of this.records)k(e)&&this.records.delete(t)}emit(){var t;(t=this.onChange)==null||t.call(this)}}const f=Math.round;class K{constructor(t,e,s){this.panel=e,this.cb=s,this.panelOpen=!1,this.records=[];const i=document.createElement("div");i.className="brand";const o=document.createElement("span");o.className="brand-dot",i.append(o,"Sidetation"),t.append(i);const r=(d,h)=>{const c=document.createElement("button");return c.textContent=d,c.addEventListener("click",h),t.append(c),c},a=()=>{const d=document.createElement("div");d.className="divider",t.append(d)};this.toggleBtn=r("开始编辑",()=>s.onToggle()),this.toggleBtn.classList.add("primary"),this.hintEl=document.createElement("div"),this.hintEl.className="hint",t.append(this.hintEl),a(),this.editsBtn=r("修改 0",()=>this.togglePanel()),this.resetBtn=r("重置",()=>s.onReset()),a(),this.mdBtn=r("复制 Markdown",()=>s.onCopyMd()),this.cssBtn=r("复制 CSS",()=>s.onCopyCss())}togglePanel(){this.panelOpen=!this.panelOpen,this.panel.classList.toggle("open",this.panelOpen),this.panelOpen&&this.renderPanel()}update(t,e){this.records=e,this.toggleBtn.textContent=t?"完成":"开始编辑",this.toggleBtn.classList.toggle("active",t),this.hintEl.textContent=t?"拖拽移动 · Del 删除 · ⌘Z 撤销 · Esc 退出":"",this.hintEl.style.display=t?"":"none",this.editsBtn.textContent=`修改 ${e.length}`;const s=e.length===0;this.editsBtn.disabled=s,this.resetBtn.disabled=s,this.mdBtn.disabled=s,this.cssBtn.disabled=s,s&&this.panelOpen?this.togglePanel():this.panelOpen&&this.renderPanel()}renderPanel(){if(this.panel.replaceChildren(),this.records.length===0){const t=document.createElement("div");t.className="panel-empty",t.textContent="还没有修改",this.panel.append(t);return}for(const t of this.records){const e=document.createElement("div");e.className="edit-row";const s=[];t.deleted&&s.push("删除"),t.moved&&s.push(`移动 Δx ${f(t.dx)} / Δy ${f(t.dy)}`),t.resized&&s.push(`尺寸 ${f(t.startSize.w)}×${f(t.startSize.h)} → ${f(t.size.w)}×${f(t.size.h)}`);const i=document.createElement("div");i.className="edit-info";const o=document.createElement("div");o.className="edit-sel",o.textContent=t.selector;const r=document.createElement("div");r.className="edit-delta",r.textContent=s.join(" · "),i.append(o,r),e.append(i);const a=document.createElement("button");a.textContent="撤销",a.addEventListener("click",()=>this.cb.onRevert(t.id)),e.append(a),this.panel.append(e)}}}function W(n,t,e){const s=[],i=[],o=p=>{s.push(p.left,p.right,p.left+p.width/2),i.push(p.top,p.bottom,p.top+p.height/2)},r=n.parentElement;if(r&&r!==document.body&&o(r.getBoundingClientRect()),r){let p=0;for(const x of Array.from(r.children)){if(x===n||!(x instanceof HTMLElement))continue;const g=x.getBoundingClientRect();if(!(g.width===0&&g.height===0)&&(o(g),++p>=30))break}}const a=[t.left,t.left+t.width,t.left+t.width/2],d=[t.top,t.top+t.height,t.top+t.height/2],h=(p,x)=>{let g=e+1,T=null;for(const B of p)for(const z of x){const R=Math.abs(z-B);R<g&&(g=R,T={adj:z-B,guide:z})}return T},c=h(a,s),m=h(d,i);return{adjX:(c==null?void 0:c.adj)??0,adjY:(m==null?void 0:m.adj)??0,guideV:(c==null?void 0:c.guide)??null,guideH:(m==null?void 0:m.guide)??null}}const l=Math.round;function V(n){const t=n.el.getBoundingClientRect();return{x:t.left+window.scrollX,y:t.top+window.scrollY,w:t.width,h:t.height}}function C(n){const t=l(n);return t>0?`+${t}`:`${t}`}function D(n){const t=n.filter(s=>s.el.isConnected),e=[`# Sidetation 视觉修改记录（${t.length} 处）`,"",`- 页面：${location.href}`,`- 视口：${window.innerWidth}×${window.innerHeight}`,""];return t.forEach((s,i)=>{const o=s.originalRect;if(e.push(`## ${i+1}. \`${s.selector}\``),e.push(`- 元素：\`<${s.tag}>\``),s.deleted){e.push("- **删除该元素**"),e.push(`- 原始盒（页面坐标）：x ${l(o.x)}，y ${l(o.y)}，w ${l(o.w)}，h ${l(o.h)}`),e.push("");return}const r=V(s);s.moved&&e.push(`- 移动：Δx ${C(s.dx)}px，Δy ${C(s.dy)}px`),s.resized&&e.push(`- 尺寸：${l(s.startSize.w)}×${l(s.startSize.h)} → ${l(s.size.w)}×${l(s.size.h)}`),e.push(`- 原始盒（页面坐标）：x ${l(o.x)}，y ${l(o.y)}，w ${l(o.w)}，h ${l(o.h)}`),e.push(`- 修改后：x ${l(r.x)}，y ${l(r.y)}，w ${l(r.w)}，h ${l(r.h)}`),e.push("")}),e.push("---"),e.push("请把以上视觉改动落实到源码中：根据元素所在布局选择合适的方式（margin / padding / flex / grid / gap / width / height 等），不要直接照抄 transform 位移，那只是编辑器里的临时表现。"),e.join(`
`)}function L(n){return n.filter(s=>s.el.isConnected).map(s=>{const i=[];return s.deleted?i.push("  display: none;"):(s.moved&&i.push(`  transform: translate(${l(s.dx)}px, ${l(s.dy)}px);`),s.resized&&(i.push(`  width: ${l(s.size.w-s.sizeAdj.w)}px;`),i.push(`  height: ${l(s.size.h-s.sizeAdj.h)}px;`))),`${`/* ${s.tag}: ${l(s.startSize.w)}×${l(s.startSize.h)} @ (${l(s.originalRect.x)}, ${l(s.originalRect.y)}) */`}
${s.selector} {
${i.join(`
`)}
}`}).join(`

`)+`
`}const F=3;class P{constructor(t={}){this.overlay=new H,this.history=new U,this.active=!1,this.hovered=null,this.selected=null,this.drag=null,this.resize=null,this.rafId=0,this.savedUserSelect="",this.loop=()=>{this.selected&&this.selected.isConnected?this.overlay.setSelection(this.selected.getBoundingClientRect(),this.selectionLabel()):(this.selected&&(this.selected=null),this.overlay.setSelection(null)),this.hovered&&this.hovered.isConnected&&this.hovered!==this.selected?this.overlay.setHover(this.hovered.getBoundingClientRect()):this.overlay.setHover(null),this.rafId=requestAnimationFrame(this.loop)},this.onPointerMove=e=>{if(this.resize){this.moveResize(e);return}if(this.drag){this.moveDrag(e);return}if(this.inOverlay(e)){this.hovered=null;return}this.hovered=this.pageElementAt(e.clientX,e.clientY)},this.onPointerDown=e=>{if(this.inOverlay(e))return;if(e.preventDefault(),e.stopPropagation(),e.altKey&&this.selected){this.isSelectable(this.selected.parentElement)&&this.select(this.selected.parentElement);return}const s=this.pageElementAt(e.clientX,e.clientY);if(!s){this.select(null);return}this.selected!==null&&(s===this.selected||this.selected.contains(s))||this.select(s);const o=this.selected;this.drag={el:o,startX:e.clientX,startY:e.clientY,rec:null,before:null,baseDx:0,baseDy:0,moved:!1,downTarget:s}},this.onPointerUp=e=>{if(this.resize){const s=this.resize;this.resize=null,document.documentElement.style.cursor="",this.history.commit(s.rec,s.before);return}if(this.drag){const s=this.drag;this.drag=null,this.overlay.setGuides(null,null),document.documentElement.style.cursor="",s.moved&&s.rec&&s.before?this.history.commit(s.rec,s.before):s.downTarget!==this.selected&&this.select(s.downTarget),e.preventDefault(),e.stopPropagation()}},this.blockEvent=e=>{this.inOverlay(e)||(e.preventDefault(),e.stopImmediatePropagation())},this.onKeyDown=e=>{const s=e.metaKey||e.ctrlKey;if(e.key==="Escape"){e.preventDefault(),e.stopPropagation(),this.selected?this.select(null):this.deactivate();return}if(s&&(e.key==="z"||e.key==="Z")){e.preventDefault(),e.stopPropagation(),(e.shiftKey?this.history.redo():this.history.undo())&&this.overlay.toast(e.shiftKey?"重做":"撤销");return}if(!this.selected)return;if(e.key==="Delete"||e.key==="Backspace"){e.preventDefault(),e.stopPropagation();const h=this.history.ensure(this.selected),c=this.history.snapshot(h);h.deleted=!0,this.select(null),this.history.commit(h,c),this.overlay.toast("已删除（⌘Z 撤销）");return}if(e.key==="Enter"){e.preventDefault(),e.stopPropagation();const h=e.shiftKey?this.selected.parentElement:this.selected.firstElementChild;this.isSelectable(h)&&this.select(h);return}if(e.key==="Tab"){e.preventDefault(),e.stopPropagation();const h=e.shiftKey?this.selected.previousElementSibling:this.selected.nextElementSibling;this.isSelectable(h)&&this.select(h);return}const i=e.shiftKey?10:1,r={ArrowLeft:[-i,0],ArrowRight:[i,0],ArrowUp:[0,-i],ArrowDown:[0,i]}[e.key];if(!r)return;e.preventDefault(),e.stopPropagation();const a=this.history.ensure(this.selected),d=this.history.snapshot(a);a.dx+=r[0],a.dy+=r[1],a.moved=!0,this.history.commit(a,d,{coalesce:!0})},this.opts={autoStart:!1,snapThreshold:6,...t},this.toolbar=new K(this.overlay.toolbarEl,this.overlay.panelEl,{onToggle:()=>this.active?this.deactivate():this.activate(),onCopyMd:()=>this.copy(D(this.history.all()),"已复制 Markdown"),onCopyCss:()=>this.copy(L(this.history.all()),"已复制 CSS"),onReset:()=>this.history.resetAll(),onRevert:e=>this.history.revert(e)}),this.history.onChange=()=>this.syncUI(),this.overlay.onHandleDown=(e,s)=>this.startResize(e,s),this.syncUI(),this.opts.autoStart&&this.activate()}activate(){this.active||(this.active=!0,this.savedUserSelect=document.documentElement.style.userSelect,document.documentElement.style.userSelect="none",window.addEventListener("pointermove",this.onPointerMove,!0),window.addEventListener("pointerdown",this.onPointerDown,!0),window.addEventListener("pointerup",this.onPointerUp,!0),window.addEventListener("pointercancel",this.onPointerUp,!0),window.addEventListener("click",this.blockEvent,!0),window.addEventListener("keydown",this.onKeyDown,!0),this.rafId=requestAnimationFrame(this.loop),this.syncUI())}deactivate(){this.active&&(this.active=!1,document.documentElement.style.userSelect=this.savedUserSelect,document.documentElement.style.cursor="",window.removeEventListener("pointermove",this.onPointerMove,!0),window.removeEventListener("pointerdown",this.onPointerDown,!0),window.removeEventListener("pointerup",this.onPointerUp,!0),window.removeEventListener("pointercancel",this.onPointerUp,!0),window.removeEventListener("click",this.blockEvent,!0),window.removeEventListener("keydown",this.onKeyDown,!0),cancelAnimationFrame(this.rafId),this.hovered=null,this.selected=null,this.drag=null,this.resize=null,this.overlay.setHover(null),this.overlay.setSelection(null),this.overlay.setGuides(null,null),this.syncUI())}destroy(){this.deactivate(),this.overlay.destroy()}selectionLabel(){if(!this.selected)return"";const t=this.selected.getBoundingClientRect();return`${N(this.selected)}  ${Math.round(t.width)}×${Math.round(t.height)}`}pageElementAt(t,e){let s=document.elementFromPoint(t,e);for(;s&&!(s instanceof HTMLElement);)s=s.parentElement;return!s||s===document.body||s===document.documentElement||s.closest("[data-sidetation]")?null:s}inOverlay(t){return t.composedPath().includes(this.overlay.host)}select(t){this.selected=t,this.hovered=null}isSelectable(t){return t instanceof HTMLElement&&t!==document.body&&t!==document.documentElement&&!t.closest("[data-sidetation]")}moveDrag(t){const e=this.drag,s=t.clientX-e.startX,i=t.clientY-e.startY;if(!e.moved){if(Math.hypot(s,i)<F)return;e.moved=!0,e.rec=this.history.ensure(e.el),e.before=this.history.snapshot(e.rec),e.baseDx=e.rec.dx,e.baseDy=e.rec.dy,document.documentElement.style.cursor="move"}const o=e.rec;let r=e.baseDx+s,a=e.baseDy+i;const d=e.el.getBoundingClientRect(),h={left:d.left+(r-o.dx),top:d.top+(a-o.dy),width:d.width,height:d.height},c=W(e.el,h,this.opts.snapThreshold);r+=c.adjX,a+=c.adjY,this.overlay.setGuides(c.guideV,c.guideH),o.dx=r,o.dy=a,o.moved=!0,b(o)}startResize(t,e){if(!this.selected)return;e.preventDefault(),e.stopPropagation();const s=this.history.ensure(this.selected),i=this.selected.getBoundingClientRect();this.resize={rec:s,before:this.history.snapshot(s),dir:t,startX:e.clientX,startY:e.clientY,startW:i.width,startH:i.height,baseDx:s.dx,baseDy:s.dy}}moveResize(t){const e=this.resize,{rec:s,dir:i}=e,o=t.clientX-e.startX,r=t.clientY-e.startY;let a=e.startW,d=e.startH;if(i.includes("e")&&(a=e.startW+o),i.includes("w")&&(a=e.startW-o),i.includes("s")&&(d=e.startH+r),i.includes("n")&&(d=e.startH-r),t.shiftKey&&e.startH>0&&e.startW>0){const h=e.startW/e.startH;i==="e"||i==="w"?d=a/h:i==="n"||i==="s"?a=d*h:Math.abs(o)>Math.abs(r)?d=a/h:a=d*h}a=Math.max(8,Math.round(a)),d=Math.max(8,Math.round(d)),s.dx=i.includes("w")?e.baseDx+(e.startW-a):e.baseDx,s.dy=i.includes("n")?e.baseDy+(e.startH-d):e.baseDy,(s.dx!==e.baseDx||s.dy!==e.baseDy)&&(s.moved=!0),s.size={w:a,h:d},s.resized=!0,b(s)}copy(t,e){var i;const s=()=>{const o=document.createElement("textarea");o.value=t,o.style.position="fixed",o.style.opacity="0",document.body.append(o),o.select(),document.execCommand("copy"),o.remove(),this.overlay.toast(e)};(i=navigator.clipboard)!=null&&i.writeText?navigator.clipboard.writeText(t).then(()=>this.overlay.toast(e),()=>s()):s()}getMarkdown(){return D(this.history.all())}getCSS(){return L(this.history.all())}undo(){return this.history.undo()}redo(){return this.history.redo()}syncUI(){this.history.prune(),this.toolbar.update(this.active,this.history.all())}}function _(n){return new P(n)}u.Sidetation=P,u.init=_,Object.defineProperty(u,Symbol.toStringTag,{value:"Module"})});
;(function(){var s=window.Sidetation||globalThis.Sidetation;if(document.querySelector('[data-sidetation]')){console.log('Sidetation already injected');return;}window.__sidetation=s.init({autoStart:true});console.log('Sidetation ready — 已自动进入编辑模式');})();