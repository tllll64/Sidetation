# Sidetation

像设计师一样在真实网页里**拖拽元素位置、拉伸元素大小**，然后把改动导出成结构化反馈交给 AI coding agent（Claude Code / Cursor）落实到源码，或直接导出 CSS。

思路致敬 [agentation](https://github.com/benjitaylor/agentation)：不生成代码，只生成**精确的上下文**——但把「文字标注」升级为「直接操纵」。

## 使用

```bash
npm install
npm run dev   # 打开演示沙盒
```

在自己的项目里（仅开发环境）：

```ts
import { init } from 'sidetation';

if (import.meta.env.DEV) {
  init();
}
```

## 在任意网站上测试

**Chrome 插件（推荐给团队）**：`npm run build` 后，在 `chrome://extensions` 开启「开发者模式」→「加载已解压的扩展程序」→ 选择 `extension/` 目录。点工具栏图标即可在当前页开启/关闭编辑模式（带 ON 徽标），仅申请 `activeTab` 权限，不受页面 CSP 限制。

`npm run build` 还会在 `dist/` 里额外生成两个注入文件：

- **`console-paste.js`** — 打开任意网站 → DevTools 控制台 → 整个文件内容粘贴回车，工具栏立即出现并进入编辑模式。控制台执行不受页面 CSP 限制，几乎所有网站可用。
- **`bookmarklet.txt`** — 把整段 `javascript:...` 存为浏览器书签的 URL，在任何页面点击书签即可注入。少数 CSP 严格的站点可能拦截 bookmarklet，此时退回控制台方式。

注意：注入只影响当前页面的展示（刷新即消失），导出的选择器在别人的网站上无法对应你的源码，因此在第三方网站上主要用「复制 CSS」而非 Markdown。

## 功能

- **悬浮工具栏**：默认折叠成品牌 pill，点击展开为完整工具栏（开始/完成编辑、修改列表、重置、复制 Markdown / CSS，以及可选的同步 MCP）
- **点选元素**：hover 高亮，点击选中；点击子元素下钻，`Alt+点击` 上钻到父级
- **多选批量操作**：`Shift+点击` 加入/移出多选；拖拽任意已选元素整体移动，`Delete` 批量删除，均记录为一次撤销；选中 ≥2 个元素时出现对齐面板（左/水平居中/右/上/垂直居中/下），≥3 个元素可横向/纵向等距分布
- **拖拽移动**：`transform: translate` 位移，不破坏文档流；自动吸附兄弟/父元素的边缘与中线（Figma 式参考线）
- **拉伸缩放**：8 手柄，`Shift` 锁比例，自动处理 `content-box` 的补偿
- **属性面板**（Figma 风格悬浮面板，选中即出现）：
  - Auto layout：Flow（none/column/row/wrap）、W/H、九宫格对齐、Gap、Padding、Clip content
  - Appearance：不透明度、圆角
  - Fill：背景色 + 透明度；Stroke：描边色 + 粗细
- **快捷键**（Figma 同款）：`Delete` 删除元素、`⌘Z / ⌘⇧Z` 撤销重做、`Enter / Shift+Enter` 下钻/上钻、`Tab / Shift+Tab` 兄弟元素切换、方向键微调（`Shift` ×10）、`Esc` 取消/退出
- **编辑历史**：手势级 undo/redo 栈（同字段连续修改自动合并为一步），面板可单条还原或全部重置；每条记录带「优化前 → 优化后」DOM 快照缩略图（原生 SVG foreignObject 实现，无第三方依赖）
- **会话持久化**：修改自动存入 `localStorage`（按页面路径归档），刷新页面后自动恢复；选择器在刷新后失效的记录会以 toast 提示未能恢复的数量

## 导出格式

**Markdown（给 AI agent）**——包含稳定选择器（过滤 CSS-in-JS 哈希类名）、位移量、before/after 盒模型，并提示 agent 用合理的布局属性落实而非照抄 transform。

**CSS**——可直接粘贴的覆盖样式（transform / width / height）。

**同步 MCP（直连 AI agent，可选）**——默认隐藏；用 `init({ enableMcpSync: true })` 开启后，工具栏会出现「同步 MCP」按钮，把修改推送到本地 MCP 桥，任意支持 MCP 的 agent（Claude Code / Cursor / Codex / CodeBuddy / WorkBuddy…）即可直接读取，省去复制粘贴。stdio 与 Streamable HTTP 两种传输都支持，多个 agent 可同时读同一份修改。配置见 [`mcp/README.md`](mcp/README.md)。

## 技术要点

- Vanilla TypeScript，零运行时依赖，框架无关
- 所有 UI 渲染在 Shadow DOM 隔离层中（`pointer-events: none` 穿透 + 局部交互）
- 编辑只写内联样式并保存原值，撤销即完整还原

## 构建

```bash
npm run build         # 类型检查 + 打包 ES/UMD 到 dist/，并生成注入产物与扩展 bundle
npm run package:ext   # 在 build 基础上打包 dist/sidetation-extension.zip
```

构建产物（`dist/`、`extension/sidetation.js`）不入库。CI（GitHub Actions）在每次 push / PR 时执行 typecheck + 构建 + 扩展打包并上传 artifact；推送 `v*` tag 会自动创建 Release 并附上扩展 zip。
