---
title: Kotlin 学习总结 — 从语法基础到 Android 实战
date: 2026-07-09 14:00:00
categories:
  - 技术
tags:
  - Kotlin
  - Android
  - 协程
  - Room
  - DataStore
  - Retrofit
desc: 以短信中继 Android 项目为线索，系统梳理 Kotlin 语法核心、data class、Room/DataStore 数据层、Retrofit 网络层、协程挂起函数，以及 Android 原生 API 高频用法。
---

## 一、起点：一个常见的困惑

初学 Kotlin 时，很容易在 IDE 里看到「有的文件带 `.kt`，有的不带 `.kt`」，误以为这是两种不同的写法。

**结论很简单：**

- **语法层面**：所有 Kotlin 源码文件后缀都是 `.kt`（脚本文件另有 `.kts`），没有例外。
- **显示层面**：IDE（IntelliJ IDEA / Android Studio）可以隐藏扩展名，Tab 上只显示 `User` 而不是 `User.kt`，这只是视觉差异，不影响编译。

文件名和类名可以不一致，但通常建议保持一致，方便阅读。

---

## 二、Kotlin 语言基础

### 2.1 基本数据类型

Kotlin 没有 Java 的 `int`/`long` 原始类型关键字，一切皆对象，编译器会在合适时优化为 JVM 原生类型：

| Kotlin 类型 | Java 对应 |
|------------|----------|
| `Int`      | `int`    |
| `Long`     | `long`   |
| `Double`   | `double` |
| `Float`    | `float`  |
| `Boolean`  | `boolean`|
| `Char`     | `char`   |
| `String`   | `String` |

### 2.2 类的基本写法

```kotlin
// User.kt
class User(val name: String, var age: Int) {
    // 属性、方法、init 块等
}
```

对比 Java 的几个关键差异：

- **默认 public**，不需要写 `public`
- **getter/setter 自动生成**，可直接用 `.` 访问
- **主构造函数**写在类名后面
- **数据类**用 `data class` 自动生成 `equals`/`hashCode`/`toString`/`copy`

---

## 三、data class：日常开发最值钱的语法

以配置类为例：

```kotlin
data class AppConfig(
    val deviceId: String,
    val serverUrl: String,
    val simSlots: List<SimSlotConfig>,
) {
    val isValid: Boolean
        get() = deviceId.isNotBlank() && serverUrl.startsWith("http")

    companion object {
        const val DEFAULT_SERVER_URL = "http://172.16.9.103:3000"
    }
}
```

这段短短几行代码，浓缩了 Kotlin 最常用的特性：

| 语法 | 作用 | Java 类比 |
|------|------|-----------|
| `data class` | 自动生成 `toString`/`equals`/`hashCode`/`copy` | 手动写样板代码 |
| `val` + 构造参数 | 只读属性 | `private final` + getter |
| 自定义 getter | 计算属性，每次访问实时计算 | `public boolean isValid()` |
| `companion object` | 伴生对象，存放类级别成员 | `static` 成员 |
| `const val` | 编译期常量，内联到字节码 | `public static final` |
| 尾随逗号 | 方便 Git diff，增删参数时少改一行 | 无 |

**几个细节值得记住：**

- `isNotBlank()` 是 Kotlin 对 `String` 的扩展函数，比 `!isEmpty()` 更严格（会检查空白字符）。
- `List<T>` 是只读接口，`MutableList<T>` 才是可变的——Kotlin 鼓励不可变数据。
- `data class` 的 `equals`/`hashCode` 依赖属性值，如果内部持有可变集合且被外部修改，相等性判断可能失效。

**使用示例：**

```kotlin
val config = AppConfig("abc123", "http://example.com", listOf(...))
val copyConfig = config.copy(serverUrl = "https://new.com")  // 只改 serverUrl
val (id, url, slots) = config  // 解构声明
```

---

## 四、伴生对象 companion object

`companion object` 的官方译法是**伴生对象**，可以理解为「类的小伙伴」——和类绑定，存放不需要实例化就能访问的成员。

```kotlin
class AppConfig {
    companion object {
        const val DEFAULT = "http://..."
    }
}

AppConfig.DEFAULT  // 直接通过类名访问
```

