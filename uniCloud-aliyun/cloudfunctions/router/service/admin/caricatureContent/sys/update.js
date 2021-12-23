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
      caricature_id, //漫画id
      current_number, //当前集数编号 不可重复
      current_name, //当前集数名称
    } = data;
    // 这里需要把 params1 params2 params3 改成你数据库里允许用户添加的字段
    if (vk.pubfn.isNullOne(_id)) {
      return { code: -1, msg: "参数错误" };
    }

    let dbName = "opendb-caricature-content";
    //判断是否存在集数
    let num = await vk.baseDao.count({
      dbName,
      whereJson: {
        caricature_id,
        current_number,
      },
    });
    let info = await vk.baseDao.findById({
      dbName,
      id: _id,
    });

    if (num > 0 && info.current_number !== current_number) {
      return { code: -1, msg: "该集数已存在,请勿重复添加" };
    }

    await vk.baseDao.updateById({
      dbName,
      id: _id,
      dataJson: {
        current_number, //当前集数编号 不可重复
        current_name, //当前集数名称
      },
    });
    // 业务逻辑结束-----------------------------------------------------------
    return res;
  },
};
