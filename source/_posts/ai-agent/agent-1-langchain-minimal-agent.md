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

⏺ tool-test/ 代码讲解

这个目录是一套渐进式 AI Agent 工具调用学习代码，从零开始逐步构建 Agent 的核心能力——tool binding（工具绑定） 与 多轮推理循环（multi-turn reasoning loop）。

  ---
整体概览

hello-langchain.mjs          ← ① 热身：一次最简单的模型调用
tool-file-read.mjs           ← ② 单工具 Agent：tool binding + 推理循环
all-tools.mjs                ← ③ 工具库：定义 4 个可复用工具
mini-cursor.mjs              ← ④ 多工具 Agent：组合 4 个工具完成复杂任务
my-mcp-server.mjs            ← ⑤ MCP Server：自定义 MCP 协议服务端
langchain-mcp-test.mjs       ← ⑥ 单 MCP Client：LangChain 连接 MCP Server
mcp-test.mjs                 ← ⑦ 多 MCP Client：同时连接多个 MCP Server

  ---
① hello-langchain.mjs — 热身

这几乎是 LangChain 的 "Hello World"，只做一件事：调用模型，打印回复。

User ──► model.invoke("介绍下自己") ──► console.log(response.content)

知识点：
- ChatOpenAI 初始化（modelName、apiKey、baseURL）
- model.invoke() 是最基本的调用方式，传入字符串，返回 AIMessage

  ---
② tool-file-read.mjs — 单工具 Agent

这是第一个真正的 Agent。关键区别：不再是"一问一答"，而是 模型可以决定调用工具来获取外部信息，然后再回答。

┌─────────────────────────────────────────────────────┐
│  User: "读取文件并解释代码"                            │
│                                                     │
│  ┌─ Loop ───────────────────────────────┐           │
│  │  1. modelWithTools.invoke(messages)   │           │
│  │  2. 检查 response.tool_calls          │           │
│  │     ├─ 有 tool_calls ─► 执行工具      │           │
│  │     │    └─ 推入 ToolMessage 回消息列表  │           │
│  │     └─ 无 tool_calls ─► 最终文本回复   │           │
│  └───────────────────────────────────────┘           │
└─────────────────────────────────────────────────────┘

核心概念：

┌──────────────┬─────────────────────────────────────────────────────────────────────────────┐
│     概念     │                                    说明                                     │
├──────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ tool binding │ model.bindTools(tools) — 把工具定义注入模型，模型就"知道"自己有哪些工具可用 │
├──────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ tool_calls   │ 模型输出的不是文本而是工具调用指令，包含 name、args、id                     │
├──────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ ToolMessage  │ 工具执行结果必须包装成 ToolMessage 并带上 tool_call_id 回传给模型           │
├──────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 推理循环     │ while 循环反复调用模型，直到模型不再返回 tool_calls                         │
└──────────────┴─────────────────────────────────────────────────────────────────────────────┘

tool() 的定义三段式：

const readFileTool = tool(
async ({ filePath }) => { /* 实际执行逻辑 */ },  // ① 函数体
{
name: 'read_file',                              // ② 工具名（模型用它识别）
description: '...',                             // ③ 描述（模型用它决策何时调用）
schema: z.object({ filePath: z.string() }),     // ④ Zod schema（参数类型约束）
}
);

  ---
③ all-tools.mjs — 工具库

纯工具定义文件，不包含 Agent 逻辑。定义了 4 个工具：

┌─────────────────┬──────────────┬─────────────────────────────────────────────────┐
│     工具名      │     能力     │                  关键实现细节                   │
├─────────────────┼──────────────┼─────────────────────────────────────────────────┤
│ read_file       │ 读取文件内容 │ fs.readFile + 错误处理                          │
├─────────────────┼──────────────┼─────────────────────────────────────────────────┤
│ write_file      │ 写入文件     │ 自动 mkdir -p 创建父目录                        │
├─────────────────┼──────────────┼─────────────────────────────────────────────────┤
│ execute_command │ 执行系统命令 │ child_process.spawn + stdio: 'inherit' 实时输出 │
├─────────────────┼──────────────┼─────────────────────────────────────────────────┤
│ list_directory  │ 列出目录     │ fs.readdir + 格式化输出                         │
└─────────────────┴──────────────┴─────────────────────────────────────────────────┘

值得注意的设计：execute_command 支持 workingDirectory 参数，让 Agent 可以在指定目录下执行命令，这是 Agent 自动化操作文件系统的关键能力。

  ---
④ mini-cursor.mjs — 多工具 Agent

这是整个目录的"正餐"。组合了 4 个工具，让 Agent 自动完成一个复杂任务：创建 React TodoList 应用。

User Query: "创建一个功能丰富的 React TodoList 应用"
│
▼
┌─────────────────────────────────────┐
│  System Prompt                      │
│  - 定义 Agent 角色                   │
│  - 强调工具的用法规则                 │
│  - 明确反例（不要 cd + workingDir）   │
└─────────────────────────────────────┘
│
▼
┌──── Multi-turn Reasoning Loop ───────┐
│                                      │
│  Turn 1: execute_command             │
│    → "pnpm create vite react-todo..."│
│  Turn 2: write_file                  │
│    → "src/App.tsx" (TodoList 组件)    │
│  Turn 3: write_file                  │
│    → "src/App.css" (渐变样式+动画)    │
│  Turn 4: execute_command             │
│    → "pnpm install"                  │
│  Turn 5: list_directory              │
│    → 确认文件结构                     │
│  ...                                 │
│  Turn N: 模型输出最终文本回复          │
│                                      │
└──────────────────────────────────────┘

