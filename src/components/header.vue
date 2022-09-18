<template>
    <div>
        <div class="header">
            <i v-if="!collapse" @click="collapseChange" class="iconfont el-icon-s-fold"></i>
            <i v-else @click="collapseChange" class="iconfont el-icon-s-unfold"></i>


            <div class="header-right">
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip :content="fullscreen ? `取消全屏` : `全屏`" placement="bottom">
                        <i class="el-icon-full-screen"></i>
                    </el-tooltip>
                </div>
                <div class="user-avator">
                    <img src="../assets/img/user.jpg" />
                </div>
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{ userName }}
                        <i class="el-icon-arrow-down"></i>
                    </span>

                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
import bus from "../assets/js/bus";
import { getLoginOut } from "../api/index"
import { mixin } from "../mixins/index";
export default {
    mixins: [mixin],
    props: ['collapse'],//默认为false
    data() {
        return {
            collapse: false,
            fullscreen: false,
        };
    },
    computed: {
        userName() {
            return localStorage.getItem("userName");

        },
    },
    methods: {
        //侧边栏折叠
        collapseChange() {
            this.collapse = !this.collapse;
            bus.$emit("collapse", this.collapse);
        },
        //     changeMenu(){
        //         // 点击切换按钮的时候，修改父组件的数据 --isCollapse
        //         this.$emit('changeCollapse')
        //     }
        //全屏事件
        handleFullScreen() {
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullScreen) {
                    document.msExitFullScreen();
                }
            } else {
                let element = document.documentElement;
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitCancelFullScreen) {
                    element.webkitCancelFullScreen();
                } else if (element.mozCancelFullScreen) {
                    element.mozCancelFullScreen();
                } else if (element.msExitFullScreen) {
                    element.msExitFullScreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        },
        handleCommand(command) {
            if (command == "logout") {
                //这是后台退出登录
                getLoginOut().then((res) => {
                    if (res.code == 2) {
                        localStorage.removeItem("userName");
                        localStorage.removeItem("userId");
                        this.notify("退出登录成功", "success");
                        this.$router.push("/");
                    }
                });
            }
        },
    },

}
</script>

<style lang='less' scoped>
.header {
    height: 60px;
    line-height: 60px;
    color: #fff;
    background-color: skyblue;

    .iconfont {
        font-size: 28px;
    }
}

//全屏、头像、名称和退出登录
.header-right {
    float: right;
    padding-right: 240px;
    display: flex;
    // height: 70px;
    align-items: center;

}

.btn-fullscreen {
    /*transform: rotate(45deg);*/
    margin-right: 5px;
    font-size: 26px;
}

.user-avator {
    margin-left: 20px;
}

.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.user-name {
    margin-left: 10px;
    font-size: 18px;
}

.el-dropdown-link {
    color: #ffffff;
    cursor: pointer;
}
</style>