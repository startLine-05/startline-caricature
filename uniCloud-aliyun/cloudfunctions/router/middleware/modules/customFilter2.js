/**
 * 自定义过滤器 - 后置
 */

module.exports = [
	{
		id: "xxxx2",
		regExp: "^xxx2/kh", // 正则匹配规则，这个是以^xxx2/kh/开头的云函数会被拦截
		description: "这里是你过滤器2号的描述",
		index: 210,
		mode:"onActionExecuted", // 可选 onActionExecuting onActionExecuted
		main: async function(event, serviceRes) {
			let { data = {}, util } = event;
			let { vk } = util;
			serviceRes.msg = "被过滤器修改后的值";
			return serviceRes;
		}
	}
]
