"use strict";
module.exports = {
	/**
	 * 漫画详情查询
	 * @url user/pub/test1 前端调用的url参数地址
	 * @description 此函数描述
	 * @param {Object} data 请求参数
	 * @param {String} uniIdToken 用户token
	 * @param {String} userInfo 当前登录用户信息（可信任，仅kh目录下的函数有此值）
	 * pub目录下请求参数需要带上 need_user_info = true
	 * @param {Object} util 公共工具包
	 * @param {Object} filterResponse 过滤器返回的数据
	 * @param {Object} originalParam 原始请求参数（包含了原始event和context）
	 * data 请求参数 说明
	 * @param {String} uid 当前登录用户id（可信任，仅kh目录下的函数有此值）
	 * res 返回参数说明
	 * @param {Number} code 错误码，0表示成功
	 * @param {String} msg 详细信息
	 */
	main: async (event) => {
		//  注意: userInfo 和 uid 是可信任的，但默认只有kh目录下的函数才有此值
		let { data = {}, userInfo, util, filterResponse, originalParam } = event;
		let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
		let { uid } = data;
		let res = {
			code: 0,
			msg: "",
		};
		// 业务逻辑开始-----------------------------------------------------------
		const dbName = "opendb-caricature-data";
		let { caricature_id } = data;
		if (vk.pubfn.isNullOne(caricature_id)) {
			return {
				code: -1,
				msg: "参数错误",
			};
		}
		// 可写与数据库的交互逻辑等等
		res.data = await vk.baseDao.selects({
			dbName: "opendb-caricature-data",
			getOne: true, // 只返回第一条数据
			getMain: true, // 直接返回数据库查询到的数据（不带code,rows等参数）
			// 主表where条件
			whereJson: {
				_id: caricature_id,
			},
			foreignDB: [
				//查漫画内容
				{
					dbName: "opendb-caricature-content",
					localKey: "_id",
					foreignKey: "caricature_id",
					as: "caricatureContentList",
					sortArr:[{ "name":"current_number", "type":"desc" }],
					// 副表字段显示规则
					fieldJson: {
						_id: true,
						current_name: true,
						current_number: true,
						create_date: true,
					},
				},
			],
		});
		// 下方代码是演示调用 获取评论的云函数
		const getCommentsService = vk.require("service/client/comments/pub/getComments");
		const getCommentsRes = await getCommentsService.main({
				...event,
				data: {
					...event.data,
					pageIndex: 1,
					pageSize: 3,
					type: '1'
				}
			},
			util
		);
		res.data.commentsList = getCommentsRes.rows;
		// 业务逻辑结束-----------------------------------------------------------
		return res;
	},
};
