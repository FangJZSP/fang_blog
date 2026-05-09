---
title: 使用 OpenSpec 管理项目变更
date: 2026-05-09 16:00:00
categories:
  - 技术
tags:
  - AIGC
  - OpenSpec
  - 工作流
  - 工具
desc: 介绍如何使用 OpenSpec 的 propose → apply → archive 工作流来结构化地管理项目变更。
---

## 什么是 OpenSpec

OpenSpec 是一套**结构化变更管理**工作流，将每个改动封装为独立的 change，通过 `propose → apply → archive` 三个阶段确保变更可追溯、可审查。

## 核心工作流

### 1. Propose（提案）

运行 `/openspec-propose` 描述你的需求，系统会自动生成 4 个制品：

| 制品                | 用途                          |
|-------------------|-----------------------------|
| `proposal.md`     | 为什么要做这个变更，变更范围是什么           |
| `design.md`       | 技术方案，关键决策与理由，风险权衡           |
| `specs/*/spec.md` | 可测试的需求规格，每个需求含 WHEN/THEN 场景 |
| `tasks.md`        | 按依赖排序的实施任务清单                |

### 2. Apply（实施）

运行 `/openspec-apply` 开始逐项执行任务清单。每个任务完成后自动勾选 `[x]`，进度实时可见。

``` bash
# 示例：tasks.md 中的任务结构
## 1. 初始化
- [x] 1.1 创建项目结构
- [x] 1.2 安装依赖

## 2. 核心功能
- [x] 2.1 实现数据导出
- [ ] 2.2 添加单元测试
```

### 3. Archive（归档）

所有任务完成后运行 `/openspec-archive`，将 change 目录归档到 `openspec/changes/archive/`，delta specs 同步到主 specs
目录。归档后的目录结构：

```
openspec/changes/archive/
└── 2026-05-09-setup-hexo-blog/
    ├── proposal.md
    ├── design.md
    ├── specs/
    ├── tasks.md
    └── .openspec.yaml
```

## 实践案例：搭建本博客

以搭建这个 Hexo 博客为例，完整流程如下：

1. **Propose**：描述"搭建 Hexo 博客，使用 Typography 主题，部署到 GitHub Pages"
2. 系统生成 3 个 capability specs（blog-setup、theme-typography、github-pages-deploy）和 22 个实施任务
3. **Apply**：依次完成 Hexo 初始化、主题安装、插件配置、GitHub Pages 部署
4. **Archive**：归档到 `2026-05-09-setup-hexo-blog`，specs 同步到主目录

## 小结

OpenSpec 的优势在于：

- **结构化**：proposal → design → specs → tasks 的清晰链路
- **可追溯**：每个变更独立归档，含完整上下文
- **可测试**：specs 中的 WHEN/THEN 场景可直接作为测试用例
- **渐进式**：不需要一次性做完所有事情，任务清单支持暂停和继续
