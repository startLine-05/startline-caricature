/**
 * 自定义过滤器 - 前置
 */

module.exports = [
	{
		id: "xxxx1",
		regExp: "^xxx1/kh", // 正则匹配规则，这个是以^xxx1/kh/开头的云函数会被拦截
		description: "这里是你过滤器1号的描述",
		index: 210, // 由于kh（检测token）过滤器的执行顺序是200，如果需要在检测登录的过滤后执行，则需要填写 > 200 的值
		mode:"onActionExecuting", // 可选 onActionExecuting onActionExecuted
		main: async function(event) {
			// 这里是拦截规则，可以查数据库，最终code:0 代表通过，其他均为未通过，msg是被拦截的原因
			let { data = {}, util } = event;
			let { vk } = util;
			return {
				code: -1,
				msg: "被自定义过滤器1号拦截了"
			}
		}
	}
]
