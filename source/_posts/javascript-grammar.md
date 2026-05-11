---
title: JavaScript 语法全景 — 从核心概念到现代特性
date: 2026-05-11 14:00:00
categories:
  - 技术
tags:
  - AIGC
  - JavaScript
  - 语法
  - 前端
desc: 系统梳理 JavaScript 的语法体系，从基础骨架到异步模型，从原型链到模块系统，涵盖 ES6+ 现代特性与非浏览器环境延伸。
---

## 一、JS 的语言定位与设计哲学

JavaScript 是 Brendan Eich 在 1995 年用 10 天设计出来的。它的初衷很简单——让网页"动起来"。但它后来的命运远超预期：从浏览器脚本语言成长为全平台通用的编程语言，服务端有 Node.js，桌面端有 Electron，移动端有 React Native。

JS 的几个核心特征决定了它的语法走向：

- **动态类型**：变量类型在运行时确定，灵活但容易出错
- **原型继承**：没有传统的 class（直到 ES6 语法糖出现），对象通过原型链共享行为
- **一等公民函数**：函数可以赋值给变量、作为参数传递、作为返回值返回
- **事件驱动**：天生适合处理用户交互和 I/O

ECMAScript 是 JS 的规范标准。关键分水岭是 ES6（ES2015），从此 JS 进入现代化阶段，之后每年一个版本（ES2016 ~ ES2024+），持续演进。

## 二、基础语法骨架

### 2.1 变量声明：var / let / const

```javascript
// var：函数作用域，有变量提升，可重复声明
var a = 1;
var a = 2; // 不报错

// let：块级作用域，无提升（有暂时性死区），不可重复声明
let b = 1;
// let b = 2; // SyntaxError

// const：块级作用域，声明时必须赋值，不可重新赋值
const c = 1;
// c = 2; // TypeError
```

核心原则：**默认用 const，确实需要改值时用 let，永远不用 var。**

### 2.2 数据类型

JS 有 7 种原始类型和 1 种引用类型：

```javascript
// 原始类型（存储在栈，按值传递）
let str = 'hello';         // string
let num = 42;              // number
let big = 9007199254740991n; // bigint
let flag = true;           // boolean
let empty = null;          // null（历史遗留：typeof null === "object"）
let x;                     // undefined
let sym = Symbol('id');    // symbol

// 引用类型（存储在堆，按引用传递）
let obj = { name: 'fang' }; // object
let arr = [1, 2, 3];       // object（数组是特殊的 object）
let fn = function() {};     // function（可调用的 object）
```

`typeof` 的两个经典坑：`typeof null === "object"` 是语言层面的历史 bug；`typeof [] === "object"` 需要用 `Array.isArray()` 来区分数组。

### 2.3 运算符

```javascript
// == 会做类型转换，=== 不会——永远用 ===
0 == '0';   // true
0 === '0';  // false

// 可选链 ?. ：安全访问深层属性
const name = user?.profile?.name; // 任一环节为 null/undefined 则短路返回 undefined

// 空值合并 ?? ：只在 null/undefined 时取默认值
const count = input ?? 10; // 区别于 ||：0 和 '' 不会被当做 falsy
```

### 2.4 内存机制：栈与堆

理解内存分配是理解 JS 行为的底层基础：

```
栈（Stack）→ 存原始值 + 引用地址，大小固定，访问快
堆（Heap） → 存对象/数组/函数实体，大小动态，访问需通过栈上的引用
```

```javascript
// 原始值：栈上各自独立
let x = 10;
let y = x;
x = 20;
console.log(y); // 10 —— y 不受影响

// 引用值：栈上存地址，堆上存实体
let obj1 = { value: 10 };
let obj2 = obj1;
obj1.value = 20;
console.log(obj2.value); // 20 —— 共享同一个堆对象

// 数组也是引用
const arr = [1, 2, 3];
arr.push(4);     // 合法 — 改的是堆上的内容
// arr = [5, 6]; // 非法 — 改的是栈上的引用地址
```

