(window.webpackJsonp=window.webpackJsonp||[]).push([[87],{496:function(s,a,n){"use strict";n.r(a);var t=n(2),e=Object(t.a)({},(function(){var s=this,a=s._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h1",{attrs:{id:"relaxchat部署"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#relaxchat部署"}},[s._v("#")]),s._v(" RelaxChat部署")]),s._v(" "),a("h2",{attrs:{id:"后端部署"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#后端部署"}},[s._v("#")]),s._v(" 后端部署")]),s._v(" "),a("h3",{attrs:{id:"打包"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#打包"}},[s._v("#")]),s._v(" 打包")]),s._v(" "),a("p",[s._v("打包 解决pom依赖问题")]),s._v(" "),a("p",[s._v("然后maven那边选择自己的服务，进行package")]),s._v(" "),a("h3",{attrs:{id:"dockerfile配置"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#dockerfile配置"}},[s._v("#")]),s._v(" dockerfile配置")]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 使用官方的 Java 运行时作为基础镜像")]),s._v("\nFROM openjdk:17-jdk-alpine\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 设置工作目录")]),s._v("\nWORKDIR /usr/src/app\n\nENV "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("TZ")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("Asia/Shanghai\nRUN "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("ln")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-snf")]),s._v(" /usr/share/zoneinfo/"),a("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$TZ")]),s._v(" /etc/localtime "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&&")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("echo")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$TZ")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" /etc/timezone\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 将你的 jar 包复制到 Docker 镜像中")]),s._v("\nCOPY relax-chat-server-1.0-SNAPSHOT.jar /usr/src/app\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 设置启动命令，当容器启动时运行你的 jar 包")]),s._v("\nCMD "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"java"')]),s._v(", "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"-jar"')]),s._v(", "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"relax-chat-server-1.0-SNAPSHOT.jar"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br")])]),a("p",[s._v("环境配置文件")]),s._v(" "),a("h3",{attrs:{id:"上传jar包和dockerfile"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#上传jar包和dockerfile"}},[s._v("#")]),s._v(" 上传jar包和dockerfile")]),s._v(" "),a("p",[s._v("详情请看服务器使用关于mac如何上传文件到服务器上")]),s._v(" "),a("h3",{attrs:{id:"构建镜像"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#构建镜像"}},[s._v("#")]),s._v(" 构建镜像")]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("docker")]),s._v(" build "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-t")]),s._v(" relaxchat"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("版本号"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("h3",{attrs:{id:"运行镜像"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#运行镜像"}},[s._v("#")]),s._v(" 运行镜像")]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 配置spring文件 注意服务器的防火墙/安全组是否打开了")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("docker")]),s._v(" run "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-itd")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("--name")]),s._v(" relaxChat_版本号 "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-p")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("8080")]),s._v(":8080 "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-p")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("8090")]),s._v(":8090 "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-e")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("SPRING_PROFILES_ACTIVE")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("prod relaxchat_版本号\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br")])]),a("h3",{attrs:{id:"踩的坑"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#踩的坑"}},[s._v("#")]),s._v(" 踩的坑")]),s._v(" "),a("ul",[a("li",[s._v("忘记换配置文件了")])]),s._v(" "),a("p",[s._v("直接用test，直接访问不到服务，解决防范")]),s._v(" "),a("ul",[a("li",[s._v("设置了环境配置文件prod")])]),s._v(" "),a("p",[s._v("内存不够，小小服务器直接启动不起来项目，")]),s._v(" "),a("ul",[a("li",[s._v("docker运行忘记映射两个端口了～")])]),s._v(" "),a("h4",{attrs:{id:"检查镜像运行状况"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#检查镜像运行状况"}},[s._v("#")]),s._v(" 检查镜像运行状况")]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 看看启动容器的运行状态")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("docker")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("ps")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 看所有容器的运行状态")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("docker")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("ps")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-a")]),s._v("\n\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 查看服务器端口使用状态，检查自己的项目是否启动成功")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("netstat")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-lnpt")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br")])]),a("h2",{attrs:{id:"前端部署"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#前端部署"}},[s._v("#")]),s._v(" 前端部署")]),s._v(" "),a("h3",{attrs:{id:"修改前端访问后端接口"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#修改前端访问后端接口"}},[s._v("#")]),s._v(" 修改前端访问后端接口")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 测试服")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("VITE_API_PREFIX")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("http://127.0.0.1:8080\n"),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("VITE_WS_URL")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("ws://127.0.0.1:8090\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 正式服，加后缀方便nginx识别路径并反向代理")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("VITE_API_PREFIX")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("http://xxx.xxx.xxx.xxx:80/api\n"),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("VITE_WS_URL")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("ws://xxx.xxx.xxx.xxx:80/ws\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br")])]),a("h3",{attrs:{id:"启动项目"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#启动项目"}},[s._v("#")]),s._v(" 启动项目")]),s._v(" "),a("ol",[a("li",[s._v("注意node.js版本，可以使用nvm来管理")])]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# mac安装node ")]),s._v("\nbrew upgrade node@18.20.4\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# pnpm包管理工具")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("npm")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("pnpm")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-g")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 依赖安装")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("pnpm")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 运行项目")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("pnpm")]),s._v(" run dev\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br")])]),a("h3",{attrs:{id:"打包项目"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#打包项目"}},[s._v("#")]),s._v(" 打包项目")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 打包项目， ts项目，可能会校验ts的类型，如果不想校验，想打包直接成功，可以把type check先删掉")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("pnpm")]),s._v(" build\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br")])]),a("h2",{attrs:{id:"nginx相关"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#nginx相关"}},[s._v("#")]),s._v(" nginx相关")]),s._v(" "),a("h3",{attrs:{id:"安装和启动"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#安装和启动"}},[s._v("#")]),s._v(" 安装和启动")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 安装")]),s._v("\nyum "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token parameter variable"}},[s._v("-y")]),s._v(" nginx\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 启用 Nginx")]),s._v("\nsystemctl start nginx\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 设置为在系统启动时自动启动")]),s._v("\nsystemctl "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("enable")]),s._v(" nginx\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 打开浏览器，输入服务器ip，看看是否有页面展示，没有就去看看防火墙")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br")])]),a("h3",{attrs:{id:"配置"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#配置"}},[s._v("#")]),s._v(" 配置")]),s._v(" "),a("div",{staticClass:"language-conf line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("http{\n\n  #不限制的ip\n  geo $limit {\n      default 1;\n      127.0.0.1 0;     # 本机地址\n  }\n\n  map $limit $limit_key {\n      0 \"\";\n      1 $binary_remote_addr;\n  }\n  #频控全局配置\n  limit_req_zone $limit_key zone=one:2m rate=10r/s;\n\n  server {\n      # 前端服务\n      listen 9090;\n\n      #频控生效位置\n      limit_req zone=one burst=10 nodelay;\n\n      location / {\n          root /project/relaxchat/dist/;\n          index index.html;\n          try_files $uri $uri/ /index.html;\n      }\n\n      # 后端服务\n      location /api/ {\n          proxy_pass http://后端项目springboot服务ip:8080/;\n          # 设置允许跨域的域，* 表示允许任何域，也可以设置特定的域\n          add_header 'Access-Control-Allow-Origin' '*';\n          # 允许的方法\n          add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';\n          # 允许的头信息字段\n          add_header 'Access-Control-Allow-Headers' 'User-Agent,Keep-Alive,Content-Type';\n          # 缓存时间\n          add_header 'Access-Control-Max-Age' 1728000;\n\n          proxy_set_header X-Real-IP $remote_addr;\n          proxy_set_header REMOTE-HOST $remote_addr;\n          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n          proxy_set_header X-NginX-Proxy true;\n          proxy_set_header Host $host;\n\n          proxy_set_header Connection '';\n          proxy_http_version 1.1;\n          chunked_transfer_encoding off;\n          proxy_buffering off;\n          proxy_cache off;\n      }\n\n      location /ws {\n          proxy_pass http://后端项目ws服务ip:8090/;\n          # 升级协议\n          proxy_http_version 1.1;\n          proxy_set_header X-Real-IP $remote_addr;\n          proxy_set_header Upgrade $http_upgrade;\n          proxy_set_header Connection \"upgrade\";\n          proxy_read_timeout 600s;\n      }\n\n      error_page 404 /404.html;\n      location = /404.html {}\n\n      error_page 500 502 503 504 /50x.html;\n      location = /50x.html {}\n  }\n}\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br"),a("span",{staticClass:"line-number"},[s._v("15")]),a("br"),a("span",{staticClass:"line-number"},[s._v("16")]),a("br"),a("span",{staticClass:"line-number"},[s._v("17")]),a("br"),a("span",{staticClass:"line-number"},[s._v("18")]),a("br"),a("span",{staticClass:"line-number"},[s._v("19")]),a("br"),a("span",{staticClass:"line-number"},[s._v("20")]),a("br"),a("span",{staticClass:"line-number"},[s._v("21")]),a("br"),a("span",{staticClass:"line-number"},[s._v("22")]),a("br"),a("span",{staticClass:"line-number"},[s._v("23")]),a("br"),a("span",{staticClass:"line-number"},[s._v("24")]),a("br"),a("span",{staticClass:"line-number"},[s._v("25")]),a("br"),a("span",{staticClass:"line-number"},[s._v("26")]),a("br"),a("span",{staticClass:"line-number"},[s._v("27")]),a("br"),a("span",{staticClass:"line-number"},[s._v("28")]),a("br"),a("span",{staticClass:"line-number"},[s._v("29")]),a("br"),a("span",{staticClass:"line-number"},[s._v("30")]),a("br"),a("span",{staticClass:"line-number"},[s._v("31")]),a("br"),a("span",{staticClass:"line-number"},[s._v("32")]),a("br"),a("span",{staticClass:"line-number"},[s._v("33")]),a("br"),a("span",{staticClass:"line-number"},[s._v("34")]),a("br"),a("span",{staticClass:"line-number"},[s._v("35")]),a("br"),a("span",{staticClass:"line-number"},[s._v("36")]),a("br"),a("span",{staticClass:"line-number"},[s._v("37")]),a("br"),a("span",{staticClass:"line-number"},[s._v("38")]),a("br"),a("span",{staticClass:"line-number"},[s._v("39")]),a("br"),a("span",{staticClass:"line-number"},[s._v("40")]),a("br"),a("span",{staticClass:"line-number"},[s._v("41")]),a("br"),a("span",{staticClass:"line-number"},[s._v("42")]),a("br"),a("span",{staticClass:"line-number"},[s._v("43")]),a("br"),a("span",{staticClass:"line-number"},[s._v("44")]),a("br"),a("span",{staticClass:"line-number"},[s._v("45")]),a("br"),a("span",{staticClass:"line-number"},[s._v("46")]),a("br"),a("span",{staticClass:"line-number"},[s._v("47")]),a("br"),a("span",{staticClass:"line-number"},[s._v("48")]),a("br"),a("span",{staticClass:"line-number"},[s._v("49")]),a("br"),a("span",{staticClass:"line-number"},[s._v("50")]),a("br"),a("span",{staticClass:"line-number"},[s._v("51")]),a("br"),a("span",{staticClass:"line-number"},[s._v("52")]),a("br"),a("span",{staticClass:"line-number"},[s._v("53")]),a("br"),a("span",{staticClass:"line-number"},[s._v("54")]),a("br"),a("span",{staticClass:"line-number"},[s._v("55")]),a("br"),a("span",{staticClass:"line-number"},[s._v("56")]),a("br"),a("span",{staticClass:"line-number"},[s._v("57")]),a("br"),a("span",{staticClass:"line-number"},[s._v("58")]),a("br"),a("span",{staticClass:"line-number"},[s._v("59")]),a("br"),a("span",{staticClass:"line-number"},[s._v("60")]),a("br"),a("span",{staticClass:"line-number"},[s._v("61")]),a("br"),a("span",{staticClass:"line-number"},[s._v("62")]),a("br"),a("span",{staticClass:"line-number"},[s._v("63")]),a("br"),a("span",{staticClass:"line-number"},[s._v("64")]),a("br"),a("span",{staticClass:"line-number"},[s._v("65")]),a("br"),a("span",{staticClass:"line-number"},[s._v("66")]),a("br"),a("span",{staticClass:"line-number"},[s._v("67")]),a("br"),a("span",{staticClass:"line-number"},[s._v("68")]),a("br"),a("span",{staticClass:"line-number"},[s._v("69")]),a("br"),a("span",{staticClass:"line-number"},[s._v("70")]),a("br")])]),a("p",[s._v("编辑完nginx.conf文件后记得刷新")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 刷新nginx")]),s._v("\nsystemctl reload nginx\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br")])])])}),[],!1,null,null,null);a.default=e.exports}}]);