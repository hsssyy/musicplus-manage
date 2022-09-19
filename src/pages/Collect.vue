<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
                <h2>XXX的收藏列表</h2>
                <el-button type="primary" size="mini" @click="delAll">批量删除</el-button>
                <el-input size="mini" placeholder="搜索..." class="handle-input" v-model="select_value" id="select"
                    @keyup.enter.native="searchEnter"></el-input>

                <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加</el-button>
            </div>
        </div>
        <!-- 用户收藏表 -->
        <el-table size="mini" border style="width: 100%" height="700px" :data="data"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40"></el-table-column>
            <!-- 这里仅拿到数据库里歌曲、歌单的id,需转为名字 -->
            <el-table-column prop="song_id" label="歌曲" width="180" align="center"></el-table-column>
            <el-table-column prop="song_list_id" label="歌单" width="120" align="center"></el-table-column>
            <el-table-column prop="create_time" label="收藏时间" width="120" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row.id)">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 
        layout:分页条布局
        prev:上页按钮
        pager:页码
        next：下一页按钮
        page-size: 每页显示数量
        total：总条目数
    -->
        <div class="pagination">
            <el-pagination background :current-page="currentPage" :page-size="pageSize" :total="total"
                layout="total,prev,pager,next" @current-change="handleCurrentChange"></el-pagination>
        </div>

        <el-dialog title="删除用户" :append-to-body="true" :visible.sync="delVisible" width="300px" center>
            <div>删除不可恢复，是否确定删除？</div>
            <span slot="footer">
                <el-button size="mini" type="primary" @click="delVisible = false">取消</el-button>
                <el-button size="mini" type="danger" @click="deleteRow">确定</el-button>
            </span>
        </el-dialog>


        <!-- 编辑收藏信息 -->
        <el-dialog title="编辑" :append-to-body="true" :visible.sync="showCommentDialog" width="400px" center>
            <el-form :model="collectForm" ref="collectForm" label-width="80px" action="" id="tf" :rules="rules">
                <el-form-item label="歌曲" size="mini">
                    <!-- 这里拿到的也只是数据库表里的歌曲id和歌单id -->
                    <el-input type="text" v-model="collectForm.song_id"></el-input>
                </el-form-item>
                <el-form-item label="歌单" size="mini">
                    <el-input type="text" v-model="collectForm.song_list_id"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="mini" @click="editVisible = false">取消</el-button>
                <el-button size="mini" @click="editSave">确定</el-button>
            </span>
        </el-dialog>
        <!-- 数据库表的type=0，收藏的是歌曲。=1收藏的是歌单？？？？？ -->

        <!--添加收藏-->
        <el-dialog title="添加收藏" :append-to-body="true" :visible.sync="centerDialogVisible" width="400px" center
            @close="closeDialog">
            <el-form :model="addCollectForm" ref="addCollectForm" label-width="80px" :rules="rules">
                <el-form-item label="类型" size="mini">
                    <input type="radio" name="type" value="0" v-model="addCollectForm.type" />&nbsp;歌曲&nbsp;&nbsp;
                    <input type="radio" name="type" value="1" v-model="addCollectForm.type" />&nbsp;歌单
                </el-form-item>
                <!-- 添加好像很麻烦，需要把输入的歌曲名、歌单名转为id,要验证该歌曲、歌单是否存在 -->
                <el-form-item prop="song_list_id" label="歌曲名" size="mini">
                    <el-input v-model="addCollectForm.song_id" placeholder="歌曲"></el-input>
                </el-form-item>
                <el-form-item prop="song_list_id" label="歌单名" size="mini">
                    <el-input v-model="addCollectForm.song_list_id" placeholder="歌单"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="mini" @click="centerDialogVisible=false">取消</el-button>
                <el-button type="primary" size="mini" @click="getId">确定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import {
    getCollect,
    deleteCollect,
    updateCollect,
    addCollct,
    songByName,//根据歌曲名查找id
    deleteSomeCollect,
    songListByName//根据歌单名查找id
    // selectLikeUserName//搜索
} from "../api/index";
import { mixin } from "../mixins";
export default {
    mixins: [mixin],
    data() {
        return {
            delVisible: false, //删除弹窗是否显示
            editVisible: false,//编辑弹窗是否显示
            centerDialogVisible: false,//添加新用户
            tableData: [],//数据库表数据
            //分页设置
            currentPage: 0,//当前页
            pageSize: 0,//分页的每页显示多少个
            total: 0,//总条数

            idx: -1, //当前选择删哪个用户
            ids: [],//批量删除用户

            // 搜索框的值(双向数据绑定)
            select_value: "",


            userId: "",//用户id
            userName: "",//用户名


            //编辑框的数据绑定model
            collectForm: {
                id: "",
                song_id: "",
                song_list_id: "",

            },
            //规则
            // rules: {
            //     song_id: [
            //         { required: true, message: "请输入歌曲名", trigger: "blur" },
            //     ],
            //     song_list_id: [
            //         { required: true, message: "请输入歌单名", trigger: "blur" },
            //     ],
            // },
            //添加____________________________________-----------------添加收藏好像很麻烦
            addCollectForm: {
                user_id: "",
                type: "",
                songName: "",
                songListName: "",
                create_time: "",
            },

        };
    },
    computed: {
        data() {
            return this.tableData;//查找数据库数据
        },
    },
    watch: {
        // 监听input输入框，若没东西了，就恢复默认状态
        select_value: function () {
            if (this.select_value == "") {
                this.getData();
            }
        }
    },
    //生命周期函数
    created() {
        this.userId = this.$route.query.id;//点击收藏，传来的参数，用户id
        this.userName = this.$route.query.name;//用户名
        this.getData();
    },

    methods: {
        //获取当前页
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getData();
        },
        //查询所有用户  以及分页
        getData() {
            this.tableData = [],
                getCollect(this.currentPage).then((res) => {
                    this.tableData = res.records;
                    this.pageSize = res.size;
                    this.total = res.total;
                })
        },



        //enter查询（回车搜索） 
        searchEnter() {
            // 控制一下，如果用户没输入东西就不去搜索
            if (this.select_value === "") {
                return
            } else {
                this.tableData = [];
                var username1 = this.select_value;
                selectLikeUserName(username1).then((res) => {
                    this.tableData = res.records;
                    this.pageSize = res.size;
                    this.total = res.total;
                })
            }
        },

        //删除一个用户
        deleteRow() {
            deleteCollect(this.idx)
                .then((res) => {
                    if (res) {
                        this.notify("删除成功", "sucess");
                        this.getData();
                    } else {
                        this.notify("删除失败", "error");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            this.delVisible = false;
        },
        //把多选中框赋值给ids
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
        },
        delAll() {
            deleteSomeCollect(this.ids).then((res) => {
                if (res) {
                    this.notify("删除成功", "sucess");
                    this.delVisible = false;
                    this.getData();
                } else {
                    this.notify("删除失败", "error");
                }
            })
            this.delVisible = false;
        },


        //弹出编辑页面
        handleEdit(row) {
            this.editVisible = true;
            this.collectForm = {
                song_id: row.song_id,
                song_list_id: row.song_list_id,
            };
        },
        //保存修改信息
        editSave() {
            updateCollect(this.collectForm)
                .then((res) => {
                    if (res) {
                        this.notify("修改成功", "success");
                        this.getData();
                    } else {
                        this.notify("修改失败", "error");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            this.editVisible = false;
        },


        //在收藏添加歌曲或歌单前 ，需要获取该歌曲id，（可是歌曲还拼接了歌手名，单单输入歌曲名不行,还要输入歌手名）
        getId() {
            let _this = this;
            var songName = _this.addCollectForm.songName;
            var songListName = _this.addCollectForm.songListName;
            if (this.addCollectForm.type = "0") {
                songByName(songName).then((res) => {
                    _this.addNewCollect(res.id);//调用添加歌曲的方法 发送请求
                })
            } else {
                songListByName(songListName).then((res) => {
                    _this.addNewCollect(res.id);//调用添加歌单的方法 发送请求
                })
            }
            // return alert(this.addCollectForm.type)
        },

        //添加收藏
        addNewCollect(Id) {
            let params = new URLSearchParams();
            if (this.addCollectForm.type = "0") {
                params.append("songId", Id);
                params.append("userId", this.userId);//用户id
                addCollct(params)
                    .then((res) => {
                        if (res) {
                            this.notify("添加成功", "success");
                            this.getData();
                        } else {
                            this.notify("添加失败", "error");
                        }
                    })

            } else {
                params.append("songListId", Id);
                params.append("userId", this.userId);
                addCollct(params)
                    .then((res) => {
                        if (res) {
                            this.notify("添加成功", "success");
                            this.getData();
                        } else {
                            this.notify("添加失败", "error");
                        }
                    })

            }
            this.centerDialogVisible = false
        },

        // 关闭添加的弹窗，置空表单
        closeDialog() {
            this.addCollectForm.type = ''
            this.addCollectForm.song_id = ''
            this.addCollectForm.song_list_id = ''
            this.$refs.addCollectForm.resetFields()
        },





    },
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.consumer-img {
    width: 100%;
    height: 80px;
    border-radius: 5px;
    margin-bottom: 5px;
    overflow: hidden;
}

.handle-input {
    width: 300px;
    display: inline-block;
}

.pagination {
    display: flex;
    justify-content: center;
}
</style>