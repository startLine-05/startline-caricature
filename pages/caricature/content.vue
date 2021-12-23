<template>
  <view class="page-body">
    <vk-data-table-query v-model="queryForm.formData" :columns="queryForm.columns" @search="search"></vk-data-table-query>

    <view>
      <el-row>
        <el-button type="success" size="small" icon="el-icon-circle-plus-outline" @click="addBtn">添加</el-button>
        <!-- 批量操作 -->
        <el-dropdown v-if="table.multipleSelection" :split-button="false" trigger="click" @command="batchBtn">
          <el-button type="danger" size="small" style="margin-left: 20rpx" :disabled="table.multipleSelection.length === 0">
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
      ref="table"
      :action="table.action"
      :columns="table.columns"
      :query-form-param="queryForm"
      :right-btns-more="table.rightBtnsMore"
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
    <vk-data-dialog v-model="form.props.show" :title="form.props.title" width="600px" mode="form" :close-on-click-modal="false">
      <vk-data-form
        ref="form"
        v-model="form.data"
        :rules="form.props.rules"
        :action="form.props.action"
        :form-type="form.props.formType"
        :columns="columns"
        label-width="100px"
        @success="
          form.props.show = false;
          refresh();
        "
      >
      </vk-data-form>
    </vk-data-dialog>
    <!-- 添加或编辑的弹窗结束 -->
    <el-dialog :title="`${current_row.current_name}(${current_row.current_name})-编辑内容`" :visible.sync="visibleEditImg">
      <div class="flex">
        <div v-for="(item, index) of current_row.image_list" :key="index">
          <div class="u-f-ajc" :style="{ flexDirection: 'column', padding: '10px' }">
            <el-badge :value="index + 1" class="item">
              <vk-data-upload v-model="item.img_url" list-type="picture-card" :limit="1"> </vk-data-upload>
            </el-badge>
            <el-button type="text" size="mini" @click="soltImg(index)">插入内容</el-button>
          </div>
        </div>
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
      // init请求返回的数据
      data: {},
      // 表格相关开始 -----------------------------------------------------------
      table: {
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
      queryForm: {
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
      form: {
        // 表单请求数据，此处可以设置默认值
        data: {
          caricature_id: "",
        },
        // 表单属性
        props: {
          // 表单请求地址
          action: "",
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
        _id: "",
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
    soltImg(index) {
      console.log(index, this.current_row.image_list);
      this.current_row.image_list.splice(index + 1, 0, {
        img_url: "",
      });
    },
    sumbitImgLis() {
      let { image_list } = this.current_row;
      const listTemp = [];
      image_list.forEach((v, index) => {
        if (v.img_url) {
          listTemp.push({
            img_url: v.img_url,
            page_num: index + 1,
          });
        }
      });
      vk.callFunction({
        url: "admin/caricatureContent/sys/updateImg",
        title: "请求中...",
        data: { ...this.current_row, image_list: listTemp },
      })
        .then((res) => {
          console.log(res, "sss");
          this.visibleEditImg = false;
          this.refresh();
        })
        .catch((err) => {});
    },
    // 页面数据初始化函数
    init(options) {
      this.queryForm.formData = options;
      this.form.data = options;
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
    // 获取当前选中的行的数据
    getCurrentRow() {
      return that.$refs.table.getCurrentRow();
    },
    // 监听 - 行的选中高亮事件
    currentChange(val) {
      that.table.selectItem = val;
    },
    // 当选择项发生变化时会触发该事件
    selectionChange(list) {
      that.table.multipleSelection = list;
    },
    // 显示添加页面
    addBtn() {
      that.resetForm();
      that.form.props.action = "admin/caricatureContent/sys/add";
      that.form.props.formType = "add";
      that.form.props.title = "添加";
      that.form.props.show = true;
    },
    // 显示修改页面
    updateBtn({ item }) {
      that.form.props.action = "admin/caricatureContent/sys/update";
      that.form.props.formType = "update";
      that.form.props.title = "编辑";
      that.form.props.show = true;
      that.form.data = item;
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
      console.log(that.form.props.formType);
      if (that.form.props.formType == "add") {
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
  flex-wrap: wrap;
}
</style>
