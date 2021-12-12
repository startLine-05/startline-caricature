<template>
  <view class="page-body">
    <!-- 页面内容开始 -->

    <!-- 表格搜索组件开始 -->
    <vk-data-table-query v-model="queryForm1.formData" :columns="queryForm1.columns" @search="search"></vk-data-table-query>
    <!-- 表格搜索组件结束 -->

    <!-- 自定义按钮区域开始 -->
    <view>
      <el-row>
        <el-button type="success" size="small" icon="el-icon-circle-plus-outline" @click="addBtn">添加</el-button>
        <!-- 批量操作 -->
        <el-dropdown v-if="table1.multipleSelection" :split-button="false" trigger="click" @command="batchBtn">
          <el-button type="danger" size="small" style="margin-left: 20rpx" :disabled="table1.multipleSelection.length === 0">
            批量操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="1">批量操作1</el-dropdown-item>
            <el-dropdown-item :command="2">批量操作2</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>
    </view>
    <!-- 自定义按钮区域结束 -->

    <!-- 表格组件开始 -->
    <vk-data-table
      ref="table1"
      :action="table1.action"
      :columns="table1.columns"
      :query-form-param="queryForm1"
      :right-btns="['detail_auto', 'update', 'delete', 'more']"
      :right-btns-more="table1.rightBtnsMore"
      :selection="true"
      :row-no="true"
      :pagination="true"
      @update="updateBtn"
      @delete="deleteBtn"
      @current-change="currentChange"
      @selection-change="selectionChange"
    ></vk-data-table>
    <!-- 表格组件结束 -->

    <!-- 添加或编辑的弹窗开始 -->
    <vk-data-dialog v-model="form1.props.show" :title="form1.props.title" width="600px" mode="form" :close-on-click-modal="false">
      <vk-data-form
        v-model="form1.data"
        :rules="form1.props.rules"
        :action="form1.props.action"
        :form-type="form1.props.formType"
        :columns="form1.props.columns"
        label-width="80px"
        @success="
          form1.props.show = false;
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
var categoryData = []; //分类数据

