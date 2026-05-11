---
title: AI Agent 学习 #1: 工具调用与 MCP — 从 tool binding 到多 MCP Server 编排
date: 2026-05-11 18:00:00
categories:
  - 技术
tags:
  - AIGC
  - AI-Agent
  - Tool-Calling
  - MCP
  - LangChain
  - System-Prompt
desc: 从单工具 Agent 到多 MCP Server 编排，拆解 tool binding、多轮推理循环、MCP 协议及 MultiServerMCPClient 的工作原理。
---

## 完整代码

本期的代码分布在 7 个文件中，按学习顺序从浅入深：

| 文件 | 定位 | 核心能力 |
|------|------|----------|
| `hello-langchain.mjs` | 热身 | 一次最简单的模型调用 |
| `tool-file-read.mjs` | 单工具 Agent | tool binding + 推理循环 |
| `all-tools.mjs` | 工具库 | 定义 4 个可复用工具 |
| `mini-cursor.mjs` | 多工具 Agent | 组合 4 个工具完成复杂任务 |
| `my-mcp-server.mjs` | MCP Server | 自定义 MCP 协议服务端 |
| `langchain-mcp-test.mjs` | 单 MCP Client | LangChain 连接 MCP Server |
| `mcp-test.mjs` | 多 MCP Client | 同时连接多个 MCP Server |

---

### hello-langchain.mjs

```javascript
import dotenv from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';

dotenv.config();

const model = new ChatOpenAI({
    modelName: process.env.MODEL_NAME || "qwen-coder-turbo",
    apiKey: process.env.OPENAI_API_KEY,
    configuration: {
        baseURL: process.env.OPENAI_BASE_URL,
    },
});

const response = await model.invoke("介绍下自己");
console.log(response.content);
```

---

### tool-file-read.mjs

```javascript
import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';
import { tool } from '@langchain/core/tools';
import { HumanMessage, SystemMessage, ToolMessage } from '@langchain/core/messages';
import fs from 'node:fs/promises';
import { z } from 'zod';

const model = new ChatOpenAI({
  modelName: process.env.MODEL_NAME || "qwen-coder-turbo",
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  configuration: {
      baseURL: process.env.OPENAI_BASE_URL,
  },
});

const readFileTool = tool(
  async ({ filePath }) => {
    const content = await fs.readFile(filePath, 'utf-8');
    return `文件内容:\n${content}`;
  },
  {
    name: 'read_file',
    description: '用此工具来读取文件内容。输入文件路径。',
    schema: z.object({
      filePath: z.string().describe('要读取的文件路径'),
    }),
  }
);

const tools = [readFileTool];
const modelWithTools = model.bindTools(tools);

const messages = [
  new SystemMessage(`你是一个代码助手，可以使用工具读取文件并解释代码。`),
  new HumanMessage('请读取 ./src/tool-file-read.mjs 文件内容并解释代码')
];

let response = await modelWithTools.invoke(messages);
messages.push(response);

while (response.tool_calls && response.tool_calls.length > 0) {
  const toolResults = await Promise.all(
    response.tool_calls.map(async (toolCall) => {
      const tool = tools.find(t => t.name === toolCall.name);
      if (!tool) return `错误: 找不到工具 ${toolCall.name}`;
      return await tool.invoke(toolCall.args);
    })
  );

  response.tool_calls.forEach((toolCall, index) => {
    messages.push(
      new ToolMessage({
        content: toolResults[index],
        tool_call_id: toolCall.id,
      })
    );
  });

  response = await modelWithTools.invoke(messages);
}

console.log(response.content);
```

---

### all-tools.mjs

