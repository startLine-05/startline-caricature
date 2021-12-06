<template>
	<vk-data-dialog
		v-model="value.show"
		:title="page.title"
		:top="page.top"
		:width="page.width"
		mode="form"
	>
		<!-- 页面主体内容开始 -->
		<vk-data-form
			ref="form1"
			v-model="form1.data"
			:form-type="value.mode"
			:rules="form1.props.rules"
			:action="form1.props.action"
			:columns="form1.props.columns"
			:loading.sync="form1.props.loading"
			:labelWidth="form1.props.labelWidth"
			:before-action="form1.props.beforeAction"
			:show-cancel="page.showCancel"
			:cancel-text="page.cancelText"
			:submit-text="page.submitText"
			@success="onFormSuccess"
		></vk-data-form>
		<!-- 页面主体内容结束 -->
	</vk-data-dialog>
</template>

<script>
var that; // 当前页面对象
var vk = uni.vk; // vk实例
export default {
	props: {
		value: {
			Type: Object,
			default: function() {
				return {
					show: false,
					mode: "",
					item: ""
				};
			}
		}
	},
	data: function() {
		// 组件创建时,进行数据初始化
		return {
			page: {
				title: "导入菜单",
				submitText: "导入",
				cancelText: "关闭",
				showCancel: true,
				top: "7vh",
				width:"800px"
			},
			form1: {
				// 表单请求数据，此处可以设置默认值
				data: {
					mode: 1,
					jsonType: 1
				},
				// 表单属性
				props: {
					// 表单请求地址
					action: "admin/system/menu/sys/adds",
					// 表单字段显示规则
					columns: [
						{ key: "jsonType", title: "json类型", type: "radio",
							data: [
								{ value: 1, label: "树形结构" },
								{ value: 2, label: "数组结构" },
							]
						},
						{ key:"parent_id", title:"父级菜单Id", type:"text",
							showRule:"jsonType=1"
						},
						{ key: "mode", title: "重复标识是否覆盖", type: "radio",
							data: [
								{ value: 1, label: "覆盖" },
								{ value: 2, label: "忽略" },
							]
						},
						{ key: "menus", title: "JSON内容", type: "textarea",
							autosize: { minRows: 18, maxRows: 18 }
						},
					],
					// 表单验证规则
					rules: {
						menus: [
							{ required: true, message: "不能为空", trigger: "change" },
						]
					},
					// add 代表添加 update 代表修改
					formType: "",
					// 表单是否在请求中
					loading: false,
					// 是否显示表单1 的弹窗
					show: false,
					labelWidth:"140px",
					beforeAction(formData){
						try {
							let menus = JSON.parse(formData.menus);
							if(Object.prototype.toString.call(menus) === '[object Object]'){
								menus = [menus];
							}
							if(formData.jsonType == 1){
								menus.map((item, index) => {
									item.parent_id = formData.parent_id;
								});
								menus = vk.pubfn.treeToArray(menus,{
								  id:"menu_id",
								  parent_id:"parent_id",
								  children:"children"
								});
							}
							return {
								menus
							};
						}catch(err){
							vk.toast("json解析失败","none");
							console.error(err);
							return false;
						}
					}
				}
			}
		};
	},
	mounted() {
		that = this;
		that.init();
	},
	methods: {
		// 初始化
		init() {
			let { value } = that;
			that._input(value);
		},
		_input(value){
			that.$emit("input", value);
		},
		// 监听 - 页面打开
		onOpen() {
			that = this;
			let { value={} } = that;
			let { menu_id } = value.item || {};
			that.form1.data.parent_id = menu_id;
		},
		// 监听 - 页面关闭
		onClose() {
			that.resetForm();
		},
		// 监听 - 提交成功后
		onFormSuccess() {
			that.close();
			that.$emit("success");
		},
		// 下方的代码基本无需修改 -----------------------------------------------------------
		// 打开页面
		open() {
			let { value } = that;
			value.show = true;
			that._input(value);
		},
		// 关闭页面
		close() {
			let { value } = that;
			value.show = false;
			that._input(value);
		},
		// 表单重置
		resetForm() {
			that.$refs.form1.resetForm();
		},
		// 表单提交
		submitForm() {
			that.$refs.form1.submitForm();
		}
	},
	watch: {
		"value.show": {
			handler(newValue, oldValue) {
				let that = this;
				if (newValue) {
					that.onOpen();
				} else {
					that.onClose();
				}
			}
		}
	},
	// 过滤器
	filters: {

	},
	// 计算属性
	computed: {

	}
};
</script>

<style lang="scss" scoped>

</style>
