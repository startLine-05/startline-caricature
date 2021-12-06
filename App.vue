<script>
import config from "@/app.config.js";

export default {
	computed: {},
	methods: {
		// 检测用户是否登录
		init() {
			let that = this;
			let { vk } = that;
      // 如果token失效，直接跳登录页面
      if (!vk.callFunctionUtil.checkToken()) {
        vk.reLaunch(config.login.url);
        return false;
      }
			if (!that.isAllowLoginBackground()) {
				vk.alert("您的账户无登陆权限", function() {
					vk.reLaunch(config.login.url);
				});
				return false;
			}
			vk.userCenter.getMenu({
				success: function(data) {
					// 初始化菜单
					let { menus = [] } = data;
					// 合并去重
					menus = vk.pubfn.arr_concat(menus, config.sideBar.staticMenu, "menu_id");
					// 排序
					menus.sort(function(a, b) {
						let sortA = a.sort || 0;
						let sortB = b.sort || 0;
						return sortA - sortB;
					});
					if (JSON.stringify(menus) !== JSON.stringify(vk.getVuex("$app.navMenu"))) {
						vk.setVuex("$app.navMenu", menus);
					}
					// 将树形结构转成数组结构
					let menuList = vk.pubfn.treeToArray(menus, {
						id: "menu_id",
						parent_id: "parent_id",
						children: "children"
					});
					if (JSON.stringify(menuList) !== JSON.stringify(vk.getVuex("$app.menuList"))) {
						vk.setVuex("$app.menuList", menuList);
					}
					vk.setVuex("$app.inited", true);
					vk.setVuex("$user.userInfo", data.userInfo);
					vk.setVuex("$user.permission", data.userInfo.permission);
				}
			});
			uni.getSystemInfo().then(([err, res]) => {
				let isPC = res.model && res.model != "PC" ? false : true;
				vk.setVuex("$app.isPC", isPC);
				vk.setVuex("$app.width", res.windowWidth);
				vk.setVuex("$app.height", res.windowHeight);
			});
			uni.onWindowResize(res => {
				vk.pubfn.debounce(
					function() {
						vk.setVuex("$app.width", res.size.windowWidth);
						vk.setVuex("$app.height", res.size.windowHeight);
					},
					50,
					false,
					"app-onresize"
				);
			});
		},
		isAllowLoginBackground(userInfo) {
			let that = this;
			let { vk } = that;
			if (!userInfo) userInfo = vk.getVuex("$user.userInfo");
			let key = true;
			if (vk.pubfn.isNotNull(userInfo)) {
				let { role = [], allow_login_background = false } = userInfo;
				if (role.indexOf("admin") == -1 && !allow_login_background) {
					key = false;
				}
			}
			return key;
		}
	},
	// 监听 - 页面404
	onPageNotFound(e) {
		uni.redirectTo({
			url: config.error.url
		});
	},
	onLaunch: function() {
		let that = this;
		that.vk.pubfn.needInit({
			that,
			config,
			success: function() {
				that.init();
			}
		});
	},
	onShow: function() {
		console.log("App Show");
	},
	onHide: function() {
		console.log("App Hide");
	}
};
</script>

<style lang="scss"></style>