```javascript
import { tool } from '@langchain/core/tools';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { z } from 'zod';

const readFileTool = tool(
  async ({ filePath }) => {
    const content = await fs.readFile(filePath, 'utf-8');
    return `文件内容:\n${content}`;
  },
  {
    name: 'read_file',
    description: '读取指定路径的文件内容',
    schema: z.object({
      filePath: z.string().describe('文件路径'),
    }),
  }
);

const writeFileTool = tool(
  async ({ filePath, content }) => {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, content, 'utf-8');
    return `文件写入成功: ${filePath}`;
  },
  {
    name: 'write_file',
    description: '向指定路径写入文件内容，自动创建目录',
    schema: z.object({
      filePath: z.string().describe('文件路径'),
      content: z.string().describe('要写入的文件内容'),
    }),
  }
);

const executeCommandTool = tool(
  async ({ command, workingDirectory }) => {
    const cwd = workingDirectory || process.cwd();
    const [cmd, ...args] = command.split(' ');
    return new Promise((resolve) => {
      const child = spawn(cmd, args, {
        cwd,
        stdio: 'inherit',
        shell: true,
      });
      child.on('close', (code) => {
        resolve(code === 0
          ? `命令执行成功: ${command}`
          : `命令执行失败，退出码: ${code}`);
      });
    });
  },
  {
    name: 'execute_command',
    description: '执行系统命令，支持指定工作目录，实时显示输出',
    schema: z.object({
      command: z.string().describe('要执行的命令'),
      workingDirectory: z.string().optional().describe('工作目录'),
    }),
  }
);

const listDirectoryTool = tool(
  async ({ directoryPath }) => {
    const files = await fs.readdir(directoryPath);
    return `目录内容:\n${files.map(f => `- ${f}`).join('\n')}`;
  },
  {
    name: 'list_directory',
    description: '列出指定目录下的所有文件和文件夹',
    schema: z.object({
      directoryPath: z.string().describe('目录路径'),
    }),
  }
);

export { readFileTool, writeFileTool, executeCommandTool, listDirectoryTool };
```

---

### mini-cursor.mjs

```javascript
import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage, ToolMessage } from '@langchain/core/messages';
import { executeCommandTool, listDirectoryTool, readFileTool, writeFileTool } from './all-tools.mjs';

const model = new ChatOpenAI({
    modelName: "qwen-plus",
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
    configuration: {
        baseURL: process.env.OPENAI_BASE_URL,
    },
});

const tools = [readFileTool, writeFileTool, executeCommandTool, listDirectoryTool];
const modelWithTools = model.bindTools(tools);

async function runAgentWithTools(query, maxIterations = 30) {
    const messages = [
        new SystemMessage(`你是一个项目管理助手，使用工具完成任务。
当前工作目录: ${process.cwd()}

重要规则 - execute_command：
- workingDirectory 参数会自动切换到指定目录
- 当使用 workingDirectory 时，绝对不要在 command 中使用 cd
- 错误示例: { command: "cd react-todo-app && pnpm install", workingDirectory: "react-todo-app" }
- 正确示例: { command: "pnpm install", workingDirectory: "react-todo-app" }
`),
        new HumanMessage(query)
    ];

    for (let i = 0; i < maxIterations; i++) {
        const response = await modelWithTools.invoke(messages);
        messages.push(response);

        if (!response.tool_calls || response.tool_calls.length === 0) {
            return response.content;
        }

        for (const toolCall of response.tool_calls) {
            const foundTool = tools.find(t => t.name === toolCall.name);
            if (foundTool) {
                const toolResult = await foundTool.invoke(toolCall.args);
                messages.push(new ToolMessage({
                    content: toolResult,
                    tool_call_id: toolCall.id,
                }));
            }
        }
    }

    return messages[messages.length - 1].content;
}

const case1 = `创建一个功能丰富的 React TodoList 应用：
1. 创建项目：echo -e "n\nn" | pnpm create vite react-todo-app --template react-ts
2. 修改 src/App.tsx，实现完整功能的 TodoList
3. 添加复杂样式：渐变背景、卡片阴影、悬停效果
4. 添加动画：CSS transitions
5. 列出目录确认
`;

await runAgentWithTools(case1);
```

