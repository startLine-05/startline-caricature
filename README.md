
![](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-cf0c5e69-620c-4f3c-84ab-f4619262939f/ad18e7d6-ae0e-4424-bf3d-6e3dad1036a1.png)

### 插件名称：`vk-unicloud-admin`
### 作者：VK

## 序
* 如果你热爱编程，想快速入门云开发，欢迎使用`vk-unicloud`系列开发框架
* 无需转变开发习惯，0成本上手云开发。
* 框架内置了众多API、工具包，为你的业务扫平障碍。使你的项目刚起步进度就是50%（微信登录、短信、验证码、缓存、生成小程序码等等）
* 从此你又get一个新技能，只需用js，轻松搞定前后台整体业务。
* `client端`框架地址： [https://ext.dcloud.net.cn/plugin?id=2204](https://ext.dcloud.net.cn/plugin?id=2204)
* `admin端`框架地址：[https://ext.dcloud.net.cn/plugin?id=5043](https://ext.dcloud.net.cn/plugin?name=vk-unicloud-admin)
* `client端`框架文档：[点击查看](https://vkdoc.fsq.pub/client/)
* `admin端`框架文档：[点击查看](https://vkdoc.fsq.pub/admin/)

#### 框架学习Q群：`22466457` 欢迎萌新和大佬来使用和共同改进框架

#### 框架体验地址：[点击进入『框架体验地址』](https://vkunicloud.fsq.pub/admin/)

#### 体验账号：

* 高级管理员：test11（账号）123456（密码）可以执行绝大部分功能
* 初级管理员：test12（账号）123456（密码）只能执行查询功能
* 无权限用户：test13（账号）123456（密码）无admin登录权限

[点击体验『表单可视化生成器』](https://vkunicloud.fsq.pub/vk-form-visualizer/)

### 什么是 `vk-unicloud-admin` ?

* `vk-unicloud-admin` 是基于 `unicloud` + `uni-id` +`element` + `vk-unicloud-router` 的一套快速 `PC admin` 完整开发框架
* （只兼容PC，只为PC admin而生）

### `vk-unicloud-admin` 的优势是什么 ?

* 1、完美集成 `vk-unicloud-router`，拥有 `vk-unicloud-router` 的所有现成API功能。让你开发事半功倍。[点击查看](https://vkdoc.fsq.pub/client/)
* 2、完美集成 `element` UI框架，并在 `element` 基础上进行了深度封装（支持原生 `element`）[element官网](https://element.eleme.cn/#/zh-CN/component/button)
* 3、`表单可视化拖拽工具`（可直接生成 `vk框架代码 `和 `element` 原生代码 [点击体验](https://vkunicloud.fsq.pub/vk-form-visualizer/)
* 4、`万能表格组件`，通过少量代码即可完成 `CRUD`，同时还拥有较高的自由度。几分钟完成一个页面 `CRUD`。
* 5、`万能表单组件`，通过少量代码即可完成表单渲染 + 表单请求。
* 6、完善的用户角色权限，无需开发即可拥有（权限可精确到每一个云函数）。
* 7、`pages-dev.json` 机制，开发调试页面不会被发布到正式版中。
* 8、只要你开发过传统 `vue admin` 项目，那么上手此框架的学习成本几乎为0
* 9、众多示例代码，为你的云开发之路扫平障碍。
* 10、内置3个主题（纯黑，纯白，黑白）且支持自定义主题。[点击查看主题](https://vkdoc.fsq.pub/admin/1/theme.html)
* 11、群内众多开发者，关于框架使用问题几乎有问必答。Q群：22466457
* 12、更多功能敬请体验。


### 核心功能

#### 一、万能表格

核心思想：通过 JSON 配置渲染页面（简单配置一下，表格就完成了）

如下方JSON用于渲染头像和时间
```js
 [
   { key: "avatar", title: "头像", type: "avatar", width: 80, shape:"circle" },
   { key: "_add_time", title: "添加时间", type: "time", width: 160, valueFormat:"yyyy-MM-dd hh:mm:ss" },
 ]
```

* 1、查询：包含分页、排序、多条件搜索、搜索项折叠、多表连表、数据源预处理、展开行、树状结构等等
* 2、支持多选框（用于批量操作）
* 3、自动生成详情页：点击详情按钮，自动显示详情页弹窗。
* 4、修改：点击修改按钮，自动显示修改表单弹窗。
* 5、删除：点击删除，显示气泡二次确认提示，再点击确定，则删除数据。
* 6、自定义操作按钮：如发货、审核等自定义按钮。
* 7、高自由度：每个字段都有插槽，在内置组件不满足需求的情况下，可以使用插槽自己编写该字段的渲染规则。（内置组件基本上可满足90%以上的渲染需求）
* 8、导出excel表格：通过内置api只需一行代码即可直接导出表格数据。
* 9、导出满足表格查询条件的数据库内所有数据（unicloud的查询有限制每次500条记录，但万能表格解决了此问题，可以导出数据库内全部数据)
* 10、异常重试机制：一般不需要此功能，但是由于unicloud-阿里云空间会偶尔查询失败，此时此功能就派上用场了（会自动重新再查询，用户体验上只是感觉这次查询慢了一点而已（因为第一次失败了，查了2次或2次以上））
* 11、不仅仅支持unicloud云函数请求，还支持http请求。
* 12、支持下方自动显示合计
* 13、更多功能敬请体验 [万能表格文档地址](https://vkdoc.fsq.pub/admin/2/table.html)

#### 二、万能表单

核心思想：通过 JSON 配置渲染表单（简单配置一下，表单就完成了）

如下方JSON用于渲染 一个昵称输入框 和 性别单选按钮组
```js
 [
   { key:"nickname", title:"昵称", type:"text" },
   {
    key:"gender", title:"性别", type:"radio",
    data:[
      { value:1, label:"男" },
      { value:2, label:"女" }
    ]
   }
 ]
```

* 1、自动提交表单
* 2、提交前自动表单验证
* 3、防止表单重复提交（提交后按钮自动进入loading状态，不可再点击）
* 4、同一表单可复用（如一般添加和修改的表单基本是一样的）
* 5、表单复用时，支持字段显示规则（如添加时有A字段，修改时，无A字段等）
* 6、拦截器：表单提交前拦截，执行自己逻辑，再放行或终止。
* 7、高自由度：每个字段都有插槽，在内置组件不满足需求的情况下，可以使用插槽自己编写该字段的渲染规则。（内置组件基本上可满足90%以上的渲染需求）
* 8、重置表单：一键重置表单
* 9、表单可视化拖拽工具 [点击查看](https://vkunicloud.fsq.pub/vk-form-visualizer/#/)
* 10、更多功能敬请体验 [万能表单文档地址](https://vkdoc.fsq.pub/admin/3/form.html)

`vk-unicloud-admin` 框架同时还包含 `vk-unicloud-router` 所有功能，[点击查看vk-unicloud-router功能列表](https://vkdoc.fsq.pub/client/)

### 同时 admin 框架内置了以下页面

* 1、用户管理
* 2、角色管理
* 3、权限管理
* 4、菜单管理
* 5、应用管理
* 6、系统缓存管理
* 7、动态组件数据
* 8、用户登录日志
* 9、系统操作日志
* 10、VK框架组件演示
* 11、element静态功能演示
* 12、素材管理（图片、视频、文件）
* 13、持续完善中。。。

## 2、快速上手 - 安装步骤 

[点击查看『安装步骤』](https://vkdoc.fsq.pub/admin/1/quickstart.html)

## 3、框架目录结构

[点击查看『目录结构』](https://vkdoc.fsq.pub/admin/1/catalogue.html)

## 4、万能表格

[点击查看『万能表格』](https://vkdoc.fsq.pub/admin/2/table.html)

## 5、万能表单

[点击查看『万能表单』](https://vkdoc.fsq.pub/admin/3/form.html)

[点击查看『表单可视化生成器』](https://vkunicloud.fsq.pub/vk-form-visualizer/)

## 6、用户角色权限

[点击查看『用户角色权限』](https://vkdoc.fsq.pub/admin/4/role.html)

## 7、创建我的第一个带CRUD的页面

[点击查看『如何创建我的第一个带CRUD的页面』](https://vkdoc.fsq.pub/admin/5/template.html)

## 8、HBX代码块提示

[点击查看『HBX代码块提示』](https://vkdoc.fsq.pub/admin/4/codeTips.html)

## 9、admin框架更新步骤指南

[点击查看『admin框架更新步骤指南』](https://vkdoc.fsq.pub/admin/1/update.html)

## 10、强制重置admin账号密码

[点击查看『强制重置admin账号密码』](https://vkdoc.fsq.pub/admin/4/forceResetAdminPassword.html)

## 11、admin框架内置组件参数说明

[点击查看『admin框架内置组件参数说明』](https://vkdoc.fsq.pub/admin/components/1%E3%80%81text.html)

## 20、云函数开发文档

[点击查看『云函数开发文档』](https://vkdoc.fsq.pub/client/uniCloud/cloudfunctions/catalogue.html)

## 21、vk.baseDao数据库API

[点击查看『vk.baseDao』数据库API](https://vkdoc.fsq.pub/client/uniCloud/db/api.html)

## 22、数据库缓存API

[点击查看『数据库缓存API』](https://vkdoc.fsq.pub/client/uniCloud/cache/cache.html)

## 23、中间件开发文档

[点击查看『中间件开发文档』](https://vkdoc.fsq.pub/client/uniCloud/middleware/filter.html)

## 24、JS API文档大全

[点击查看『JS API文档大全』](https://vkdoc.fsq.pub/client/jsapi.html)

## 25、前端请求云函数

[点击查看『前端请求云函数』](https://vkdoc.fsq.pub/client/pages/callFunction.html)

## 26、配置前端非法token拦截器

[点击查看『前端请求云函数』](https://vkdoc.fsq.pub/client/pages/interceptor1.html)

## 27、配置前端全局异常拦截器

[点击查看『前端请求云函数』](https://vkdoc.fsq.pub/client/pages/interceptor2.html)

## 28、vuex使用文档

[点击查看『vuex使用文档』](https://vkdoc.fsq.pub/client/pages/vuex.html)

## 29、更多其他功能敬请在框架内体验

### vk-unicloud-admin 框架研究Q群:`22466457` 如有问题或建议可以在群内讨论。

### 如果你觉得框架对你有用，可以在下方进行评论，也可以进行赞赏。