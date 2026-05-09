## Context

从零开始搭建个人技术博客。当前仓库为空（仅有 `.git` 和 `openspec/`），需要初始化 Hexo 工程并使用「活版印字」主题，最终部署到 GitHub Pages。

约束：
- 托管平台：GitHub Pages（`<username>.github.io/<repo>` 或自定义域名）
- 主题：hexo-theme-typography（活版印字），基于 Pug 模板引擎
- 代码高亮：hexo-prism-plugin（主题要求替换默认高亮）

## Goals / Non-Goals

**Goals:**
- 在仓库根目录初始化 Hexo 工程
- 安装 hexo-theme-typography 主题及其依赖插件
- 配置站点元数据、主题参数、插件参数
- 配置 GitHub Pages 自动部署（推送即发布）
- 创建一篇示例文章验证全流程

**Non-Goals:**
- 自定义域名配置（后续按需添加）
- 评论系统接入（Disqus/LiveRe，后续按需配置）
- Google Analytics 接入（后续按需配置）
- 主题 SCSS 源码修改（使用默认样式）
- 多语言支持（使用默认中文）

## Decisions

### 静态站点生成器：Hexo

选择 Hexo 是因为用户明确指定。相比 Jekyll/Hugo/Gatsby，Hexo 的优势在于 Node.js 生态、丰富的插件系统、中文社区支持良好。

### 部署方式：hexo-deployer-git

使用 `hexo-deployer-git` 插件直接将生成的静态文件推送到 `gh-pages` 分支。相比 GitHub Actions 方式更简单直接，无需额外 CI 配置。后续如需更复杂的构建流程可迁移到 GitHub Actions。

### 主题安装方式：直接克隆

将主题直接克隆到 `themes/typography/` 目录。使用 `.gitignore` 排除主题的 `.git` 目录以避免子模块管理复杂度。

### 插件组合

按照主题要求的依赖清单：
- `hexo-renderer-pug` — Pug 模板编译（主题使用 Pug）
- `hexo-generator-archive` — 归档页面生成
- `hexo-generator-category-enhance` — 增强分类页（替换默认 `hexo-generator-category`）
- `hexo-generator-feed` — RSS/Atom 订阅
- `hexo-generator-tag` — 标签页生成
- `hexo-prism-plugin` — 代码语法高亮

## Risks / Trade-offs

- **风险：hexo-theme-typography 最后更新于 2018 年，可能与最新 Hexo 版本不兼容** → 锁定 Hexo 版本或准备回退方案
- **风险：部分插件（hexo-generator-category-enhance）可能已无人维护** → 如遇到问题可回退使用默认分类生成器
- **权衡：直接克隆而非 git submodule 管理主题** → 优势是简单，劣势是更新主题不便。对于稳定版本的主题，简单性优先

## Migration Plan

不涉及迁移——这是全新搭建。

部署步骤：
1. 本地初始化并验证 `hexo server` 正常运行
2. 配置 `hexo-deployer-git` 指向仓库的 `gh-pages` 分支
3. 执行 `hexo deploy` 验证部署成功
4. 在 GitHub 仓库设置中启用 GitHub Pages，选择 `gh-pages` 分支

## Open Questions

- 是否使用自定义域名？目前默认使用 `https://<username>.github.io/<repo>/`
- GitHub Pages 选择 `/docs` 文件夹还是 `gh-pages` 分支？默认使用 `gh-pages` 分支方式
