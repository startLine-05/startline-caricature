### uniCloud云函数路由框架研究Q群:22466457 如有问题或建议可以在群内讨论。
### 插件名称：`vk-unicloud-router`
### 作者：VK

## 序
##### 如果你热爱编程，想快速入门云开发，欢迎使用`vk-unicloud`系列开发框架
##### 无需转变开发习惯，0成本上手云开发。
##### 框架内置了众多API、工具包，为你的业务扫平障碍。使你的项目刚起步进度就是50%（微信登录、短信、验证码、缓存、生成小程序码等等）
##### 从此你又get一个新技能，只需用js，轻松搞定前后台整体业务。
##### 完整框架项目地址：
##### `client端`框架地址： [https://ext.dcloud.net.cn/plugin?id=2204](https://ext.dcloud.net.cn/plugin?id=2204)
##### `admin端`框架地址：[https://ext.dcloud.net.cn/plugin?id=5043](https://ext.dcloud.net.cn/plugin?name=vk-unicloud-admin)
##### `client端`框架文档：[点击查看](https://vkdoc.fsq.pub/client/)
##### `admin端`框架文档：[点击查看](https://vkdoc.fsq.pub/admin/)
##### 框架学习Q群：`22466457` 欢迎萌新和大佬来使用和共同改进框架

## 主要功能 以及 对开发者的价值

#### 1、实现云函数路由模式
```
1.1、路由模式不使用任何第三方包，兼容性强，运行稳定
1.2、减少云函数数量，云函数有个数限制（用一个云函数即可实现多个云函数效果）
1.3、部分通用的代码块可以放在公共区执行，具有公共函数的效果，增加代码复用率，便于维护。
1.4、可以在开发环境和生产环境中任意切换，开发时，用开发环境，开发过程中不会影响到线上环境。（具体切换方法在文档最后）
1.5、美化云函数请求过程中的日志排版，使请求日志一目了然。（再也不用为日志分散，难找而头疼）
1.6、可以强制关闭云端服务（适用于需要临时关闭后端服务的情况，如腾讯云迁移数据到阿里云时需要先关闭服务，否则迁移过程中会有新数据产生）
```

#### 2、实现`全局过滤器`，过滤非法请求。您无需关心用户角色权限问题。

#### 3、众多现成的`JS API`，让您无需重复造轮子。（持续增加中）

#### 4、众多现成的`云函数 API`，为您的业务扫平障碍，让您可以专注于自身业务开发。（微信登录、短信、验证码、缓存、生成小程序码等等）（持续增加中）

#### 5、全面支持`url化`的云函数请求，您无需关心url化后参数的获取问题

#### 6、已集成`uni-id` 当前版本:`3.3.9`（已支持真实发送邮箱验证码和阿里云短信验证码）
```
6.1、由于每个应用基本都会用上用户系统，官方建议所有`uniCloud`应用均使用`uni-id`作为用户体系，
有了统一的账户规范，并且围绕这套账户规范，有各种各样插件，那么开发者可以随意整合这些插件，让数据连同。

6.2、同时方便其他用户使用`unicloud`插件发布者发布的前后端一体插件，只需要导入一个云函数即可。
(如导入一个社区插件，可能要导入几十个云函数，而使用此云函数路由后，只需导入一个云函数，且已集成`uni-id`，打通账号体系)。
```

#### 7、在`uni-id`基础上升级为 `vk.userCenter` 用户中心API 通过this.vk.userCenter 即可调用
 
#### 8、封装`uni.callFunction` 和 `uni.request` 使之合二为一 通过this.vk.callFunction 调用

#### 9、`vk.baseDao` 数据库API，使小白也能轻松上手对数据库的调用。`1.7.0`起支持`数据库事务` [点击查看](https://vkdoc.fsq.pub/client/uniCloud/db/api.html)

#### 10、`vk.baseDao.selects` 数据库万能连表查询API [点击查看](https://vkdoc.fsq.pub/client/uniCloud/db/selects.html)

#### 11、集成 `uview-ui` UI框架（感谢`uview-ui`作者）。

#### 12、`商品SKU选择器组件`（打造uni插件市场功能最全的SKU选择器组件）

