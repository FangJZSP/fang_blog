---
title: Hexo 入门与 Typography 主题使用指南
date: 2026-05-09 17:00:00
categories:
  - 技术
tags:
  - AIGC
  - Hexo
  - Typography
  - 博客
desc: 从零掌握 Hexo 静态博客框架，以及活版印字主题的配置与定制技巧。
---

## Hexo 基础

### 安装

``` bash
npm install -g hexo-cli
hexo init my-blog
cd my-blog
npm install
```

### 常用命令

| 命令                | 作用                                |
|-------------------|-----------------------------------|
| `hexo server`     | 启动本地预览，默认 `http://localhost:4000` |
| `hexo new "文章标题"` | 在 `source/_posts/` 创建新文章          |
| `hexo generate`   | 生成静态文件到 `public/` 目录              |
| `hexo deploy`     | 部署到远程服务器（需配置 deploy 段）            |
| `hexo clean`      | 清除缓存和静态文件                         |

### 文章 Front-matter

每篇文章顶部的 YAML 配置：

``` yaml
---
title: 文章标题
date: 2026-05-09 17:00:00
categories:
  - 技术
tags:
  - Hexo
  - 博客
desc: 文章摘要，用于 SEO 描述和列表展示
---
```

### 目录结构

```
.
├── _config.yml          # 站点配置
├── source/
│   └── _posts/          # 文章（Markdown）
├── themes/              # 主题目录
├── scaffolds/           # 文章模板
└── public/              # 生成的静态站点（不提交 Git）
```

### 根 `_config.yml` 关键配置

``` yaml
# 站点信息
title: 放的博客
subtitle: ''
description: 个人技术博客
author: 放
language: zh-CN
timezone: Asia/Shanghai

# URL —— GitHub Pages 项目站点需设置 root
url: https://fangjzsp.github.io/fang_blog/
root: /fang_blog/

# 代码高亮（使用 Prism 插件时需关闭内置）
highlight:
  enable: false

# 部署到 GitHub Pages
deploy:
  type: git
  repo: https://github.com/FangJZSP/fang_blog.git
  branch: gh-pages
```

---

## Typography 主题

### 安装

主题和依赖插件需一起安装：

``` bash
# 1. 卸载默认分类插件
npm uninstall hexo-generator-category

# 2. 安装主题依赖
npm install hexo-renderer-pug hexo-generator-archive \
  hexo-generator-category-enhance hexo-generator-feed \
  hexo-generator-tag hexo-prism-plugin hexo-deployer-git

# 3. 克隆主题
git clone https://github.com/SumiMakito/hexo-theme-typography \
  themes/typography

# 4. 根 _config.yml 中设置
# theme: typography
```

### 主题 `_config.yml` 配置

主题自身的配置文件位于 `themes/typography/_config.yml`：

``` yaml
# 双标题显示
title_primary: "放的博客"     # 主标题（大字）
title_secondary: "Fang's Blog" # 副标题（小字）

# 自动截取摘要长度
truncate_len: 160

# 配色方案 —— light 或 dark
themeStyle: light

# 社交链接（留空则不显示图标）
github: FangJZSP
twitter:        # 不填 = 隐藏
weibo:          # 不填 = 隐藏
instagram:      # 不填 = 隐藏

# 显示控制
showPageCount: true
showCategories: true
showTags: true

# 评论系统（二选一，留空 = 不启用）
disqus:         # Disqus shortname
livere:         # LiveRe data-uid
```

### 插件配置（根 `_config.yml`）

``` yaml
# Prism 代码高亮
prism_plugin:
  mode: preprocess
  theme: default
  line_number: true

# 归档 —— 不分页，全部列出
archive_generator:
  per_page: 0

# 分类页
category_generator:
  per_page: 10
  enable_index_page: true

# 标签页
tag_generator:
  per_page: 10
  enable_index_page: true

# Atom 订阅
feed:
  type: atom
  path: atom.xml
  limit: 20
```

### 支持的页面类型

启用对应插件后，主题会自动生成：

| 路径               | 内容       |
|------------------|----------|
| `/archives`      | 全部文章归档   |
| `/categories`    | 分类列表     |
| `/categories/技术` | 某分类下的文章  |
| `/tags`          | 标签列表     |
| `/tags/Hexo`     | 某标签下的文章  |
| `/atom.xml`      | Atom 订阅源 |

### 每篇文章的 SEO

在 front-matter 中设置 `desc` 字段会自动生成 `<meta name="description">`：

``` yaml
desc: 这篇文章会讲清楚 Hexo 和 Typography 的用法。
```

不设 `desc` 时，主题会用 `truncate_len` 自动截取正文前 N 个字符作为摘要。

---

## 进阶定制

### 修改样式

主题使用 SCSS 编写样式，源文件在 `themes/typography/raw/scss/`：

```
raw/scss/
├── style.scss        # 主样式（亮色）
├── style-dark.scss   # 暗色样式
└── animation.scss    # 动画
```

修改后需编译：

``` bash
cd themes/typography
npm install    # 安装 node-sass（需要 Node ≤ 16）
npm run build  # 编译并压缩 CSS
```

如果 Node 版本过新导致 `node-sass` 编译失败，可以直接修改 `source/css/` 下的编译产物。

### 修改模板

所有 Pug 模板位于 `themes/typography/layout/`：

```
layout/
├── index.pug         # 首页
├── post.pug          # 文章页
├── archive.pug       # 归档页
├── category.pug      # 分类页
├── tag.pug           # 标签页
├── category-index.pug
├── tag-index.pug
├── page.pug
├── mixins.pug        # 可复用混入
└── partial/
    ├── head.pug      # <head> 标签
    ├── nav.pug       # 导航栏
    ├── sidebar.pug   # 侧边栏
    ├── footer.pug    # 页脚
    ├── comments.pug  # 评论区
    └── layout.pug    # 整体布局骨架
```

### 多语言

语言文件在 `themes/typography/languages/`，默认支持中文、英文、韩文。修改 `zh-cn.yml` 可以调整界面文案。

---

## 发文流程总结

``` bash
# 1. 写文章
hexo new "我的新文章"

# 2. 本地预览
hexo server

# 3. 生成并部署
hexo generate
hexo deploy
```

三步即可让新文章上线。