一个常被忽视的细节：**栈内存随函数执行完毕自动回收；堆内存由垃圾回收器（GC）基于引用计数和标记清除来管理。** 这也是闭包可能导致内存泄漏的原因——被闭包引用的变量无法被 GC 回收。

## 三、函数 — JS 的核心抽象

### 3.1 函数的多种形态

```javascript
// 函数声明 —— 有提升，可以在声明前调用
function add(a, b) { return a + b; }

// 函数表达式 —— 无提升
const add = function(a, b) { return a + b; };

// 箭头函数 —— this 由外层词法作用域决定
const add = (a, b) => a + b;
```

箭头函数与普通函数的关键差异：（1）没有自己的 `this`，`this` 继承自外层；（2）不能用作构造函数（没有 `prototype` 属性）；（3）没有 `arguments` 对象。

### 3.2 函数参数

```javascript
// 默认参数
function greet(name = 'World') {
  console.log(`Hello, ${name}!`);
}

// 剩余参数 ...args：把剩余实参收集为数组
function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4); // 10

// 剩余参数必须在参数列表末尾
function fn(first, ...rest) {} // OK
// function fn(...rest, last) {} // SyntaxError
```

相比旧时代用 `arguments` 类数组对象，`...args` 返回的是真正的数组，可以直接调用数组方法。

### 3.3 闭包的形成原理与经典场景

```javascript
function createCounter() {
  let count = 0;          // 函数执行完毕后，这个变量本该销毁
  return function() {     // 但内部的函数持有对它的引用
    return ++count;       // 于是 count 存活在闭包中
  };
}

const counter = createCounter();
counter(); // 1
counter(); // 2
```

闭包的本质：**内部函数引用外部函数的变量，导致外部函数的变量对象无法被垃圾回收。** 经典应用场景：数据私有化、函数工厂、柯里化、防抖节流。经典坑：`for` 循环中用 `var` 绑定异步回调，需要用 `let` 或闭包解决。

### 3.4 `this` 的四种绑定规则

```javascript
// 1. 默认绑定：非严格模式下指向 window，严格模式下指向 undefined
function fn() { console.log(this); }

// 2. 隐式绑定：谁调用就指向谁
obj.method(); // this → obj

// 3. 显式绑定：call / apply / bind
fn.call(obj, arg1); // this → obj

// 4. new 绑定：构造函数中的 this 指向新创建的实例
function Person(name) { this.name = name; }
const p = new Person('fang'); // this → p
```

箭头函数打破以上规则——它的 `this` 由定义时外层作用域决定，且绑定后无法改变。

### 3.5 高阶函数与函数式范式

```javascript
const nums = [1, 2, 3, 4, 5];

nums.map(n => n * 2);      // [2, 4, 6, 8, 10]
nums.filter(n => n > 2);   // [3, 4, 5]
nums.reduce((sum, n) => sum + n, 0); // 15

// pipe：组合多个函数
const pipe = (...fns) => x => fns.reduce((v, fn) => fn(v), x);
```

## 四、对象与原型

### 4.1 对象创建的方式

```javascript
// 字面量（最常用）
const obj = { name: 'fang', age: 25 };

// 构造函数
function Person(name) { this.name = name; }
const p = new Person('fang');

// Object.create —— 纯原型链接，不调用构造函数
const child = Object.create(parent);

// class（语法糖）
class Person {
  constructor(name) { this.name = name; }
}
```

### 4.2 原型链的工作机制

```javascript
const arr = [1, 2, 3];
arr.push(4);  // push 来自 Array.prototype
arr.toString(); // toString 来自 Object.prototype

// 链：arr → Array.prototype → Object.prototype → null
```

原型链是 JS 实现"继承"的方式——**属性查找沿 `[[Prototype]]` 链逐级向上，直到找到或到达 null。** `class` 语法糖本质上是封装了构造函数 + 原型绑定的过程，编译后和 ES5 版本没有区别。