#### 13、对 `Vuex` 进行了深度封装（支持持久化），现在可以很方便的使用Vuex进行读取和储存。[点击查看](https://vkdoc.fsq.pub/client/pages/vuex.html)

#### 14、自定义过滤器（在业务云函数执行之前(或之后)，统一拦截，进行过滤后再放行，支持设置多个过滤器，并按指定顺序执行）

#### 15、支持设置需要登录的页面列表或不需要登录的页面列表（通过本地token检测，无网络请求，支持通配符写法）

#### 16、支持设置可以被分享的页面列表或禁止分享的页面列表（支持通配符写法）

#### 17、`vk.localStorage` 封装本地缓存的curd，同时具有监听缓存被更新和被删除的功能。[点击查看用法](https://vkdoc.fsq.pub/client/pages/localStorage.html)

#### 18、美化云函数请求过程中的日志排版，使请求日志一目了然。

#### 19、可以`强制关闭`云端服务（适用于需要临时关闭后端服务的情况，如腾讯云迁移数据到阿里云时需要先关闭服务，否则迁移过程中会有新数据产生）

#### 20、全局数据缓存API，现在可以很方便的在云函数中使用缓存。 [点击查看详情](https://vkdoc.fsq.pub/client/uniCloud/cache/cache.html)

#### 21、【1.8.0 新增】微信小程序服务端API [点击查看文档](https://vkdoc.fsq.pub/client/uniCloud/plus/weixin.html)

#### 22、【1.8.12 新增】百度开放平台服务端API [点击查看文档](https://vkdoc.fsq.pub/client/uniCloud/plus/baidu.html)

#### 23、【1.9.1 新增】【全网首家】云函数URL化之URL重写 [点击查看文档](https://vkdoc.fsq.pub/client/uniCloud/cloudfunctions/urlrewrite.html)

#### 24、作者亲自在群内解答框架使用问题，让你轻松上手`uniCloud云开发`。

#### 25、其他好处…

##### 插件首页体验地址

![插件首页体验地址](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-vk-cloud-router-test/51de83e0-e9ae-11ea-81ea-f115fe74321c.png?x-oss-process=image/resize,h_250 "插件首页体验地址")
 
## 快速上手

