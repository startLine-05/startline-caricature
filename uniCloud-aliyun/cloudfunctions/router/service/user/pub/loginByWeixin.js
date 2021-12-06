module.exports = {
	/**
	 * 用户登录(微信授权)
	 * @url user/pub/loginByWeixin 前端调用的url参数地址
	 * @description 支持APP、微信小程序、微信公众号
	 * data 请求参数 说明
	 * @param {String} code 微信登录返回的code
	 * @param {String} platform 客户端类型：mp-weixin、app-plus、h5-weixin，默认会自动取客户端类型，但是在云函数url化等场景无法取到客户端类型，可以使用此参数指定
	 * @param {String} type login:登录 register:注册
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 * @param {String} token 登录成功之后返回的token信息
	 * @param {String} tokenExpired token过期时间
	 * @param {Object} userInfo 用户信息
	 */
	main: async (event) => {
		let { data = {}, util, originalParam } = event;
		let { uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = {};
		// 业务逻辑开始-----------------------------------------------------------
		res = await vk.openapi.weixin.loginByWeixin(data, originalParam.context);
		if (res.token) {
			// 日志服务
			const loginLogService = vk.require("service/user/util/login_log");
			await loginLogService.add({
				type: "login",
				login_type: "weixin",
				user_id: res.uid,
				context: originalParam.context
			}, util);
		}
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}
