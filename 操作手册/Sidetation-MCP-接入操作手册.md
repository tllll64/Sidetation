# Sidetation × CodeBuddy MCP 接入操作手册

> 本手册记录了从零开始，在 CodeBuddy 里把 Sidetation 接入为 MCP、并跑通「浏览器拖拽 → 同步 → 让 AI 落实到源码」完整链路的全过程，含实际遇到的报错与解决办法。
>
> 环境：macOS · CodeBuddy IDE · 项目路径 `/Users/tianlin/Documents/GitHub/Sidetation`

---

## 一、这套流程最终实现了什么

```
CodeBuddy IDE 预览窗口          MCP 桥（本机常驻）           CodeBuddy 对话
┌─────────────────┐   同步    ┌──────────────┐   MCP    ┌──────────────┐
│ 拖拽 / 拉伸元素   │ ────────▶ │  receiver     │ ◀─────── │ 「读取修改并   │
│ 点「同步 MCP」    │  POST     │  :8787        │  stdio   │  落实到源码」  │
└─────────────────┘           └──────────────┘          └──────────────┘
```

在 IDE 内置预览里像用 Figma 一样直接拖拽页面元素，一键同步，AI 读到的是**结构化数据**（稳定选择器 + 精确位移 + 前后盒模型），而不是模糊的文字描述。

---

## 二、前置条件

| 项 | 要求 |
|---|---|
| Node.js | 已安装（`node -v` 可用） |
| CodeBuddy | IDE 版本，支持 MCP |
| 项目 | 已克隆到本地，本手册路径为 `/Users/tianlin/Documents/GitHub/Sidetation` |

---

## 三、完整操作步骤

### 步骤 1：在 CodeBuddy 注册 MCP Server

1. 在侧栏对话面板右上方，点击 **CodeBuddy Settings**（设置）按钮
2. 切换到 **MCP** 标签页
3. 点右侧 **+ 配置 MCP**（Add MCP），在弹出的 JSON 里填入配置

配置文件位置：`/Users/tianlin/.codebuddy/mcp.json`

```json
{
  "mcpServers": {
    "sidetation": {
      "command": "node",
      "args": ["/Users/tianlin/Documents/GitHub/Sidetation/mcp/server.mjs"]
    }
  }
}
```

> 采用 **stdio 方式**（推荐）：CodeBuddy 会自己拉起 `server.mjs` 读进程，最省事。
> `args` 里务必用 **绝对路径**。

**验证注册成功**：MCP 列表里 `sidetation` 前应显示**绿色圆点**，并标注 **`4 tools 0 prompts`**（即 `get_latest_edits` / `get_edits_json` / `list_pages` / `clear_edits` 四个工具）。开关为蓝色开启即生效。

### 步骤 2：让 Sidetation 出现在预览页里

演示沙盒 `index.html` 默认调用 `init()`，但没开 MCP 同步开关。需要改成开启：

```html
<!-- index.html -->
<script type="module">
  import { init } from '/src/index.ts';
  window.sidetation = init({ enableMcpSync: true });  // ← 加上 { enableMcpSync: true }
</script>
```

> `enableMcpSync: true` 会让工具栏出现「**同步 MCP**」按钮（默认关闭，见 `src/index.ts` 中 `enableMcpSync` 默认 `false`）。
>
> 若集成到你自己的项目，则在入口文件加：
> ```ts
> import { init } from 'sidetation';
> if (import.meta.env.DEV) init({ enableMcpSync: true });
> ```

### 步骤 3：安装依赖并启动 dev server

```bash
cd /Users/tianlin/Documents/GitHub/Sidetation
npm install     # 首次必须，否则 dev server 起不来（见「报错记录 1」）
npm run dev     # 启动在 http://localhost:5173/
```

启动成功日志：
```
VITE v5.4.21  ready in 361 ms
➜  Local:   http://localhost:5173/
```

在 CodeBuddy 内置预览打开 `http://localhost:5173/`，页面上会出现 Sidetation 悬浮工具栏。

### 步骤 4：启动 MCP 桥（receiver 常驻）

浏览器点「同步 MCP」把数据推送进来，**必须**让 receiver 在跑：

```bash
cd /Users/tianlin/Documents/GitHub/Sidetation/mcp
npm install         # 首次必须
npm run receiver    # 常驻进程，监听 :8787
```

> stdio 方式下 CodeBuddy 会自己拉起 `server.mjs` 读数据，但**接收浏览器的新同步必须靠 receiver**。二者共享同一个 store 文件 `~/.sidetation-mcp.json`。
> macOS 可用 `./install-macos.sh` 注册开机自启。

