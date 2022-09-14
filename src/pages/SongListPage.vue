<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" size="mini" @click="delAll">批量删除
        </el-button>
        <el-input size="mini" placeholder="筛选关键词" class="handle-input" v-model="select_value"
          @keyup.enter.native="searchEnter"></el-input>
        <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加歌单 </el-button>
      </div>
    </div>

    <el-table size="mini" border style="width: 100%" height="600px" :data="data"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column label="歌单图片" width="110" align="center">
        <template slot-scope="scope">
          <div class="songlist-img">
            <img :src="getUrl(scope.row.pic)" style="width: 100%" />
          </div>
          <el-upload :action="uploadUrl(scope.row.id)" :on-success="handleAvatorSuccess">
            <el-button size="mini">更新图片</el-button>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="120" align="center"></el-table-column>

      <el-table-column label="简介">
        <template slot-scope="scope">
          <p style="height: 100px; overflow: scroll">
            {{ scope.row.introduction }}
          </p>
        </template>
      </el-table-column>

      <el-table-column prop="style" label="风格" width="120" align="center"></el-table-column>

      <el-table-column label="歌曲管理" width="250" align="center">
        <template slot-scope="scope">
          <el-button type="success" round  @click="songEdit(scope.row.id)">歌曲管理</el-button>
        </template>
      </el-table-column>

      <el-table-column label="评论" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="info" icon="el-icon-chat-dot-round" circle  @click="getComment(data[scope.$index].id)"></el-button>
        </template>

      </el-table-column>

      <el-table-column label="操作"  align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)"></el-button>
          <el-button  type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row.id)"></el-button>
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

    <el-dialog title="添加歌单"  :append-to-body="true"  :visible.sync="centerDialogVisible" width="400px" center>
      <el-form :model="registerForm" ref="registerForm" label-width="80px">
        <el-form-item prop="title" label="标题" size="mini">
          <el-input v-model="registerForm.title" placeholder="标题"></el-input>
        </el-form-item>

        <el-form-item prop="introduction" label="简介" size="mini">
          <el-input v-model="registerForm.introduction" placeholder="简介" type="textarea"></el-input>
        </el-form-item>
        <el-form-item prop="style" label="风格" size="mini">
          <el-input v-model="registerForm.style" placeholder="风格"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
        <el-button size="mini" @click="addSongList">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改歌单"  :append-to-body="true"  :visible.sync="editVisible" width="400px" center>
      <el-form :model="form" ref="form" label-width="80px">
        <el-form-item prop="title" label="标题" size="mini">
          <el-input v-model="form.title" placeholder="标题"></el-input>
        </el-form-item>

        <el-form-item prop="introduction" label="简介" size="mini">
          <el-input v-model="form.introduction" placeholder="简介" type="textarea"></el-input>
        </el-form-item>
        <el-form-item prop="style" label="风格" size="mini">
          <el-input v-model="form.style" placeholder="风格"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="editVisible = false">取消</el-button>
        <el-button size="mini" @click="editSave">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="删除歌单"  :append-to-body="true"  :visible.sync="delVisible" width="300px" center>
      <div>删除不可恢复，是否确定删除？</div>
      <span slot="footer">
        <el-button size="mini" @click="delVisible = false">取消</el-button>
        <el-button size="mini" @click="deleteRow">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSongList,
  deleteSongList,
  deleteSongLists,
  updateSongList,
  insertSongList,
} from "../api/index";
import { mixin } from "../mixins";
export default {
  mixins: [mixin],
  data() {
    return {
      centerDialogVisible: false, //添加弹窗是否显示
      editVisible: false, //编辑弹窗是否显示
      delVisible: false, //删除弹窗是否显示
      
      // 搜索框的值(双向数据绑定)
      select_value: "",

      registerForm: {
        //添加框
        title: "",
        introduction: "",
        style: "",
        pic: "/img/songListPic/songListPic.jpg"  //默认图片
      },
      form: {
        //编辑框
        id: "",
        title: "",
        introduction: "",
        style: "",
      },
      tableData: [],
      //分页设置
      currentPage: 0,//当前页
      pageSize: 0,//分页的每页显示多少个
      total: 0,//总条数

      idx: -1, //当前选择项

    };
  },
  computed: {
    //计算当前搜索结果表里的数据
    data() {
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
  //         if (item.title.includes(this.select_word)) {
  //           this.tableData.push(item);
  //         }
  //       }
  //     }
  //   },
  // },
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
    //查询所有歌单
    getData() {
      this.tableData = [],
        getSongList(this.currentPage).then((res) => {
          this.tableData = res.records;
          this.pageSize = res.size;
          this.total = res.total;
        })
    },
//模糊查询（根据文本框的值去查询）
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
    //添加歌单
    addSongList() {
      insertSongList(this.registerForm)
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
    //弹出编辑页面
    handleEdit(row) {
      this.editVisible = true;
      this.form = {
        id: row.id,
        title: row.title,
        introduction: row.introduction,
        style: row.style,
      };
    },
    //保存更改后页面
    editSave() {
      updateSongList(this.form)
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
      return `http://127.0.0.1:8888/songList/updateSongListPic?id=${id}`;
    },
    //删除一个歌单
    deleteRow() {
      deleteSongList(this.idx)
        .then((res) => {
          if (res) {
            this.notify("删除成功", "success");
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
      this.delVisible = true;
      deleteSongLists(this.ids).then((res) => {
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
    //转向歌曲管理
    songEdit(id, name) {
      this.$router.push({ path: `/ListSong`, query: { id } });
    },
    //转向该歌单的评论列表
    getComment(id) {
      this.$router.push({ path: `/comment`, query: { id } });
    }
  },
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.songlist-img {
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