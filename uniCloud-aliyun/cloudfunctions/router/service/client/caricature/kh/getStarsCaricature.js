"use strict";
module.exports = {
  /**
   * 获取收藏漫画
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
    let res = { code: 0, msg: "" };
    // 业务逻辑开始-----------------------------------------------------------
    res = await vk.baseDao.selects({
      dbName: "opendb-caricature-favorite", // 主表名
      pageIndex: 1,
      pageSize: 999,
      getCount: false, // 是否需要同时查询满足条件的记录总数量
      // 主表where条件
      whereJson: {
        user_id: uid,
      },

      // 副表列表
      foreignDB: [
        {
          dbName: "opendb-caricature-data",
          localKey: "caricature_id",
          foreignKey: "_id",
          limit: 1,
		  as: "starsDetail",
          fieldJson: {
            author: true,
            category_id: true,
            name: true,
            avatar: true,
            view_count: true,
            like_count: true,
          },
        },
      ],
    });

    // 业务逻辑结束-----------------------------------------------------------
    return res;
  },
};