关键设计点：

1. System Prompt 工程：明确告诉模型工具的用法，包括 错误示例（反例），这对引导模型正确使用工具至关重要
2. for 循环 + maxIterations：防止无限循环，最大 30 轮
3. model.bindTools(tools)：所有 4 个工具同时绑定，模型自主决定先用哪个后用哪个

  ---
⑤ my-mcp-server.mjs — MCP Server

MCP（Model Context Protocol） 的 Server 端实现。把自己变成一个"工具服务器"，可以被任何 MCP Client 连接。

┌─────────────────────────────────┐
│  my-mcp-server                  │
│                                 │
│  Tool: query_user               │
│    ├─ 输入: userId ("001")       │
│    └─ 输出: 用户信息 ({name,     │
│              email, role})      │
│                                 │
│  Resource: docs://guide         │
│    └─ 使用指南文本               │
│                                 │
│  通信方式: StdioServerTransport  │
│    (标准输入/输出)               │
└─────────────────────────────────┘

对比直接定义 tool 函数 vs MCP Server：

┌──────────┬─────────────────┬────────────────────────┐
│   维度   │ tool() 直接定义 │       MCP Server       │
├──────────┼─────────────────┼────────────────────────┤
│ 复用性   │ 仅当前进程可用  │ 任何 MCP Client 可连接 │
├──────────┼─────────────────┼────────────────────────┤
│ 语言无关 │ 必须用 JS/TS    │ 任何语言实现，协议互通 │
├──────────┼─────────────────┼────────────────────────┤
│ 部署     │ 内嵌            │ 独立进程，可远程       │
├──────────┼─────────────────┼────────────────────────┤
│ 适用场景 │ 快速原型        │ 生产级工具服务         │
└──────────┴─────────────────┴────────────────────────┘

  ---
⑥ langchain-mcp-test.mjs — 单 MCP Client

LangChain 作为 MCP Client 连接自定义 MCP Server，并且利用了 MCP Resource 作为 System Prompt 的内容来源。

// 读取 MCP Server 暴露的 Resource
const res = await mcpClient.listResources();
// 将 Resource 内容拼入 SystemMessage
new SystemMessage(resourceContent)

流程：

langchain-mcp-test.mjs
│
├──► 启动 my-mcp-server 子进程
│         └── 通过 stdio 通信
├──► mcpClient.getTools()
│         └── 获得 query_user 工具
├──► mcpClient.listResources()
│         └── 获得 "使用指南" 文本
├──► model.bindTools(tools) + SystemMessage(resource)
└──► Agent Loop（同前面模式）

  ---
⑦ mcp-test.mjs — 多 MCP Client

终极形态：一个 Agent 同时连接 4 个 MCP Server。

                      ┌──────────────────────┐
                      │   mcp-test.mjs       │
                      │   (MultiServerMCP    │
                      │    Client)           │
                      └──┬───┬───┬───┬──────┘
  ---
⑦ mcp-test.mjs — 多 MCP Client

终极形态：一个 Agent 同时连接 4 个 MCP Server。

                      ┌──────────────────────┐
                      │   mcp-test.mjs       │
                      │   (MultiServerMCP    │
                      │    Client)           │
                      └──┬───┬───┬───┬──────┘
                         │   │   │   │
            ┌────────────┘   │   │   └──────────────┐
            ▼                ▼   ▼                  ▼
     ┌──────────┐  ┌──────────┐ ┌────────────┐ ┌──────────────┐
     │ my-mcp-  │  │ amap-maps│ │ filesystem │ │ chrome-      │
     │ server   │  │ (高德地图)│ │ (文件系统)  │ │ devtools     │
     │ (用户查询)│  │          │ │            │ │ (浏览器控制) │
     └──────────┘  └──────────┘ └────────────┘ └──────────────┘
        stdio         HTTP          stdio           stdio

这个 Agent 可以：搜酒店 → 拿图片 → 打开浏览器 → 分 tab 展示 —— 跨服务编排。

  ---
关键要点

1. Tool Binding 是 Agent 的起点 — model.bindTools(tools) 让模型"知道"自己有什么工具以及何时用
2. 推理循环是 Agent 的核心 — while/for 循环反复调用模型，直到模型决定停止调用工具并输出最终文本
3. ToolMessage 回传不可省略 — 工具执行结果必须包装为 ToolMessage 并带上 tool_call_id，模型才能把工具结果和调用请求对应起来
4. System Prompt 是行为护栏 — 提供工具列表、用法规则、反例，极大影响 Agent 表现
5. maxIterations 是安全阀 — 防止模型陷入无限工具调用循环
6. MCP 将工具解耦为独立服务 — 从进程内 tool() 到独立 MCP Server，实现语言无关、可复用、可远程的工具生态
7. MultiServerMCPClient 支持多 MCP Server 并行 — 一个 Agent 可以同时调度来自不同 MCP Server 的工具，实现跨域编排
