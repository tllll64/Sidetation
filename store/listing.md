# Chrome Web Store 上架材料 — Sidetation

> 在开发者控制台每个字段直接粘贴对应内容即可。

## 商品名称（Store listing → Title）

```
Sidetation - 网页可视化编辑 & AI 反馈
```

（英文市场备用：`Sidetation - Visual Page Editor for AI Agents`）

## 简短说明（Summary，≤132 字符）

```
像设计师一样拖拽、缩放、编辑网页元素，一键导出结构化修改记录给 Claude Code / Cursor 等 AI coding agent，或直接复制 CSS。
```

## 详细说明（Description）

```
Sidetation 让你在任何网页上「所见即所得」地表达设计意图，不再用文字向 AI 描述「按钮往左一点、再小一点」。

【怎么用】
点击工具栏图标开启编辑模式，再点一次关闭。页面右下角出现工具栏后：
· 点选任意元素，直接拖动位置（自动吸附对齐参考线）
· 8 个手柄缩放大小，Shift 锁定宽高比
· Figma 式属性面板：flex 布局、四边 padding、背景色、描边、圆角、透明度
· 双击纯文本元素，行内直接改文字
· Delete 删除元素，⌘Z / Ctrl+Z 全程撤销重做

【导出】
每处修改自动记录为「稳定选择器 + before/after 盒模型 + 样式变更」，附前后对比快照缩略图：
· 复制 Markdown：粘给 Claude Code、Cursor 等 AI coding agent，让它改真实源码
· 复制 CSS：得到可直接粘贴的样式覆盖

【安全与隐私】
· 仅在你点击图标的页面注入，不后台运行，不读取其他标签页
· 不收集、不上传任何数据，无远程请求
· 所有修改只存在于当前页面，刷新即消失

【适合谁】
设计师、前端工程师、产品经理——所有需要向 AI 或同事精确表达「页面应该改成什么样」的人。

开源项目：https://github.com/tllll64/Sidetation
```

## 类别（Category）

```
Developer Tools（开发者工具）
```

## 语言（Language）

```
中文（简体）
```

## 图形资源（Graphic assets）

| 素材 | 要求 | 文件 |
|---|---|---|
| 商店图标 | 128×128 PNG | `extension/icons/icon128.png` |
| 截图（至少 1 张） | 1280×800 PNG | `store/screenshot-1.png`、`store/screenshot-2.png` |
| 小型宣传图（可选） | 440×280 | 暂缺，可跳过 |

## 隐私（Privacy practices 标签页）

见 `store/privacy.md`，每个问题的答案都写好了。

## 发布可见度（Distribution）

- **Public**：所有人可搜索安装（同事直接搜 "Sidetation"）
- 如想先内部试用，选 **Unlisted**（仅链接可安装），之后可随时改为 Public

## 提交流程速查

1. https://chrome.google.com/webstore/devconsole → 「+ 新商品」
2. 上传 `dist/sidetation-extension.zip`
3. 「商品详情」粘贴上方名称 / 简短说明 / 详细说明，选类别与语言
4. 上传图标与截图
5. 「隐私权规范」按 `privacy.md` 逐项填写
6. 「分发」选 Public → 提交审核（activeTab 类插件通常 1–3 个工作日）
