
<template>
    <div>
        <el-menu default-active="/" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff"
            active-text-color="#ffd04b" router :collapse="collapse">
            <el-menu-item>
                <span slot="title">Yep!Music后台管理系统</span>
            </el-menu-item>
            <el-menu-item index="/Info">
                <i class="el-icon-menu"></i>
                <span slot="title">系统首页</span>
            </el-menu-item>
            <el-submenu index="/Consumer2">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>用户管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/Consumer2">
                        <i class="el-icon-menu"></i>
                        <span slot="title">普通用户</span>
                    </el-menu-item>
                    <el-menu-item index="/VipConsumer">
                        <i class="el-icon-menu"></i>
                        <span slot="title">VIP用户</span>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="/Singer">
                <i class="el-icon-setting"></i>
                <span slot="title">歌手管理</span>
            </el-menu-item>
            <el-menu-item index="/SongList">
                <i class="el-icon-setting"></i>
                <span slot="title">歌单管理</span>
            </el-menu-item>
            <el-submenu index="/Auth">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>权限管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/Auth/Roles-List">
                        <i class="el-icon-menu"></i>
                        <span slot="title">角色列表</span>
                    </el-menu-item>
                    <el-menu-item index="/Auth/Auth-List">
                        <i class="el-icon-menu"></i>
                        <span slot="title">权限列表</span>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </div>

</template>


<script>
import bus from "../assets/js/bus";
export default {
    // props: [' isCollapse'],//从父组件Home.vue接收的数据
    data() {
        return {
            collapse: false
        };
    },
    created() {
        //通过Bus进行组件件的通信，来折叠侧边栏
        bus.$on("collapse", (msg) => {
            this.collapse = msg;
        });
    },

}
</script>

<style lang='less' scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
</style> 