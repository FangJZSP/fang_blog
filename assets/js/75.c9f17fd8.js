(window.webpackJsonp=window.webpackJsonp||[]).push([[75],{485:function(a,t,_){"use strict";_.r(t);var v=_(2),s=Object(v.a)({},(function(){var a=this,t=a._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[t("h1",{attrs:{id:"kafka支持延迟消息"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#kafka支持延迟消息"}},[a._v("#")]),a._v(" Kafka支持延迟消息")]),a._v(" "),t("h2",{attrs:{id:"延迟队列和延迟消息"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#延迟队列和延迟消息"}},[a._v("#")]),a._v(" 延迟队列和延迟消息")]),a._v(" "),t("h3",{attrs:{id:"延迟队列"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#延迟队列"}},[a._v("#")]),a._v(" 延迟队列")]),a._v(" "),t("p",[a._v("延迟队列是一种特殊的队列")]),a._v(" "),t("p",[a._v("它里面的每个元素都有一个过期时间，当元素还没到过期时间的时候，如果你试图从队列里面获取一个元素，你会被阻塞")]),a._v(" "),t("p",[a._v("当有元素过期的时候，你就会拿到这个过期的元素")]),a._v(" "),t("p",[a._v("可以这样想，拿到的永远是最先过期的那个元素")]),a._v(" "),t("h3",{attrs:{id:"延迟消息"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#延迟消息"}},[a._v("#")]),a._v(" 延迟消息")]),a._v(" "),t("p",[a._v("基于消息队列的延迟队列，也叫做延迟消息")]),a._v(" "),t("p",[a._v("具体来说，延迟消息是指消息不是立刻被消费的，而是在经过一段时间之后，才会被消费")]),a._v(" "),t("p",[a._v("在到时间之前，这个消息一直都被存储在消息队列的服务器上")]),a._v(" "),t("p",[a._v("订单超时取消的例子，它就用到了延迟消息")]),a._v(" "),t("h2",{attrs:{id:"支持延迟消息的其他消息队列"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#支持延迟消息的其他消息队列"}},[a._v("#")]),a._v(" 支持延迟消息的其他消息队列")]),a._v(" "),t("p",[a._v("RabbitMQ有插件支持延迟消息功能，而RocketMQ和Kafka则只能自己开发")]),a._v(" "),t("h3",{attrs:{id:"rabbitmq延迟消息"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#rabbitmq延迟消息"}},[a._v("#")]),a._v(" RabbitMQ延迟消息")]),a._v(" "),t("p",[t("code",[a._v("rabbitmq_delayed_message_exchange")]),a._v("启用这个插件就可以使用延迟消息")]),a._v(" "),t("p",[a._v("这个插件的基本原理也比较简单，就是实现了一个exchange。这个exchange制住了消息什么时候会被真的投递到队列里")]),a._v(" "),t("p",[a._v("消息暂存exchange里，使用Mnesia来存储当延迟的时间满足条件之后，存储的消息会投递到真正的消息队列")]),a._v(" "),t("p",[a._v("启发：")]),a._v(" "),t("ul",[t("li",[a._v("实现一个延迟队列可以借助数据库")])]),a._v(" "),t("p",[a._v("限制：")]),a._v(" "),t("ul",[t("li",[a._v("消息在投递到目标消息队列之前，存放在服务端本地的Mnesia，如果这时候没有刷新磁盘或节点不可用，消息可能丢失")]),a._v(" "),t("li",[a._v("不支持高并发、大数据量，现实中很多场景都是要在高并发大数据量场景下使用延迟消息")])]),a._v(" "),t("p",[a._v("除此之外，可手动实现延迟消息")])])}),[],!1,null,null,null);t.default=s.exports}}]);