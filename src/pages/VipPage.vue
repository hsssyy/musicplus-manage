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


        <el-table :data="data" style="width: 100%" height="600px"  >
            <!-- :row-class-name="tableRowClassName" -->
            <el-table-column prop="id" label="编号" width="180" align="center"> </el-table-column>
            <el-table-column prop="viptype" label="套餐类型" width="180" align="center"></el-table-column>
            <el-table-column prop="price" label="价格" align="center"> </el-table-column>
            <el-table-column prop="viptime" label="时长" align="center"> </el-table-column>
            <el-table-column prop="adminId" label="管理员工号" align="center"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" align="center"> </el-table-column>
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
        <!-- 原来表格是自适应页面大小的，加了分页就不自适应了-->
        <!-- <div class="pagination">
            <el-pagination background :current-page="currentPage" :page-size="pageSize" :total="total"
                layout="total,prev,pager,next" @current-change="handleCurrentChange"></el-pagination>
        </div> -->
        <!-- 添加套餐类型 -->
        <!-- 添加用户弹出的对话框  id设置自增，套餐名要不要设置套餐+自增字段？？ -->
        <el-dialog :title="编辑套餐信息" :append-to-body="true" :visible.sync="showAddRoleDialog" width="50%"
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
                    <el-input type="text" v-model.trim=userName autocomplete="off" :disabled="true"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetAddRoleForm">取消</el-button>
                <el-button type="primary" @click="addNewVip">确 定</el-button>
            </span>
        </el-dialog>


        <!--编辑按钮对话框  需要记录管理员身份-->
        <!-- <el-dialog title="添加新套餐" :append-to-body="true" :visible.sync="centerDialogVisible" width="400px" center>
            <el-form :model="registerForm" ref="registerForm" label-width="80px" :rules="rules">
                <el-form-item prop="username" label="套餐名" size="mini">
                    <el-input v-model="registerForm.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="价格" size="mini">
                    <el-input v-model="registerForm.password" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item prop="phoneNum" label="时长" size="mini">
                    <el-input v-model="registerForm.phoneNum" placeholder="手机号"></el-input>
                </el-form-item> -->
        <!-- 这一部分应改为管理员身份自动获取，输入框改为不可修改（双向数据绑定） -->
        <!-- <el-form-item prop="phoneNum" label="管理员" size="mini">
                    <el-input v-model="admin" placeholder="手机号" :disable="true"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer">
                <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="addNewConsumer">确定</el-button>
            </span>
        </el-dialog> -->


        <!-- 删除按钮对话框 -->

        <!-- <el-dialog title="删除用户" :append-to-body="true" :visible.sync="delVisible" width="300px" center>
            <div>删除不可恢复，是否确定删除？</div>
            <span slot="footer">
                <el-button type="primary" size="mini" @click="delVisible = false">取消</el-button>
                <el-button type="danger" size="mini" @click="deleteRow">确定</el-button>
            </span>
        </el-dialog> -->

    </div>
</template>

<script>
import { success } from "log-symbols";
import { getVipTypeList, addVip, deleteVip, updateVip ,getNameById} from "../api/index";
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

            // //分页设置
            // currentPage: 0,//当前页
            // pageSize: 0,//分页的每页显示多少个
            // total: 0,//总条数

            delVisible: false, //删除弹窗是否显示
            editVisible: false,//编辑弹窗是否显示
            centerDialogVisible: false,//添加新用户
            tableData: [],//VIP数据库表数据



            // 搜索框的值(双向数据绑定)
            // select_value: "",

            showAddRoleDialog: false,//对话框默认不显示


            // 用于存储编辑套餐对话框中的数据
            typeInfo: {
                id: '',
                name: '',
                price: '',
                viptime: '',
                viptype:'',
                updateTime:'',//更新时间
            },
            // 应用验证规则
            Rules: {
                name: [
                    { required: true, message: '请输入套餐名称', trigger: 'blur' },
                ],
                price: [
                    { required: true, message: '请输入套餐价格', trigger: 'blur' },
                ],
                duration: [
                    { required: true, message: '请输入套餐时长', trigger: 'blur' },
                ],
            },
            // 使用了一个Dialog既做添加也做修改，通过判断addORedit来确定标题(0起始，1添加，2编辑)
            // addORedit: 0,

        };
    },


    computed: {//存在缓存，不经常变化的在此操作
        //获取用户名
        userName() {
            return localStorage.getItem("userName");//拿到管理员账号名
            // return localStorage.getItem("id");//拿不到id,存储在本地的是输入的用户名，若是在数据库查找，可以拿到管理员id

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
        //获取当前页
        // handleCurrentChange(val) {
        //     this.currentPage = val;
        //     this.getData();
        // },
        //查询所有用户  以及分页
        getData() {
            this.tableData = [],
                getVipTypeList().then((res) => {
                    this.tableData = res;
                    // this.pageSize = res.size;
                    // this.total = res.total;
                })
        },
        
        //弹出编辑页面
        handleEdit(row) {
            this.showAddRoleDialog = true;
            this.typeInfo = {
                id: row.id,
                viptype: row.viptype,
                price: row.price,
                viptime: row.viptime,
                admin: this.userName//更新时间直接在后台获取，然后加入数据库再展示出来

            }
        },
        //保存修改的信息
        addNewVip() {
            this.typeInfo.updateTime = new Date(); 
            updateVip(this.typeInfo)
                .then((res) => {
                    if (res) {
                        this.notify("修改成功", "success");
                        this.getVipTypeList();
                    } else {
                        this.notify("修改失败", "error");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            this.showAddRoleDialog = false;
        },

        //删除一个
        handleDelete(id){
            deleteVip(id).then(res =>{
                if(res.code==1){
                    this.$notify("删除成功",success)
                    this.getVipTypeList();
                }else{
                    this.$notify("删除失败",success)
                }
                
            })
        }
        // 获取所有角色数据
        // async getVipTypeList() {
        //     const { data: res } = await this.$http.get('roles')
        //     if (res.meta.status !== 200)
        //         return this.$message.error('获取角色列表数据失败！')
        //     this.rolesList = res.data
        // },

        // 关闭添加角色的弹窗，置空表单
        // closeAddRoleDialog() {
        //     this.typeInfo.name = ''
        //     this.typeInfo.price = ''
        //     this.typeInfo.duration = ''
        //     this.$refs.addRoleForm.resetFields()
        // },

        // 点击取消，置空表单数据
        // resetAddRoleForm() {
        //     this.showAddRoleDialog = false
        //     this.closeAddRoleDialog()

        // },

        // 添加Vip套餐
        // addRole() {
        //     this.addORedit = 1
        //     this.showAddRoleDialog = true
        // },

        //添加一个Vip套餐
        // addNewVip() {
        //     if (this.addORedit == 1) {
        //         addVip(this.registerForm)
        //             .then((res) => {
        //                 if (res) {
        //                     this.notify("添加成功", "success");
        //                     this.getVipTypeList();
        //                 } else {
        //                     this.notify("添加失败", "error");
        //                 }
        //             })
        //         this.centerDialogVisible = false;
        //     }
        //     if (this.addORedit == 2) {
        //         this.handleEdit
        //         this.editSave
        //     }
        // },


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