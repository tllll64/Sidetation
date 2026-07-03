# Sidetation 产品需求文档 (PRD)

## 1. 项目概述

### 1.1 项目名称
Sidetation

### 1.2 项目背景
在现代网页开发流程中，设计稿与实际代码实现之间往往存在差距。传统的开发模式通常是：设计人员制作设计稿 → 开发人员根据设计稿编写代码 → 反复修改调整。这种模式效率低，且设计人员难以直接参与到代码层面的调整中。

同时，随着 AI 编码助手（如 Claude Code、Cursor）的普及，开发者需要一种更直观的方式向 AI 助手传达视觉上的修改需求。目前的方案主要是通过文字描述或截图标注，不够精确且效率低下。

项目思路致敬 [agentation](https://github.com/benjitaylor/agentation)，但将「文字标注」升级为「直接操纵」。

### 1.3 项目目标
- 让非技术人员（如设计师）也能在真实网页上直观地调整元素位置和大小
- 生成精确、结构化的修改数据，便于 AI 编码助手理解和实现
- 支持直接导出 CSS 样式，快速在项目中应用
- 提供完整的历史记录和撤销功能
- 框架无关，可在任意网页项目中使用

### 1.4 目标用户
- 网页设计师：快速在真实页面上验证设计想法
- 前端开发者：快速调整布局，然后让 AI 助手实现
- 产品经理：直观地提出页面布局修改建议
- 使用 AI 编码工具的开发者：为 AI 提供精确的视觉反馈

## 2. 功能需求

### 2.1 核心功能

#### 2.1.1 悬浮工具栏
- **功能描述**：提供一个悬浮在页面上的工具栏，包含主要操作按钮
- **功能细节**：
  - 开始/完成编辑按钮
  - 修改列表按钮（查看所有修改记录）
  - 重置按钮（撤销所有修改）
  - 复制 Markdown 按钮
  - 复制 CSS 按钮
  - 操作提示文本

#### 2.1.2 元素选择
- **功能描述**：支持点选页面上的任意元素
- **功能细节**：
  - 鼠标悬停时高亮显示元素边界
  - 点击选中元素
  - 点击子元素下钻选中
  - Alt+点击 上钻选中父元素
  - Enter 键下钻到第一个子元素
  - Shift+Enter 键上钻到父元素
  - Tab / Shift+Tab 在兄弟元素间切换
  - Esc 键取消选中或退出编辑模式

#### 2.1.3 拖拽移动
- **功能描述**：支持拖拽选中元素改变位置
- **功能细节**：
  - 使用 transform: translate 实现位移，不破坏文档流
  - 自动吸附兄弟/父元素的边缘与中线（Figma 式参考线）
  - 吸附阈值可配置（默认 6px）
  - 移动操作会保存到历史记录

#### 2.1.4 拉伸缩放
- **功能描述**：支持通过手柄调整元素大小
- **功能细节**：
  - 8 个方向的调整手柄
  - Shift 键锁定宽高比例
  - 自动处理 content-box 的边框补偿
  - 调整大小操作会保存到历史记录

#### 2.1.5 键盘微调
- **功能描述**：使用键盘进行精确微调
- **功能细节**：
  - 方向键每次移动 1px
  - Shift+方向键每次移动 10px
  - Esc 键取消选中
  - Delete / Backspace 键删除元素

#### 2.1.6 编辑历史
- **功能描述**：记录所有编辑操作，支持撤销和重做
- **功能细节**：
  - 每个元素一条编辑记录
  - 支持单条撤销
  - 支持全部重置
  - ⌘Z / Ctrl+Z 撤销
  - ⌘Shift+Z / Ctrl+Shift+Z 重做

#### 2.1.7 导出功能
- **功能描述**：将编辑结果导出为不同格式
- **功能细节**：
  - **Markdown 格式**：包含稳定选择器（过滤 CSS-in-JS 哈希类名）、位移量、before/after 盒模型，提示 AI 用合理的布局属性落实而非照抄 transform
  - **CSS 格式**：可直接粘贴的覆盖样式（transform / width / height）

### 2.2 次要功能

#### 2.2.1 演示沙盒
- **功能描述**：提供一个本地开发的演示页面，用于测试功能

#### 2.2.2 控制台注入
- **功能描述**：在任意网站的控制台粘贴代码即可注入 Sidetation

#### 2.2.3 书签小工具
- **功能描述**：将 Sidetation 保存为浏览器书签，在任意页面点击即可注入

## 3. 非功能需求

### 3.1 性能
- 初始化时间 < 100ms
- 拖拽操作流畅，帧率 ≥ 60fps
- 内存占用合理，无内存泄漏

### 3.2 兼容性
- 支持现代浏览器（Chrome、Firefox、Safari、Edge）
- 框架无关（可在 React、Vue、Angular 等项目中使用）
- 支持 TypeScript

### 3.3 安全性
- 不修改页面原有 DOM 结构（除了添加内联样式）
- 所有 UI 渲染在 Shadow DOM 隔离层中
- 不收集用户数据

### 3.4 可维护性
- 代码结构清晰，模块化设计
- 完整的 TypeScript 类型定义
- 零运行时依赖

## 4. 技术架构

### 4.1 技术栈
- **语言**：TypeScript
- **构建工具**：Vite
- **运行时**：零依赖

### 4.2 核心模块

#### 4.2.1 主模块 ([index.ts](file:///Users/xiaoshizi/Documents/GitHub/Sidetation/src/index.ts))
- 核心类 `Sidetation`
- 管理整个编辑流程
- 处理指针事件
- 协调各子模块

#### 4.2.2 覆盖层模块 ([overlay.ts](file:///Users/xiaoshizi/Documents/GitHub/Sidetation/src/overlay.ts))
- 渲染悬浮工具栏
- 渲染元素选中框和手柄
- 渲染吸附参考线
- 使用 Shadow DOM 隔离

#### 4.2.3 历史记录模块 ([history.ts](file:///Users/xiaoshizi/Documents/GitHub/Sidetation/src/history.ts))
- 管理编辑记录
- 实现撤销/重做功能
- 快照管理

#### 4.2.4 工具栏模块 ([toolbar.ts](file:///Users/xiaoshizi/Documents/GitHub/Sidetation/src/toolbar.ts))
- 工具栏 UI 实现
- 修改记录面板
- 按钮事件处理

#### 4.2.5 选择器模块 ([selector.ts](file:///Users/xiaoshizi/Documents/GitHub/Sidetation/src/selector.ts))
- 生成稳定的 CSS 选择器
- 过滤 CSS-in-JS 哈希类名

#### 4.2.6 导出模块 ([export.ts](file:///Users/xiaoshizi/Documents/GitHub/Sidetation/src/export.ts))
- 生成 Markdown 格式输出
- 生成 CSS 格式输出

#### 4.2.7 样式模块 ([styles.ts](file:///Users/xiaoshizi/Documents/GitHub/Sidetation/src/styles.ts))
- 内置样式定义
- Shadow DOM 样式

#### 4.2.8 应用模块 ([apply.ts](file:///Users/xiaoshizi/Documents/GitHub/Sidetation/src/apply.ts))
- 将编辑记录应用到 DOM
- 处理 transform、width、height 等样式

#### 4.2.9 吸附模块 ([snap.ts](file:///Users/xiaoshizi/Documents/GitHub/Sidetation/src/snap.ts))
- 计算吸附位置
- 生成参考线

#### 4.2.10 类型定义 ([types.ts](file:///Users/xiaoshizi/Documents/GitHub/Sidetation/src/types.ts))
- TypeScript 接口定义
- 数据结构定义

### 4.3 数据结构

#### EditRecord（编辑记录）
```typescript
interface EditRecord {
  id: number;
  el: HTMLElement;
  selector: string;
  tag: string;
  originalRect: Rect;
  savedInline: { transform: string; width: string; height: string; display: string };
  baseTransform: string;
  baseDisplay: string;
  sizeAdj: { w: number; h: number };
  dx: number;
  dy: number;
  moved: boolean;
  resized: boolean;
  deleted: boolean;
  startSize: { w: number; h: number };
  size: { w: number; h: number };
  props: Record<string, string>;
  savedProps: Record<string, string>;
}
```

#### SidetationOptions（配置选项）
```typescript
interface SidetationOptions {
  autoStart?: boolean;        // 初始化后立即激活编辑模式
  snapThreshold?: number;     // 吸附阈值（像素）
}
```

## 5. 使用场景

### 5.1 场景一：设计师快速验证设计
**用户**：网页设计师
**流程**：
1. 在浏览器中打开开发中的网站
2. 通过书签或控制台注入 Sidetation
3. 开始编辑，拖拽调整元素位置和大小
4. 复制 CSS 样式，发给开发者或直接粘贴到项目中

### 5.2 场景二：开发者配合 AI 编码
**用户**：前端开发者
**流程**：
1. 在自己的项目中引入 Sidetation（开发环境）
2. 激活编辑模式，调整页面布局
3. 复制 Markdown 格式的修改记录
4. 粘贴到 Claude Code / Cursor 中，让 AI 实现修改

### 5.3 场景三：产品经理提出修改建议
**用户**：产品经理
**流程**：
1. 在测试环境页面上注入 Sidetation
2. 直观地调整页面元素
3. 复制修改记录，作为需求文档的一部分

## 6. 未来规划

### 6.1 短期目标
- 支持更多 CSS 属性的直接编辑
- 添加网格对齐功能
- 支持保存和加载编辑会话

### 6.2 长期目标
- 支持多人协作编辑
- 提供云端存储功能
- 与更多 AI 编码工具深度集成

## 7. 风险与挑战

### 7.1 技术风险
- **CSP 限制**：某些网站的内容安全策略可能限制 bookmarklet 注入
  - 缓解措施：提供控制台注入方式作为备选

- **CSS-in-JS 哈希类名**：动态生成的类名可能导致选择器不稳定
  - 缓解措施：在生成选择器时过滤哈希类名

### 7.2 用户体验风险
- **文档流破坏**：使用 transform 可能导致用户误解实际效果
  - 缓解措施：在导出 Markdown 时明确提示 AI 使用合理的布局属性

## 8. 成功指标

- 下载量 / 安装量
- GitHub Star 数
- 社区反馈和 Issue 数量
- 在 AI 编码社区中的提及频率
