export default {
	data() {
		return {}
	},
	onLoad() {
		// 将vk实例挂载到app.globalData上，方便在非Vue页面自身函数中调用vk实例（因为获取不到this）
		let app = getApp({allowDefault: true});
		if(app && app.globalData && !app.globalData.vk){
			app.globalData.vk = this.vk;
		}
		if(this.vk){
			const url = this.vk.pubfn.getCurrentPageRoute();
			this.vk.navigate.checkAllowShare({ url });
		}
	},
	created(){
		// 将vk实例挂载到app.globalData上，方便在非Vue页面自身函数中调用vk实例（因为获取不到this）
		let app = getApp({allowDefault: true});
		if(app && app.globalData && !app.globalData.vk){
			app.globalData.vk = this.vk;
		}
	},
	methods: {
		$getData(data, key, defaultValue){
			let { vk } = this;
			return vk.pubfn.getData(data, key, defaultValue);
		}
	}
}
