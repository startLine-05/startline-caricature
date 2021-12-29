module.exports = {
  /**
   * 修改漫画单集图片内容数据
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
    let { _id, image_list } = data;

    if (vk.pubfn.isNullOne(_id)) {
      return { code: -1, msg: "参数错误" };
    }
    const dbName = "opendb-caricature-content";
    await vk.baseDao.updateById({
      dbName,
      id: _id,
      dataJson: {
        image_list,
      },
    });
    // 业务逻辑结束-----------------------------------------------------------
    return res;
  },
};