和 Java `static` 的区别：Kotlin 的伴生对象是一个**真正的对象实例**，可以继承父类、实现接口，比 `static` 更灵活。

---

## 五、Room 数据库：SQLite 的 Kotlin 封装

```kotlin
@Database(entities = [PendingMessage::class, RelayLog::class], version = 2)
abstract class AppDatabase : RoomDatabase() {
    abstract fun pendingMessageDao(): PendingMessageDao
    abstract fun relayLogDao(): RelayLogDao

    companion object {
        @Volatile private var instance: AppDatabase? = null

        private val MIGRATION_1_2 = object : Migration(1, 2) {
            override fun migrate(db: SupportSQLiteDatabase) {
                db.execSQL(
                    """
                    CREATE TABLE IF NOT EXISTS relay_logs (
                        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                        sender TEXT NOT NULL,
                        bodyPreview TEXT NOT NULL,
                        createdAt INTEGER NOT NULL,
                        success INTEGER NOT NULL
                    )
                    """.trimIndent(),
                )
            }
        }

        fun get(context: Context): AppDatabase =
            instance ?: synchronized(this) {
                instance ?: Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "sms_relay.db",
                )
                    .addMigrations(MIGRATION_1_2)
                    .build()
                    .also { instance = it }
            }
    }
}
```

### 5.1 核心知识点

**`@Database` 注解**

- `entities`：声明数据库包含哪些表
- `version`：版本号，升级时需配合 Migration
- `abstract`：Room 编译时自动生成 `AppDatabase_Impl`

**Migration 迁移**

- `object : Migration(1, 2)` 是 Kotlin 的匿名内部类，等价于 Java 的 `new Migration(1, 2) { ... }`
- 三重引号 `"""..."""` 支持多行字符串，`.trimIndent()` 移除公共缩进
- SQLite 没有布尔类型，用 `INTEGER` 存 0/1

**双重检查锁（DCL）单例**

```kotlin
instance ?: synchronized(this) {
    instance ?: Room.databaseBuilder(...).build().also { instance = it }
}
```

- Elvis 操作符 `?:`：instance 不为 null 直接返回，否则进入同步块
- `@Volatile`：保证多线程可见性，配合 DCL 实现线程安全
- `context.applicationContext`：用应用上下文，避免 Activity 内存泄漏
- `::class.java`：Kotlin 获取 Java Class 引用
- `.also { instance = it }`：作用域函数，构建完成后赋值

### 5.2 适用场景

Room 适合复杂关系数据、大表、需要 SQL 查询的场景。消息记录、日志表这类结构化数据是典型用法。

---

## 六、DataStore：轻量级配置存储

```kotlin
private val Context.dataStore by preferencesDataStore("sms_relay_config")

class ConfigRepository(private val context: Context) {
    private val gson = Gson()
    private val deviceIdKey = stringPreferencesKey("device_id")
    private val serverUrlKey = stringPreferencesKey("server_url")
    private val simSlotsKey = stringPreferencesKey("sim_slots")

    val configFlow: Flow<AppConfig?> = context.dataStore.data.map { prefs ->
        val deviceId = prefs[deviceIdKey] ?: return@map null
        val serverUrl = prefs[serverUrlKey] ?: return@map null
        val simJson = prefs[simSlotsKey] ?: "[]"
        val type = object : TypeToken<List<SimSlotConfig>>() {}.type
        val simSlots: List<SimSlotConfig> = gson.fromJson(simJson, type)
        AppConfig(deviceId, serverUrl, simSlots)
    }

    suspend fun save(config: AppConfig) {
        context.dataStore.edit { prefs ->
            prefs[deviceIdKey] = config.deviceId
            prefs[serverUrlKey] = config.serverUrl
            prefs[simSlotsKey] = gson.toJson(config.simSlots)
        }
    }
}
```

### 6.1 核心知识点

**顶层委托属性**

- `val Context.dataStore by preferencesDataStore(...)` 为 Context 添加扩展属性
- `by` 是属性委托，DataStore 实例由框架管理
- 对比 SharedPreferences：DataStore 基于协程 + Flow，异步、类型安全

