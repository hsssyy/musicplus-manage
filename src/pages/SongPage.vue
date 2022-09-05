<template>
  <div class="table">
    <div class="crumbs">
      <i class="el-icon-tickets"></i>
      歌曲信息
    </div>
    <div class="container">
        <div class="handle-box">
            <el-button type="primary" size="mini" @click="delAll">批量删除</el-button>
            <el-input  size="mini" placeholder="请输入歌曲名" class="handle-input"></el-input>
            <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加歌曲</el-button>
        </div>
    </div>
   
    <el-dialog title="添加歌曲" :visible.sync="centerDialogVisible" width="400px" center>
      <el-form :model="registerForm" ref="registerForm" label-width="80px" action="" id="tf" :rules="rules">
        <div>
          <label>歌名</label>
          <el-input type="text" v-model="registerForm.name"></el-input>
        </div> 
        <div>
          <label>专辑</label>
          <el-input type="text" v-model="registerForm.introduction"></el-input>
        </div>
        <div>
          <label>歌词</label>
          <el-input type="textarea" v-model="registerForm.lyric"></el-input>
        </div>
        <!-- <div> -->
           <!-- <label>歌曲上传</label> -->
          <!-- <input type="file" name="url" /> -->
          <!-- <el-upload type="file" v-model="registerForm.file">歌曲上传</el-upload> -->
          <!-- <el-upload type="file" v-model="registerForm.file">
                <el-button size="mini">歌曲上传</el-button>
          </el-upload> -->
        <!-- </div> -->
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
        <el-button size="mini" @click="addSong">确定</el-button>
      </span>
    </el-dialog>

    <el-table size="mini" border style="width: 100%" height="600px" :data="data" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column label="歌曲图片" width="110" align="center">
        <template slot-scope="scope">
          <div class="consumer-img">
              <img :src="getUrl(scope.row.pic)" style="width: 100%" />
          </div>
      </template>
      </el-table-column>
      <el-table-column prop="name" label="歌手-歌名" width="120" align="center"></el-table-column>

      <el-table-column prop="introduction" label="专辑" width="150" align="center"></el-table-column>

      <el-table-column label="歌词" align="center">
        <template slot-scope="scope">
          <ul style="height: 100px; overflow: scroll">
            <li
              v-for="(item, index) in parseLyric(scope.row.lyric)"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
        </template>
      </el-table-column>

      <el-table-column label="资源更新" align="center">
        <template slot-scope="scope">
          <el-upload
            :action="uploadUrl(scope.row.id)"
            :on-success="handleAvatorSuccess"
          >
            <el-button size="mini">更新图片</el-button>
          </el-upload>
          <br />
          <el-upload :action="uploadSongUrl(scope.row.id)" :on-success="handleSongSuccess">
            <el-button size="mini">更新歌曲</el-button>
          </el-upload>
        </template>
      </el-table-column>

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
        <el-pagination background :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="total,prev,pager,next"
          @current-change="handleCurrentChange"
        ></el-pagination>
     </div>

     <el-dialog title="修改歌曲" :visible.sync="editVisible" width="400px" center>
        <el-form :model="form" ref="form" label-width="80px">
            <el-form-item prop="name" label="歌手-歌名" size="mini">
              <el-input v-model="form.name" placeholder="歌手-歌名"></el-input>
            </el-form-item>
            <el-form-item prop="introduction" label="专辑" size="mini">
              <el-input v-model="form.introduction" placeholder="专辑" />
            </el-form-item>

            <el-form-item prop="lyric" label="歌词" size="mini">
              <el-input v-model="form.lyric" placeholder="歌词" type="textarea" />
            </el-form-item>
        </el-form>
     <span slot="footer">
       <el-button size="mini" @click="editVisible = false">取消</el-button>
       <el-button size="mini" @click="editSave">确定</el-button>
     </span>
   </el-dialog>

   <el-dialog title="删除歌曲" :visible.sync="delVisible" width="300px" center>
    <div>删除不可恢复，是否确定删除？</div>
    <span slot="footer">
      <el-button size="mini" @click="delVisible = false">取消</el-button>
      <el-button size="mini" @click="deleteRow">确定</el-button>
    </span>
  </el-dialog>

  </div>