export default {
  data() {
    // 页面数据变量
    return {
      // 页面是否请求中或加载中
      loading: false,
      // init请求返回的数据
      data: {},
      // 表格相关开始 -----------------------------------------------------------
      table1: {
        // 表格数据请求地址
        action: "admin/caricature/sys/getList",
        rightBtnsMore: [
          {
            title: "内容管理",
            onClick: function (row) {
              vk.navigateTo(`/pages/caricature/content?caricature_id=${row._id}`);
            },
          },
        ],
        // 表格字段显示规则
        columns: [
          { key: "_id", title: "id", type: "text", width: 200 },
          { key: "avatar", title: "封面大图", type: "image", width: 150 },
          { key: "name", title: "漫画名称", type: "text", width: 140, defaultValue: "暂无" },
          { key: "author", title: "作者", type: "text", width: 140, defaultValue: "暂无" },
          { key: "excerpt", title: "简介", type: "text", width: 250 },
          {
            key: "caricature_status",
            title: "漫画状态",
            type: "tag",
            width: 120,
            defaultValue: 0,
            data: [
              { value: 0, label: "连载中", tagType: "primary" },
              { value: 1, label: "已完结", tagType: "success" },
            ],
          },
          {
            key: "category_id",
            title: "漫画分类",
            type: "html",
            width: 120,
            formatter: function (val) {
              const index = categoryData.findIndex((v) => v.value === val);
              return `<text>${categoryData[index] ? categoryData[index].label : "未分类"}</text>`;
            },
          },
          { key: "view_count", title: "阅读数量", type: "text" },
          { key: "like_count", title: "喜欢数量", type: "text" },
          { key: "comment_count", title: "评论数量", type: "text" },
          { key: "publish_date", title: "创建时间", type: "time", width: 160, sortable: "custom" },
          { key: "last_modify_date", title: "最后修改时间", type: "time", width: 160 },
          { key: "is_sticky", title: "是否置顶", type: "switch", width: 120 },
          { key: "is_essence", title: "是否推荐", type: "switch", width: 120 },
          { key: "comment_status", title: "评论开放状态", type: "switch", width: 120 },
        ],
        // 多选框选中的值
        multipleSelection: [],
        // 当前高亮的记录
        selectItem: "",
      },
      // 表格相关结束 -----------------------------------------------------------
      // 表单相关开始 -----------------------------------------------------------
      // 查询表单请求数据
      queryForm1: {
        // 查询表单数据源，可在此设置默认值
        formData: {},
        // 查询表单的字段规则 fieldName:指定数据库字段名,不填默认等于key
        columns: [
          { key: "_id", title: "ID", type: "text", width: 140, mode: "=" },
          { key: "name", title: "漫画名称", type: "text", width: 140, mode: "%%" },
          { key: "author", title: "作者", type: "text", width: 140, mode: "%%" },
          {
            key: "category_id",
            title: "漫画分类",
            type: "select",
            mode: "=",
            data: this.categoryData,
          },
        ],
      },
      form1: {
        // 表单请求数据，此处可以设置默认值
        data: {},
        // 表单属性
        props: {
          // 表单请求地址
          action: "",
          // 表单字段显示规则
          columns: [
            { key: "name", title: "漫画名称", type: "text" },
            { key: "author", title: "作者", type: "text" },
            {
              key: "excerpt",
              title: "漫画简介",
              type: "textarea",
              maxlength: "300",
              showWordLimit: true,
              autosize: { minRows: 2, maxRows: 10 },
            },
            {
              key: "category_id",
              title: "漫画分类",
              type: "select",
              data: () => this.this.categoryData,
            },
            { key: "avatar", title: "漫画封面", type: "image", limit: 1 },
            { key: "is_sticky", title: "是否置顶", type: "switch", width: 120, activeValue: true, inactiveValue: false },
            { key: "is_essence", title: "是否推荐", type: "switch", width: 120, activeValue: true, inactiveValue: false },
            { key: "comment_status", title: "评论状态", type: "switch", width: 120, activeValue: true, inactiveValue: false },
          ],
          // 表单对应的验证规则
          rules: {
            name: [
              { required: true, message: "漫画名称为必填字段", trigger: "blur" },
              { min: 2, max: 10, message: "漫画名称长度在 2 到 20 个字符", trigger: "blur" },
            ],
            author: [
              { required: true, message: "作者为必填字段", trigger: "blur" },
              { min: 2, max: 10, message: "昵称长度在 2 到 20 个字符", trigger: "blur" },
            ],
            excerpt: [{ required: true, message: "漫画简介为必填字段", trigger: "blur" }],
          },
          // add 代表添加 update 代表修改
          formType: "add",
          // 是否显示表单1 的弹窗
          show: false,
        },
      },
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
      originalForms["form1"] = vk.pubfn.copyObject(that.form1);
      this.getCategoryData();
    },
    //查询分类列表
    getCategoryData() {
      this.vk
        .callFunction({
          url: "admin/category/kh/getList",
        })
        .then((res) => {
          categoryData = res.data;
          this.queryForm1.columns[3].data = res.data;
        });
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
      that.$refs.table1.search();
    },
    // 刷新
    refresh() {
      that.$refs.table1.refresh();
    },
    // 获取当前选中的行的数据
    getCurrentRow() {
      return that.$refs.table1.getCurrentRow();
    },
    // 监听 - 行的选中高亮事件
    currentChange(val) {
      that.table1.selectItem = val;
    },
    // 当选择项发生变化时会触发该事件
    selectionChange(list) {
      that.table1.multipleSelection = list;
    },
    // 显示添加页面
    addBtn() {
      that.resetForm();
      that.form1.props.action = "admin/caricature/sys/add";
      that.form1.props.formType = "add";
      that.form1.props.title = "添加";
      that.form1.props.show = true;
    },
    // 显示修改页面
    updateBtn({ item }) {
      that.form1.props.action = "admin/caricature/sys/update";
      that.form1.props.formType = "update";
      that.form1.props.title = "编辑";
      that.form1.props.show = true;
      that.form1.data = item;
    },
    // 删除按钮
    deleteBtn({ item, deleteFn }) {
      deleteFn({
        action: "admin/caricature/sys/delete",
        data: {
          _id: item._id,
        },
      });
    },
    // 监听 - 批量操作的按钮点击事件
    batchBtn(index) {
      switch (index) {
        case 1:
          vk.toast("批量操作按钮1");
          break;
        case 2:
          vk.toast("批量操作按钮2");
          break;
        default:
          break;
      }
    },
  },
  // 监听属性
  watch: {},
  // 过滤器
  filters: {},
  // 计算属性
  computed: {
    categoryData() {
      return categoryData;
    },
  },
};
</script>
<style lang="scss" scoped></style>
