<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" size="mini" @click="delAll">批量删除</el-button>
        <el-input  size="mini" placeholder="筛选相关用户" class="handle-input" @blur="selectUserName" id="select"></el-input>
        <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加新用户</el-button>
      </div>
    </div>

    <el-table size="mini" border style="width: 100%" height="600px" :data="data" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column label="用户歌手图片" width="110" align="center">
            <template slot-scope="scope">
                <div class="consumer-img">
                    <img :src="getUrl(scope.row.avator)" style="width: 100%" />
                </div>
                <el-upload 
                  :action="uploadUrl(scope.row.id)"
                  :on-success="handleAvatorSuccess"
                >
                <el-button size="mini">更新图片</el-button>
              </el-upload>
            </template>
        </el-table-column>
        <el-table-column prop="username"  label="用户名" width="120" align="center"></el-table-column>
        <el-table-column  label="性别" align="center" width="50">
            <template slot-scope="scope">
                {{ changeSex(scope.row.sex) }}
            </template>
        </el-table-column>
        <el-table-column prop="phoneNum" label="电子邮箱" width="180" align="center"></el-table-column>
        <el-table-column label="生日" prop="birth" width="120" align="center"></el-table-column>
        <el-table-column prop="introduction" label="签名" width="120"  align="center"></el-table-column>
        <el-table-column prop="location" label="地区" width="100"  align="center"></el-table-column>
        <el-table-column label="收藏" width="80" align="center"></el-table-column>
        <el-table-column label="操作" width="150" align="center">
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
      <el-pagination
        background
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total,prev,pager,next"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <el-dialog title="删除用户" :visible.sync="delVisible" width="300px" center>
      <div>删除不可恢复，是否确定删除？</div>
      <span slot="footer">
        <el-button size="mini" @click="delVisible = false">取消</el-button>
        <el-button size="mini" @click="deleteRow">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改用户" :visible.sync="editVisible" width="400px" center>
        <el-form :model="form" ref="form" label-width="80px" :rules="rules">
            <el-form-item prop="username" label="用户名" size="mini">
                <el-input v-model="form.username" placeholder="用户名"></el-input>
            </el-form-item>

            <el-form-item  label="性别" size="mini">
                <input type="radio" name="sex" value="0" v-model="form.sex"/>&nbsp;女&nbsp;&nbsp;
                <input type="radio" name="sex" value="1" v-model="form.sex" />&nbsp;男
            </el-form-item>

            <el-form-item prop="phone_num" label="手机号" size="mini">
                <el-input v-model="form.phoneNum" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item prop="email" label="电子邮箱" size="mini">
                <el-input v-model="form.email" placeholder="电子邮箱"></el-input>
            </el-form-item>

            <el-form-item label="生日" size="mini">
                <el-date-picker type="date" v-model="form.birth" placeholder="选择日期" style="width:100%"></el-date-picker>
            </el-form-item>

            <el-form-item prop="introduction" label="签名" size="mini">
              <el-input v-model="form.introduction" placeholder="签名"></el-input>
            </el-form-item>

            <el-form-item prop="location" label="地区" size="mini">
              <el-input v-model="form.location" placeholder="地区"></el-input>
            </el-form-item>
        </el-form>
      <span slot="footer">
        <el-button size="mini" @click="editVisible = false">取消</el-button>
        <el-button size="mini" @click="editSave">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog  title="添加新用户" :visible.sync="centerDialogVisible" width="400px" center>
      <el-form :model="registerForm"  ref="registerForm" label-width="80px" :rules="rules">
        <el-form-item prop="username" label="用户名" size="mini">
          <el-input v-model="registerForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" size="mini">
          <el-input v-model="registerForm.password" placeholder="密码"></el-input>
        </el-form-item>

        <el-form-item label="性别" size="mini">
          <input type="radio" name="sex" value="0" v-model="registerForm.sex"/>&nbsp;女&nbsp;&nbsp;
          <input type="radio" name="sex" value="1" v-model="registerForm.sex"/>&nbsp;男
        </el-form-item>
        <el-form-item prop="phoneNum" label="手机号" size="mini">
          <el-input v-model="registerForm.phoneNum" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="电子邮箱" size="mini">
          <el-input v-model="registerForm.email" placeholder="电子邮箱"></el-input>
        </el-form-item>

        <el-form-item prop="birth" label="生日" size="mini">
          <el-date-picker type="date" v-model="registerForm.birth" placeholder="选择日期" style="width:100%"></el-date-picker>
        </el-form-item>
        <el-form-item prop="introduction" label="签名" size="mini">
          <el-input v-model="registerForm.introduction" placeholder="签名"></el-input>
        </el-form-item>
        <el-form-item prop="location" label="地区" size="mini">
          <el-input v-model="registerForm.location" placeholder="地区"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
        <el-button size="mini" @click="addNewConsumer">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {
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
      centerDialogVisible: false,//添加新用户
      tableData: [],
      //分页设置
      currentPage: 0,//当前页
      pageSize: 0,//分页的每页显示多少个
      total: 0,//总条数

      idx: -1, //当前选择删哪个用户
      ids:[],//批量删除用户

      //编辑框的数据绑定model
      form: {
        id: "",
        username: "",
        password: "",
        sex: "",
        phoneNum: "",
        email: "",
        birth: "",
        introduction: "",
        location: "",
      },
      //规则
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        phoneNum: [
          { required: true, message: "请输入手机号", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入电子邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        introduction: [
          { required: true, message: "请输入签名", trigger: "blur" },
        ],
        location: [{ required: true, message: "请输入地区", trigger: "blur" }],
      },
      //添加用户的model数据
      registerForm: {
        username: "",
        password: "",
        sex: "1",
        phoneNum: "",
        email: "",
        birth: "",
        introduction: "",
        location: "",
        avator: "/avatorImages/user.jpg"  //默认图片
      },
      
    };
  },
  computed: {
    data(){
      return this.tableData;
    },
  },
  // watch: {
  //   //搜素框里面的内容发生变化的时候，搜素结果table列表的内容跟着它的内容发生变化
  //   select_word: function () {
  //     if (this.select_word == "") {
  //       this.tableData = this.tempData;
  //     } else {
  //       this.tableData = [];
  //       for (let item of this.tempData) {
  //         if (item.username.includes(this.select_word)) {
  //           this.tableData.push(item);
  //         }
  //       }
  //     }
  //   },
  // },
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
      getConsumer(this.currentPage).then((res) => {
        this.tableData = res.records;
        this.pageSize = res.size;
        this.total = res.total;
      })
    },
    //模糊查询用户名 以及分页
    selectUserName(){
      this.tableData = [];
      // var username = $("select").val;
      var username1 = new InputEvent(document.getElementById("select"));//不知道咋获取输入框的值  小bug
      selectLikeUserName(username1).then((res)=>{
        this.tableData = res.records;
        this.pageSize = res.size;
        this.total = res.total;
      })
    },
    
    //删除一个用户
    deleteRow(){
      deleteConsumer(this.idx)
      .then((res)=>{
        if(res){
          this.notify("删除成功","sucess");
          this.getData();
        }else{
          this.notify("删除失败","error");
        }
      })
      .catch((err) => {
          console.log(err);
        });
      this.delVisible = false;
    },
    //把多选中框赋值给ids
    handleSelectionChange(selection){
      this.ids = selection.map(item => item.id)
    },
    delAll(){
      
      deleteSomeConsumer(this.ids).then((res)=>{
        if(res){
          this.notify("删除成功","sucess");
          this.delVisible = false;
          this.getData();
        }else{
          this.notify("删除失败","error");
        }
      })
      this.delVisible = false;
    },
    //弹出编辑页面
    handleEdit(row) {
        this.editVisible = true;
        this.form = {
          id: row.id,
          username: row.username,
          password: row.password,
          sex: row.sex,
          phoneNum: row.phone_num,
          email: row.email,
          birth: row.birth,
          introduction: row.introduction,
          location: row.location,
        };
    }, 
    //保存修改用户信息
    editSave(){
      updateConsumer(this.form)
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
    //更新图片
    uploadUrl(id) {
        return `http://127.0.0.1:8888/consumer/updateConsumerPic?id=${id}`;
      },
    //添加一个用户
    addNewConsumer(){
      addConsumer(this.registerForm)
      .then((res) => {
        if(res){
          this.notify("添加成功","success");
          this.getData();
        }else{
          this.notify("添加失败","error");
        }
      })
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