**Flow 响应式数据流**

- `dataStore.data` 返回 `Flow<Preferences>`，数据变化时自动发射新值
- `.map { ... }` 把 Preferences 映射为 `AppConfig?`
- `return@map null` 是标签返回，提前退出 lambda

**Gson + TypeToken**

- DataStore 只支持基本类型，复杂对象需序列化为 JSON 字符串
- `object : TypeToken<List<SimSlotConfig>>() {}.type` 解决 Java 泛型擦除问题

**suspend fun save()**

- `suspend` 标记挂起函数，只能在协程中调用
- `edit { }` 是原子操作，要么全部成功，要么全部失败

### 6.2 Room vs DataStore

| 维度 | Room (SQLite) | DataStore (Protobuf) |
|------|--------------|---------------------|
| 适用场景 | 复杂关系数据、大表、查询 | 简单键值对、配置、小数据 |
| 类型安全 | 编译时检查（Entity） | 只支持基本类型 |
| 异步 | 支持协程 | 天生协程 + Flow |
| 数据量 | 无限制 | 建议 < 1MB |

---

## 七、Retrofit + OkHttp：网络层封装

```kotlin
object ApiClient {
    private val httpClient = OkHttpClient.Builder()
        .connectTimeout(10, TimeUnit.SECONDS)
        .readTimeout(10, TimeUnit.SECONDS)
        .addInterceptor(HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BASIC
        })
        .build()

    fun create(serverUrl: String): ApiService {
        val baseUrl = if (serverUrl.endsWith("/")) serverUrl else "$serverUrl/"
        return Retrofit.Builder()
            .baseUrl(baseUrl)
            .client(httpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }
}
```

### 7.1 核心知识点

**`object` 单例**

- Kotlin 的 `object` 声明编译后生成静态实例，天然线程安全
- 比 Java 的 static + 私有构造器更简洁

**OkHttp 建造者模式**

- `connectTimeout` / `readTimeout`：连接和读取超时
- `HttpLoggingInterceptor`：开发环境打印网络日志，生产环境应禁用
- `apply` 作用域函数：创建对象后立即配置属性

**Retrofit 动态代理**

- `baseUrl` 必须以 `/` 结尾
- 每次 `create()` 创建新 Retrofit 实例，但共享同一个 `httpClient`（连接池复用）
- `GsonConverterFactory` 自动将 JSON 解析为 Kotlin 数据类

---

## 八、协程：suspend 与 Flutter async 的对比

`suspend` 和 Flutter/Dart 的 `async` 语义相近，都是标记「可以暂停和恢复的异步函数」，但实现机制有差异：

| 维度 | Kotlin `suspend` | Flutter/Dart `async` |
|------|------------------|----------------------|
| 返回值 | 普通类型 `T` | `Future<T>` |
| 等待方式 | 不需要 `await`，看起来像同步调用 | 必须写 `await` |
| 调用环境 | 协程或另一个 `suspend` 函数 | `async` 函数内 |
| 底层 | 协程状态机 + Continuation | 事件循环 + Future |

**Kotlin 示例：**

```kotlin
suspend fun fetchData(): String {
    delay(1000)  // 挂起 1 秒，不阻塞线程
    return "Hello"
}

viewModelScope.launch {
    val result = fetchData()  // 不需要 await
}
```

**Flutter 对应：**

```dart
Future<String> fetchData() async {
    await Future.delayed(Duration(seconds: 1));
    return "Hello";
}

String result = await fetchData();  // 必须 await
```

**「挂起」的含义**：函数执行到挂起点时主动暂停，线程不会被阻塞，异步完成后协程恢复执行。这是 Kotlin 让异步代码看起来像同步代码的设计哲学。

---

## 九、Android 原生 API 高频清单

以电池优化检查为例：

```kotlin
fun isBatteryOptimizationDisabled(context: Context): Boolean {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) return true
    val pm = context.getSystemService(PowerManager::class.java) ?: return true
    return pm.isIgnoringBatteryOptimizations(context.packageName)
}
```

这段代码涉及三个核心概念：**系统服务**、**版本适配**、**权限/优化策略**。

