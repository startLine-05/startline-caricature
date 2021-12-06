module.exports = {
  /**
   * 密码加密测试
   * @url user/pub/encryptPwd 前端调用的url参数地址
   * @description 密码加密测试
   * @params {Object} data 请求参数
   * @params {String} uniIdToken 用户token
   * @params {Object} util 公共工具包
	 * res 返回参数说明
	 * @params {Number} code 错误码，0表示成功
	 * @params {String} msg 详细信息
	 * @params {String} password 加密后的字符串
   */
	main: async (event) => {
		let { util } = event;
		let { uniID } = util;
		let res = {};
		// 业务逻辑开始----------------------------------------------------------- 
		const password = await uniID.encryptPwd('123456');
		res = {
			code: 0,
			msg: '密码加密完成',
			password
		}
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	}
}