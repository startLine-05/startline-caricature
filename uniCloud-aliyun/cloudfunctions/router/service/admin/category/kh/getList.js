module.exports = {
  /**
   * 查询漫画分类
   * @url admin/kong/sys/getList 前端调用的url参数地址
   * data 请求参数 说明 不需要参数
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
    let dbName = "opendb-caricature-categories";
    let list = await db.collection(dbName).get();
    res.data = list.data.map((v) => {
      return {
        value: v._id,
        label: v.name,
      };
    });
    return res;
  },
};
