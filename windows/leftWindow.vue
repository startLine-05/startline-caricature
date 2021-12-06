<template>
	<scroll-view class="sidebar" :class="vk.getVuex('$app.isPC') ? 'pc' : 'mobile'" scroll-y="true" v-loading="!vk.getVuex('$app.inited')"
	 :style="{
			backgroundColor:backgroundColor,
			boxShadow:boxShadow
	 }"
	>
		<vk-data-menu-nav
			v-if="vk.getVuex('$app.inited')"
			:data="vk.getVuex('$app.navMenu')"
			:uniqueOpened="true"
			:theme="theme"
			@select="select"
		></vk-data-menu-nav>
	</scroll-view>
</template>

<script>
	import config from "@/app.config.js";
	export default {
		data() {
			return {
				theme: config.theme
			}
		},
		methods: {
			select(e){

			},
		},
		// 监听属性
		watch: {
			$route: {
				immediate: true,
				handler(newRoute, oldRoute) {
					let that = this;
					let { vk } = that;
					let { path , query } = newRoute;
					let url = path + vk.pubfn.queryParams(query);
					let route = { path, query, url };
					vk.setVuex('$app.route', route);
				}
			}
		},
		// 计算属性
		computed: {
			backgroundColor(){
				let theme = this.theme;
				if (theme && theme.use) {
					return theme[theme.use].leftMenu.backgroundColor;
				} else {
					return "#ffffff";
				}
			},
			boxShadow(){
				let theme = this.theme;
				if (theme && theme.use) {
					return theme[theme.use].leftMenu.boxShadow;
				} else {
					return "2px 0 6px rgba(0,21,4,0.2)";
				}
			}
		}
	}
</script>

<style lang="scss">
	.sidebar {
		position: fixed;
		top: var(--window-top);
		width: 240px;
		height: calc(100vh - (var(--window-top)) + 50px);
		box-sizing: border-box;
		box-shadow: var(--boxShadow);
		box-shadow: 2px 0 8px 0 rgba(29,35,41,0.05);
		background-color: $left-window-bg-color;
		padding-bottom: 10px;
		top: 50px;
		z-index: 998;
	}
	.title {
		margin-left: 5px;
	}
	.center{
		text-align: center;
		margin-top: 100px;
	}
</style>
