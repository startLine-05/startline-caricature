"use strict";
const formRules = require("../../utils/formRules.js");
module.exports = {
  /**
   * 添加评论
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
    const dbName = "opendb-caricature-comments";
    let { caricature_id, comment_content, comment_type, reply_user_id, reply_comment_id,parent_comment_id } = data;
    const ruleList =
      comment_type == "1"
        ? ["caricature_id", "comment_content", "comment_type", "reply_user_id", "reply_comment_id","parent_comment_id"]
        : ["caricature_id", "comment_content", "comment_type"];
    let formRulesRes = await formRules.add(event, ruleList);
    if (formRulesRes.code !== 0) {
      return formRulesRes;
    }
    //新增参数
    const parm = {
      caricature_id,
      user_id: uid,
      comment_content,
      comment_type,
      reply_user_id,
      reply_comment_id,
	  parent_comment_id,
	  //默认值
	  like_count:0,
	  like_user:[],
      comment_date: new Date().getTime(),
    };
    res.id = await vk.baseDao.add({
      dbName,
      dataJson: parm,
    });
    // 业务逻辑结束-----------------------------------------------------------
    return res;
  },
};