---

### my-mcp-server.mjs

```javascript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const database = {
  users: {
    '001': { id: '001', name: '张三', email: 'zhangsan@example.com', role: 'admin' },
    '002': { id: '002', name: '李四', email: 'lisi@example.com', role: 'user' },
    '003': { id: '003', name: '王五', email: 'wangwu@example.com', role: 'user' },
  }
};

const server = new McpServer({
  name: 'my-mcp-server',
  version: '1.0.0',
});

server.registerTool('query_user', {
  description: '查询数据库中的用户信息。输入用户 ID，返回该用户的详细信息。',
  inputSchema: {
    userId: z.string().describe('用户 ID，例如: 001, 002, 003'),
  },
}, async ({ userId }) => {
  const user = database.users[userId];
  if (!user) {
    return {
      content: [{ type: 'text', text: `用户 ID ${userId} 不存在。` }],
    };
  }
  return {
    content: [{
      type: 'text',
      text: `用户信息：\n- ID: ${user.id}\n- 姓名: ${user.name}\n- 邮箱: ${user.email}\n- 角色: ${user.role}`,
    }],
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

---

### langchain-mcp-test.mjs（单 MCP Client）

```javascript
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage, ToolMessage } from '@langchain/core/messages';

const model = new ChatOpenAI({
    modelName: "qwen-plus",
    apiKey: process.env.OPENAI_API_KEY,
    configuration: { baseURL: process.env.OPENAI_BASE_URL },
});

const mcpClient = new MultiServerMCPClient({
    mcpServers: {
        'my-mcp-server': {
            command: "node",
            args: ["/path/to/my-mcp-server.mjs"]
        }
    }
});

const tools = await mcpClient.getTools();
const modelWithTools = model.bindTools(tools);

// 读取 MCP Server 暴露的 Resource 作为 System Prompt
const res = await mcpClient.listResources();
let resourceContent = '';
for (const [serverName, resources] of Object.entries(res)) {
    for (const resource of resources) {
        const content = await mcpClient.readResource(serverName, resource.uri);
        resourceContent += content[0].text;
    }
}

async function runAgentWithTools(query, maxIterations = 30) {
    const messages = [
        new SystemMessage(resourceContent),
        new HumanMessage(query)
    ];
    // ... 推理循环同 mini-cursor.mjs
}

await runAgentWithTools("查一下用户 002 的信息");
await mcpClient.close();
```

---

### mcp-test.mjs（多 MCP Client）

```javascript
const mcpClient = new MultiServerMCPClient({
    mcpServers: {
        'my-mcp-server': {
            command: "node",
            args: ["/path/to/my-mcp-server.mjs"]
        },
        "amap-maps-streamableHTTP": {
            "url": "https://mcp.amap.com/mcp?key=" + process.env.AMAP_MAPS_API_KEY
        },
        "filesystem": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-filesystem", ...paths]
        },
        "chrome-devtools": {
            "command": "npx",
            "args": ["-y", "chrome-devtools-mcp@latest"]
        },
    }
});

const tools = await mcpClient.getTools();
// tools 现在包含了来自 4 个 MCP Server 的所有工具
// Agent 可以同时调度: 查地图 → 搜酒店 → 打开浏览器 → 展示结果
```

---

## 这个 Agent / 这段代码做了什么

本期代码展示了一条完整的 **Agent 工具调用能力进阶路线**，核心回答一个问题：**模型如何从"只能说话"变成"能动手做事"？**

```
                          ① hello-langchain
                          "介绍下自己" → 模型直接回复
                                │
                                │ 加入 tool binding
                                ▼
                          ② tool-file-read
                          模型发现需要读取文件
                          → 返回 tool_calls 而非文本
                          → 执行工具 → 回传 ToolMessage
                          → 模型拿到文件内容再做回复
                                │
                                │ 扩展到多个工具
                                ▼
                        ③④ mini-cursor
                          read + write + exec + list
                          四个工具组合使用
                          自动完成"创建 React 项目"全流程
                                │
                                │ 工具解耦为独立服务
                                ▼
                        ⑤⑥ MCP 单 Server
                          工具不再内嵌在 Agent 代码里
                          而是运行在独立 MCP Server 进程中
                          Agent 通过 MCP 协议获取工具并调用
                                │
                                │ 多 MCP Server 编排
                                ▼
                          ⑦ MCP 多 Server
                          同时连接 4 个 MCP Server
                          跨服务编排：地图 + 文件 + 浏览器
