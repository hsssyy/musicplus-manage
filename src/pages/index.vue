<template>
    <div>
        <div class="box">
            <el-row :gutter="20" class="mgb20">
                <el-col :span="5">
                    <el-card>
                        <div class="grid-content">
                            <div class="grid-cont-center">
                                <div class="grid-num">{{ consumerCount }}</div>
                                <div>全部用户</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card>
                        <div class="grid-content">
                            <div class="grid-cont-center">
                                <div class="grid-num">{{ songCount }}</div>
                                <div>管理员总数</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card>
                        <div class="grid-content">
                            <div class="grid-cont-center">
                                <div class="grid-num">{{ singerCount }}</div>
                                <div>歌手数量</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card>
                        <div class="grid-content">
                            <div class="grid-cont-center">
                                <div class="grid-num">{{ songListCount }}</div>
                                <div>歌曲数量</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>

        <div>
            <div class="chart">
                <div id="c1" class="chart1" style="width: 50%;height: 300px;background:#fff ;"> </div>
                <div id="c6" class="chart6" style="width: 30%;height: 300px;background:#fff ;"> </div>
                <div id="c2" class="chart2" style="width: 30%;height: 300px;background:#fff ;"> </div>
            </div>
            <div class="chart3">
                <div id="c4" class="chart4" style="width: 50%;height: 300px;background:#fff ;"> </div>
                <div id="c5" class="chart5" style="width: 30%;height: 300px;background:#fff ;">
                    <div>
                        <i class="el-icon-setting"></i>
                        <span slot="title">导航</span> {{ songListCount }}
                    </div>
                    <div>
                        <i class="el-icon-setting"></i>
                        <span slot="title">普通用户数量</span> {{ songListCount }}
                    </div>
                    <div>
                        <i class="el-icon-setting"></i>
                        <span slot="title">VIP用户数量</span> {{ songListCount }}
                    </div>
                    <div>
                        <i class="el-icon-setting"></i>
                        <span slot="title">创作者数量</span> {{ songListCount }}
                    </div>

                </div>
                <div id="c7" class="chart7" style="width: 30%;height: 300px;background:#fff ;"> </div>

            </div>
        </div>


    </div>
</template>

<script>
import {
    // getConsumer,
    getCountOfConsumer,
    // allSong,
    getCountOfSong,
    // getAllSinger,
    getCountOfSinger,
    // getAllSongList,
    getCountOfSongList,
} from "../api/index";
export default {
    data() {
        return {
            consumerCount: 0, //用户总数
            songCount: 0, //歌曲总数
            singerCount: 0, //歌手数量
            songListCount: 0, //歌单数量
        
            consumerSex: {
            //按性别分类的用户
            columns: ["性别", "总数"],
                rows: [
                    { 性别: "女", 总数: 0 },
                    { 性别: "男", 总数: 0 },
                ],
        },
    }
    },
    mounted() {
        this.bar();
        this.line();
        this.line2();
        this.line3();
        this.line7();

    },
    methods: {
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




        bar() {
            var chartDom2 = document.getElementById('c1');
            var myChart2 = this.$echarts.init(chartDom2);
            var option2;
            option2 = {
                title: {
                    text: 'ECharts 入门示例'
                },
                xAxis: {
                    data: ['A', 'B', 'C', 'D', 'E']
                },
                yAxis: {},
                series: [
                    {
                        type: 'bar',
                        data: [23, 24, 18, 25, 18],
                        barGap: '20%',
                        barCategoryGap: '40%',

                    },
                    {
                        type: 'bar',
                        data: [12, 14, 9, 9, 11]
                    }
                ]
            };
            option2 && myChart2.setOption(option2);
            window.addEventListener("resize", () => {
                if (myChart2) {
                    myChart2.resize()
                }
            })

        },
        line() {
            var chartDom2 = document.getElementById('c2');
            var myChart2 = this.$echarts.init(chartDom2);
            var option2;

            option2 = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [
                    {
                        name: 'Access From',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '40',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: 1048, name: 'Search Engine' },
                            { value: 735, name: 'Direct' },
                            { value: 580, name: 'Email' }
                        ]
                    }
                ]
            };

            option2 && myChart2.setOption(option2);
            window.addEventListener("resize", () => {
                if (myChart2) {
                    myChart2.resize()
                }
            })

        },
        line2() {
            var chartDom2 = document.getElementById('c6');
            var myChart2 = this.$echarts.init(chartDom2);
            var option2;

            option2 = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [
                    {
                        name: 'Access From',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '40',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value:1233, name: 'Search Engine' },
                            { value: 735, name: 'Direct' },
                        ]
                    }
                ]
            };

            option2 && myChart2.setOption(option2);
            window.addEventListener("resize", () => {
                if (myChart2) {
                    myChart2.resize()
                }
            })

        },
        line3() {
            var chartDom2 = document.getElementById('c4');
            var myChart2 = this.$echarts.init(chartDom2);
            var option2;
            option2 = {
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: [820, 932, 901, 934, 1290, 1330, 1320],
                        type: 'line',
                        smooth: true,//平滑曲线
                        areaStyle: {}
                    }
                ]
            };

            option2 && myChart2.setOption(option2);
            window.addEventListener("resize", () => {
                if (myChart2) {
                    myChart2.resize()
                }
            })

        },
        line5() {




        },
        line7() {
            var chartDom2 = document.getElementById('c7');
            var myChart2 = this.$echarts.init(chartDom2);
            var option2;
            option2 = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {},
                toolbox: {
                    show: true,
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        dataView: { readOnly: false },//数据视图
                        magicType: { type: ['line', 'bar'] },//转为折线图或柱状图
                        restore: {},//还原
                        saveAsImage: {}//下载为图片
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value',
                    // axisLabel: {
                    //     formatter: '{value} °C'
                    // }
                },
                series: [
                    {
                        // name: 'Highest',
                        type: 'line',
                        data: [10, 11, 13, 11, 12, 12, 9],
                        markPoint: {
                            data: [
                                { type: 'max', name: 'Max' },
                                { type: 'min', name: 'Min' }
                            ]
                        }
                    }
                ]
            };

            option2 && myChart2.setOption(option2);
            window.addEventListener("resize", () => {
                if (myChart2) {
                    myChart2.resize()
                }
            })

        }

    }
}
</script>

<style scoped>
.box {
    margin-top: 10px;
    margin-left: 20px;
    margin-right: 20px;
}

.chart {
    display: flex;
    /*设置为弹性盒*/
    align-items: center;
    margin-top: 20px;
    margin-right: 20px;
    margin-left: 20px;
    height: 300px;
    width: 96%;
    margin-right: 20px;
}


.chart1 {
    display: flex;
    /*设置为弹性盒*/


}

.chart6 {
    display: flex;
    /*设置为弹性盒*/


}

.chart2 {
    display: flex;
    /*设置为弹性盒*/
    margin-left: 20px;

    /* margin-top: 20px; */

}

.chart3 {
    display: flex;
    align-items: center;
    margin-top: 20px;
    margin-right: 20px;
    margin-left: 20px;
    height: 300px;
    width: 96%;
}

.chart5 {
    display: flex;
    margin-left: 30px;
}

.chart4 {
    display: flex;
    margin-left: 30px;
}

.chart7 {
    display: flex;
    margin-left: 30px;
}

/**数量 */
.grid-content {
    display: flex;
    align-items: center;
    height: 80px;
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