### 4.3 属性描述符

JS 对象的每个属性都有元属性：

```javascript
const user = {};

// value / writable / enumerable / configurable
Object.defineProperty(user, 'name', {
  value: 'fang',
  writable: false,     // 不可修改
  enumerable: true,    // 可被 for...in 枚举
  configurable: false, // 不可删除，不可再次配置
});

// get / set：存储器属性
const obj = {
  _value: 0,
  get value() { return this._value; },
  set value(v) {
    if (v < 0) throw new Error('不能为负');
    this._value = v;
  }
};

obj.value = 10;   // 调用 setter
console.log(obj.value); // 调用 getter
```

`value/writable` 和 `get/set` 互斥，一个属性只能是一种（数据属性或访问器属性）。

## 五、异步模型 — JS 的杀手特性

### 5.1 事件循环（Event Loop）

JS 是单线程的，但通过事件循环实现了非阻塞 I/O。这是理解一切异步行为的基石：

```
┌──────────────────────────────┐
│          调用栈（Call Stack）  │  ← 同步任务，LIFO
│          ┌──────────┐        │
│          │  fn3()   │        │
│          │  fn2()   │        │
│          │  fn1()   │        │
│          └──────────┘        │
│  调用栈清空后，从微任务队列取  │
├──────────────────────────────┤
│  微任务队列（Microtask Queue） │  ← Promise.then/catch、queueMicrotask
│  全部清空后，取一个宏任务      │
├──────────────────────────────┤
│  宏任务队列（Macrotask Queue） │  ← setTimeout、setInterval、I/O、事件
│  一次取一个，执行后回到微任务   │
└──────────────────────────────┘
```

执行顺序口诀：**同步 → 微任务（清空）→ 宏任务（取一个）→ 微任务（清空）→ ……**

### 5.2 回调 → Promise → async/await

```javascript
// 回调时代：回调地狱
fs.readFile(path, (err, data) => {
  if (err) handleError(err);
  else parseData(data, (err, result) => {
    // ...
  });
});

// Promise：链式调用，扁平化
fetch('/api')
  .then(res => res.json())
  .then(data => process(data))
  .catch(err => console.error(err));

// async/await：像同步代码一样写异步
async function main() {
  try {
    const res = await fetch('/api');
    const data = await res.json();
    return process(data);
  } catch (err) {
    console.error(err);
  }
}
```

### 5.3 异步错误捕获的特殊性

```javascript
// 为什么 try-catch 抓不住回调中的错误？
try {
  setTimeout(() => {
    throw new Error('异步错误'); // 这个错误不会被 catch 捕获
  }, 0);
} catch (e) {
  // 永远不会执行到这里
}

// 原因：try-catch 只能捕获当前调用栈中的错误
// 当 setTimeout 的回调执行时，外层已经执行完毕，调用栈已清空
// 错误发生在全新的调用栈上，与 try-catch 无关

// 正确做法
new Promise((resolve, reject) => {
  setTimeout(() => reject(new Error('异步错误')), 0);
}).catch(e => console.log('被捕获:', e));

// 或使用 async/await
async function main() {
  try {
    await new Promise((_, reject) =>
      setTimeout(() => reject(new Error('异步错误')), 0)
    );
  } catch (e) {
    console.log('被捕获:', e); // 现在可以捕获了
  }
}
```

核心原理：**try-catch 是同步的，只能捕获同一调用栈中的错误。** Promise 的 `.catch()` 和 `async/await` 本质上把错误重新放到了可预测的微任务链路中，所以能被捕获。另一个容易忽视的细节——**Promise 内部同步抛错会被转为 rejected，但异步抛错需要显式 reject**：

```javascript
new Promise(() => {
  throw new Error('同步抛错'); // 会被 Promise 自动捕获 → rejected
});

new Promise((_, reject) => {
  setTimeout(() => {
    // throw new Error('异步抛错'); // 不会被任何东西捕获，进程崩溃
    reject(new Error('正确做法'));  // 只有手动 reject 才能进 .catch()
  });
});
```

