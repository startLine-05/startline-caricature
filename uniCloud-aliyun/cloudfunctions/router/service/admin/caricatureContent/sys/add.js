module.exports = {
  /**
   * 添加单条数据
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
    const dbName = "opendb-caricature-content";
    const create_date = new Date().getTime(); //创建时间
    let {
      caricature_id, //漫画id
      current_number, //当前集数编号 不可重复
      current_name, //当前集数名称
      image_list,
    } = data;

    //判断是否存在集数
    let num = await vk.baseDao.count({
      dbName,
      whereJson: {
        caricature_id,
        current_number,
      },
    });

    if (num > 0) {
      return { code: -1, msg: "该集数已存在,请勿重复添加" };
    }

    res.id = await vk.baseDao.add({
      dbName,
      dataJson: {
        caricature_id,
        current_number,
        current_name,
        image_list,
        create_date,
      },
    });
    // 业务逻辑结束-----------------------------------------------------------
    return res;
  },
};
