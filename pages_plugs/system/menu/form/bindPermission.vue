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
			v-loading="page.loading"
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
		>
			<template v-slot:permissionList>
				<el-tree
					ref="tree"
					:data="data.treeData"
					:node-key="data.nodeKey"
					:default-checked-keys="data.checkedKeys"
					:props="{
						children: 'children',
						label: 'label'
					}"
					show-checkbox
					default-expand-all
					expand-on-click-node
				></el-tree>
			</template>
		</vk-data-form>
		<!-- 页面主体内容结束 -->
	</vk-data-dialog>
</template>

<script>
var that;					// 当前页面对象
var vk = uni.vk; 	// vk实例
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
			data:{
				info:{},
				// 权限的树形结构数据
				treeData: [],
				// 默认选中的权限列表
				checkedKeys:[],
				// 树的唯一标识
				nodeKey:"permission_id",
			},
			page: {
				title: "权限赋予",
				submitText: "确定",
				cancelText: "关闭",
				showCancel: true,
				top: "7vh",
				width:"800px",
				loading: false
			},
			form1: {
				// 表单请求数据，此处可以设置默认值
				data: {
					menu_id:"",
					reset:true,
					permissionList:[]
				},
				// 表单属性
				props: {
					// 表单请求地址
					action: "admin/system/menu/sys/bindPermission",
					// 表单字段显示规则
					columns: [
						// 常用字段类型
						{ key: "permissionList", title: "权限列表", type: "text" }
					],
					// 表单验证规则
					rules: {

					},
					labelWidth: "100px",
					beforeAction:function(formData){
						let checkedKeys = that.$refs.tree.getCheckedKeys();
						let halfCheckedKeys = that.$refs.tree.getHalfCheckedKeys();
						let allCheckedKeys = checkedKeys.concat(halfCheckedKeys);
						// 去除空属性
						for(let i = 0;i<allCheckedKeys.length;i++){
							if(vk.pubfn.isNull(allCheckedKeys[i])){
								allCheckedKeys.splice(i, 1);
								i--;
							}
						}
						formData.permissionList = allCheckedKeys;
						return formData;
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
			let { item } = value;
			let { menu_id, name, permission = [] } = item;
			that.page.title = `权限赋予（${name}）`;
			that.data.info = item;
			that.form1.data.menu_id = menu_id;
			that.form1.data.permissionList = permission;
			that.page.loading = true;
			// 执行请求
			vk.callFunction({
				url: 'admin/system/permission/sys/getAll',
				data: {},
			  success: (data) => {
					let rows = [{
						label :"全选",
						permission_id :"",
						children : data.rows
					}];
					// 渲染树
					that.data.treeData = rows;
					let currentPermission = vk.pubfn.copyObject(permission);
					// 设置当前选中用户的权限列表
					// 去除所有含有子元素的权限
					for(let i in data.list){
						let item = data.list[i];
						let index = currentPermission.indexOf(item.parent_id);
						if(index > -1){
							currentPermission.splice(index, 1);
						}
					}
					that.data.checkedKeys = currentPermission;
					that.$refs.tree.setCheckedKeys(currentPermission);
			  },
				complete() {
					// 设置权限数据状态为加载完毕
					that.page.loading = false;
				}
			});
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