```

**以 mini-cursor.mjs 为例**，它的执行流程如下：

```
User: "创建 React TodoList 应用"
              │
              ▼
┌─────────────────────────────────────────┐
│  System Prompt                          │
│  角色: 项目管理助手                       │
│  工具清单: read / write / exec / list    │
│  规则: 不要同时使用 cd + workingDirectory │
└─────────────────────────────────────────┘
              │
              ▼
┌──── 多轮推理循环 ──────────── maxIterations=30 ──┐
│                                                   │
│  Turn 1: model → tool_calls                       │
│    execute_command("pnpm create vite...")          │
│    → Vite 项目生成完毕，回传成功消息                │
│                                                   │
│  Turn 2: model → tool_calls                       │
│    write_file("src/App.tsx", "<TodoList 组件>")    │
│    → 写入完毕，回传成功消息                        │
│                                                   │
│  Turn 3: model → tool_calls                       │
│    write_file("src/App.css", "<渐变 + 动画样式>")   │
│    → 写入完毕                                     │
│                                                   │
│  Turn 4: model → tool_calls                       │
│    execute_command("pnpm install", wd:"react-...") │
│    → 安装依赖完毕                                 │
│                                                   │
│  Turn 5: model → tool_calls                       │
│    list_directory("react-todo-app/src")            │
│    → 确认文件结构正确                              │
│                                                   │
│  Turn 6: model → 无 tool_calls                    │
│    → 输出文本: "TodoList 项目创建完成！"            │
│                                                   │
└───────────────────────────────────────────────────┘
```

---

## 知识点拆解

### 1. Tool Binding — 模型如何"获得"工具能力

**Tool Binding（工具绑定）** 是 Agent 的起点。`model.bindTools(tools)` 把工具的 `name`、`description`、`schema` 注入到模型请求中，模型就能在推理时决定"这个任务我需要调用某个工具"。

```javascript
// ① 定义工具 — 三段式
const readFileTool = tool(
  async ({ filePath }) => { /* 执行逻辑 */ },   // 函数体
  {
    name: 'read_file',                           // 工具名
    description: '读取指定路径的文件内容',          // 功能描述
    schema: z.object({                           // 参数 schema
      filePath: z.string().describe('文件路径'),
    }),
  }
);

// ② 绑定 — 模型从此"知道"自己有 read_file 能力
const modelWithTools = model.bindTools([readFileTool]);
```

`description` 是模型决定**何时**调用工具的唯一依据 —— 写得越精准，模型决策越正确。

---

### 2. 推理循环 — 模型如何"反复使用"工具

普通 LLM 调用是 **一问一答**：`model.invoke()` → 拿到文本 → 结束。但 Agent 的调用是 **多轮循环**：

```javascript
// 循环直到模型不再请求工具调用
while (response.tool_calls && response.tool_calls.length > 0) {
  // 执行模型请求的所有工具
  for (const toolCall of response.tool_calls) {
    const tool = tools.find(t => t.name === toolCall.name);
    const result = await tool.invoke(toolCall.args);
    messages.push(new ToolMessage({
      content: result,
      tool_call_id: toolCall.id,      // 关键：id 必须匹配
    }));
  }

  response = await modelWithTools.invoke(messages);  // 再次推理
}
```

**两个关键判断**：

| 模型返回 | 含义 | 动作 |
|----------|------|------|
| `content` 有值、无 `tool_calls` | 模型认为任务完成 | 退出循环，展示最终回复 |
| `tool_calls` 有值 | 模型需要更多外部信息 | 执行工具 → 回传结果 → 继续循环 |

`maxIterations` 是安全阀 —— 防止模型陷入死循环。本代码设为 30。

---

### 3. ToolMessage 回传 — 为什么不能直接用字符串

工具执行结果 **必须** 包装成 `ToolMessage` 回传，而不能直接拼字符串：

```javascript
// ✅ 正确：ToolMessage 带 tool_call_id
messages.push(new ToolMessage({
  content: toolResult,
  tool_call_id: toolCall.id,
}));

