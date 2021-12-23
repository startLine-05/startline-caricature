<template>
  <view class="page-body">
    <vk-data-table-query v-model="queryForm.formData" :columns="queryForm.columns" @search="search"></vk-data-table-query>

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
    <el-dialog :title="`${current_row.current_name}-${current_row.current_number}-编辑内容`" :destroy-on-close="true" :visible.sync="visibleEditImg">
      <div style="overflow: auto; height: 400px">
        <shmily-drag-image v-if="visibleEditImg" ref="dragImage" :number="999" :cols="3" :list.sync="image_list" :custom="false"></shmily-drag-image>
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
import shmilyDragImage from "@/components/shmily-drag-image/shmily-drag-image.vue";
export default {
  components: {
    shmilyDragImage,
  },
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
      //编辑图片弹框
      visibleEditImg: false,
      current_row: {},
      image_list: [],
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
    // 页面数据初始化函数
    init(options) {
      this.queryForm.formData = options;
      this.form.data = options;
      originalForms["form"] = vk.pubfn.copyObject(that.form);
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
    editImgList(row) {
      console.log(row);
      this.current_row = row;
      this.image_list = row.image_list;
      this.visibleEditImg = true;
    },
    async sumbitImgLis() {
      const { image_list } = this;
      const resList = await this.uploadFileList(image_list);
      console.log("tttt", resList);

      vk.callFunction({
        url: "admin/caricatureContent/sys/updateImg",
        title: "请求中...",
        data: { ...this.current_row, image_list: resList },
      })
        .then((res) => {
          console.log(res, "sss");
          this.visibleEditImg = false;
          this.refresh();
        })
        .catch((err) => {});
    },
    //同步上传方法
    async uploadFileList(image_list) {
      const list = [];
      for (let i = 0; i < image_list.length; i++) {
        if (image_list[i].includes("blob")) {
          console.log("image_list[i]", image_list[i]);
          list.push(
            vk.callFunctionUtil
              .uploadFile({
                title: "上传中...",
                filePath: image_list[i],
                // suffix: "png", // 不传suffix会自动获取，但H5环境下获取不到后缀，但可以通过file.name 获取
                provider: "unicloud",
              })
              .then((res) => res.url)
          );
        } else {
          list.push(Promise.resolve(image_list[i]));
        }
      }
      return Promise.all(list);
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
<style lang="less" scoped></style>
