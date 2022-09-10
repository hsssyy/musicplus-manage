<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" size="mini" @click="delAll">批量删除</el-button>
                <el-input size="mini" placeholder="筛选相关用户" class="handle-input" v-model="select_value" id="select"
                    @keyup.enter.native="searchEnter"></el-input>

                <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加新用户</el-button>
            </div>
        </div>

        <el-table size="mini" border style="width: 100%" height="600px" :data="data"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column label="用户图片" width="110" align="center">
                <template slot-scope="scope">
                    <div class="consumer-img">
                        <img :src="getUrl(scope.row.avator)" style="width: 100%" />
                    </div>
                    <el-upload :action="uploadUrl(scope.row.id)" :on-success="handleAvatorSuccess">
                        <el-button size="mini">更新图片</el-button>
                    </el-upload>
                </template>
            </el-table-column>
            <el-table-column prop="username" label="用户名" width="120" align="center"></el-table-column>
            <el-table-column label="性别" align="center" width="50">
                <template slot-scope="scope">
                    {{ changeSex(scope.row.sex) }}
                </template>
            </el-table-column>
            <el-table-column prop="email" label="电子邮箱" width="180" align="center"></el-table-column>
            <el-table-column label="生日" prop="birth" width="120" align="center"></el-table-column>
            <el-table-column prop="introduction" label="签名" width="120" align="center"></el-table-column>
            <el-table-column prop="location" label="地区" width="100" align="center"></el-table-column>
            <el-table-column label="收藏" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" @click="songEdit(scope.row.id, scope.row.name)">收藏</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
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

    </div>

</template>
<script>
import {
    getSinger,
    getConsumer,
    deleteConsumer,
    updateConsumer,
    addConsumer,
    deleteSomeConsumer,
    selectLikeUserName
} from "../api/index";
import { mixin } from "../mixins";
export default {
    mixins: [mixin],
    data() {
        return {
            delVisible: false, //删除弹窗是否显示
            editVisible: false,//编辑弹窗是否显示
            centerDialogVisible: false,//添加歌手
            tableData: [],//存放显示的数据
            //分页设置
            currentPage: 0,//当前页
            pageSize: 0,//分页的每页显示多少个
            total: 0,//总条数

            idx: -1, //当前选择删哪个用户
            ids: [],//批量删除用户

            // 搜索框的值(双向数据绑定)
            select_value: "",


            //更新图片
            uploadUrl(id) {
                return `http://127.0.0.1:8888/consumer/updateConsumerPic?id=${id}`;
            },
        };
    },
    computed: {
        data() {
            return this.tableData;
        },
    },

    //生命周期函数
    created() {
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
            getSinger(this.currentPage).then((res) => {
                    this.tableData = res.records;
                    this.pageSize = res.size;
                    this.total = res.total;
                })
        },
    },
};
</script>