// ❌ 错误：直接拼字符串
messages.push(new HumanMessage(toolResult));
```

**原因**：模型在一次推理中可能同时发起多个工具调用（如同时读文件 A 和文件 B），它靠 `tool_call_id` 把每个结果和对应的调用请求匹配起来。不传 `tool_call_id`，模型无法区分哪个结果对应哪个请求。

---

### 4. System Prompt 工程 — 如何引导模型正确使用工具

`mini-cursor.mjs` 的 System Prompt 是一个很好的范例，它的结构是 **角色 + 工具清单 + 规则 + 反例**：

```
角色: 你是一个项目管理助手

工具清单:
1. read_file: 读取文件
2. write_file: 写入文件
3. execute_command: 执行命令（支持 workingDirectory 参数）
4. list_directory: 列出目录

规则（正例 + 反例）:
- 错误: { command: "cd react-todo-app && pnpm install", workingDirectory: "react-todo-app" }
  这是错误的！因为 workingDirectory 已经切换到了 react-todo-app
- 正确: { command: "pnpm install", workingDirectory: "react-todo-app" }
```

**提供反例是低成本高收益的做法** —— 模型非常容易犯 `cd` + `workingDirectory` 这种双重切换的错误，用反例一次性说清楚比事后调试省力得多。

---

### 5. MCP — 将工具从进程内解耦到独立服务

回顾工具定义的演进：

```
阶段 1: 进程内 tool()
┌──────────────────┐
│ Agent 进程        │
│  └─ tool() 定义   │
│  └─ 直接调用      │
└──────────────────┘

阶段 2: MCP Server（独立进程）
┌──────────────┐     stdio      ┌──────────────────┐
│ MCP Client   │ ◄────────────► │ MCP Server        │
│ (LangChain)  │                │  └─ query_user    │
└──────────────┘                │  └─ docs://guide   │
                                └──────────────────┘
```

`my-mcp-server.mjs` 的核心要素：

```javascript
// 1. 创建 Server
const server = new McpServer({ name: 'my-mcp-server', version: '1.0.0' });

// 2. 注册 Tool — tool() 的 MCP 等价物
server.registerTool('query_user', {
  description: '查询用户信息',
  inputSchema: { userId: z.string() },
}, async ({ userId }) => { /* ... */ });

// 3. 注册 Resource — MCP 独有的概念，提供文档/上下文
server.registerResource('使用指南', 'docs://guide', { /* ... */ });

// 4. 通过标准输入输出通信
const transport = new StdioServerTransport();
await server.connect(transport);
```

**Tool vs Resource**：

| MCP 概念 | 用途 | 类比 |
|----------|------|------|
| **Tool** | 执行操作、获取动态数据 | 函数调用 |
| **Resource** | 提供静态文档、上下文 | REST 的 GET 端点 |

在 `langchain-mcp-test.mjs` 中，Resource 被用作 System Prompt 的一部分——模型在对话前就"读过" MCP Server 的使用指南。

---

### 6. MultiServerMCPClient — 多 MCP Server 并行编排

一个 Agent 可以同时连接多个 MCP Server，每个 Server 提供不同领域的工具：

```
MultiServerMCPClient
        │
   ┌────┼────────┬────────────┐
   ▼    ▼        ▼            ▼
