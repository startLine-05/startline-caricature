<template>
  <view class="page-body">
    <h1>欢迎登录startLine-caricature 管理后台</h1>
    <image class="img" src="/static/bg/007.jpg" mode="widthFix" />
  </view>
</template>

<script>
var that; // 当前页面对象
var vk = uni.vk; // vk实例

export default {
  data() {
    // 页面数据变量
    return {
      // init请求返回的数据
      data: {},
    };
  },
};
</script>
<style lang="scss" scoped>
.img {
  width: 100%;
}
</style>
