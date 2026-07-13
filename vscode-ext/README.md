# Sidetation 预览（VS Code / CodeBuddy IDE 扩展）

在 IDE 里零配置预览并**拖拽编辑**本地前端项目：扩展内置一个注入代理，把 Sidetation 自动插进任何 dev server 返回的页面——**项目一行代码都不用改**。

```
你的 dev server (5173)
      ▲ 转发
扩展内置代理 (127.0.0.1:随机端口) ←— 在 HTML 响应里注入 Sidetation
      ▲
IDE 预览面板 (webview iframe)
```

WebSocket 原样透传，Vite HMR / 热更新不受影响。

## 使用

1. 启动你项目的 dev server（Vite / webpack / 任意框架均可）。
2. `⌘⇧P` → **Sidetation: 打开预览** → 输入 dev server 地址（默认 `http://localhost:5173`）。
3. 预览面板出现，点 Sidetation 工具栏「开始编辑」即可拖拽 / 拉伸 / 多选对齐。
4. 导出：「复制 Markdown / CSS」，或配好 [MCP 桥](../mcp/README.md) 后点「同步 MCP」直接给 AI agent 读取。

## 配置

| 设置项 | 默认 | 说明 |
|--------|------|------|
| `sidetation.defaultTarget` | `http://localhost:5173` | 输入框的默认地址 |
| `sidetation.mcpEndpoint` | `http://127.0.0.1:8787` | 「同步 MCP」指向的 receiver 端点 |

## 开发 / 打包

```bash
# 仓库根目录先构建出 UMD
npm run build

cd vscode-ext
npm install
npm run package   # typecheck + 构建 + 产出 sidetation-preview-x.y.z.vsix
```

`.vsix` 在 VS Code 与 CodeBuddy IDE 里均可通过「Install from VSIX…」安装。

调试：本目录下 `code --extensionDevelopmentPath=$PWD`；设置环境变量 `SIDETATION_PREVIEW_TARGET=http://localhost:5173` 可跳过输入框自动打开预览（用于开发自测）。

## 已知限制

- ⌘Z 等快捷键可能被 IDE 截胡，用工具栏按钮兜底；鼠标手势不受影响。
- 代理只改写 `text/html` 响应；SPA 用 history 路由的子路径同样会被注入（响应仍是 HTML）。
- 「同步 MCP」需要本机 receiver 在跑（`cd mcp && npm run receiver`）。