### 9.1 常用系统服务（Top 10）

| 系统服务 | 主要功能 |
|---------|----------|
| `ConnectivityManager` | 检查网络连接、监听网络变化 |
| `NotificationManager` | 发送通知、管理通知渠道 |
| `ActivityManager` | 运行任务、内存信息 |
| `PowerManager` | 电源管理、电池优化、WakeLock |
| `AlarmManager` | 定时任务 |
| `LocationManager` | GPS / 网络定位 |
| `TelephonyManager` | SIM 卡信息、运营商 |
| `AudioManager` | 音量、音频模式 |
| `Vibrator` | 震动 |
| `InputMethodManager` | 软键盘显示/隐藏 |

Kotlin 推荐写法：

```kotlin
val cm = context.getSystemService(ConnectivityManager::class.java)
```

### 9.2 Build 系列（版本与设备信息）

```kotlin
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
    // Android 10+ 特有逻辑
}

val brand = Build.BRAND           // "Xiaomi"
val model = Build.MODEL           // "MI 8"
val manufacturer = Build.MANUFACTURER
```

### 9.3 Context 常用方法

```kotlin
context.packageName                          // 包名
context.getString(R.string.app_name)         // 读取资源
context.filesDir                               // 内部存储路径
context.getSystemService(Any::class.java)    // 获取系统服务
```

### 9.4 短信项目相关 API

| 类 | 用途 |
|----|------|
| `SmsManager` | 发送短信 |
| `ContentResolver` | 查询短信数据库 |
| `BroadcastReceiver` | 监听短信到达 |
| `TelephonyManager` | 获取 SIM 卡信息 |

---

## 十、完整数据流架构

把前面所有模块串起来，一个典型的 Android 应用数据层长这样：

```
应用启动
    ↓
DataStore (ConfigRepository)
    读取 serverUrl、deviceId、simSlots
    ↓
ApiClient.create(serverUrl)
    根据配置创建 Retrofit 客户端
    ↓
ApiService
    定义 API 接口（发送短信、心跳、注册设备）
    ↓
Repository / ViewModel
    调用 ApiService 执行网络请求
    Room 存储消息记录和日志
    ↓
UI (Activity / Fragment)
    collect(configFlow) 自动更新
```

**设计模式汇总：**

| 模式 | 体现 |
|------|------|
| 单例模式 | `object ApiClient`、`companion object` + DCL |
| 仓储模式 | `ConfigRepository` 统一管理数据访问 |
| 建造者模式 | `OkHttpClient.Builder()`、`Retrofit.Builder()` |
| 抽象工厂 | `AppDatabase` 提供 DAO 工厂方法 |
| 响应式编程 | `Flow` + `map` 实现数据驱动 UI |

---

## 十一、学习路线建议

基于这次对话的脉络，推荐按以下顺序深入：

1. **语法基础**：`val`/`var`、`data class`、扩展函数、作用域函数（`apply`/`also`/`let`）
2. **面向对象**：`companion object`、`object` 单例、密封类 `sealed class`
3. **异步编程**：协程、`suspend`、`Flow`、`viewModelScope`
4. **数据层**：DataStore（配置）+ Room（结构化数据）
5. **网络层**：Retrofit + OkHttp + Gson/Moshi
6. **Android 原生**：系统服务、权限、BroadcastReceiver、ContentProvider

每个阶段都用真实项目代码来学，比孤立地看语法文档效率高得多。对话中的短信中继项目就是一个很好的载体——从 `AppConfig` 数据类，到 Room 存消息、DataStore 存配置、Retrofit 发请求，再到 `PowerManager` 检查电池优化，覆盖了 Android 开发的完整链路。

---

## 参考

- 原文对话：[DeepSeek 分享 — Kotlin 学习讨论](https://chat.deepseek.com/share/tm7m8jnjl9xaasrx4x)
- [Kotlin 官方文档](https://kotlinlang.org/docs/home.html)
- [Android Developers — Room](https://developer.android.com/training/data-storage/room)
- [Android Developers — DataStore](https://developer.android.com/topic/libraries/architecture/datastore)
