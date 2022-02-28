# startLine-caricature-admin

## 简介

> 这是一个基于最火之一的前沿技术-微服务开发的漫画网站，前后端采用阿里云的云服务技术一体化技术，包含了前端 vue + 云后端 node（云数据库，云函数，云存储）

## 准备前序

#### 环境安装

你需要在本地安装 node 和 git。同时你需要阅读以下文档来帮助你快速上手，因为此项目是基于该框架或组件库开发而来。

#### 阅读文档

> 请至少阅读 Uni 文档，用于帮助你快速上手。

1.  [uView 多平台快速开发的 UI 框架](https://www.uviewui.com/)
2.  [uni-app 使用 Vue.js 开发所有前端应用的框架](https://uniapp.dcloud.io/)
3.  [uniCloud 是云端一体化的后端云服务](https://uniapp.dcloud.io/uniCloud/README)
4.  [vk-uniCloud 基于 uniCloud 封装的一体化框架](https://vkdoc.fsq.pub/)

#### 下载 Hbuilderx 编译器

1. [Hbuilderx 下载地址](https://www.dcloud.io/hbuilderx.html)
2. 此项目有 scss,uni-app 等预处理, 请先下载对应的插件后运行。

### 云服务

1. 请先按照相关文档申请云空间服务。[uniCloud 控制台](https://unicloud.dcloud.net.cn/)
2. 请先将 admin 端 绑定云空间之后，并且完成初始化向导。

#### 配置敏感文本，图片检测，短信验证

> 登录或注册的验证码 需要配置发送邮件的邮箱

1.  [内容安全检测文档](https://vkdoc.fsq.pub/client/uniCloud/plus/weixin.html#_1-2%E3%80%81%E5%86%85%E5%AE%B9%E5%AE%89%E5%85%A8)

> 登录或注册需要配置发送邮件的邮箱

2. [发送邮箱验证码文档](https://vkdoc.fsq.pub/client/uniCloud/plus/mail.html#_4%E3%80%81%E5%8F%91%E9%80%81%E9%82%AE%E7%AE%B1%E9%AA%8C%E8%AF%81%E7%A0%81)

如有问题请先看上述使用文档和文章，若不能满足，欢迎 issue 和 pr

## 功能

```
- 登录 / 登出

- 评论管理

- 漫画设置管理
  - 分类管理
  - 漫画管理

- 用户角色权限权限
  - 用户管理
  - 角色管理
  - 权限管理
  - 菜单管理

- 系统设置
  - 素材管理
  - 系统缓存管理
  - 动态组件管理
  - 用户登录日志
```

## 目录

### 管理台前端目录

```bash
src
└─common 公共模块
├─components   // 组件
│   ├─shmily-drag-image     //图片拖动组件
│   └─vk-data-input-editor  //输入组件
│
├─pages  // 开发页面目录
│   ├─caricature    //漫画管理
│   ├─category      // 分类管理
│   ├─login         // 登录
│   ├─comment       // 评论管理
│   └─index         // 管理台首页
│
└─pages_plugs         // 框架集成系统管理模块
│   ├─systemt         //用户角色权限管理
│   ├─system_uni      //系统设置
│   └─error           //错误页面
└─static                    // 静态资源
└─pages_template            // 框架模板
└─store                     // vuex
└─uni_modules               // 差距管理模块
└─uniCloud-aliyun           // uni-cloud开发目录
└─App.vue                   // 入口vue
└─main                      // 入口文件
└─app.config                // 配置文件
```

### 后端路由目录

> 以下的目录并非强制性，只是建议，便于统一开发规范。

```bash
.
├── service──────────────────────# 业务逻辑层（用于写业务逻辑）
│ └── admin────────────────# 后台管理端业务逻辑
│ ── └── user─────────────────# 用户管理（自己系统的逻辑）
│ ──── └── kh───────────────────# kh函数为必须登录后才能访问的函数
│ ──── └── pub──────────────────# pub函数为所有人都可以访问,不限制
│ ──── └── sys──────────────────# sys函数为需要特定授权才可以访问的函数
│ ──── └── util─────────────────# 用户管理专用的工具包
│ ── └── order────────────────# 订单服务（自己系统的逻辑）
│ ──── └── kh───────────────────# kh函数为必须登录后才能访问的函数
│ ──── └── pub──────────────────# pub函数为所有人都可以访问,不限制
│ ──── └── sys──────────────────# sys函数为需要特定授权才可以访问的函数
│ ──── └── util─────────────────# 订单管理专用的工具包
│ ── └── system───────────────# 系统管理（用户、角色、权限、菜单、应用）
│ ── └── system_uni───────────# 框架内置一些其他通用功能管理
│ └── client───────────────# 客户端业务逻辑（H5、小程序、APP）
│ ── └── user─────────────────# 用户服务（自己系统的逻辑）
│ ──── └── kh───────────────────# kh函数为必须登录后才能访问的函数
│ ──── └── pub──────────────────# pub函数为所有人都可以访问,不限制
│ ──── └── util─────────────────# 用户服务专用的工具包
│ ── └── order────────────────# 订单服务（自己系统的逻辑）
│ ──── └── kh───────────────────# kh函数为必须登录后才能访问的函数
│ ──── └── pub──────────────────# pub函数为所有人都可以访问,不限制
│ ──── └── util─────────────────# 订单服务专用的工具包
│ ── └── xxxxxxxxxxxxxxx──────#
│ ── └── xxxxxxxxxxxxxxx──────#
│ └── common───────────────# 公共逻辑（公共接口）
│ ── └── xxxxxxxxxxxxxxxx─────#
│ ── └── xxxxxxxxxxxxxxxx─────#
│ ── └── xxxxxxxxxxxxxxxx─────#
│ └── user─────────────────# 统一用户中心服务(已集成uniID)（用户中心作为核心，且为了方便插件升级,故与admin和client平级）
│ ── └── kh───────────────────# kh函数为必须登录后才能访问的函数(客户端用户)
│ ── └── pub──────────────────# pub函数为所有人都可以访问,不限制
│ ── └── sys──────────────────# sys函数为后端管理人员才能访问的函数(商家后台工作人员)
│ ── └── util─────────────────# 统一用户中心服务专用的工具包
│ └── plugs───────────────# 插件逻辑（插件专用）（会陆续新增一些实用性插件给开发者使用，如微信小程序发送订阅消息等等）
│ ──└── plugs-A───────────────────# 插件A
│ ────└── admin───────────────────# 插件A admin端
│ ────└── client──────────────────# 插件A client端
│ ──└── plugs-B───────────────────# 插件B
│ ────└── admin───────────────────# 插件B admin端
│ ────└── client──────────────────# 插件B client端
│ └── template─────────────# 云函数模板（插件内的云函数写法模板）
│ ── └── db_api───────────────# 数据库接口调用模板
│ └── muban.js─────────────# 云函数模板（新建一个云函数应复制粘贴这个文件）
│ └── muban_easy.js────────# 云函数模板（简易版）
└─────────────────────────────────
```
<b>其中目录结构如下<b>

1. caricature 漫画模块
2. caricatureContent 漫画内容管理
3. category 分类模块
4. comment 评论模块
5. system 权限管理
6. system_uni 系统管理

## 开发

```bash
# 克隆项目
git clone https://github.com/startLine-05/startline-caricature.git

# 进入项目目录
cd startline-caricature

# 安装依赖
npm install

# 使用uni 编辑器打开项目

# 云服务空间初始化向导

# 运行置浏览器
```

## 预览

> 账号：startline_05@163.com
> 密码：123456

[在线预览](https://static-3ea692f6-5a08-4910-a093-a4a8fab5ac7c.bspapp.com/admin)

## Browsers support

Modern browsers and Internet Explorer 10+.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Safari |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE10, IE11, Edge                                                                                                                                                                                                 | last 2 versions                                                                                                                                                                                                    | last 2 versions                                                                                                                                                                                                | last 2 versions                                                                                                                                                                                                |

## License

MIT

Copyright (c) 2022-present XianYu
