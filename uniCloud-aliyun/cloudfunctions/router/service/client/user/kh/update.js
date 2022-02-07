module.exports = {
  /**
   * 修改单条漫画数据
   * @url admin/kong/sys/update 前端调用的url参数地址
   * data 请求参数 说明
   * res 返回参数说明
   * @param {Number} code 错误码，0表示成功
   * @param {String} msg 详细信息
   */
  main: async (event) => {
    let { data = {}, userInfo, util, filterResponse, originalParam } = event;
    let { customUtil, uniID, config, pubFun, vk, db, _ } = util;
    let { uid } = data;
    let res = { code: 0, msg: "ok" };
    // 业务逻辑开始-----------------------------------------------------------
    let {
        avatar,
        nickname,
        signature,
        gender,
    } = data;
    let dbName = "uni-id-users";
	//检测文本
	let msgSecCheckRes = await vk.openapi.weixin.security.msgSecCheck({
	  content: `${signature}${nickname}`
	});
	if(msgSecCheckRes.code !== 0){
		return msgSecCheckRes
	}
	//检测图片
	let imgSecCheckRes = await vk.openapi.weixin.security.imgSecCheck({
	  base64:avatar
	});

	if(imgSecCheckRes.code !== 0){
		return imgSecCheckRes
	}
    res.data = await vk.baseDao.updateById({
      dbName,
      id: uid,
      dataJson: {
		  avatar,
		  nickname,
		  signature,
		  gender,
      },
    });
    // 业务逻辑结束-----------------------------------------------------------
    return res;
  },
};
