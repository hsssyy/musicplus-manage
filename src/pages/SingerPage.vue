<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" size="mini" @click="delAll">批量删除</el-button>
        <el-input size="mini" placeholder="请输入歌手名" class="handle-input" v-model="select_value"
          @keyup.enter.native="searchEnter"></el-input>
        <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加歌手</el-button>
      </div>
    </div>

    <el-table size="mini" border style="width: 100%" height="700px" :data="data"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column label="歌手图片" width="110" align="center">
        <template slot-scope="scope">
          <div class="consumer-img">
            <img :src="getUrl(scope.row.pic)" style="width: 100%" />
          </div>
          <el-upload :action="uploadUrl(scope.row.id)" :on-success="handleAvatorSuccess">
            <el-button size="mini">更新图片</el-button>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="歌手" width="120" align="center"></el-table-column>
      <el-table-column label="性别" align="center" width="50">
        <template slot-scope="scope">
          {{ changeSex(scope.row.sex) }}
        </template>
      </el-table-column>
      <el-table-column label="生日" prop="birth" width="120" align="center"></el-table-column>
      <el-table-column prop="location" label="地区" width="100" align="center"></el-table-column>
      <el-table-column prop="introduction" label="简介" width="120" align="center"></el-table-column>
      <el-table-column label="歌曲管理" width="250" align="center">
        <template slot-scope="scope">
          <el-button type="success" round @click="songEdit(scope.row.id, scope.row.name)">歌曲管理</el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row.id)"></el-button>
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
    <el-dialog title="删除歌手" :append-to-body="true" :visible.sync="delVisible" width="300px" center>
      <div>删除不可恢复，是否确定删除？</div>
      <span slot="footer">
        <el-button size="mini" type="primary" @click="delVisible = false">取消</el-button>
        <el-button size="mini" type="danger" @click="deleteRow">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改歌手" :append-to-body="true" :visible.sync="editVisible" width="400px" center>
      <el-form :model="form" ref="form" label-width="80px" :rules="rules">
        <el-form-item prop="name" label="歌手" size="mini">
          <el-input v-model="form.name" placeholder="歌手"></el-input>
        </el-form-item>

        <el-form-item label="性别" size="mini">
          <input type="radio" name="sex" value="0" v-model="form.sex" />&nbsp;女&nbsp;&nbsp;
          <input type="radio" name="sex" value="1" v-model="form.sex" />&nbsp;男&nbsp;&nbsp;
          <input type="radio" name="sex" value="2" v-model="form.sex" />&nbsp;组合&nbsp;&nbsp;
          <input type="radio" name="sex" value="3" v-model="form.sex" />&nbsp;不明
        </el-form-item>

        <el-form-item label="生日" size="mini">
          <el-date-picker type="date" v-model="form.birth" placeholder="选择日期" style="width:100%"></el-date-picker>
        </el-form-item>

        <el-form-item prop="location" label="地区" size="mini">
          <el-input v-model="form.location" placeholder="地区"></el-input>
        </el-form-item>

        <el-form-item prop="introduction" label="签名" size="mini">
          <el-input v-model="form.introduction" placeholder="简介"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="editVisible = false">取消</el-button>
        <el-button size="mini" type="primary" @click="editSave">确定</el-button>
      </span>
    </el-dialog>
    <!--添加歌手弹出的对话框-->
    <el-dialog title="添加歌手" :append-to-body="true" :visible.sync="centerDialogVisible" width="400px" center
      @close="closeDialog">
      <el-form :model="registerForm" ref="registerForm" label-width="80px" :rules="rules">
        <el-form-item prop="name" label="歌手" size="mini">
          <el-input v-model="registerForm.name" placeholder="歌手"></el-input>
        </el-form-item>
        <el-form-item label="性别" size="mini">
          <input type="radio" name="sex" value="0" v-model="registerForm.sex" />&nbsp;女&nbsp;&nbsp;
          <input type="radio" name="sex" value="1" v-model="registerForm.sex" />&nbsp;男&nbsp;&nbsp;
          <input type="radio" name="sex" value="2" v-model="registerForm.sex" />&nbsp;组合&nbsp;&nbsp;
          <input type="radio" name="sex" value="3" v-model="registerForm.sex" />&nbsp;不明
        </el-form-item>

        <el-form-item prop="birth" label="生日" size="mini">
          <el-date-picker type="date" v-model="registerForm.birth" placeholder="选择日期" style="width:100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="introduction" label="简介" size="mini">
          <el-input v-model="registerForm.introduction" placeholder="简介"></el-input>
        </el-form-item>

        <el-form-item prop="location" label="地区" size="mini">
          <el-input v-model="registerForm.location" placeholder="地区"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="addNewSinger">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {
  getSinger,
  deleteSinger,
  updateSinger,
  addSinger,
  deleteSomeSinger
} from "../api/index";
import { mixin } from "../mixins";
export default {
  mixins: [mixin],
  data() {
    return {
      delVisible: false, //删除弹窗是否显示
      editVisible: false,//编辑弹窗是否显示
      centerDialogVisible: false,//添加歌手
      tableData: [],
      //分页设置
      currentPage: 0,//当前页
      pageSize: 0,//分页的每页显示多少个
      total: 0,//总条数

      idx: -1, //当前选择删哪个歌手
      ids: [],//批量删除歌手


      // 搜索框的值(双向数据绑定)
      select_value: "",

      //编辑框的数据绑定model
      form: {
        id: "",
        name: "",
        sex: "",
        birth: "",
        location: "",
        introduction: "",

      },
      //规则
      rules: {
        name: [
          { required: true, message: "请输入歌手名", trigger: "blur" },
        ],
        introduction: [
          { required: true, message: "请输入简介", trigger: "blur" },
        ],
        location: [{ required: true, message: "请输入地区", trigger: "blur" }],
      },
      //添加歌手的model数据
      registerForm: {
        name: "",
        sex: "",
        birth: "",
        introduction: "",
        location: "",
        pic: "/img/singerPic/singer.jpg"  //默认图片
      },
      //更新图片
      uploadUrl(id) {
        return `http://127.0.0.1:8888/singer/updateSingerPic?id=${id}`;
      },
    };
  },
  computed: {
    data() {
      return this.tableData;
    },
  },
  watch: {
    // 监听input输入框，若没东西了，就回复默认状态
    select_value: function () {
      if (this.select_value == "") {
        // 发请求回到初始列表数据状态
        // console.log("搜索框没东西了，回复初始状态");
        this.getData();
      }
    }
  },
  created() {
    this.getData();
  },
  methods: {
    //获取当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    //查询所有歌手  以及分页
    getData() {
      this.tableData = [],
        getSinger(this.currentPage).then((res) => {
          this.tableData = res.records;
          this.pageSize = res.size;
          this.total = res.total;
        })
    },


    //模糊查询
    searchEnter() {
      // 控制一下，如果用户没输入东西就不去搜索
      if (this.select_value === "") {
        return
      } else {
        // 把input带着，发请求获取有关联的数据并呈现在页面中
        // console.log("带着关键字交给后端搜索", this.select_value);
        this.tableData = [];
        // var username = $("select").val;
        // var username1 = new InputEvent(document.getElementById("select"));//不知道咋获取输入框的值  小bug
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
      deleteSinger(this.idx)
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

      deleteSomeSinger(this.ids).then((res) => {
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
      this.form = {
        id: row.id,
        name: row.name,
        sex: row.sex,
        birth: row.birth,
        location: row.location,
        introduction: row.introduction,
      };
    },
    //保存修改歌手信息
    editSave() {
      let d = this.form.birth;
      if (d.length != 19) {
        let datetime = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " 00:00:00";
        this.form.birth = datetime;
      }

      updateSinger(this.form)
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
    //添加一个歌手
    addNewSinger() {
      let d = this.registerForm.birth;
      let datetime = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " 00:00:00";
      this.registerForm.birth = datetime;
      addSinger(this.registerForm)
        .then((res) => {
          if (res) {
            this.notify("添加成功", "success");
            this.getData();
          } else {
            this.notify("添加失败", "error");
          }
        })
      this.centerDialogVisible = false;
    },
    //转向歌曲管理
    songEdit(id, name) {
      this.$router.push({ path: `/Song`, query: { id, name } });
    },

    // 关闭添加歌手的弹窗，置空表单
    closeDialog() {
      this.registerForm.name = ''
      this.registerForm.sex = ''
      this.registerForm.birth = ''
      this.registerForm.introduction = ''
      this.registerForm.location = ''
      this.$refs.registerForm.resetFields()
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