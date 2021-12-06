const formRules = require("../util/formRules.js");
module.exports = {
	/**
	 * 添加用户
	 * @url admin/system/user/sys/add 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {String} username 		用户名
	 * @param {String} nickname 		昵称
	 * @param {String} gender 			性别
	 * @param {Boolean} mobile 		手机号
	 * @param {String} comment 		备注
	 * @param {Array} dcloud_appid 	允许登录的应用列表
	 * @param {Number} login_appid_type 	0:全部应用 1:部分应用
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: '' };
		// 业务逻辑开始-----------------------------------------------------------
		let {
			username,
			password,
			nickname,
			gender,
			mobile,
			comment,
			allow_login_background,
			dcloud_appid = [],
			login_appid_type
		} = data;
		if(!password) password = "234567";
		let mobile_confirmed;
		// 参数合法校验开始-----------------------------------------------------------
		let formRulesRes = await formRules.add(event);
		if (formRulesRes.code !== 0) {
			return formRulesRes;
		}
		// 参数合法校验结束-----------------------------------------------------------

		let dbName = "uni-id-users";
		// 检测username
		let num = await vk.baseDao.count({
			dbName: dbName,
			whereJson: {
				username: username
			}
		});
		if (num > 0) {
			return { code: -1, msg: `用户名【${username}】已注册!` };
		}
		// 检测mobile
		if (mobile) {
			let num = await vk.baseDao.count({
				dbName: dbName,
				whereJson: {
					mobile: mobile
				}
			});
			if (num > 0) {
				return { code: -1, msg: `手机号【${mobile}】已注册!` };
			}
			mobile_confirmed = 1; // 设置该手机号为已验证(否则无法通过手机号进行登录)
		}
		let registerRes = await uniID.register({
			autoSetDcloudAppid: false,
			username,
			password
		});
		if (registerRes.code !== 0 || !registerRes.uid) {
			return registerRes;
		}
		// 设置用户其他信息
		await vk.baseDao.update({
			dbName: dbName,
			whereJson: {
				_id: registerRes.uid
			},
			dataJson: {
				nickname,
				gender,
				mobile,
				mobile_confirmed,
				comment,
				allow_login_background,
				status:0,
				dcloud_appid: _.remove()
			}
		});
		// 设置允许登录的应用列表
		if(login_appid_type && typeof uniID.setAuthorizedAppLogin === "function"){
			await uniID.setAuthorizedAppLogin({
				uid: registerRes.uid,
				dcloudAppidList: dcloud_appid
			});
		}
		res.type = "register";
		res.uid = registerRes.uid;
		return res;
	}
}
