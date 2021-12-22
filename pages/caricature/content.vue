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
      :right-btns-more="table1.rightBtnsMore"
      :right-btns="['detail_auto', 'update', 'delete', 'more']"
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
        ref="form1"
        v-model="form1.data"
        :rules="form1.props.rules"
        :action="form1.props.action"
        :form-type="form1.props.formType"
        :columns="columns"
        label-width="100px"
        @success="
          form1.props.show = false;
          refresh();
        "
      >
      </vk-data-form>
    </vk-data-dialog>
    <!-- 添加或编辑的弹窗结束 -->
    <el-dialog :title="`${current_row.current_name}(${current_row.current_name})-编辑内容`" :visible.sync="visibleEditImg">
      <div class="flex">
        <block v-for="(item, index) of current_row.image_list" :key="index">
          <vk-data-upload v-model="item.img_url" :limit="1"></vk-data-upload>
        </block>
        <div class="u-f-ajc">
          <i class="el-icon-upload el-icon--right"></i>
        </div>
        <!-- <el-button type="primary"> 添加第{{ current_row.image_list.length }}页数<i class="el-icon-upload el-icon--right"></i> </el-button> -->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visibleEditImg = false">取 消</el-button>
        <el-button type="primary" @click="sumbitImgLis">确 定</el-button>
      </div>
    </el-dialog>
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
      table1: {
        // 表格数据请求地址
        action: "admin/caricatureContent/sys/getList",
        rightBtnsMore: [
          {
            title: "内容管理",
            onClick: (row) => {
              this.editImgList(row);
            },
          },
        ],
        // 表格字段显示规则
        columns: [
          { key: "_id", title: "id", type: "text", width: 200 },
          { key: "current_number", title: "漫画集数编号", type: "text", width: 140 },
          { key: "current_name", title: "当前集数名称", type: "text", width: 250 },
          { key: "_add_time_str", title: "创建时间", type: "text", width: 250 },
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
        formData: {
          caricature_id: "",
        },
        // 查询表单的字段规则 fieldName:指定数据库字段名,不填默认等于key
        columns: [
          { key: "_id", title: "ID", type: "text", width: 140, mode: "=" },
          { key: "current_number", title: "漫画集数编号", type: "text", width: 140, mode: "=" },
          { key: "current_name", title: "当前集数名称", type: "text", width: 140, mode: "%%" },
        ],
      },
      form1: {
        // 表单请求数据，此处可以设置默认值
        data: {
          caricature_id: "",
        },
        // 表单属性
        props: {
          // 表单请求地址
          action: "",
          // 表单字段显示规则
          // columns: [
          //   { key: "current_number", title: "当前集数", type: "number" },
          //   { key: "current_name", title: "集数名称", type: "text" },
          //   this.form1.formType == "add"
          //     ? {
          //         key: "image_list",
          //         title: "初始化内容",
          //         type: "image",
          //         limit: 99,
          //         disabled: () => {
          //           console.log("sssss", this.form1.formType == "add" ? true : false);
          //           return this.form1.formType == "add" ? true : false;
          //         },
          //       }
          //     : {},
          // ],
          // 表单对应的验证规则
          rules: {
            current_number: [{ required: true, message: "当前集数为必填字段", trigger: "blur" }],
            current_name: [
              { required: true, message: "集数名称为必填字段", trigger: "blur" },
              { min: 2, max: 10, message: "集数名称长度在 2 到 10 个字符", trigger: "blur" },
            ],
          },
          // add 代表添加 update 代表修改
          formType: "add",
          // 是否显示表单1 的弹窗
          show: false,
        },
      },
      visibleEditImg: false,
      current_row: {
        image_list: [],
      },
      // 表单相关结束 -----------------------------------------------------------
    };
  },
  // 监听 - 页面每次【加载时】执行(如：前进)
  onLoad(options = {}) {
    that = this;
    vk = that.vk;
    options = options;
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
    editImgList(row) {
      console.log(row);
      this.current_row = row;
      this.visibleEditImg = true;
    },
    sumbitImgLis() {
      console.log(this.current_row);
      vk.callFunction({
        url: "admin/caricatureContent/sys/updateImg",
        title: "请求中...",
        data: this.current_row,
      })
        .then((res) => {
          console.log(res, "sss");
        })
        .catch((err) => {});
    },
    // 页面数据初始化函数
    init(options) {
      this.queryForm1.formData = options;
      this.form1.data = options;
      originalForms["form1"] = vk.pubfn.copyObject(that.form1);
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
      that.form1.props.action = "admin/caricatureContent/sys/add";
      that.form1.props.formType = "add";
      that.form1.props.title = "添加";
      that.form1.props.show = true;
    },
    // 显示修改页面
    updateBtn({ item }) {
      that.form1.props.action = "admin/caricatureContent/sys/update";
      that.form1.props.formType = "update";
      that.form1.props.title = "编辑";
      that.form1.props.show = true;
      that.form1.data = item;
    },
    // 删除按钮
    deleteBtn({ item, deleteFn }) {
      deleteFn({
        action: "admin/caricatureContent/sys/delete",
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
    columns() {
      console.log(that.form1.props.formType);
      if (that.form1.props.formType == "add") {
        return [
          { key: "current_number", title: "当前集数", type: "number" },
          { key: "current_name", title: "集数名称", type: "text" },
          {
            key: "image_list",
            title: "初始化内容",
            type: "image",
            limit: 99,
          },
        ];
      } else {
        return [
          { key: "current_number", title: "当前集数", type: "number" },
          { key: "current_name", title: "集数名称", type: "text" },
        ];
      }
    },
  },
};
</script>
<style lang="less" scoped>
.flex {
  display: flex;
  align-items: center;
}
.add {
  width: 100px;
  height: 100px;
  border: 5px;
}
</style>
