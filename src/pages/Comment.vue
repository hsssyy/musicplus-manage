<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" size="mini" @click="delAll">批量删除</el-button>
                <el-input size="mini" placeholder="筛选相关用户" class="handle-input" v-model="select_value" id="select"
                    @keyup.enter.native="searchEnter"></el-input>
            </div>
        </div>

        <el-table size="mini" border style="width: 100%" height="700px" :data="data"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40"></el-table-column>
            <!-- 这里的用户需要由id转为用户名 -->
            <el-table-column prop="id" label="用户" width="180" align="center"></el-table-column>
            <el-table-column prop="content" label="评论内容" align="center"> </el-table-column>
            <el-table-column prop="create_time" label="评论时间" align="center"> </el-table-column>
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

        <el-dialog title="编辑评论" :append-to-body="true" :visible.sync="showCommentDialog" width="400px" center>
            <el-form :model="commentForm" ref="commentForm" label-width="80px" action="" id="tf" :rules="rules">
                <el-form-item  label="评论内容" size="mini">
                    <el-input type="textarea" v-model="commentForm.content"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="mini" @click="showCommentDialog = false">取消</el-button>
                <el-button size="mini" @click="updataCom">确定</el-button>
            </span>
        </el-dialog>


        <el-dialog title="删除用户" :append-to-body="true" :visible.sync="delVisible" width="300px" center>
            <div>删除不可恢复，是否确定删除？</div>
            <span slot="footer">
                <el-button type="primary" size="mini" @click="delVisible = false">取消</el-button>
                <el-button type="danger" size="mini" @click="deleteRow">确定</el-button>
            </span>
        </el-dialog>

    </div>
</template>


<script>
import {
    getComment,//获取评论
    updateComment, //更新（编辑后）
    deleteComment,//删除单个
    deleteSomeComment//删除所有
} from "../api/index";
import { mixin } from "../mixins";
export default {
    mixins: [mixin],
    data() {
        return {
            //分页设置
            currentPage: 0,//当前页
            pageSize: 0,//分页的每页显示多少个
            total: 0,//总条数

            delVisible: false, //删除弹窗是否显示
            showCommentDialog: false,//编辑弹窗是否显示

            idx: -1, //当前选择删哪个用户
            ids: [],//批量删除用户

            tableData: [],//VIP数据库表数据

            //编辑框的数据绑定model
            commentForm: {
                id: "",
                content: "",//评论内容
            },

        };
    },

    computed: {
        data() {
            return this.tableData;
        },
    },

    created() {
        this.getData();
    },

    methods: {
        // 获取当前页
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getData();
        },
        //查询所有用户评论 
        getData() {
            this.tableData = [],
                getComment().then((res) => {
                    this.tableData = res.records;
                    this.pageSize = res.size;
                    this.total = res.total;
                })
        },

        //弹出编辑页面
        handleEdit(row) {
            this.showCommentDialog = true;
            this.commentForm = {
                id: row.id,
                content: row.content,
            }
        },
        //保存修改的信息
        updataCom() {
            updateComment(this.commentForm)
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
            this.showCommentDialog = false;
        },

        //删除一个评论
        deleteRow() {
            deleteComment(this.idx)
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
            deleteSomeComment(this.ids).then((res) => {
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



    },
}

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



/* 修改文本域样式 */

.el-textarea textarea {
    padding-bottom: 13px;
}

.el-textarea .el-input__count {
    height: 12px;
    line-height: 12px;
}
</style>