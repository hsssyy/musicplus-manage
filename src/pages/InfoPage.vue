<template>
  <div>
    <el-row :gutter="20">
    <el-col :span="6">
      <el-card shadow="hover" :body-style="{ padding: '0px' }">
        <div class="card-content">
          <div class="card-left">
            <i class="el-icon-user"></i>
          </div>
          <div class="card-right">
            <div class="card-num">{{  consumerCount }}</div>
            <div>用户总数</div>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="hover" :body-style="{ padding: '0px' }">
        <div class="card-content">
          <div class="card-left">
            <i class="el-icon-headset"></i>
          </div>
          <div class="card-right">
            <div class="card-num">{{ songCount }}</div>
            <div>歌曲总数</div>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="hover" :body-style="{ padding: '0px' }">
        <div class="card-content">
          <div class="card-left">
            <i class="el-icon-mic"></i>
          </div>
          <div class="card-right">
            <div class="card-num">{{ singerCount }}</div>
            <div>歌手数量</div>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="hover" :body-style="{ padding: '0px' }">
        <div class="card-content">
          <div class="card-left">
            <i class="el-icon-document"></i>
          </div>
          <div class="card-right">
            <div class="card-num">{{ songListCount }}</div>
            <div>歌单数量</div>
          </div>
        </div>
      </el-card>
    </el-col>
</el-row>

    <el-row :gutter="20" class="mgb20">
      <el-col :span="12">
        <h3 class="mgb20">用户性别比例</h3>
        <div style="background-color: white" >
          <ve-pie :data="consumerSex" :theme="options" ></ve-pie>
        </div>
      </el-col>
      <el-col :span="12">
        <h3 class="mgb20">歌单风格</h3>
        <div style="background-color: white">
          <ve-histogram :data="songStyle"></ve-histogram>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mgb20">
      <el-col :span="12">
        <h3 class="mgb20">歌手性别比例</h3>
        <div style="background-color: white">
          <ve-pie :data="singerSex"  :settings="chartSettings"></ve-pie>
        </div>
      </el-col>
      <el-col :span="12">
        <h3 class="mgb20">歌手国籍分布</h3>
        <div style="background-color: white">
          <ve-line :data="country"  :settings="chartSettings_line"></ve-line>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  getCountOfConsumer,
  getCountOfSong,
  getCountOfSinger,
  getCountOfSongList,
} from "../api/index";

export default {
  data() {
    this.chartSettings = {
        roseType: 'radius'
      },
      this.chartSettings_line={
        area: true
      }
    return {
      consumerCount: 0, //用户总数
      songCount: 0, //歌曲总数
      singerCount: 0, //歌手数量
      songListCount: 0, //歌单数量

      consumer: [], //拿回的所有用户是一个数组，需要进行一个数据转换，取其长度即为用户总数
    
      consumerSex: {
        //按性别分类的用户
        columns: ["性别", "总数"],
        rows: [
          { 性别: "女", 总数: 0 },
          { 性别: "男", 总数: 0 },
        ],
      },
      options: {
        color: ["#87cefa", "#ffc0cb"],//颜色
      },

      songStyle: {
        columns: ["风格", "总数"],
        rows: [
          { 风格: "华语", 总数: 0 },
          { 风格: "粤语", 总数: 0 },
          { 风格: "欧美", 总数: 0 },
          { 风格: "日韩", 总数: 0 },
          { 风格: "BGM", 总数: 0 },
          { 风格: "轻音乐", 总数: 0 },
          { 风格: "乐器", 总数: 0 },
        ],
      },
      singerSex: {
        columns: ["性别", "总数"],
        rows: [
          { 性别: "女", 总数: 0 },
          { 性别: "男", 总数: 0 },
          { 性别: "组合", 总数: 0 },
          { 性别: "不明", 总数: 0 },
        ],
      },
      country: {
        columns: ["国籍", "总数"],
        rows: [
          { 国籍: "中国", 总数: 0 },
          { 国籍: "俄罗斯", 总数: 0 },
          { 国籍: "欧美", 总数: 0 },
          { 国籍: "日本", 总数: 0 },
          { 国籍: "美国", 总数: 0 },
        ],
      },
    };
  },
  //生命周期函数
  mounted() {//执行方法（页面的所有元素加载完成之后才执行，created（）是在页面加载的时候就开始执行）
    this.getConsumer2();
    this.getSong();
    this.getSinger();
    this.getSongList();
  },
  methods: {//声明方法
    getConsumer2() {
      //用户总数
      getCountOfConsumer().then((res) => {
        this.consumer = res;
        this.consumerCount = res.length;
        this.consumerSex.rows[0]["总数"] = this.setSex(0, this.consumer);
        this.consumerSex.rows[1]["总数"] = this.setSex(1, this.consumer);
      });
    },
    setSex(sex, val) {
      //根据性别获取用户数
      let count = 0;
      for (let item of val) {
        if (sex == item.sex) {
          count++;
        }
      }
      return count;
    },
    getSong() {
      //歌曲总数
      getCountOfSong().then((res) => {
        this.songCount = res.length;
      });
    },
    getSinger() {
      //歌手总数
      getCountOfSinger().then((res) => {
        this.singerCount = res.length;

        this.singerSex.rows[0]["总数"] = this.setSex(0, res);
        this.singerSex.rows[1]["总数"] = this.setSex(1, res);
        this.singerSex.rows[2]["总数"] = this.setSex(2, res);
        this.singerSex.rows[3]["总数"] = this.setSex(3, res);

        for (let item of res) {
          this.getByCountry(item.location);
        }
      });
    },
    getByCountry(location) {
      //根据歌籍获取数量
      for (let item of this.country.rows) {
        if (location.includes(item["国籍"])) {
          item["总数"]++;
        }
      }
    },
    getSongList() {
      //歌单总数
      getCountOfSongList().then((res) => {
        this.songListCount = res.length;
        for (let item of res) {
          this.getByStyle(item.style);
        }
      });
    },
    getByStyle(style) {
      //根据歌单风格获取数量
      for (let item of this.songStyle.rows) {
        if (style.includes(item["风格"])) {
          item["总数"]++;
        }
      }
    },
  },
};
</script>

<style scoped>
.card-content {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100px;
  padding-left: 20%;
  text-align: center;
  font-size: 60px;
  color: rgb(47, 187, 157);
}



.card-right {
  flex: 1;
  font-size: 14px;
}

.card-num {
  font-size: 30px;
  font-weight: bold;
}

h3 {
  margin: 10px 0;
  text-align: center;
}
.cav-info {
  border-radius: 6px;
  overflow: hidden;
  height: 250px;
  background-color: white;
}
</style>
