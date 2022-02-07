"use strict";
const formRules = require("../../utils/formRules.js");
module.exports = {
  /**
   * 设置评论点赞
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
    let { comments_id, type = '1', } = data;
    const ruleList = ["comments_id",]

    let formRulesRes = await formRules.add(event, ruleList);
	
    if (formRulesRes.code !== 0) {
      return formRulesRes;
    }
	
	let { like_user = [] } = await vk.baseDao.findById({
	  dbName,
	  id:comments_id,
	});
	
	let index = like_user.indexOf(uid)
	if(type == '1'){
		if(index >= 0){
			return {code :1,msg: "请勿重复点赞" };
		}
		like_user.push(uid)
	}else{
		if(index < 0){
			return {code :1,msg: "该用户还未点赞" };
		}
		like_user.splice(index,1)
	}
	
	res.data = await vk.baseDao.updateById({
	  dbName,
	  id:comments_id,
	  dataJson:{
	    like_user,
		like_count:like_user.length,
	  },
	});

    // 业务逻辑结束-----------------------------------------------------------
    return res;
  },
};