### 步骤 5：拖拽 → 同步 → 让 CodeBuddy 改码

1. 预览里点「**开始编辑**」，点选元素，拖动 / 拉伸 / 多选对齐
2. 点「**同步 MCP**」，看到提示「**已同步 N 处修改到 MCP**」即成功
3. 回到 CodeBuddy 对话，说：
   > 用 sidetation 的 `get_latest_edits` 读取我刚在页面上做的修改，落实到源码里，用合理的布局属性实现，不要照抄 transform。

CodeBuddy 会调用 MCP 工具读到结构化数据。例如本次实测读到：

```
## 1. `section.banner > button.btn.btn-primary`
- 元素：<button>
- 移动：Δx +15px，Δy 0px
- 尺寸：142×46 → 182×46
```

据此落实到源码（`index.html`），用健康的布局属性而非 transform：

```css
.banner .btn-primary {
  width: 182px;        /* 142 → 182，精确复现加宽 */
  margin-right: -15px; /* 右对齐元素向右外扩 15px */
}
```

---

## 四、报错记录与解决办法

### 报错 1：dev server 起不来 / 依赖缺失

**现象**：检查发现 `node_modules` 不存在（`deps: MISSING`），直接 `npm run dev` 会失败。

**原因**：项目刚克隆下来，未安装依赖。

**解决**：
```bash
cd /Users/tianlin/Documents/GitHub/Sidetation
npm install
```
安装后再 `npm run dev` 即正常。

> 注意：`mcp/` 目录是**独立的**依赖，需要**单独** `cd mcp && npm install`，不要以为根目录装过就够了。

### 报错 2：点「同步 MCP」提示「同步失败：本地 MCP 服务未启动？」

**原因**：receiver 桥没在运行，浏览器 POST 到 `http://127.0.0.1:8787/ingest` 失败。

**解决**：
```bash
cd /Users/tianlin/Documents/GitHub/Sidetation/mcp
npm run receiver
```
保持该进程常驻，再回浏览器重新点「同步 MCP」。

### 报错 3：CodeBuddy 说「读不到修改」

**排查顺序**：
1. 确认浏览器里**已经点过**「同步 MCP」并看到成功提示
2. 让 CodeBuddy 先调 `list_pages` 确认 store 里有哪些页面
3. 多页面时，`get_latest_edits` 默认取**最近一次同步**的页面；也可传 `url` 指定

### 报错 4：快捷键（⌘Z / Delete）在预览里不生效

**原因**：IDE 内置预览会把部分快捷键优先交给编辑器处理（截胡）。

**解决**：改用工具栏按钮和属性面板操作，鼠标交互不受影响。

---

## 五、MCP 工具速查

| 工具 | 作用 |
|------|------|
| `get_latest_edits(url?)` | 返回最近同步页面的修改（Markdown 格式），直接据此改码 |
| `get_edits_json(url?)` | 返回结构化 JSON（选择器 / dx,dy / size / props / 盒模型） |
| `list_pages()` | 列出所有已同步页面及修改数量、时间 |
| `clear_edits(url?)` | 清空修改（传 url 只清该页，否则全清） |

> 不传 `url` 时默认取最近一次同步的页面。
> 落实完修改后，可让 CodeBuddy 调 `clear_edits` 清空 store，避免下次同步与旧数据混淆。

---

## 六、每次使用的最短清单

日常使用时（依赖已装好），只需三件事：

```bash
# 1. 起 dev server（终端 A）
cd /Users/tianlin/Documents/GitHub/Sidetation && npm run dev

# 2. 起 MCP 桥（终端 B）
cd /Users/tianlin/Documents/GitHub/Sidetation/mcp && npm run receiver
```

3. CodeBuddy 预览打开 `http://localhost:5173/` → 拖拽 → 同步 MCP → 让 AI 读取落实。

---

## 附：关键路径一览

| 用途 | 路径 |
|---|---|
| CodeBuddy MCP 配置 | `/Users/tianlin/.codebuddy/mcp.json` |
| MCP reader（stdio） | `/Users/tianlin/Documents/GitHub/Sidetation/mcp/server.mjs` |
| MCP receiver（常驻） | `/Users/tianlin/Documents/GitHub/Sidetation/mcp/receiver.mjs` |
| 共享 store 文件 | `~/.sidetation-mcp.json` |
| 演示页入口 | `/Users/tianlin/Documents/GitHub/Sidetation/index.html` |
| receiver 端口 | `127.0.0.1:8787` |
