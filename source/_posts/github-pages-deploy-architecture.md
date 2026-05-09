---
title: GitHub Pages 部署原理：双分支架构与安全性
date: 2026-05-09 18:00:00
categories:
  - 技术
tags:
  - AIGC
  - GitHub Pages
  - Hexo
  - 部署
  - 安全
desc: 深入理解 main 与 gh-pages 双分支分工、敏感信息防护，以及 hexo-deployer-git 的工作机制。
---
## 为什么要两个分支？

```
fang_blog/
├── main (源代码)       ──→  只有你可见的管理视角
└── gh-pages (静态站点) ──→  GitHub Pages 对外服务
```

### main 分支 — 源代码

存放 Hexo 工程的所有**源文件**，不上线：

```
main:
├── _config.yml          # 站点配置
├── package.json         # 依赖声明
├── source/_posts/       # Markdown 文章
├── themes/typography/   # 主题文件
├── scaffolds/           # 模板
└── .gitignore           # 忽略规则
```

### gh-pages 分支 — 发布产物

存放 `hexo generate` 生成的**静态文件**，由 GitHub Pages 直接对外服务：

```
gh-pages:
├── index.html           # 首页
├── 2026/05/09/
│   ├── hello-world/index.html
│   ├── hexo-typography-guide/index.html
│   └── openspec-guide/index.html
├── archives/index.html
├── categories/index.html
├── tags/index.html
├── atom.xml
├── css/
├── js/
└── fonts/
```

gh-pages 上只有 HTML、CSS、JS、图片等**浏览器可直接渲染的静态资源**，没有任何源代码或配置文件。

---

## 敏感信息安全吗？

### ghp_ 已确认：没有泄露

逐项排查：

| 检查项 | 状态 | 说明 |
|---|---|---|
| API Key / Token | 无 | 配置文件不含任何密钥 |
| 密码 | 无 | 不涉及 |
| GitHub Token | 无 | `hexo-deployer-git` 通过本地 Git 凭据推送，token 不被写入文件 |
| 邮箱 | 仅 git log | commit 中的邮箱是公开信息，且仅存在于 main 分支 |
| 数据库 | 无 | 静态博客不涉及数据库 |
| `_config.yml` | 公开 | 仅有标题、URL、GitHub 用户名等公开信息 |

### 三层防护

```
┌─────────────────────────────────────┐
│ 1. .gitignore                       │
│    排除 node_modules/ public/       │
│    .deploy*/ db.json                │
│    themes/typography/.git/          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ 2. main 分支只有源代码              │
│    不会直接暴露给公网               │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ 3. gh-pages 分支只有编译产物        │
│    纯静态 HTML/CSS/JS               │
│    无 config、无源码、无密钥        │
└─────────────────────────────────────┘
```

### 容易忽略的点

- **`_config.yml` 中不要写 token**：部署凭据用 SSH key 或系统级的 git credential，不要写入文件
- **主题的 `google-analytics.js`**：如果启用了 GA，修改 tracking ID 后确保只推公开的 ID（GA tracking ID 本身是公开的）
- **`package.json`** 中 `"private": true` 是 npm 的标记，不是敏感信息

---

## 部署流程详解

### hexo-deployer-git 做了什么

运行 `hexo deploy` 时的完整过程：

```
hexo generate
      │
      ▼
┌──────────────┐
│  source/     │  Markdown + 主题资源
│  themes/     │──────▶ hexo 渲染引擎
│  _config.yml │
└──────────────┘
      │
      ▼
┌──────────────┐
│  public/     │  纯静态站点
│  *.html      │  (被 .gitignore 排除)
│  css/ js/    │
└──────────────┘
      │
      ▼  hexo deploy
┌──────────────────────────────────────┐
│ .deploy_git/  (临时目录)            │
│                                      │
│ 1. git init                          │
│ 2. 复制 public/ → .deploy_git/      │
│ 3. git commit                        │
│ 4. git push → origin/gh-pages       │
│    (force push，完全覆盖)            │
└──────────────────────────────────────┘
```

每次 deploy 都是**覆盖式推送**：gh-pages 分支永远精确反映最近一次 `hexo generate` 的输出，不会残留旧文件。

### GitHub Pages 如何挂载

```
GitHub 仓库 Settings → Pages
                          │
                  ┌───────┴───────┐
                  │ Build and     │
                  │ deployment    │
                  │               │
                  │ Source:       │
                  │ Deploy from   │
                  │ a branch   ✓  │
                  │               │
                  │ Branch:       │
                  │ gh-pages  ✓   │
                  │ / (root)  ✓   │
                  └───────┬───────┘
                          │
                          ▼
              https://fangjzsp.github.io/fang_blog/
```

GitHub Pages 会监听 `gh-pages` 分支的更新，每次 push 后几秒内自动刷新站点。对于**项目站点**（`username.github.io/repo`），需要设置 `root: /repo/` 确保资源路径正确。

### 两种 Pages 类型对比

| | 用户/组织站点 | 项目站点 |
|---|---|---|
| 仓库名 | `<user>.github.io` | 任意（如 `fang_blog`） |
| URL | `https://<user>.github.io/` | `https://<user>.github.io/<repo>/` |
| Pages 分支 | `main` 或 `gh-pages` | `gh-pages` |
| root 配置 | `/` | `/<repo>/` |
| 数量限制 | 每个账号 1 个 | 每个仓库 1 个 |

本博客属于**项目站点**，所以 root 设为 `/fang_blog/`。

---

## 日常发文流程

``` bash
# 1. 写文章
hexo new "文章标题"
# 编辑 source/_posts/文章标题.md

# 2. 本地预览（可选）
hexo server

# 3. 生成 + 部署
hexo generate
hexo deploy

# 4. 提交源文件到 main
git add source/_posts/
git commit -m "新增文章：xxx"
git push origin main
```

## 总结

- **main** = 你的工作台，存放源码，不对外
- **gh-pages** = 展示橱窗，只有编译后的静态文件，对外服务
- **敏感信息不会泄露**，因为 source 不上 gh-pages，且 gh-pages 只有纯静态资源
- 每次 deploy 都是完整覆盖，干净无残留
