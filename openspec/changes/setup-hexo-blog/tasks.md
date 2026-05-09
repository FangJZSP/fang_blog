## 1. Hexo 工程初始化

- [x] 1.1 在仓库根目录执行 `hexo init .` 初始化 Hexo 工程
- [x] 1.2 修改 `_config.yml` 站点元数据（title、subtitle、description、author、language: zh-CN、timezone、url）
- [x] 1.3 执行 `npm install` 安装 Hexo 基础依赖
- [x] 1.4 执行 `hexo server` 验证博客可本地预览

## 2. 主题安装

- [x] 2.1 卸载默认分类插件：`npm uninstall hexo-generator-category`
- [x] 2.2 安装主题依赖插件：`hexo-renderer-pug`、`hexo-generator-archive`、`hexo-generator-category-enhance`、`hexo-generator-feed`、`hexo-generator-tag`、`hexo-prism-plugin`、`hexo-deployer-git`
- [x] 2.3 克隆 hexo-theme-typography 到 `themes/typography/`
- [x] 2.4 在主题目录执行 `npm install` 安装主题自身的依赖（跳过 — node-sass 与 Node 25 不兼容，预编译 CSS 已存在于主题中）
- [x] 2.5 在根 `_config.yml` 中设置 `theme: typography`，禁用内置高亮（`highlight.enable: false`）

## 3. 插件与主题配置

- [x] 3.1 根 `_config.yml` 配置 prism_plugin（`mode: preprocess`、`theme: default`、`line_number: true`）
- [x] 3.2 根 `_config.yml` 配置 archive_generator（`per_page: 0`）、category_generator（`per_page: 10`、`enable_index_page: true`）、tag_generator（`per_page: 10`、`enable_index_page: true`）
- [x] 3.3 根 `_config.yml` 配置 feed（`type: atom`、`path: atom.xml`、`limit: 20`）
- [x] 3.4 配置主题 `_config.yml`：设置 title_primary、title_secondary、themeStyle: light、truncate_len、社交链接（github 填写，其余留空）

## 4. GitHub Pages 部署配置

- [x] 4.1 根 `_config.yml` 配置 deploy 段（`type: git`、`repo:` 指向当前仓库地址、`branch: gh-pages`）
- [x] 4.2 创建 `.gitignore`，排除 `public/`、`node_modules/`、`themes/typography/.git/`
- [x] 4.3 执行 `hexo generate` 生成静态文件，验证 `public/` 目录正常产出
- [x] 4.4 执行 `hexo deploy` 部署到 GitHub Pages
- [x] 4.5 在 GitHub 仓库 Settings > Pages 中将 source 设置为 `gh-pages` 分支（已自动生效）
- [x] 4.6 通过 `https://fangjzsp.github.io/fang_blog/` 验证博客可正常访问

## 5. 示例内容与收尾

- [x] 5.1 创建一篇示例文章（`hexo new "Hello World"`），包含代码块、分类、标签
- [x] 5.2 重新生成并部署，验证文章样式、归档页、分类页、标签页、Atom feed 均正常
- [ ] 5.3 将所有配置和源代码提交到 main 分支
