<template>
  <div class="table">
    <div class="crumbs">
      <i class="el-icon-tickets"></i>
      歌单歌曲信息
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" size="mini" @click="delAll">批量删除</el-button>
        <el-input  size="mini" placeholder="请输入歌曲名" class="handle-input" v-model="select_value" 
          @keyup.enter.native="searchEnter"></el-input>
        <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加歌曲</el-button>
      </div>
    </div>

    <el-table size="mini" border style="width: 100%" height="600px" :data="tableData" @selection-change="handelSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="name" label="歌手-歌名" width="120" align="center"></el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加歌曲" :append-to-body="true" :visible.sync="centerDialogVisible" width="400px" center>
      <el-form :model="registerForm" ref="registerForm" label-width="80px" action="" id="tf">
        <el-form-item prop="singerName" label="歌手名字" size="mini">
          <el-input v-model="registerForm.singerName" placeholder="歌手名字"></el-input>
        </el-form-item>

        <el-form-item prop="songName" label="歌曲名字" size="mini">
          <el-input v-model="registerForm.songName" placeholder="歌曲名字"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
        <el-button size="mini" @click="getSongId">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="删除歌曲" :append-to-body="true" :visible.sync="delVisible" width="300px" center>
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
import { insertListSong,songByName,songIdBySongListId,songBySongId,deleteListSong,deleteListSongs } from "../api/index";

export default {
  mixins: [mixin],
  data() {
    return {
      centerDialogVisible: false, //添加弹窗是否显示
      delVisible: false, //删除弹窗是否显示
      registerForm: {
        //添加框
        singerName: "", //歌手名字
        songName: "", //歌曲名字
      },
      tableData: [],
    
      idx: -1, //当前选择项
      
      songListId: "", //歌单id
      songIds:[],//批量删除歌曲编号

      
      // 搜索框的值(双向数据绑定)
      select_value: "",
      
    };
  },
  // watch: {
  //   //搜素框里面的内容发生变化的时候，搜素结果table列表的内容跟着它的内容发生变化
  //   select_word: function () {
  //     if (this.select_word == "") {
  //       this.tableData = this.tempData;
  //     } else {
  //       this.tableData = [];
  //       for (let item of this.tempData) {
  //         if (item.name.includes(this.select_word)) {
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
    this.songListId = this.$route.query.id;
    this.getData();
  },
  methods: {
    
    //模糊查询（enter查询）
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
    //查询所有歌曲
    getData() {
      this.tableData = [];
      songIdBySongListId(this.songListId)
      .then((res) =>{
        for (let item of res) {
          this.getSong(item.song_id);
        }
      })
    },
    //根据歌曲id查询歌曲对象，放到tableData
    getSong(id) {
      songBySongId(id).then((res)=>{
        this.tableData.push(res);
      })
      .catch((err) => {
          console.log(err);
        });
    },
    //在歌单添加歌曲前 ，需要获取该歌曲id，
    getSongId() {
      let _this = this;
      var songName = _this.registerForm.singerName + "-" + _this.registerForm.songName;
      songByName(songName).then((res)=>{
        _this.addSong(res.id);//调用添加歌曲的方法 发送请求
      })
    },
    //添加歌曲
    addSong(songId) {
      let params = new URLSearchParams();
      params.append("songId", songId);
      params.append("songListId", this.songListId);
      insertListSong(params)
      .then((res)=>{
        if(res){
          this.notify("添加成功","success");
          this.getData();
        }else{
          this.notify("添加失败","error");
        }
      })
    },

    //删除一条歌曲
    deleteRow() {
      deleteListSong(this.idx,this.songListId)
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
    handelSelectionChange(selection){
      this.songIds = selection.map(item => item.id)
      
    },
    delAll(){
      deleteListSongs(this.songIds,this.songListId).then((res)=>{
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