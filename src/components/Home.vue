<!-- <template>
  <div>
    <the-header></the-header>
    <the-aside></the-aside>
    <div class="content-box" :class="{ 'content-collapse': collapse }">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import TheHeader from "./TheHeader.vue";
import TheAside from "./TheAside.vue";
import bus from "../assets/js/bus";
export default {
  components: {
    TheHeader,
    TheAside,
  },
  data() {
    return {
      collapse: false,
    };
  },
  created() {
    bus.$on("collapse", (msg) => {
      this.collapse = msg;
    });
  },
};
</script> -->

<template>

  <div class="layout">
    <!--左侧导航区域-->
    <aside1 class="menu" :collapse="collapse" />
    <!--顶部内容区域-->
    <content1 class="header" :class="{isActive:collapse}" @changeCollapse='changeCollapse' :collapse="collapse"/>
    <!--右侧内容区域-->
    <right1 class="right" :class="{isActive:collapse}"/>
  </div>
</template>

<script>
import aside1 from "./aside.vue";
import content1 from "./header.vue";
import right1 from "./right.vue";
import bus from "../assets/js/bus";
export default {
  components: {
    aside1,
    content1,
    right1,
  },
  data() {
    return {
      collapse: false,//默认侧边栏展开，为true折叠
    }
  },
  // methods: {
  //   changeCollapse() {
  //     this.isCollapse = !this.isCollapse;
  //   }

  // }
  created() {
    bus.$on("collapse", (msg) => {
      this.collapse = msg;
    });
  },
}

</script>

<style lang="less" scoped>
.layout {
  display: flex;

  .menu {
    // width: 200px;
    //min-height: 500px;
    background: #545c64;
    position: fixed; //固定定位，固定导航栏
    top: 0;
    bottom: 0;
    z-index:20001;
  }

  .header {
    margin-left: 200px; //右移紧贴侧边栏
    min-height: 60px;
    position: fixed; //固定定位，固定顶部导航栏
    top: 0;
    width: 100%;
    z-index:20000;
  }

  .right {
    margin-left: 200px; //右移紧贴侧边栏
    margin-top: 60px;
    z-index:1;
    width: 100%;
    height: 100%;
  }
  .isActive{
    margin-left: 64px;
  }
}
</style>


