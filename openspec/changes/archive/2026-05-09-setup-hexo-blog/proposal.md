## Why

需要一个个人技术博客来记录和分享文章。Hexo 是一个快速、简洁的静态博客框架，配合「活版印字」(hexo-theme-typography) 主题提供优雅的排版设计，部署到 GitHub Pages 可以实现零成本托管。

## What Changes

- 在本仓库中初始化 Hexo 博客工程
- 安装并配置 hexo-theme-typography 主题（活版印字）
- 配置代码高亮（Prism）、分类增强、标签页、RSS/Atom 订阅等插件
- 配置 GitHub Pages 自动部署（通过 GitHub Actions 或 hexo-deployer-git）
- 编写一篇示例文章验证整体流程

## Capabilities

### New Capabilities

- `blog-setup`: Hexo 博客工程初始化，包含站点元数据配置（标题、描述、语言、URL 等）
- `theme-typography`: 活版印字主题安装与配置，包含配色方案、社交链接、评论系统、SEO 等
- `github-pages-deploy`: GitHub Pages 部署配置，实现推送代码后自动构建发布

### Modified Capabilities

<!-- No existing capabilities to modify -->

## Impact

- 仓库根目录将新增 Hexo 工程文件（`_config.yml`、`source/`、`themes/`、`scaffolds/` 等）
- 需要安装 Node.js 依赖：hexo、hexo-renderer-pug、hexo-prism-plugin、hexo-generator-* 等
- `.github/workflows/` 将包含 GitHub Actions 部署配置
- 主题以 git submodule 或直接克隆方式引入
