<template>
  <view class="page-body">
    <vk-data-table-query v-model="queryForm.formData" :columns="queryForm.columns" @search="search"></vk-data-table-query>
    <vk-data-table
      ref="table"
      :action="table.action"
      :columns="table.columns"
      :query-form-param="queryForm"
      :right-btns="['detail_auto', 'delete']"
      :row-no="true"
      :pagination="true"
      @delete="deleteBtn"
    ></vk-data-table>
    <!-- 页面内容结束 -->
  </view>
</template>

<script>
var that; // 当前页面对象
var vk = uni.vk; // vk实例
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
        action: "admin/comment/sys/getList",

        // 表格字段显示规则
        columns: [
          { key: "_id", title: "id", type: "text", width: 200 },
          { key: "userInfo.nickname", title: "用户名称", type: "text", width: 140, defaultValue: "暂无" },
          { key: "replyUserInfo.nickname", title: "回复用户名称", type: "text", width: 140, defaultValue: "暂无" },
          { key: "caricature.name", title: "评论所在漫画", type: "text", width: 250, defaultValue: "暂无" },
          {
            key: "comment_type",
            title: "评论类型",
            type: "radio",
            data: [
              { value: "0", label: "主评论" },
              { value: "1", label: "回复类型" },
            ],
          },
          { key: "comment_content", title: "评论内容", type: "text", width: 140 },
          { key: "like_count", title: "点赞数", type: "text", width: 140 },
          { key: "_add_time_str", title: "发表时间", type: "time", width: 160 },
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
          { key: "userName", title: "用户昵称", type: "text", width: 150, mode: "=" },
          { key: "caricatureName", title: "漫画名称", type: "text", width: 150, mode: "=" },
          { key: "comment_date", title: "发表时间", type: "datetimerange", width: 380, mode: "[]" },
        ],
      },
    };
  },
  // 监听 - 页面每次【加载时】执行(如：前进)
  onLoad(options = {}) {},
  // 监听 - 页面【首次渲染完成时】执行。注意如果渲染速度快，会在页面进入动画完成前触发
  onReady() {},
  // 监听 - 页面每次【显示时】执行(如：前进和返回) (页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面)
  onShow() {},
  // 监听 - 页面每次【隐藏时】执行(如：返回)
  onHide() {},
  // 函数
  methods: {
    // 搜索
    search() {
      this.$refs.table.search();
    },
    // 删除按钮
    deleteBtn({ item, deleteFn }) {
      deleteFn({
        action: "admin/comment/sys/delete",
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
