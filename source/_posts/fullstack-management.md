---
title: 全栈工作区管理指南 — Git Submodule + OpenSpec + Claude Code 多仓协作实践
date: 2026-05-09
tags:
  - AIGC
  - git
  - submodule
  - openspec
  - 全栈
  - 工作流
  - 工程化
---

## 背景

我的 IM 聊天应用项目技术栈横跨三端：

| 端     | 技术栈                                   | 仓库                 |
|-------|---------------------------------------|--------------------|
| 后端    | Go + GoFrame v2 + MySQL + Redis + NSQ | `go_relaxing`      |
| 移动端   | Flutter 3.38 + Dart + GetX            | `flutter_relaxing` |
| Web 端 | Vue 3 + TypeScript + Vite + Pinia     | `web_relaxing`     |

三端各有独立的 Git 仓库和开发节奏，但功能开发往往是跨端的——加一个群管理功能，后端出 API，移动端和 Web 端各自实现 UI。

单体 Monorepo 太重，三仓独立又太散。最终选择了 **Git Submodule** 方案：用一个父仓库把三个子仓库"钉"在一起，同时保留各自的独立性和版本历史。

---

## 工作区总览

```
relaxing/                         # 父仓库
├── .gitmodules                   # 子模块配置
├── .claude/                      # Claude Code 技能 & 命令
│   ├── commands/opsx/            # /opsx:propose 等命令定义
│   └── skills/                   # OpenSpec 技能
├── openspec/                     # 规格驱动开发（SDD）
│   ├── project.md                # 项目技术栈和架构说明
│   ├── AGENTS.md                 # OpenSpec 工作流指引
│   ├── config.yaml               # OpenSpec 配置和规则
│   ├── specs/                    # 已归档的能力规格
│   └── changes/                  # 正在进行的变更
│       ├── complete-group-management/
│       ├── message-read-receipt-sync/
│       └── archive/              # 已完成的变更归档
├── go_relaxing/                  # [子模块] 后端
├── flutter_relaxing/             # [子模块] 移动端
└── web_relaxing/                 # [子模块] Web 端
```

**父仓库负责**：`openspec/`（规格文档）、`.claude/`（AI 配置）、`.gitmodules`（子模块引用）。这些文件不属于任何单一端，是工作区的"
元信息"。

**子模块各自负责**：自己的代码、依赖、构建配置。

---

## 核心工作流

### 1. 规格驱动：OpenSpec

整个开发的起点是 `openspec/` 下的规格文档。当需要开发一个新功能时：

```bash
# 创建变更提案（AI 自动调研代码库、生成 proposal/design/specs/tasks）
/opsx:propose 添加群消息已读状态查询功能

# 实施变更（AI 按 tasks.md 逐步实现后端 → Flutter → Web）
/opsx:apply

# 完成后归档
/opsx:archive
```

每个变更目录包含四个核心文档：

- `proposal.md` — 为什么要做、影响范围
- `design.md` — 技术方案和关键决策
- `specs/*.md` — 能力规格（场景 + WHEN/THEN 格式）
- `tasks.md` — 可勾选的实施任务清单

所有 OpenSpec 文档统一用中文，放在根目录 `openspec/` 下，不分散在各端子目录。

### 2. 开发顺序

tasks.md 中的任务严格按端排序：**后端 → Flutter → Web**。后端 API 先实现，客户端再接上。

Claude Code 在实施时会：

1. 读取 `openspec/project.md` 了解项目架构
2. 读取 `openspec/config.yaml` 获取规则（中文文档、任务分端等）
3. 按 tasks.md 逐任务实施，完成后自动勾选 `[x]`

### 3. Harness 思维

全栈 AI 开发最大的坑是风格不统一。解决方法：**给 AI 一个已有的功能实现当模板**。

比如要添加"删除账户"功能，AI 会参考已有的 `UpdateUser` 实现——模仿它的 Controller → Service → Logic
分层、参数校验方式、命名风格。这样产出的代码和现有代码一脉相承，Review 成本大幅下降。

---

## Git Submodule 维护指南

### 为什么用 Submodule 而不是 Monorepo

- 三个仓库有不同的开发节奏和发布周期
- 各自的 CI/CD、依赖管理、代码规范独立
- 但跨端功能开发时需要同时看到三端代码
- Submodule 在保留独立性的同时提供了"快照"能力——父仓库记录每个子模块的精确 commit

### 初始化/克隆

```bash
# 首次克隆（带所有子模块）
git clone --recurse-submodules <父仓库URL>

# 如果已经克隆了父仓库但没拉子模块
git submodule update --init --recursive
```

### 日常开发：在子模块中工作

子模块目录就是一个完整的 Git 仓库，可以正常操作：

```bash
cd go_relaxing

# 正常开发流程
git checkout -b feature/new-api
# ... 写代码 ...
git add -A
git commit -m "feat: add message read status API"

# 推送到子模块远程
git push origin feature/new-api
```

**重要**：子模块的更改不会自动反映到父仓库。写完子模块代码后，需要回到父仓库更新引用：

```bash
cd /path/to/relaxing

# 查看子模块变化
git diff --submodule

# 父仓库会看到 go_relaxing 的 commit hash 变了
git add go_relaxing
git commit -m "chore: update go_relaxing submodule"
```

### 更新子模块到最新

```bash
# 方法一：更新所有子模块到远程最新
git submodule update --remote

# 方法二：只更新某个子模块
git submodule update --remote go_relaxing

# 方法三：进入子模块手动拉取
cd go_relaxing
git pull origin main
cd ..
git add go_relaxing
git commit -m "chore: update go_relaxing to latest main"
```

### 切换子模块分支

```bash
# 让子模块跟踪特定分支
git config -f .gitmodules submodule.go_relaxing.branch main
git config -f .gitmodules submodule.flutter_relaxing.branch dev

# 更新到该分支最新
git submodule update --remote
```

### 删除子模块

```bash
# 四步删除法
git submodule deinit go_relaxing
git rm go_relaxing
rm -rf .git/modules/go_relaxing
git commit -m "chore: remove go_relaxing submodule"
```

### 常见问题

**Q: `git status` 显示子模块有 "modified content"？**

A: 说明子模块内部有未提交的更改。进入子模块目录单独处理。

**Q: 切换父仓库分支后子模块对不上？**

A: 父仓库切换分支后，子模块可能指向不同的 commit。运行 `git submodule update` 同步。

**Q: 子模块的代码怎么在 IDE 中正常工作？**

A: 子模块对 IDE 来说就是普通目录。把父仓库目录作为 IDE 工作区根目录打开，IDE 的语义索引会跨仓检索——AI 写后端时能看到前端的调用需求。

**Q: 忘记 `--recurse-submodules` 克隆了怎么办？**

A: 目录为空。运行 `git submodule update --init --recursive` 即可。

---

## 总结

这个工作区的核心思路：

1. **Git Submodule** 把三端代码物理上放在一起，逻辑上保持独立
2. **OpenSpec** 用规格文档驱动全栈开发，前后端契约严格对齐
3. **Claude Code** 作为 AI 编程助手，理解整个工作区上下文，按规格逐步实施
4. **Harness 思维** 让 AI 模仿现有代码风格，保证产出一致性

这套方案的核心价值在于：**用文档对齐意图，用工具串联执行，用子模块管理物理分布**。三者配合，让一个人 + AI 就能高效推进全栈 IM
应用的开发。
