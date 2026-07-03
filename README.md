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

`npm run build` 会在 `dist/` 里额外生成两个注入文件：

- **`console-paste.js`** — 打开任意网站 → DevTools 控制台 → 整个文件内容粘贴回车，工具栏立即出现并进入编辑模式。控制台执行不受页面 CSP 限制，几乎所有网站可用。
- **`bookmarklet.txt`** — 把整段 `javascript:...` 存为浏览器书签的 URL，在任何页面点击书签即可注入。少数 CSP 严格的站点可能拦截 bookmarklet，此时退回控制台方式。

注意：注入只影响当前页面的展示（刷新即消失），导出的选择器在别人的网站上无法对应你的源码，因此在第三方网站上主要用「复制 CSS」而非 Markdown。

## 功能

- **悬浮工具栏**：开始/完成编辑、修改列表、重置、复制 Markdown / CSS
- **点选元素**：hover 高亮，点击选中；点击子元素下钻，`Alt+点击` 上钻到父级
- **拖拽移动**：`transform: translate` 位移，不破坏文档流；自动吸附兄弟/父元素的边缘与中线（Figma 式参考线）
- **拉伸缩放**：8 手柄，`Shift` 锁比例，自动处理 `content-box` 的补偿
- **键盘微调**：方向键 1px，`Shift+方向键` 10px，`Esc` 取消选中/退出
- **编辑历史**：每个元素一条记录，可单条撤销或全部重置

## 导出格式

**Markdown（给 AI agent）**——包含稳定选择器（过滤 CSS-in-JS 哈希类名）、位移量、before/after 盒模型，并提示 agent 用合理的布局属性落实而非照抄 transform。

**CSS**——可直接粘贴的覆盖样式（transform / width / height）。

## 技术要点

- Vanilla TypeScript，零运行时依赖，框架无关
- 所有 UI 渲染在 Shadow DOM 隔离层中（`pointer-events: none` 穿透 + 局部交互）
- 编辑只写内联样式并保存原值，撤销即完整还原

## 构建

```bash
npm run build   # 类型检查 + 打包 ES/UMD 到 dist/
```
