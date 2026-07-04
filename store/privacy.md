# 隐私权规范填写指南（Privacy practices）

开发者控制台「隐私权规范」标签页逐项对应：

## 单一用途说明（Single purpose description）

```
在用户主动点击扩展图标的页面上提供可视化编辑工具（拖拽/缩放/样式编辑），并将修改记录导出到剪贴板。除此之外无任何功能。
```

## 权限理由（Permission justifications）

**activeTab：**

```
仅在用户点击扩展图标时，向当前标签页注入编辑器脚本。扩展不需要也不请求对所有网站的常驻访问权限。
```

**scripting：**

```
配合 activeTab 使用 chrome.scripting.executeScript 注入编辑器代码。这是 Manifest V3 下注入脚本的唯一方式。
```

## 数据使用（Data usage）

- 是否收集用户数据：**否**（所有复选框留空）
- 扩展不采集、不存储、不传输任何用户数据
- 无远程代码：**是，不使用远程代码**（所有代码打包在扩展内，无任何网络请求）

## 认证声明（Certification）

勾选「我确认此商品的数据使用方式符合……」即可——本扩展确实不涉及任何数据收集。

## 隐私政策 URL（Privacy policy，可选但建议填写）

如需 URL，可在官网加一个隐私页；临时可填 GitHub README：

```
https://github.com/tllll64/Sidetation#readme
```