### 5.4 异步并发控制

```javascript
// 串行：一个接一个
for (const item of items) {
  await process(item);
}

// 并行：全部同时
await Promise.all(items.map(item => process(item)));

// 限量并发：一次最多 n 个
// 用信号量或第三方库如 p-limit 实现
```

## 六、模块系统

### 6.1 演进路径

```
IIFE（立即执行函数）← 避免全局污染，但依赖顺序靠人工维护
      ↓
CommonJS ← Node.js 引入，同步加载，服务端专享
      ↓
AMD / RequireJS ← 异步加载，浏览器专享
      ↓
ES Module ← 2015 标准化，前后端统一，静态分析友好
```

### 6.2 ES Module 的使用

```javascript
// 命名导出
export const PI = 3.14;
export function cube(x) { return x ** 3; }

// 默认导出（一个模块只能有一个）
export default class Calculator { ... }

// 导入
import { cube, PI } from './math.js';
import Calculator from './calc.js';
import * as math from './math.js';         // 命名空间导入
import { cube as c } from './math.js';     // 别名
```

ES Module 是静态的——导入导出关系在编译阶段就能确定，这让打包工具可以做 Tree Shaking（自动删除未用代码）。

### 6.3 JS 文件后缀全解

JS 生态中有多种后缀，每种都有明确含义：

| 后缀 | 模块系统 | 说明 |
|------|---------|------|
| `.js` | 取决于 package.json 的 `"type"` 字段 | 最通用，`"type": "module"` 时视为 ESM，否则视为 CommonJS |
| `.mjs` | ES Module | 强制按 ESM 解析，无视 package.json |
| `.cjs` | CommonJS | 强制按 CJS 解析，无视 package.json |
| `.jsx` | 取决于配置 | 包含 JSX 语法的 JavaScript（React 组件文件），模块系统同上 |
| `.ts` | TypeScript（编译到 JS） | TypeScript 源码文件，模块规则通过 tsconfig.json 控制 |
| `.tsx` | TypeScript + JSX | TS + JSX 组合（React + TS 项目的标准后缀） |

关键区分：

```javascript
// .mjs —— 使用 ESM 语法
import fs from 'node:fs';
export const name = 'fang';

// .cjs —— 使用 CommonJS 语法
const fs = require('fs');
module.exports = { name: 'fang' };

// 跨系统调用
// ESM 中可以导入 CJS：
import pkg from './legacy.cjs'; // CJS 的 module.exports 变成默认导出

// CJS 中不能同步导入 ESM——这是两种模块系统的根本差异
// CJS 是同步的，ESM 是异步的
```

`.js` 的歧义是最常见的坑。一个 Node.js 项目中，如果你的 `package.json` 设了 `"type": "module"`，所有 `.js` 都按 ESM 解析，旧版的 `require()` 就会报错——这时候要么改成 `.cjs`，要么用 `import` 重写。

## 七、关键 ES6+ 特性速览

### 7.1 解构

```javascript
// 数组解构
const [a, b, ...rest] = [1, 2, 3, 4]; // a=1, b=2, rest=[3,4]

// 对象解构
const { name, age: nianling = 0 } = user; // 别名 + 默认值

// 函数参数解构
function greet({ name, age }) { ... }
```

### 7.2 展开运算符

```javascript
const arr = [1, 2, ...[3, 4], 5]; // [1,2,3,4,5]
const obj = { ...a, ...b };       // 浅拷贝合并，后者覆盖前者
```

### 7.3 模板字面量

```javascript
const msg = `Hello, ${name}! You have ${count} messages.`;
const multiline = `
  第一行
  第二行
`; // 保留换行
```

### 7.4 集合类型

