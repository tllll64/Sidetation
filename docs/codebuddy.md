# 在 CodeBuddy 里用 Sidetation 拖拽改页面

在 CodeBuddy IDE 的内置预览里直接拖动、拉伸页面元素，一键同步给 CodeBuddy 落实到源码——全程不出 IDE、不复制粘贴。

```
CodeBuddy IDE 预览窗口          MCP 桥（本机常驻）           CodeBuddy 对话
┌─────────────────┐   同步    ┌──────────────┐   MCP    ┌──────────────┐
│ 拖拽 / 拉伸元素   │ ────────▶ │  receiver     │ ◀─────── │ 「读取修改并   │
│ 点「同步 MCP」    │  POST     │  :8787        │  stdio/  │  落实到源码」  │
└─────────────────┘           └──────────────┘  HTTP    └──────────────┘
```

CodeBuddy 的 IDE 插件、独立 IDE 和 CLI 均支持 MCP，以下步骤通用。

## 前置：启动 MCP 桥（一次性）

```bash
cd mcp
npm install
npm run receiver        # 常驻；macOS 可用 ./install-macos.sh 注册开机自启
```

详见 [mcp/README.md](../mcp/README.md)。

## 第一步：在 CodeBuddy 注册 MCP server

打开 CodeBuddy 的 MCP 配置（IDE 中为 MCP 管理面板，或直接编辑 MCP JSON 配置），二选一：

**stdio 方式（推荐）**——CodeBuddy 自己拉起 reader 进程：

```jsonc
{
  "mcpServers": {
    "sidetation": { "command": "node", "args": ["/绝对路径/Sidetation/mcp/server.mjs"] }
  }
}
```

**HTTP 方式**——直接连 receiver 的 Streamable HTTP 端点：

```
http://127.0.0.1:8787/mcp
```

注册成功后，CodeBuddy 应能列出 `get_latest_edits` / `get_edits_json` / `list_pages` / `clear_edits` 四个工具。

## 第二步：让 Sidetation 出现在预览页面里

**自己的项目（推荐）**——入口文件加两行，仅开发环境生效：

```ts
import { init } from 'sidetation';
if (import.meta.env.DEV) init({ enableMcpSync: true });
```

`enableMcpSync: true` 会让工具栏出现「同步 MCP」按钮。用 CodeBuddy IDE 的内置预览打开本地 dev server，Sidetation 悬浮工具栏会直接出现在预览窗口里。

**第三方页面**——用 Chrome 扩展或 `dist/console-paste.js` 注入（见根 [README](../README.md)）。注意此时导出的选择器对应不到你的源码，适合复制 CSS 而非走 MCP 改码。

## 第三步：拖拽 → 同步 → 让 CodeBuddy 改码

1. 预览里点「开始编辑」，拖动 / 拉伸 / 多选对齐，改到满意。
2. 点「**同步 MCP**」，看到「已同步 N 处修改到 MCP」。
3. 回到 CodeBuddy 对话，直接说：

   > 用 sidetation 的 get_latest_edits 读取我刚在页面上做的修改，落实到源码里。注意用合理的布局属性实现，不要照抄 transform。

CodeBuddy 读到的是结构化数据：稳定选择器、精确位移量、改动前后的盒模型——不是模糊的文字描述。

## 兼容性与已知注意事项

以下结论来自 webview 沙箱等价环境的实测（IDE 内置预览 = sandbox 化 iframe）：

- **标准 IDE 预览沙箱（含 `allow-same-origin`）下全功能可用**：Shadow DOM 工具栏、点选、拖拽吸附、撤销重做、localStorage 会话持久化、导出，全部正常。
- **快捷键可能被 IDE 截胡**：⌘Z / Delete 等按键在部分 IDE 里会优先落到编辑器。此时用工具栏按钮和属性面板操作即可，鼠标交互不受影响。
- **极严沙箱（无 `allow-same-origin`）的降级**：会话持久化静默失效（编辑不受影响，刷新不恢复）；且 Vite 对 opaque origin 不返回 CORS 头，ES module 注入加载不出来——改用 UMD 注入（扩展 / console-paste 路径）即可，或在 `vite.config.ts` 设 `server.cors: true`。正常 IDE 预览用不到这条。

## 常见问题

- **点「同步 MCP」提示同步失败** → receiver 没在跑，`cd mcp && npm run receiver`。
- **CodeBuddy 说读不到修改** → 先在浏览器里点过「同步 MCP」；多页面时让它先调 `list_pages` 确认。
- **改完想清掉** → 让 CodeBuddy 调 `clear_edits`，或浏览器里点「重置」后重新同步。
