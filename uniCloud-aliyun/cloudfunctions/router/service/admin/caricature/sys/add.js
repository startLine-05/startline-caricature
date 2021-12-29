module.exports = {
  /**
   * 添加单条漫画数据
   * @url admin/kong/sys/add 前端调用的url参数地址
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
    //初始化基本数据
    const caricature_status = 0, //漫画状态
      view_count = 0, //阅读数量
      like_count = 0, //喜欢数量
      comment_count = 0, //评论数量
      publish_date = vk.pubfn.timeFormat(new Date(), "yyyy-MM-dd hh:mm:ss"), //发布时间
      last_modify_date = vk.pubfn.timeFormat(new Date(), "yyyy-MM-dd hh:mm:ss"); //最后修改时间
    publish_ip = originalParam.context.CLIENTIP; //发布ip地址
    let {
      author, //作者名称
      category_id, //分类id
      name, //名称
      avatar, //封面
      excerpt, //简介
      is_sticky = false, //是否置顶
      is_essence = false, //是否为推荐
      comment_status = false, //开放评论状态
    } = data;
    // 这里需要把 params1 params2 params3 改成你数据库里允许用户添加的字段
    let dbName = "opendb-caricature-data";
    res.id = await vk.baseDao.add({
      dbName,
      dataJson: {
        user_id: uid, //发布人id
        author,
        category_id,
        name,
        avatar,
        excerpt,
        caricature_status,
        view_count,
        like_count,
        is_sticky,
        is_essence,
        comment_status,
        comment_count,
        publish_date,
        last_modify_date,
        publish_ip,
      },
    });
    // 业务逻辑结束-----------------------------------------------------------
    return res;
  },
};
