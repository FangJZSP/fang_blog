(window.webpackJsonp=window.webpackJsonp||[]).push([[46],{456:function(v,_,a){"use strict";a.r(_);var r=a(2),t=Object(r.a)({},(function(){var v=this,_=v._self._c;return _("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[_("h1",{attrs:{id:"docker"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#docker"}},[v._v("#")]),v._v(" docker")]),v._v(" "),_("h2",{attrs:{id:"快速入门"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#快速入门"}},[v._v("#")]),v._v(" 快速入门")]),v._v(" "),_("h3",{attrs:{id:"部署mysql"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#部署mysql"}},[v._v("#")]),v._v(" 部署mysql")]),v._v(" "),_("h2",{attrs:{id:"docker基础"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#docker基础"}},[v._v("#")]),v._v(" docker基础")]),v._v(" "),_("h3",{attrs:{id:"命令解读"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#命令解读"}},[v._v("#")]),v._v(" 命令解读")]),v._v(" "),_("p",[v._v("docker run -d")]),v._v(" "),_("ul",[_("li",[v._v("run 创建容器")]),v._v(" "),_("li",[v._v("-d 后台运行")]),v._v(" "),_("li",[v._v("--name 起名")]),v._v(" "),_("li",[v._v("-p 端口映射 主机端口:容器端口")]),v._v(" "),_("li",[v._v("-e 环境变量")])]),v._v(" "),_("p",[v._v("镜像名称结构")]),v._v(" "),_("h3",{attrs:{id:"常见命令"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#常见命令"}},[v._v("#")]),v._v(" 常见命令")]),v._v(" "),_("p",[v._v("docker 拼接")]),v._v(" "),_("ul",[_("li",[v._v("pull 拉取镜像")]),v._v(" "),_("li",[v._v("images 查看镜像")]),v._v(" "),_("li",[v._v("rmi 删除镜像")]),v._v(" "),_("li",[v._v("build 打包镜像")]),v._v(" "),_("li",[v._v("save 保存镜像")]),v._v(" "),_("li",[v._v("load 加载镜像")]),v._v(" "),_("li",[v._v("push 推送镜像")]),v._v(" "),_("li",[v._v("run 创建容器")]),v._v(" "),_("li",[v._v("stop 停止容器")]),v._v(" "),_("li",[v._v("start 启动容器")]),v._v(" "),_("li",[v._v("ps 查看容器运行状态")]),v._v(" "),_("li",[v._v("rm 删除容器")])]),v._v(" "),_("p",[v._v("docker exec -it 容器 bash")]),v._v(" "),_("ul",[_("li",[v._v("exec 执行")]),v._v(" "),_("li",[v._v("-it 可输入的命令系统")]),v._v(" "),_("li",[v._v("bash 黑窗口")])]),v._v(" "),_("h3",{attrs:{id:"命令别名"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#命令别名"}},[v._v("#")]),v._v(" 命令别名")]),v._v(" "),_("p",[v._v("vi ～/.bashrc")]),v._v(" "),_("p",[v._v("可以自己设置 到处都有TypeOf")]),v._v(" "),_("h3",{attrs:{id:"数据卷挂载"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#数据卷挂载"}},[v._v("#")]),v._v(" 数据卷挂载")]),v._v(" "),_("p",[v._v("容器内目录与宿主机之间映射的桥梁")]),v._v(" "),_("p",[v._v("只需要修改宿主机的内容就可以了")]),v._v(" "),_("p",[v._v("docker volume")]),v._v(" "),_("ul",[_("li",[v._v("ls 查看数据卷")]),v._v(" "),_("li",[v._v("rm 删除数据卷")]),v._v(" "),_("li",[v._v("inspect 查看数据卷详情")]),v._v(" "),_("li",[v._v("prune 删除未使用的数据卷")])]),v._v(" "),_("h3",{attrs:{id:"本地目录挂载"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#本地目录挂载"}},[v._v("#")]),v._v(" 本地目录挂载")]),v._v(" "),_("p",[v._v("本地查看容器是否有数据卷")]),v._v(" "),_("p",[v._v("docker run")]),v._v(" "),_("ul",[_("li",[v._v("-v 本地目录:容器内目录\n"),_("ul",[_("li",[v._v("example: -v ./mysql:/var/lib/mysql")])])])]),v._v(" "),_("p",[v._v("任务：挂载")]),v._v(" "),_("p",[v._v("通过挂载可以直接把数据库的表和数据放进去吗？")]),v._v(" "),_("h3",{attrs:{id:"dockerfile-语法"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#dockerfile-语法"}},[v._v("#")]),v._v(" DockerFile 语法")]),v._v(" "),_("p",[v._v("镜像就是包含了应用程序、程序运行的系统函数库、运行配置等文件的文件包。\n构建镜像就是把上述文件打包的过程。")]),v._v(" "),_("p",[v._v("部署一个java应用的步骤:")]),v._v(" "),_("ol",[_("li",[v._v("准备一个linux服务器")]),v._v(" "),_("li",[v._v("安装jre并配置环境变量")]),v._v(" "),_("li",[v._v("拷贝jar包")]),v._v(" "),_("li",[v._v("运行jar包")])]),v._v(" "),_("p",[v._v("构建一个java镜像的步骤")]),v._v(" "),_("ol",[_("li",[v._v("准备一个linux服务器")]),v._v(" "),_("li",[v._v("安装jre并配置环境变量")]),v._v(" "),_("li",[v._v("拷贝jar包")]),v._v(" "),_("li",[v._v("编写运行脚本")])]),v._v(" "),_("p",[v._v("镜像结构：")]),v._v(" "),_("p",[v._v("入口：Entrypoint")]),v._v(" "),_("p",[v._v("层：Layer\n添加安装包、依赖、配置等、每次操作都形成新的一层。")]),v._v(" "),_("p",[v._v("基础镜像：BaseImage")]),v._v(" "),_("h4",{attrs:{id:"dockerfile指令"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#dockerfile指令"}},[v._v("#")]),v._v(" DockerFile指令")]),v._v(" "),_("ul",[_("li",[v._v("FROM 指定基础镜像")]),v._v(" "),_("li",[v._v("ENV 设置环境变量")]),v._v(" "),_("li",[v._v("COPY 拷贝本地文件到镜像的指定目录")]),v._v(" "),_("li",[v._v("RUN 执行linux的shell命令")]),v._v(" "),_("li",[v._v("EXPOSE 指定容器运行时监听的端口")]),v._v(" "),_("li",[v._v("ENTRYPOINT 镜像中应用的启动命令，容器运行时调用")])]),v._v(" "),_("p",[v._v("利用dockerFile描述镜像结构，记得备份就行了")]),v._v(" "),_("h3",{attrs:{id:"自定义镜像"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#自定义镜像"}},[v._v("#")]),v._v(" 自定义镜像")]),v._v(" "),_("p",[v._v("docker build")]),v._v(" "),_("ul",[_("li",[v._v("-t 镜像起名")]),v._v(" "),_("li",[v._v(". 指定Dockerfile所在目录")])]),v._v(" "),_("p",[v._v("好像是可以把自己的项目部署上去")]),v._v(" "),_("h3",{attrs:{id:"容器网络互联"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#容器网络互联"}},[v._v("#")]),v._v(" 容器网络互联")]),v._v(" "),_("p",[v._v("所有容器都是以bridge链接到Docker的一个虚拟网桥上")]),v._v(" "),_("p",[v._v("docker0 网桥")]),v._v(" "),_("p",[v._v("自定义网络")]),v._v(" "),_("p",[v._v("通过ip addr获得信息")]),v._v(" "),_("p",[v._v("通过自定义，可以很方便访问自己，相当于一个局域网")]),v._v(" "),_("p",[v._v("docker network")]),v._v(" "),_("ul",[_("li",[v._v("create 创建一个网络")]),v._v(" "),_("li",[v._v("ls 查看所有网络")]),v._v(" "),_("li",[v._v("rm 删除指定网络")]),v._v(" "),_("li",[v._v("prune 清除未使用网络")]),v._v(" "),_("li",[v._v("connect 指定容器连接加入某网络")]),v._v(" "),_("li",[v._v("disconnect 指定容器连接离开某网络")]),v._v(" "),_("li",[v._v("inspect 查看网络详细信息")])]),v._v(" "),_("h2",{attrs:{id:"项目部署"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#项目部署"}},[v._v("#")]),v._v(" 项目部署")]),v._v(" "),_("h3",{attrs:{id:"部署java应用"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#部署java应用"}},[v._v("#")]),v._v(" 部署java应用")]),v._v(" "),_("p",[v._v("打包jar包，然后传到服务器，然后进行build")]),v._v(" "),_("h3",{attrs:{id:"部署前端"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#部署前端"}},[v._v("#")]),v._v(" 部署前端")]),v._v(" "),_("p",[v._v("nginx，创建容器挂载，同一个网络")]),v._v(" "),_("h3",{attrs:{id:"dockercompose"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#dockercompose"}},[v._v("#")]),v._v(" DockerCompose")]),v._v(" "),_("p",[v._v("手动部署太麻烦了")]),v._v(" "),_("p",[v._v("引出docker compose，通过一个单独的yaml文件，来定义一组相关联的应用容器，\n帮助我们实现多个相互关联的docker容器的快速部署")]),v._v(" "),_("p",[v._v("项目，服务")]),v._v(" "),_("h2",{attrs:{id:"自己实践"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#自己实践"}},[v._v("#")]),v._v(" 自己实践")]),v._v(" "),_("ol",[_("li",[v._v("如何将本地mysql的表数据同步服务器，使用datagrip，用mysqldump导出sql，使用mysql导入sql")]),v._v(" "),_("li",[v._v("本地项目打包成jar包以及dockerfile，传输到服务器，使用scp命令，私钥传输")]),v._v(" "),_("li",[v._v("在Linux服务器进行了项目部署，先build，后run，看启动日志，测试接口请求的正确性")]),v._v(" "),_("li",[v._v("部署了前端，使用nginx，自己试了试，最后发现还是之前自己配置的好呀")])]),v._v(" "),_("p",[v._v("反复看了一下")]),v._v(" "),_("ul",[_("li",[v._v("dockerfile -> 创建镜像")]),v._v(" "),_("li",[v._v("docker run -> 创建容器")]),v._v(" "),_("li",[v._v("网关设置")]),v._v(" "),_("li",[v._v("nginx配置")]),v._v(" "),_("li",[v._v("jar包上传")])]),v._v(" "),_("p",[v._v("下一篇啦！！！")])])}),[],!1,null,null,null);_.default=t.exports}}]);