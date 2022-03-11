module.exports = {
	/**
	 * 查询多条评论记录
	 * @url admin/kong/sys/getList 前端调用的url参数地址
	 * data 请求参数 说明
	 * @param {Number}         pageIndex 当前页码
	 * @param {Number}         pageSize  每页显示数量
	 * @param {Array<Object>}  sortRule  排序规则
	 * @param {object}         formData  查询条件数据源
	 * @param {Array<Object>}  columns   查询条件规则
	 * res 返回参数说明
	 * @param {Number}         code      错误码，0表示成功
	 * @param {String}         msg       详细信息
	 */
	main: async (event) => {
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = { code: 0, msg: "" };
		// 业务逻辑开始-----------------------------------------------------------
		let dbName = "opendb-caricature-comments";

		const { formData, pageIndex, pageSize } = data
		const { userName, caricatureName } = formData
		delete formData['userName']
		delete formData['caricatureName']
		res = await vk.baseDao.getTableData({
			dbName,
			data,
			foreignDB: [
				// 回复本人副表
				{
					dbName: "uni-id-users",
					localKey: "user_id",
					foreignKey: "_id",
					limit: 1,
					as: "userInfo",
					// 副表字段显示规则
					fieldJson: {
						nickname: true,
						gender: true,
						username: true,
						avatar: true,
					},
				},
				{
					// 被回复本人副表
					dbName: "uni-id-users",
					localKey: "reply_user_id",
					foreignKey: "_id",
					limit: 1,
					as: "replyUserInfo",
					// 副表字段显示规则
					fieldJson: {
						nickname: true,
						gender: true,
						username: true,
						avatar: true,
					},
				},
				{
					// 漫画数据
					dbName: "opendb-caricature-data",
					localKey: "caricature_id",
					foreignKey: "_id",
					limit: 1,
					as: "caricature",
				},
			],
			lastWhereJson: {
				"userInfo.nickname": new RegExp(userName),
				"caricature.name": new RegExp(caricatureName),
			}
		});
		return res;
	},
};