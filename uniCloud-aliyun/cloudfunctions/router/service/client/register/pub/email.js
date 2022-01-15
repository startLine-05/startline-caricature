var nodemailer;
try {
  nodemailer = require("nodemailer");
} catch (err) {
  // 由于 nodemailer 包比较大，不建议在router函数内安装，可以新建一个云函数专门用来发邮箱
  console.error("请先安装npm包：nodemailer，安装方法：根目录执行npm i nodemailer");
}
module.exports = {
  /**
   * 发送邮箱验证码
   * @url user/pub/sendEmailCode 前端调用的url参数地址
   * @description 发送邮箱验证码
   * data 请求参数 说明
   * @params {String} email 邮箱
   * @params {String} type  验证码类型 login登录、register注册、bind绑定手机、unbind解绑手机
   * res 返回参数说明
   * @params {Number} code 错误码，0表示成功
   * @params {String} msg 详细信息
   * @params {String} email 手机号
   * @params {String} verifyCode 验证码
   */
  main: async (event) => {
    let { data = {}, util } = event;
    let { uniID, config, vk } = util;
    let { email, type, serviceType = "163" } = data; //默认服务邮箱为163邮箱
    let res = { code: -1, msg: "" };
    // 业务逻辑开始-----------------------------------------------------------
    const randomStr = "00000" + Math.floor(Math.random() * 1000000);
    let code = randomStr.substring(randomStr.length - 6);
    let param = {
      code,
      type,
      email,
      expiresIn: 180,
    };
    // 发送验证码开始
    let emailConfig = config.vk.service.email;
    if (typeof nodemailer === "undefined") {
      return { code: -1, msg: '请先安装npm包"nodemailer": "^6.4.11"' };
    }
    if (vk.pubfn.isNull(email)) {
      return { code: -1, msg: "发送邮箱不能为空" };
    }

    let emailService = nodemailer.createTransport({
      host: emailConfig[serviceType].host,
      port: emailConfig[serviceType].port,
      secure: emailConfig[serviceType].secure, // use SSL
      auth: emailConfig[serviceType].auth,
    });
    try {
      await emailService.sendMail({
        from: emailConfig[serviceType].auth.user, //从哪来
        to: data.email, //发送到哪个邮箱
        cc: emailConfig[serviceType].auth.user, // 由于邮件可能会被当成垃圾邮件，但只要把右键抄送给自己一份，就不会被当成垃圾邮件。
        subject: emailConfig[serviceType].auth.subject, // 发送主题
        text: `您的验证码是${code},打死也不要告诉别人哦!`, //发送内容
      });
      res.code = 0;
      res.msg = "ok";
    } catch (err) {
      res.code = -1;
      res.msg = "邮件发送失败";
      res.err = err;
    }
    // 发送验证码结束
    if (res.code === 0) {
      // 发送验证码成功后,设置验证码
      await uniID.setVerifyCode(param);
    }
    // 业务逻辑结束-----------------------------------------------------------
    return res;
  },
};
