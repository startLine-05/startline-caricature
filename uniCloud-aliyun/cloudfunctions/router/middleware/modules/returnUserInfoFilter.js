/**
 * 返回用户信息
 * 由于通常前端需要对用户信息进行缓存
 * 故云函数对用户进行修改后，需要返回给前端最新的用户信息，以便前端始终能够缓存最新用户信息
 */

module.exports = [
	{
		id: "returnUserInfo",
		regExp: [
			"^user/pub/login(.*)",
			"^user/pub/register(.*)",
			"^user/kh/bind(.*)",
			"^user/kh/unbind(.*)",
			"^user/kh/update(.*)",
			"^user/kh/set(.*)",
			"^user/kh/acceptInvite$",
			"^client/user/pub/register(.*)",
			"^client/user/pub/login(.*)"
		],
		description: "可用于指定哪些云函数需要返回给前端userInfo",
		index: 210,
		mode:"onActionExecuted",// 可选 onActionExecuting onActionExecuted
		enable:true, // 通过设置enable=false可以关闭该中间件
		main: async function(event, serviceRes) {
			let { data = {}, uniIdToken, util, filterResponse, originalParam } = event;
			let { uniID, config, vk , db, _ } = util;
			let { userInfo = {} } = filterResponse;
			let res = serviceRes;
			if(res.code === 0){
				if(vk.pubfn.isNull(res.userInfo)){
					if(vk.pubfn.isNotNull(res.uid)){
						res.userInfo = await vk.daoCenter.userDao.findById(res.uid);
					}else if(vk.pubfn.isNotNull(uniIdToken)){
						let tokenRes = await uniID.checkToken(uniIdToken);
						if(tokenRes.code === 0){
							res.userInfo = tokenRes.userInfo;
						}
					}
				}
				if(vk.pubfn.isNotNull(res.userInfo)){
					res.needUpdateUserInfo = true;
					//  此处可以继续去除你不想返回给前端的字段
					let deleteKeys = ["token","password"];
					res.userInfo = vk.pubfn.deleteObjectKeys(res.userInfo, deleteKeys);
				}
				if(vk.pubfn.isNotNullAll(res.token,res.tokenExpired)){
					// 当返回vk_uni_token对象后，框架会让token自动被前端缓存，前端不需要手动再保存token至本地缓存了。
					res.vk_uni_token = {
						token: res.token,
						tokenExpired: res.tokenExpired
					};
				}
			}
			return res;
		}
	}
]
