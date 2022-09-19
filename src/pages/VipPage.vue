<template>
    <div class="bar">
        <el-row :gutter="20" class="mgb20">
            <el-col :span="5">
                <el-card>
                    <div class="grid-content">
                        <div class="grid-cont-center">
                            <div class="grid-num">{{ typeCount }}</div>
                            <div>VIP套餐总数</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <div class="grid-content">
                        <div class="grid-cont-center">
                            <div class="grid-num">{{ VIPCount }}</div>
                            <div>VIP总数</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <div class="grid-content">
                        <div class="grid-cont-center">
                            <div class="grid-num">{{ xxCount }}</div>
                            <div>？数量</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <div class="grid-content">
                        <div class="grid-cont-center">
                            <div class="grid-num">{{ totalCost }}</div>
                            <div>消费总额</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>


        <!-- <div class="handle-box">
            <el-input placeholder="筛选相关套餐" class="handle-input" v-model="select_value" id="select"
                @keyup.enter.native="searchEnter"></el-input>
            <el-button class="btn" type="primary" @click="addRole">添加新套餐</el-button>
        </div> -->
        <el-table :data="data" style="width: 100%" height="600px">
            <el-table-column prop="id" label="编号" width="180" align="center"> </el-table-column>
            <el-table-column prop="viptype" label="套餐类型" width="180" align="center"></el-table-column>
            <el-table-column prop="price" label="价格" align="center"> </el-table-column>
            <el-table-column prop="viptime" label="时长" align="center"> </el-table-column>
            <el-table-column prop="adminId" label="管理员工号" align="center"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" align="center"> </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 添加套餐类型 -->
        <!-- 添加用户弹出的对话框  id设置自增，套餐名要不要设置套餐+自增字段？？ -->
        <el-dialog :title="编辑套餐信息" :append-to-body="true" :visible.sync="editDialog" width="50%"
            @close="closeAddRoleDialog">
            <el-form :model="typeInfo" status-icon :rules="Rules" ref="typeInfo" label-width="100px"
                class="demo-ruleForm">
                <el-form-item label="套餐名称" prop="viptype">
                    <el-input type="text" v-model.trim="typeInfo.viptype" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="套餐价格" prop="price">
                    <el-input type="text" v-model.trim="typeInfo.price" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="套餐时长" prop="viptime">
                    <el-input type="text" v-model.trim="typeInfo.viptime" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="操作管理员" prop="admin">
                    <!-- 获取当前登录的管理员的账号名 -->
                    <el-input type="text" v-model.trim=typeInfo.adminId autocomplete="off" :disabled="true">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialog=flase">取消</el-button>
                <el-button type="primary" @click="addNewVip">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import { getVipTypeList, updateVip } from "../api/index";
import { mixin } from "../mixins";
export default {
    mixins: [mixin],
    data() {
        return {

            // 这里未完成----------------------------------------
            typeCount: 0, //套餐总数
            VIPCount: 0, //VIP总数
            xxCount: 0, //？？数量
            totalCost: 0, //消费总额
            // 这里未完成----------------------------------------------

            delVisible: false, //删除弹窗是否显示
            editVisible: false,//编辑弹窗是否显示
            centerDialogVisible: false,//添加新用户
            tableData: [],//VIP数据库表数据


            // 搜索框的值(双向数据绑定)
            // select_value: "",

            showAddRoleDialog: false,//对话框默认不显示
            editDialog: false,//对话框默认不显示

            // 用于存储编辑套餐对话框中的数据
            typeInfo: {
                id: '',
                name: '',
                price: '',
                viptime: '',
                viptype: '',
                adminId: '',
                updateTime: '',//更新时间
            },
        };
    },
    computed: {//存在缓存，不经常变化的在此操作
        //获取用户名
        userName() {
            return localStorage.getItem("userName");
        },
        userId() {
            return localStorage.getItem("userId");

        },
        //查找数据库表数据
        data() {
            return this.tableData;
        },
    },
    created() {
        this.getData();
    },

    methods: {
        getData() {
            this.tableData = [],
                getVipTypeList().then((res) => {
                    this.tableData = res;
                })
        },
        //弹出编辑页面
        handleEdit(row) {
            this.editDialog = true;
            this.typeInfo = {
                id: row.id,
                viptype: row.viptype,
                price: row.price,
                viptime: row.viptime,
                adminId: this.userName
            }
        },
        //保存修改的信息
        addNewVip() {
            this.typeInfo.adminId = this.userId;
            this.typeInfo.updateTime = new Date();
            updateVip(this.typeInfo)
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
            this.editDialog = false;
        },

    },
}

</script>


<style scoped>
/* .handle-box {
    margin-top: 30px;
    margin-bottom: 30px;
} */

/* 
.handle-input {
    margin-left: 30px;
    width: 300px;
    display: inline-block;
}

.pagination {
    display: flex;
    justify-content: center;
}

.btn {
    margin-left: 8px;
} */

/**数量 */
.grid-content {
    display: flex;
    align-items: center;
    height: 50px;
}

.grid-cont-center {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: rgb(47, 187, 157);
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}
</style>