</template>

<script>
import { mixin } from "../mixins";
import "@/assets/js/iconfont.js";
import {addOneSong,selectSongs,updateSong ,deleteSong,deleteSomeSong} from "../api/index";

export default {
  mixins: [mixin],
  data() {
    return {
      singerId: "", //歌手id
      singerName: "", //歌手名
      centerDialogVisible: false, //添加弹窗是否显示
      editVisible:false, //编辑框是否显示
      delVisible:false,//删除提示框

      registerForm: {
        //添加框
        name: "",//歌名
        singerId: "",//歌手编号
        singerName: "",//歌手名
        introduction: "",//简介
        lyric: "",//歌词
        file:""
      },

      tableData: [],
      //分页设置
      currentPage: 0,//当前页
      pageSize: 0,//分页的每页显示多少个
      total: 0,//总条数
      
      rules: {
        name: [
          { required: true, message: "请输入歌名", trigger: "blur" },
        ],
        introduction: [
          { required: true, message: "请输入专辑", trigger: "blur" },
        ],
        lyric: [{ required: true, message: "请输入歌词", trigger: "blur" }],
      },

      form: {
        //编辑框
        id: "",
        name: "",
        introduction: "",
        lyric: "",
      },

      idx: -1, //当前选择删哪首歌曲
      ids:[],//批量删除歌曲
    };
  },
  created() {
    this.singerId = this.$route.query.id;//点击歌曲管理，传来的参数，歌手编号
    this.singerName = this.$route.query.name;//点击歌曲管理，传来的参数，歌手姓名
    this.getData();
  },
  computed:{
    data(){
      return this.tableData;
    }
  },
  
  
  methods: {
    
    //添加歌曲
    addSong() {
      this.registerForm.name = this.singerName+"-"+this.registerForm.name;//拼接，歌手姓名-歌名
      this.registerForm.singerId = this.singerId;//歌手id
      addOneSong(this.registerForm).then( (res) =>{
        if(res){
          this.notify("添加成功","success");
          this.getData();
          
        }else{
          this.notify("添加失败","error");
        }
       
      })
    },
    //获取当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    //查询所有该歌手的歌曲  以及分页
    getData() {
      this.tableData = [],
      // singerId = this.singerId;
      selectSongs(this.currentPage,this.singerId).then((res) => {
        this.tableData = res.records;
        this.pageSize = res.size;
        this.total = res.total;
      })
    },
    //解析歌词
    parseLyric(text) {
      let lines = text.split("\n");
      let pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g;
      let result = [];
      for (let item of lines) {
        let value = item.replace(pattern, "");
        result.push(value);
      }
      return result;
    },
    //更新图片
    uploadUrl(id) {
      return `http://127.0.0.1:8888/song/updateSongPic?id=${id}`;
    },
    //更新歌曲url
    uploadSongUrl(id) {
      return `http://127.0.0.1:8888/song/updateSongUrl?id=${id}`;
    },
    //上传歌曲成功之后要做的工作
    handleSongSuccess(res) {
      let _this = this;
      if (res.code == 1) {
        _this.getData();
        _this.$notify({
          title: "上传成功",
          type: "success",
        });
      } else {
        _this.$notify({
          title: "上传失败",
          type: "error",
        });
      }
    },
    
    //弹出编辑页面
    handleEdit(row) {
      this.editVisible = true;
      this.form = {
        id: row.id,
        name: row.name,
        introduction: row.introduction,
        lyric: row.lyric,
      };
    },
    //保存更改后页面
    editSave() {  
      updateSong(this.form)
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
  
    //删除一首歌曲
    deleteRow() {
      deleteSong(this.idx)
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
    handleSelectionChange(selection){
      this.ids = selection.map(item => item.id)
    },
    delAll(){
      
      deleteSomeSong(this.ids).then((res)=>{
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
  },
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}
.song-img {
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
.play {
  position: absolute;
  z-index: 100;
  width: 80px;
  height: 80px;
  display: flex;
  align-content: center;
  justify-content: center;
  cursor: pointer;
  top: 45px;
  left: 15px;
}
.icon {
  width: 2em;
  height: 2em;
  color: white;
  fill: currentColor;
  overflow: hidden;
}
</style>