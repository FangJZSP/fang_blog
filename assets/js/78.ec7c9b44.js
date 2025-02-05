(window.webpackJsonp=window.webpackJsonp||[]).push([[78],{494:function(s,a,t){"use strict";t.r(a);var n=t(2),e=Object(n.a)({},(function(){var s=this,a=s._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h1",{attrs:{id:"nsq实战"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#nsq实战"}},[s._v("#")]),s._v(" nsq实战")]),s._v(" "),a("h2",{attrs:{id:"mac安装nsq"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#mac安装nsq"}},[s._v("#")]),s._v(" mac安装nsq")]),s._v(" "),a("ol",[a("li",[s._v("如何在该文件夹下，在mac中打开终端")]),s._v(" "),a("li",[s._v("homebrew安装的文件在 "),a("code",[s._v("/opt/homebrew/Cellar/")])]),s._v(" "),a("li",[s._v("homebrew中的bin会是安装文件的快捷引用")])]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("brew "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" nsq\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("h2",{attrs:{id:"quick-start"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#quick-start"}},[s._v("#")]),s._v(" quick start")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 启动(脚本要在当前的目录使用)")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("cd")]),s._v(" /opt/homebrew/Cellar/nsq/1.3.0/bin\n./nsqd\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 另起终端 控制台")]),s._v("\n./nsqadmin --nsqd-http-address"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("127.0")]),s._v(".0.1:4151\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 另起终端 发送消息")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("curl")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-d")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'hello world 1'")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'http://127.0.0.1:4151/pub?topic=order'")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("curl")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-d")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'hello world 1=2'")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'http://127.0.0.1:4151/pub?topic=order'")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 另起终端 消费消息")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 可以指定topic、channel")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 三个积分服务实例都消费一个topic/channel中的数据，nsqd只会把订单信息发送到其中一个节点(可以启动几个消费者)")]),s._v("\n./nsq_tail --nsqd-tcp-address "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("127.0")]),s._v(".0.1:4150 "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("--topic")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("order "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("--channel")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("point\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br"),a("span",{staticClass:"line-number"},[s._v("15")]),a("br")])]),a("h2",{attrs:{id:"源码结构分析与nsqd启动"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#源码结构分析与nsqd启动"}},[s._v("#")]),s._v(" 源码结构分析与nsqd启动")]),s._v(" "),a("ul",[a("li",[s._v("初始化 init")]),s._v(" "),a("li",[s._v("启动 start")]),s._v(" "),a("li",[s._v("结束 stop")])]),s._v(" "),a("p",[s._v("program实现了以上三个service接口，然后使用once这个方法，使得结束方法只会执行一次.")]),s._v(" "),a("p",[s._v("os.exit(num) num为0，则说明程序正常退出，如果num为1，则说明程序异常退出")]),s._v(" "),a("h2",{attrs:{id:"nsqd初始化过程"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#nsqd初始化过程"}},[s._v("#")]),s._v(" nsqd初始化过程")]),s._v(" "),a("ol",[a("li",[s._v("设置默认值")]),s._v(" "),a("li",[s._v("解析命令行参数")]),s._v(" "),a("li",[s._v("使用时间作为随机种子数")]),s._v(" "),a("li",[s._v("启动命令 nsqd -version 用于打印版本号，并推出")]),s._v(" "),a("li",[s._v("读取配置文件")]),s._v(" "),a("li",[s._v("将flagSet和config合并")]),s._v(" "),a("li",[s._v("创建nsqd")])])])}),[],!1,null,null,null);a.default=e.exports}}]);