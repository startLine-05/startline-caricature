"use strict";
/**
 * 字段验证
 */
const commonRule = {
  caricature_id: [{ required: true, message: "漫画ID不能为空" }],
  comment_content: [{ required: true, message: "评论内容不能为空" }],
  comment_type: [{ required: true, message: "评论类型不能为空" }],
  reply_user_id: [{ required: true, message: "被回复的用户ID不能为空" }],
  reply_comment_id: [{ required: true, message: "被回复的评论ID不能为空" }],
  option: [{ required: true, message: "操作类型不能为空" }],
  content_id: [{ required: true, message: "漫画内容ID不能为空" }],
};
class Util {
  constructor() {}
  /**
   * 添加
   */
  async add(event, rulesList = []) {
    let { data = {}, userInfo, util } = event;
    let { vk } = util;
    let res = { code: 0, msg: "" };

    // 验证规则开始 -----------------------------------------------------------
    let rules = rulesList.reduce((obj, v) => {
      obj[v] = commonRule[v];
      return obj;
    }, {});

    // 验证规则结束 -----------------------------------------------------------

    // 开始进行验证
    res = vk.pubfn.formValidate({
      data: data,
      rules: rules,
    });
    // 返回验证结果
    return res;
  }
  /**
   * 修改
   */
  async update(event, rulesList = []) {
    return this.add(event, rulesList);
  }
}
module.exports = new Util();