[点击查看『安装步骤』](https://vkdoc.fsq.pub/client/quickstart.html)

## 云函数框架目录结构

```
.
├── common─────────────────# 自定义官方公共模块包
│ └── config──────────────────# 全局配置公共模块
│ └── uni-id──────────────────# uni-id官方公共模块
│ └── vk-unicloud─────────────# vk-unicloud公共模块
├── router─────────────────# 正式环境云函数主入口(函数路由器)
│ └── dao──────────────────# dao层(数据库交互公共API)
│ └── middleware───────────# 中间层(过滤器、拦截器)
│ └── node_modules─────────# npm包
│ └── service──────────────# 逻辑层(用于写业务逻辑)
│ ── └── 逻辑层目录结构在下方单独展示
│ └── util─────────────────# 工具包
│ ── └── pubFunction.js───────# 公共函数包
│ ── └── smsUtil.js───────────# 全局过滤器
│ └── config.js────────────# 入口函数初始化配置
│ └── index.js─────────────# 入口函数
│ └── package.json─────────# 第三方依赖配置文件(若使用npm，自动生成)
└─└── package-lock.json────# 第三方依赖配置文件(若使用npm，自动生成)
.
├── router-test───────────────# 函数路由(开发测试环境)
│ └── ...─────────# ...
│ └── ...─────────# ...
└── └── ...─────────# ...
```

### 逻辑层目录结构
#### `router/service` 目录为逻辑层
#### 以下的目录并非强制性，只是建议，便于统一开发规范。

```
.
├── service──────────────────────# 逻辑层（用于写业务逻辑）
│ └── admin────────────────# 后台管理端逻辑（admin框架开发中。。。）
│ ── └── xxxxxxxxxxxxxxx──────# 
│ ── └── xxxxxxxxxxxxxxx──────# 
│ ── └── xxxxxxxxxxxxxxx──────# 
│ ── └── xxxxxxxxxxxxxxx──────# 
│ └── client───────────────# 客户端逻辑（H5、小程序、APP）
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


## 云函数service模板文件示例
```js
module.exports = {
  /**
  * 此函数名称
  * @url user/sys/test1 前端调用的url参数地址
  * @description 此函数描述
  * @params {Object} data 请求参数
  * @params {String} uniIdToken 用户token
  * @params {String} userInfo 当前登录用户信息(同理,是可信任的)(只有kh函数才带此参数)
  * @params {Object} util 公共工具包
	* @params {Object} filterResponse 过滤器返回的数据
  * @params {Object} originalParam 原始请求参数(包含了原始event和context)
  * data 请求参数 说明
  * @params {String} uid  当前登录用户id,若用户已登录且token有效,则data中会带uid参数
  * (此参数是后端过滤器通过token获取并添加到data中的,是可信任的)(只有kh函数才带此参数)
  * res 返回参数说明
  * @params {Number} code 错误码，0表示成功
  * @params {String} msg 详细信息
  */
  main: async (event) => {
    let { data = {}, userInfo, util, filterResponse, originalParam } = event;
    let { customUtil, uniID, config, pubFun, vk , db, _ } = util;
    let { uid } = data;
    let res = { code : 0, msg : '' };
    // 业务逻辑开始----------------------------------------------------------- 
    // 可写与数据库的交互逻辑等等
  
  
    // 业务逻辑结束-----------------------------------------------------------
    return res;
  }
}
```
#### 成功时返回
```js
// 注意：所有成功请求必须返回code：0 code为其他值，代表失败，如兑换失败，您的积分不足！
// 如成功时返回 res.code = 0 表示执行成功;
return {
  code : 0,
  msg : '兑换成功！' 
}
```
#### 失败时返回
```js
return {
  code : -1,
  msg : '兑换失败，您的积分不足！'
}

```

## this.vk.callFunction函数的参数说明
```js
/**
 * 云函数请求封装 - 统一入口
 * @description 通过云函数路由，1个云函数实现多个云函数的效果。
 * @params {String}   url       请求路径，该路径实为router云函数的service目录下的路径
 * @params {Object}   data      请求参数
 * @params {String}   title     遮罩层提示语，为空或不传则代表不显示遮罩层。
 * @params {Boolean}  isRequest 是否使用云函数url化地址访问云函数，默认false
 * @params {Boolean}  needAlert 为true代表请求错误时，会有alert弹窗提示。默认为true
 * @params {Function} success   请求成功时，执行的回调函数
 * @params {Function} fail      请求失败时，执行的回调函数
 * @params {Function} complete  无论请求成功与否，都会执行的回调函数
 */
```


## 前端调用云函数示例

```js

this.vk.callFunction({
	url: 'user/kh/setAvatar',
	title:'请求中...',
	data:{
		avatar: "https://xxxxxxx.jpg"
	},
	success(data) {
		// 修改成功
	}
});

```

## 云函数url化方式调用云函数示例

[点击查看『云函数url化』方式调用云函数示例](https://vkdoc.fsq.pub/client/pages/callFunctionForUrl.html)

## 前端非法token拦截器

[点击查看『前端非法token拦截器』](https://vkdoc.fsq.pub/client/pages/interceptor1.html)

## vk.baseDao数据库API

[点击查看『vk.baseDao』数据库API](https://vkdoc.fsq.pub/client/uniCloud/db/api.html)

## 设置全局请求参数

[点击查看『设置全局请求参数』](https://vkdoc.fsq.pub/client/pages/updateRequestGlobalParam.html)

## 列表渲染前后端一体模板

[点击查看『列表渲染』前后端一体模板](https://vkdoc.fsq.pub/client/pages/list.html)

## 商品SKU选择器组件

[点击查看『商品SKU选择器组件』](https://gitee.com/vk-uni/vk-uni-cloud-router/wikis/pages?sort_id=2912199&doc_id=975983)

## 如何切换 正式环境 和 开发环境

[点击查看如何『切换正式环境和开发环境』](https://vkdoc.fsq.pub/client/question/q1.html)

## 本插件更新步骤
[点击查看本插件『更新步骤』](https://vkdoc.fsq.pub/client/changeGuide.html)

## uniCloud云函数路由框架研究Q群:`22466457` 如有问题或建议可以在群内讨论。

### 如果你觉得框架对你有用，可以在下方进行评论，也可以进行赞赏。