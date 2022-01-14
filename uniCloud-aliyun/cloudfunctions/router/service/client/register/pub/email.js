var nodemailer;
try {
  nodemailer = require('nodemailer');	
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
   * @params {String} type  验证码类型
   * res 返回参数说明
   * @params {Number} code 错误码，0表示成功
   * @params {String} msg 详细信息
   * @params {String} email 手机号  
   * @params {String} verifyCode 验证码
   */
  main: async (event) => {
    let { data = {}, util } = event;
    let { uniID, config } = util;
    let { email, type } = data;
    let res = {code : -1, msg : ''};
    // 业务逻辑开始----------------------------------------------------------- 
    const randomStr = '00000' + Math.floor(Math.random() * 1000000);
    let code = randomStr.substring(randomStr.length - 6);
    let param = {
      code,
      type,
      email
    };
    // 发送验证码开始
    let emailConfig = config.vk.service.email;
	console.log('ggggg',emailConfig)
    if(typeof nodemailer === "undefined"){
      return { code : -1, msg : '请先安装npm包"nodemailer": "^6.4.11"' };
    }
    let emailService = nodemailer.createTransport({
      "host": emailConfig[data.serviceType].host,
      "port": emailConfig[data.serviceType].port,
      "secure": emailConfig[data.serviceType].secure, // use SSL
      "auth": emailConfig[data.serviceType].auth
    });
	console.log('sss',emailService)
    try{
      await emailService.sendMail({
        "from": emailConfig[data.serviceType].auth.user, //从哪来
        "to": data.email, //发送到哪个邮箱
        "cc": emailConfig[data.serviceType].auth.user, // 由于邮件可能会被当成垃圾邮件，但只要把右键抄送给自己一份，就不会被当成垃圾邮件。
        "subject": data.subject, // 发送主题
        "text": `您的验证码是${code},打死也不要告诉别人哦!` //发送内容
      });
      res.code = 0;
      res.msg = "ok";
    }
    catch(err){
      res.code = -1;
      res.msg = "邮件发送失败";
      res.err = err;
    }
    // 发送验证码结束
    if(res.code === 0){
      // 发送验证码成功后,设置验证码
      await uniID.setVerifyCode(param);
    }
    // 业务逻辑结束-----------------------------------------------------------
    return res;
  }
}
