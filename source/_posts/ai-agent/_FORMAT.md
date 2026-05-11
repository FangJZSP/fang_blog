# AI Agent 学习系列 — 格式约定

## 文件命名

```
agent-N-{slug}.md
```

- `N`: 序号，从 1 开始递增
- `slug`: 本期主题的英文简述，小写单词，连字符分隔

示例: `agent-1-langchain-minimal-agent.md`

## 文件位置

所有系列文章放在 `source/_posts/ai-agent/` 目录下。

## 前置元数据（Frontmatter）

```yaml
---
title: AI Agent 学习 #N: {中文主题标题}
date: YYYY-MM-DD HH:MM:SS
categories:
  - 技术
tags:
  - AIGC
  - AI-Agent
  - {本期特化 tag 1}
  - {本期特化 tag 2}
desc: {一句话概括本期知识点}
---
```

### tags 规则

- 前两个 tag **固定**：`AIGC`、`AI-Agent`
- 后续 tag 按本期内容添加，如 `LangChain`、`Tool-Calling`、`OpenAI`、`System-Prompt` 等
- 多词标签用连字符，每个词首字母大写

## 正文结构

每篇文章遵循以下结构：

```
## 完整代码
（如果需要先展示完整代码）

## 这个 Agent / 这段代码做了什么
（用自然语言描述整体流程，搭配 ASCII 流程图）

## 知识点拆解
### N. 知识点 1
### N. 知识点 2
...

## 整体架构图
（ASCII 框图总结）

## 关键要点
（编号列表，每条一句话）

---

```

## 写作风格

- 代码块统一用 markdown fence（```javascript）
- 流程图用 ASCII art，内嵌在代码块中（无语言标注或标为纯文本）
- 表格优先用于对比和结构说明
- 知识点拆解用小标题 + 代码片段 + 说明三段式
- 术语首次出现用 **加粗**，中英文对照用括号标注

## 示例 frontmatter

```yaml
---
title: AI Agent 学习 #1: LangChain 最小化 Agent — tool binding 与多轮推理循环
date: 2026-05-11 16:00:00
categories:
  - 技术
tags:
  - AIGC
  - AI-Agent
  - LangChain
  - Tool-Calling
desc: 通过一份 LangChain 最小化 Agent 代码，拆解 Agent 的核心运行机制—tool binding、多轮推理循环、ToolMessage 回传。
---
```