<template>
  <view class="page-body">
    <!-- 页面内容开始 -->

    <!-- 表格搜索组件开始 -->
    <vk-data-table-query v-model="queryForm.formData" :columns="queryForm.columns" @search="search"></vk-data-table-query>
    <!-- 表格搜索组件结束 -->

    <!-- 自定义按钮区域开始 -->
    <view>
      <el-row>
        <el-button type="success" size="small" icon="el-icon-circle-plus-outline" @click="addBtn">添加</el-button>
      </el-row>
    </view>
    <!-- 自定义按钮区域结束 -->

    <!-- 表格组件开始 -->
    <vk-data-table
      ref="table"
      :action="table.action"
      :columns="table.columns"
      :query-form-param="queryForm"
      :right-btns="['detail_auto', 'update', 'delete']"
      :row-no="true"
      :pagination="true"
      @update="updateBtn"
      @delete="deleteBtn"
    ></vk-data-table>
    <!-- 表格组件结束 -->

    <!-- 添加或编辑的弹窗开始 -->
    <vk-data-dialog v-model="form.props.show" :title="form.props.title" width="600px" mode="form" :close-on-click-modal="false">
      <vk-data-form
        v-model="form.data"
        :rules="form.props.rules"
        :action="form.props.action"
        :form-type="form.props.formType"
        :columns="form.props.columns"
        label-width="80px"
        @success="
          form.props.show = false;
          refresh();
        "
      ></vk-data-form>
    </vk-data-dialog>
    <!-- 添加或编辑的弹窗结束 -->

    <!-- 页面内容结束 -->
  </view>
</template>

<script>
var that; // 当前页面对象
var vk = uni.vk; // vk实例
var originalForms = {}; // 表单初始化数据

export default {
  data() {
    // 页面数据变量
    return {
      // 页面是否请求中或加载中
      loading: false,
      // init请求返回的数据
      data: {},
      // 表格相关开始 -----------------------------------------------------------
      table: {
        // 表格数据请求地址
        action: "admin/category/sys/getList",

        // 表格字段显示规则
        columns: [
          { key: "_id", title: "id", type: "text", width: 200 },
          { key: "name", title: "分类名称", type: "text", width: 140 },
          { key: "description", title: "分类描述", type: "text", width: 250, defaultValue: "暂无" },
          { key: "create_date", title: "创建时间", type: "time", width: 160 },
        ],
      },
      // 表格相关结束 -----------------------------------------------------------
      // 表单相关开始 -----------------------------------------------------------
      // 查询表单请求数据
      queryForm: {
        // 查询表单数据源，可在此设置默认值
        formData: {},
        // 查询表单的字段规则 fieldName:指定数据库字段名,不填默认等于key
        columns: [
          { key: "_id", title: "ID", type: "text", width: 140, mode: "=" },
          { key: "name", title: "分类名称", type: "text", width: 150, mode: "=" },
        ],
      },
      form: {
        // 表单请求数据，此处可以设置默认值
        data: {},
        // 表单属性
        props: {
          // 表单请求地址
          action: "",
          // 表单字段显示规则
          columns: [
            { key: "name", title: "分类名称", type: "text" },
            {
              key: "description",
              title: "漫画简介",
              type: "textarea",
              maxlength: "300",
              showWordLimit: true,
              autosize: { minRows: 2, maxRows: 10 },
            },
          ],
          // 表单对应的验证规则
          rules: {
            name: [
              { required: true, message: "分类名称为必填字段", trigger: "blur" },
              { min: 2, max: 4, message: "分类名称长度在 2 到 4 个字符", trigger: "blur" },
            ],
          },
          // add 代表添加 update 代表修改
          formType: "add",
          // 是否显示表单1 的弹窗
          show: false,
        },
      },
      // 其他弹窗表单
      formDatas: {},
      // 表单相关结束 -----------------------------------------------------------
    };
  },
  // 监听 - 页面每次【加载时】执行(如：前进)
  onLoad(options = {}) {
    that = this;
    vk = that.vk;
    that.options = options;
    that.init(options);
  },
  // 监听 - 页面【首次渲染完成时】执行。注意如果渲染速度快，会在页面进入动画完成前触发
  onReady() {},
  // 监听 - 页面每次【显示时】执行(如：前进和返回) (页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面)
  onShow() {},
  // 监听 - 页面每次【隐藏时】执行(如：返回)
  onHide() {},
  // 函数
  methods: {
    // 页面数据初始化函数
    init(options) {
      originalForms["form"] = vk.pubfn.copyObject(that.form);
    },
    // 页面跳转
    pageTo(path) {
      vk.navigateTo(path);
    },
    // 表单重置
    resetForm() {
      vk.pubfn.resetForm(originalForms, that);
    },
    // 搜索
    search() {
      that.$refs.table.search();
    },
    // 刷新
    refresh() {
      that.$refs.table.refresh();
    },
    // 显示添加页面
    addBtn() {
      that.resetForm();
      that.form.props.action = "admin/category/sys/add";
      that.form.props.formType = "add";
      that.form.props.title = "添加";
      that.form.props.show = true;
    },
    // 显示修改页面
    updateBtn({ item }) {
      that.form.props.action = "admin/category/sys/update";
      that.form.props.formType = "update";
      that.form.props.title = "编辑";
      that.form.props.show = true;
      that.form.data = item;
    },
    // 删除按钮
    deleteBtn({ item, deleteFn }) {
      deleteFn({
        action: "admin/category/sys/delete",
        data: {
          _id: item._id,
        },
      });
    },
  },
  // 监听属性
  watch: {},
  // 过滤器
  filters: {},
  // 计算属性
  computed: {},
};
</script>
<style lang="scss" scoped></style>
