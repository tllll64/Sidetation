# Sidetation MCP 桥

把你在浏览器里用 Sidetation 做的视觉修改，直接送到任意支持 MCP 的 AI 编码助手（Claude Code / Cursor / Codex / CodeBuddy / WorkBuddy…）——不用再手动复制粘贴。

这是一个**标准 MCP server**，不绑定任何特定客户端。

## 架构（两个进程 + 一个共享文件）

```
                       ┌───────────────── receiver 常驻进程 ─────────────────┐
浏览器扩展 ─POST /ingest─▶  ·POST /ingest  收浏览器数据                        │
 (点「同步 MCP」)         │  ·POST /mcp    远程 agent 走 Streamable HTTP  ◀──── WorkBuddy 等云端/远程客户端
                       │  ·GET  /health                                     │
                       └──────────────┬──────────────────────────────────────┘
                                      │ 读写
                              ~/.sidetation-mcp.json  （共享 store 文件）
                                      │ 只读（每次调用都重读）
           ┌──────────────────────────┼──────────────────────────┐
     server.mjs (stdio)         server.mjs (stdio)          server.mjs (stdio)
     Claude Code                Codex                       CodeBuddy
```

要点：

- **receiver 是唯一的写入方**，独占端口（默认 `8787`），负责收浏览器数据、也对远程客户端提供 Streamable HTTP 的 `/mcp`。
- **每个 stdio agent 自己 spawn 一个 `server.mjs`，都是纯读者**，永不抢端口。
- 所有进程共享同一个 JSON 文件，且**每次工具调用都重新读文件**——所以 Claude、Codex、CodeBuddy 可以同时开着，读到的永远是同一份最新修改。

## 安装

```bash
cd mcp
npm install
```

## 启动 receiver（常驻）

浏览器同步、以及远程 HTTP 客户端，都要求 receiver 在跑：

```bash
npm run receiver         # = node receiver.mjs
```

> 只用 stdio 客户端（Claude / Codex / CodeBuddy）读取历史修改时，客户端会自己拉起 `server.mjs`，不强制要 receiver；但**要接收浏览器新的同步，就必须让 receiver 常驻**。

### 开机自启（macOS，推荐）

用自带脚本把 receiver 注册成 LaunchAgent（登录即启动、崩溃自动重启）：

```bash
cd mcp
./install-macos.sh            # 安装并启动
./install-macos.sh uninstall  # 停止并移除
```

脚本会自动解析你机器上的 `node` 路径和本目录的 `receiver.mjs`，生成
`~/Library/LaunchAgents/com.sidetation.receiver.plist` 并 `launchctl load`，日志写到
`~/Library/Logs/sidetation-receiver.log`。

> 从你**真实的仓库检出目录**里运行它——plist 会指向脚本所在路径，别在临时的 git worktree 里跑，否则 worktree 清掉后路径失效。升级过 Node 版本后重跑一次安装即可刷新路径。

## 在各 AI 客户端里注册（stdio）

命令都一样：`node /绝对路径/Sidetation/mcp/server.mjs`，只是配置文件格式不同。

### Claude Code

```bash
claude mcp add sidetation -- node /绝对路径/Sidetation/mcp/server.mjs
```

### Cursor（`~/.cursor/mcp.json`）

```json
{
  "mcpServers": {
    "sidetation": { "command": "node", "args": ["/绝对路径/Sidetation/mcp/server.mjs"] }
  }
}
```

### Codex CLI（`~/.codex/config.toml`）

```toml
[mcp_servers.sidetation]
command = "node"
args = ["/绝对路径/Sidetation/mcp/server.mjs"]
```

### CodeBuddy（MCP 配置，JSONC）

```jsonc
{
  "mcpServers": {
    // stdio 方式
    "sidetation": { "command": "node", "args": ["/绝对路径/Sidetation/mcp/server.mjs"] }
  }
}
```

> 在 CodeBuddy IDE 内置预览里拖拽改页面的端到端教程见 [docs/codebuddy.md](../docs/codebuddy.md)。

## 远程 / HTTP 客户端（WorkBuddy 等）

不 spawn 本地进程、只连 URL 的客户端，直接指向 receiver 的 Streamable HTTP 端点：

```
http://127.0.0.1:8787/mcp
```

CodeBuddy 也支持 HTTP 方式，同样填这个 URL 即可。（无鉴权，仅绑定本机 loopback。）

## 使用流程

1. `npm run receiver` 让桥常驻。
2. 浏览器里用 Sidetation 编辑页面，点工具栏「**同步 MCP**」，看到「已同步 N 处修改到 MCP」。
3. 在任意已注册的 agent 里说：「读一下 Sidetation 里我刚做的修改并落实到源码」。

## 暴露的工具

| 工具 | 作用 |
|------|------|
| `get_latest_edits(url?)` | 返回最近同步页面的修改，Markdown 格式，直接据此改码 |
| `get_edits_json(url?)` | 返回结构化 JSON（选择器 / dx,dy / size / props / text / 盒模型） |
| `list_pages()` | 列出所有已同步页面及修改数量、时间 |
| `clear_edits(url?)` | 清空修改（传 url 只清该页，否则全清） |

不传 `url` 时默认取最近一次同步的页面。

## 配置（环境变量）

| 变量 | 默认 | 说明 |
|------|------|------|
| `SIDETATION_PORT` | `8787` | receiver 端口（同时服务 `/ingest` 与 `/mcp`） |
| `SIDETATION_HOST` | `127.0.0.1` | 绑定地址，保持 loopback 避免暴露到局域网 |
| `SIDETATION_STORE` | `~/.sidetation-mcp.json` | 共享 store 文件路径（receiver 与所有 reader 必须一致） |

改了端口，浏览器侧对应传 `init({ mcpEndpoint: 'http://127.0.0.1:<port>' })`；远程客户端 URL 也随之改。

## 备注

- receiver 绑定 `127.0.0.1`，只接受本机请求；https 页面向 loopback 发请求不受浏览器混合内容拦截。
- MCP over stdio 走 stdout 的 JSON-RPC，因此所有进程的日志都走 stderr，不会污染协议。
- `/mcp` 采用无状态（stateless）模式：每个请求单独处理，天然读到最新 store。
