module.exports = {
  /**
   * 修改数据
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
      _id,
      author, //作者名称
      category_id, //分类id
      name, //名称
      avatar, //封面
      excerpt, //简介
      is_sticky = false, //是否置顶
      is_essence = false, //是否为推荐
      comment_status = true, //开放评论状态
    } = data;
    // 这里需要把 params1 params2 params3 改成你数据库里允许用户添加的字段
    if (vk.pubfn.isNullOne(_id)) {
      return { code: -1, msg: "参数错误" };
    }
    let dbName = "opendb-caricature-data";
    await vk.baseDao.updateById({
      dbName,
      id: _id,
      dataJson: {
        author,
        author,
        category_id,
        name,
        avatar,
        excerpt,
        is_sticky,
        is_essence,
      },
    });
    // 业务逻辑结束-----------------------------------------------------------
    return res;
  },
};
