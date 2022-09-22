
<template>
    <div class="sidebar">
        <!-- 侧边栏折叠过渡动画 -->
        <transition name="el-fade-in-linear">
            <el-menu default-active="/Info" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff"
                active-text-color="#ffd04b" router :collapse="collapse">
                <el-menu-item>
                    <span slot="title">Yep!Music后台管理系统</span>
                </el-menu-item>
                <el-menu-item index="/Info">
                    <i class="el-icon-menu"></i>
                    <span slot="title">系统首页</span>
                </el-menu-item>
                <!-- <el-menu-item index="/index">
                    <i class="el-icon-menu"></i>
                    <span slot="title">系统首页2</span>
                </el-menu-item> -->
                <el-submenu index="/Consumer">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>用户管理</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item index="/Consumer">
                            <i class="el-icon-menu"></i>
                            <span slot="title">全部用户</span>
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
                <el-menu-item index="/Vip">
                    <i class="el-icon-setting"></i>
                    <span slot="title">VIP管理</span>
                </el-menu-item>
                <!-- <el-submenu index="/Auth">
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
                </el-submenu> -->
            </el-menu>
        </transition>
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
        //通过Bus进行组件间的通信，来折叠侧边栏
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

.sidebar>ul {
    height: 100%;
    /**循环菜单栏高度，这样侧边栏的宽度就会一致。不一致的原因是侧边栏有些有字，有些空白，有字的部分由于上面的循环，导致侧边栏显示宽度不一致 */
}
</style> 