用户查询  高德地图  文件系统    Chrome DevTools
(query  (amap-  (filesys-    (chrome-
 _user)  maps)   tem)         devtools)
 stdio   HTTP    stdio        stdio
```

```javascript
const mcpClient = new MultiServerMCPClient({
    mcpServers: {
        'my-mcp-server':    { command: "node", args: [...] },      // 本地进程
        "amap-maps":        { url: "https://mcp.amap.com/..." },   // 远程 HTTP
        "filesystem":       { command: "npx", args: [...] },       // npm 包
        "chrome-devtools":  { command: "npx", args: [...] },       // npm 包
    }
});

const tools = await mcpClient.getTools();
// tools 合并了所有 Server 的工具，一次性 bindTools
```

**关键能力**：Agent 可以在一次任务中跨 Server 编排 —— 例如从高德拿到酒店坐标、用 filesystem 写文件、用 chrome-devtools 打开浏览器展示，所有这些工具的调度都由模型自主决策。

---

## 整体架构图

```
                          ┌──────────────────────────────────┐
                          │        ChatOpenAI (LLM)           │
                          │   model.bindTools(allTools)       │
                          └──────────────┬───────────────────┘
                                         │
                    模型决定调用哪些工具，何时停止
                                         │
                          ┌──────────────▼───────────────────┐
                          │        推理循环 (Agent Loop)       │
                          │                                  │
                          │  while (有 tool_calls) {          │
                          │    执行工具 → ToolMessage 回传     │
                          │    model.invoke(messages)         │
                          │  }                               │
                          └──────────────┬───────────────────┘
                                         │
              ┌──────────────────────────┼──────────────────────────┐
              │                          │                          │
              ▼                          ▼                          ▼
    ┌─────────────────┐      ┌─────────────────────┐    ┌──────────────────────┐
    │  进程内 tool()   │      │  MCP Server (stdio)  │    │ MCP Server (HTTP)    │
    │                 │      │                     │    │                      │
    │ read_file       │      │ query_user          │    │ amap-maps            │
    │ write_file      │      │ docs://guide        │    │ (高德地图 API)        │
    │ execute_command │      │ (my-mcp-server)     │    │                      │
    │ list_directory  │      │                     │    │                      │
    │                 │      │ filesystem          │    │                      │
    │                 │      │ chrome-devtools     │    │                      │
    └─────────────────┘      └─────────────────────┘    └──────────────────────┘
         all-tools.mjs           LangChain MCP Client      LangChain MCP Client
```

---

## 关键要点

1. **`tool()` 的三要素是 name、description、schema** — name 用于匹配，description 用于决策，schema 用于约束参数
2. **`model.bindTools()` 是 Agent 和普通 LLM 调用的分水岭** — 绑了工具模型才能输出 `tool_calls`
3. **推理循环的本质是"模型指挥 → 工具执行 → 结果反馈 → 模型再决策"** — 这个循环一直跑到模型认为任务完成
4. **`ToolMessage` 的 `tool_call_id` 不可省略** — 模型靠它把多个并发工具调用的结果一一对应
5. **System Prompt 中写反例比只写正例更有效** — 模型容易犯错的地方，直接告诉它"不要怎么做"
6. **MCP 把工具调用从进程内函数升级为进程间协议** — 工具可以独立开发、独立部署、跨语言复用
7. **MCP Resource 是 System Prompt 的天然来源** — 在 Agent 启动时读取 Resource 注入 System Prompt，让模型提前理解工具的能力边界
8. **`MultiServerMCPClient` 让一个 Agent 同时拥有多个领域的工具** — 模型自主决定跨 Server 编排，无需人工写胶水代码

---