```javascript
// Set：无重复值的集合
const set = new Set([1, 2, 2, 3]); // Set { 1, 2, 3 }

// Map：键可以是任意类型
const map = new Map();
map.set(obj, 'value'); // 对象作键

// WeakMap：键必为对象，弱引用，不阻止 GC
const wm = new WeakMap();
wm.set(element, data); // DOM 元素作键，元素移除后自动回收
```

### 7.5 Proxy 与 Reflect

```javascript
const obj = new Proxy(target, {
  get(t, key) {
    console.log(`读取 ${String(key)}`);
    return Reflect.get(t, key);
  },
  set(t, key, val) {
    console.log(`设置 ${String(key)} = ${val}`);
    return Reflect.set(t, key, val);
  }
});
```

Vue 3 的响应式系统就是基于 Proxy 构建的（Vue 2 用的是 `Object.defineProperty`）。

### 7.6 迭代器与生成器

```javascript
// 迭代器：任何具有 next() 方法的对象
// Array、Map、Set、String 都有 Symbol.iterator

// 生成器：用 function* 定义，用 yield 暂停
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

for (const val of gen()) {
  console.log(val); // 1, 2, 3
}
```

## 八、TypeScript 的关系

TypeScript 是 JS 的超集，补上了 JS 最大的短板——**类型系统**。

```typescript
// JS：类型在运行时发现
function add(a, b) { return a + b; }
add(1, '2'); // '12' —— 不是你要的

// TS：类型在编译时检查
function add(a: number, b: number): number {
  return a + b;
}
add(1, '2'); // 编译报错：类型不匹配
```

TS 的核心价值：
- **编译时捕获错误**：类型拼写错误、缺少参数、null 引用等在 IDE 中就暴露
- **自文档化**：函数签名就是最准确的文档
- **重构安全**：改一个接口，所有引用处的类型错误立刻浮现

TS 在编译后产出纯 JS（去掉类型注解），对运行时零影响。

## 九、JS 在非浏览器环境的延伸

### 9.1 Node.js

Node.js 让 JS 跑在了服务端。它的核心是 **异步 + 非阻塞 I/O**，附加了浏览器没有的能力：

```javascript
// Buffer：处理二进制数据（TCP 流、文件系统、加密）
const buf = Buffer.from('hello', 'utf-8');
const hex = buf.toString('hex');

// Stream：处理大数据，分片读入，不占满内存
const readStream = fs.createReadStream('./bigfile.txt', 'utf-8');
readStream.on('data', chunk => {
  console.log('接收片段:', chunk.length, '字节');
});
readStream.on('end', () => console.log('读取完成'));

// fs：文件系统操作（浏览器中不存在）
const fs = require('fs');
fs.readFileSync(path); // 同步读
fs.readFile(path, (err, data) => {}); // 异步读
fs.promises.readFile(path); // Promise 版
```

Buffer 和 Stream 是 Node.js 的两个基石——Buffer 让你操作原始二进制，Stream 让你在有限内存下处理无限数据。

### 9.2 Web Workers

JS 是单线程的，但可以通过 Web Workers 启动真正的操作系统线程：

```javascript
// 主线程
const worker = new Worker('worker.js');
worker.postMessage({ data: '开始计算' });
worker.onmessage = (e) => {
  console.log('结果:', e.data);
};

// worker.js —— 运行在独立线程中
self.onmessage = (e) => {
  const result = heavyComputation(e.data);
  self.postMessage(result);
};
```

关键限制：Worker 不能访问 DOM，不能直接操作主线程的变量。工作线程和主线程只能通过 `postMessage` 通信，消息内容会被**结构化克隆**（structured clone），相当于深拷贝。SharedArrayBuffer + Atomics 可以实现线程间共享内存，但这是进阶操作的范畴了。

---

JavaScript 的语法体系看似庞杂，但有一条主线贯穿始终：**函数是一等公民，异步是底层基因，原型是组织方式，模块是分治手段。** 抓住这四条，其余的特性都是在它们之上长出来的枝叶。