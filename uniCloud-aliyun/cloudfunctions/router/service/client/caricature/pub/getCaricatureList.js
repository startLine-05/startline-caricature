"use strict";
module.exports = {
  /**
   * 获取漫画列表
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
    let { uid, searchvalue = '', category_id = '', is_essence = true, } = data;
    let res = { code: 0, msg: "" };
	const parm = {
		name : new RegExp(searchvalue)
	}
	category_id && (parm.category_id = category_id)
	is_essence && (parm.is_essence = is_essence)
    // 业务逻辑开始-----------------------------------------------------------
    const dbName = "opendb-caricature-data";
    let { pageIndex, pageSize } = data;
    // 可写与数据库的交互逻辑等等
    res = await vk.baseDao.select({
      dbName, // 表名
      getMain: false, // 是否只返回rows数据
      pageIndex, // 当前第几页
      pageSize, // 每页条数
      whereJson: {
        // 条件
		...parm,
      },
      fieldJson: {
        author: true,
        category_id: true,
        name: true,
        avatar: true,
        view_count: true,
        like_count: true,
      },
    });

    // 业务逻辑结束-----------------------------------------------------------
    return res;
  },
};
