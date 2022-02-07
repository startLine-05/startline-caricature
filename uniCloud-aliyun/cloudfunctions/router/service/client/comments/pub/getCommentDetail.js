"use strict";
module.exports = {
	/**
	 * 获取评论详情
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
		let { uid, pageIndex = 1, pageSize = 10 } = data;
		let res = {
			code: 0,
			msg: "",
		};
		// 业务逻辑开始-----------------------------------------------------------
		let { commentId } = data;
		// 可写与数据库的交互逻辑等等
		if (vk.pubfn.isNullOne(commentId)) {
			return {
				code: -1,
				msg: "参数错误",
			};
		}
		res = await vk.baseDao.selects({
			dbName: "opendb-caricature-comments", // 主表名
			pageIndex, // 查询第几页
			pageSize, // 每页多少条数据
			getCount: true, // 是否需要同时查询满足条件的记录总数量
			// 主表where条件
			whereJson: {
				_id: commentId,
			},

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
			],
			// 树状结构参数
			treeProps: {
				id: "_id", // 唯一标识字段，默认为 _id
				parent_id: "parent_comment_id", // 父级标识字段，默认为 parent_id
				children: "children", // 自定义返回的下级字段名，默认为 children
				level: 1, // 查询返回的树的最大层级。超过设定层级的节点不会返回。默认10级，最大15，最小1
				limit: 500, // 每一级最大返回的数据。
				whereJson: {
					parent_comment_id: commentId,
					comment_type: '1'
				}
			}
		});

		// 业务逻辑结束-----------------------------------------------------------
		return res;
	},
};
