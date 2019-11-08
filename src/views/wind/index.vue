<template>

  <div class="wind">

    <el-input class="search" v-model="searchInput" placeholder="输入查询机场名称或拼音">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>

    <div id="cesiumContainer">
    </div>

    <!---->
    <div class="station_hover_info" v-if="activeWind=='planewind'" v-show="isHoverShow">
      <div class="station_hover_header">
        <div class="header_icon"></div>
        <div class="header_title">{{stationname}}</div>
      </div>
      <div class="station_hover_line"></div>
      <div class="station_hover_container">
        <div><span>地面风速：</span><span>{{parseFloat(info.SPD).toFixed(2)}}m/s</span></div>
        <div><span>一小时降水量：</span><span>{{parseFloat(info.T2).toFixed(1)}}MM</span></div>
        <div><span>地面风向：</span><span>{{parseInt(info.DIR)}}°</span></div>
        <div><span>相对湿度：</span><span>{{parseInt(info.RH)}}%</span></div>
        <div><span>温度：</span><span>{{parseInt(info.T - 272.15)}}℃</span></div>
        <div><span>修正海平面气压：</span><span>{{parseInt(info.SLP)}}hPa</span></div>
      </div>
      <div class="station_hover_footer">
        <div class="footer_time">数据时间(UTC)：{{infoTime}}</div>
      </div>
    </div>

    <!-- <div id="windEcharts" ref="chart"></div> -->
    <div id="menu" v-if="activeWind=='planewind'">
      <!-- <div class="input" id="search">
        <img src="../../../public/images/icon_sousuo@2x.png" id="search-icon">
        <a id="search-input">输入查询的机场名称或拼音</a>
      </div> -->

      <div>
        <div id="flat">
          <li id="flat1">平面风向展示</li>
        </div>
        <div id="profile">
          <li id="profile1">剖面风向展示</li>
        </div>
      </div>

      <div id="menu1" :class="{move_in2:!isShow,move_out2:isShow}">
        <li class="nearmenu">临近预报</li>
      </div>
      <div id="menu11" :class="{move_in2:!isShow,move_out2:isShow}">
        <li class="nearmenu">临近预报</li>
      </div>
      <div id="menu2" :class="{move_in2:!isShow,move_out2:isShow}">
        <li class="nearmenu">短时预报</li>
      </div>
      <div id="menu22" :class="{move_in2:!isShow,move_out2:isShow}">
        <li class="nearmenu">短时预报</li>
      </div>

      <div class="">
        <div id="back" :class="{move_in1:isShow,move_out1:!isShow}">
          <div style="text-align:left;">
            <a id="string"></a>&nbsp;<a id="pointname">{{stationname}}</a>
          </div>
          <div id="closename" v-bind:class="{reverseenteractive : !isShow, reverseleaveactive : isShow}">
            <img src="../../../public/images/icon_xiangxia@2x.png" @click="closename()">
          </div>

          <hr id="rule"/>

          <div id="date">
            <span id="dateshow">2019.11.04 星期一 12:00:00</span>
          </div>

          <div id="airport">
            <img src="../../../public/images/icon_jichang@2x.png" id="airporticon">
            <a id="airportname">机场名称</a>
            <a id="airportBJ">北京首都机场</a>
          </div>

          <div id="windspeed">
            <img src="../../../public/images/icon_fengsu@2x.png" id="windspeedicon">
            <a id="windspeedname">地面风速</a>
            <a id="windspeedBJ">{{parseFloat(info.SPD).toFixed(2)}}m/s</a>
          </div>

          <div id="winddirection">
            <img src="../../../public/images/icon_fengxiang@2x.png" id="winddirectionicon">
            <a id="winddirectionname">地面风向</a>
            <a id="winddirectionBJ">{{parseInt(info.DIR)}}°</a>
          </div>

          <div id="airpressure">
            <img src="../../../public/images/icon_qiya@2x.png" id="airpressureicon">
            <a id="airpressurename">修正海平面气压</a>
            <a id="airpressureBJ">{{parseInt(info.SLP)}}hPa</a>
          </div>

          <div id="T">
            <img src="../../../public/images/icon_wendu@2x.png" id="Ticon">
            <a id="Tname">温度</a><br/>
            <a id="TBJ">{{parseInt(info.T - 272.15)}}℃</a>
          </div>

          <div id="rain">
            <img src="../../../public/images/icon_jiangyu@2x.png" id="rainicon">
            <a id="rainname">一小时降水量</a>
            <a id="rainBJ">{{parseFloat(info.T2).toFixed(1)}}MM</a>
          </div>

          <div id="humidity">
            <img src="../../../public/images/icon_shidu@2x.png" id="humidityicon">
            <a id="humidityname">相对湿度</a>
            <a id="humidityBJ">{{parseInt(info.RH)}}%</a>
          </div>
          <div id="tag" v-show="isShow">
            <div id="windEcharts" style="width: 100%;height:100%;"></div>
          </div>
        </div>
      </div>

      <div id="tone">
        <div id="tonenameback">
          <a id="stringR"> </a>&nbsp;<a id="pointgroundname">机场跑道地面风速</a>
        </div>
        <hr id="ruletwo"/>
        <div>
          <a id="small"> </a> <a id="smallname">正常 0-5 m/s</a><br/>
          <a id="centre"> </a> <a id="centrename">轻度 5-17 m/s</a><br/>
          <a id="big"> </a> <a id="bigname">严重 ㄒ17 m/s</a><br/>
        </div>
      </div>
    </div>


    <article class="wind_header">
      <div>
        <el-button id="planewind" type="primary" @click="windToggle('plane')">平面风展示</el-button>
        <el-button id="sectionwind" type="primary" @click="windToggle('section')">剖面风展示</el-button>
      </div>

    </article>

    <!--<transition name="slide-fade"> 动画测试-->
    <article v-if="activeWind=='sectionwind'" class="wind_content">
      <div v-if="activeWind=='sectionwind'" class="wind_header_icon" v-show="isLegendChange">
        <div class="pic_icon"></div>
        <span>详细</span>
      </div>
      <div id="body">
        <div ref="canvas" id="canvas" class="canvas" v-show="isLegendChange"></div>
      </div>
    </article>
    <!--</transition>-->

    <article v-if="activeWind=='sectionwind'" class="wind_footer">
      <div class="wind_footer_header">
        <el-button :class="{ 'select_color': runType=='runway1' }" @click="changeRunway('runway1')">跑道1</el-button>
        <el-button :class="{ 'select_color': runType=='runway2' }" @click="changeRunway('runway2')">跑道2</el-button>
        <el-button :class="{ 'select_color': runType=='runway3' }" @click="changeRunway('runway3')">跑道3</el-button>
      </div>
      <div class="wind_footer_body">
        <div @mousemove="startMove">
          <div class="title">
            <div class="title_icon"></div>
            <span>跑道一</span>
          </div>
          <ul class="progress_bar">
            <li>0h</li>
            <li>2h</li>
            <li>4h</li>
            <li>6h</li>
            <li>8h</li>
            <li>10h</li>
            <li>12h</li>
            <li>14h</li>
            <li>16h</li>
            <li>18h</li>
            <li>20h</li>
            <li>22h</li>
            <li>24h</li>
          </ul>
          <div
            class="pentagon"
            ref="mySlider"
            :style="{left:mySliderLeft+'px'}"
            @mousedown="startSlider"
          ></div>
        </div>
      </div>
    </article>
  </div>


</template>
<script>
  import Cesium from "cesium/Cesium";
  import ElementUI from 'element-ui';
  import widgets from "cesium/Widgets/widgets.css";
  import colorTable from '@/components/wind/colorTable.js'
  import Wind3D from '@/components/wind/wind3D.js'
  import sectionwind from './sectionwind'
  import data from "@/assets/data/j1.json";
  import request from "@/utils/request1";

  export default {
    name: "cesiumContainer",
    data() {
      return {
        data: Object,
        colorTable: {
          type: Object,
          default: () => {
            return colorTable
          }
        },
        particleSystemOptions: {
          type: Object,
          default: function () {
            return {
              particlesTextureSize: 128,
              maxParticles: 128 * 128,
              particleHeight: 100.0,
              fadeOpacity: 0.996,
              dropRate: 0.003,
              dropRateBump: 0.01,
              speedFactor: 4.0,
              lineWidth: 4.0
            }
          }
        },
        searchInput: "",
        mySliderLeft: 0,
        mouseX: 0,
        mouseXstart: 0,
        flag: false,
        height_num: 35,
        initLeft: 0,
        runType: 'runway1',
        activeWind: 'planewind',
        isShow: false,
        isHoverShow: false, //悬浮数据框显示控制
        windInfo: [], // 风数据,按高度获取
        otherInfo: [], // 其他数据,只有地面2米数据
        nowHour: 12, // 当前时间
        showHour: 12, // 数据展示时间
        isLegendChange: true,
        pointName: ["18L", "MID1", "36R", "18R", "MID2", "36L", "19", "MID3", "01"], //九站点名
        infoType: ["DIR", "SPD", "SLP", "T2", "RH", "T"], // 展示数据类型
        windColor: ['#0BD3A7', "#FFBE3A", "#FF2C55"], //跑道色值
        labelColor: ["#DDFBF5", "#FFF1D4", "#FFD8DF"], //站点框色值
        runLists: ["runway1", "runway2", "runway3"], //跑道
        infoTime: "", // 当前展示数据时间
        stationname: "ZBAA",
        info: {
          DIR: "0",
          SPD: "0",
          SLP: "0",
          T2: "0",
          RH: "0",
          T: "0"
        }
      }
    },
    methods: {

      /**
       * 获取站点数据
       */
      getStationInfo: function () {
        let info = {}
        let params = {}
        params.datacode = "ZBAA"
        params.airport = "ZBAA"
        params.runway = "runway1,runway2,runway3"
        params.dataset = "U,V,DIR,SPD"
        params.starttime = "2019-11-04 06:00:00"
        params.endtime = "2019-11-04 18:00:00"
        params.resolution = "1000M"
        params.hight = "0010m"
        let url = "http://161.189.11.216:8090/gis/BJPEK/RunwaysForecast"
        info.url = url
        info.params = params
        this.$store.dispatch("station/getRankInfo", info).then((res) => { // 按高度获取风数据
          if (res.data.returnCode == 0) {
            this.windInfo = res.data.runways
//            this.changeColor(0, 12, "18R", "MID1", "36L")
//            this.changeColor(1, 12, "18L", "MID2", "36R")
//            this.changeColor(2, 12, "19", "MID3", "01")
          } else {
            this.$message.error(res.data.returnMessage)
          }
        })
        info = {}
        params = {}
        params.datacode = "ZBAA"
        params.airport = "ZBAA"
        params.runway = "runway1,runway2,runway3"
        params.starttime = "2019-11-04 06:00:00"
        params.endtime = "2019-11-04 18:00:00"
        params.resolution = "1000M"
        params.dataset = "SLP,T2,RH,T,PSFC"
        params.hight = "0002m"
        info.params = params
        info.url = url
        this.$store.dispatch("station/getRankInfo", info).then((res) => { // 获取两米高度其他数据
          if (res.data.returnCode == 0) {
            this.otherInfo = res.data.runways
          } else {
            this.$message.error(res.data.returnMessage)
          }
        })
      },
      /**
       * 画跑道
       * @param colors 跑道颜色数组 根据当前风速取值
       * @returns {Element|HTMLElementTagNameMap[string]}
       */
      drawRunWays: function (colors) {
        var point = [0, 0.25, 0.5, 0.75, 1]
        var canvas = document.createElement('canvas');      //创建canvas标签
        var ctx = canvas.getContext('2d');
        var grd = ctx.createLinearGradient(0, 0, 300, 0);
        for (var i = 0; i < point.length; i++) {
          grd.addColorStop(point[i], colors[i]);
        }
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 10;
        ctx.shadowColor = "black";
        ctx.rect(0, 0, 300, 150);
        ctx.fillStyle = grd;
        ctx.fill();
        return canvas;
      },
      /**
       * 画站点
       * @param text 站点名称
       * @param lat 站点坐标
       * @param lng 站点坐标
       */
      drawPoint(text, lat, lng, runway) {
        var r = '<table style="width: 200px;"><tr><th scope="col" colspan="4"  style="text-align:center;font-size:15px;">' + '</th></tr><tr><td >住用单位：</td><td >XX单位</td></tr><tr><td >建筑面积：</td><td >43平方米</td></tr><tr><td >建筑层数：</td><td >2</td></tr><tr><td >建筑结构：</td><td >钢混</td></tr><tr><td >建筑年份：</td><td >2006年</td></tr><tr><td colspan="4" style="text-align:right;"></td></tr></table>';
        this.viewer.entities.add({
          show: true,
          id: text.replace(/^\s*|\s*$/g, ""),
          name: text,
          type: "station",
          runway: runway,
          type: "point",
          position: Cesium.Cartesian3.fromDegrees(lat, lng),
          backColor: '#FFF1D4',
          textColor: "#FFDB92",
          label: {
            text: text,
            font: '12px Source Han Sans CN',    //字体样式
            fillColor: Cesium.Color.fromCssColorString('#FFDB92'),        //字体颜色
            backgroundColor: Cesium.Color.fromCssColorString('#FFF1D4'),    //背景颜色
            showBackground: true,                //是否显示背景颜色
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,        //label样式 TEXT的样式填充以及边框
            outlineWidth: 1,
            outlineColor: Cesium.Color.BLACK,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,//垂直位置
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,//水平位置
            pixelOffset: new Cesium.Cartesian2(10, 0),           //偏移
            scale: 1
          },
          tooltip: {html: r, anchor: [0, -12]},
        })
      },
      /**
       * 站点悬浮事件，获取当前站点时间数据
       * @param movement
       */
      pointHandler: function (movement) {
        var pick = this.viewer.scene.pick(movement.endPosition);
        //      if (!pick) {
        if (this.entity && this.entity.id.label.scale != 1 && this.entity.id.id != pick.id.id) {
          this.entity.id.label.scale = 1
          this.entity.id.label.fillColor = Cesium.Color.fromCssColorString(this.entity.id.textColor)
          this.entity.id.label.backgroundColor = Cesium.Color.fromCssColorString(this.entity.id.backColor)
          if (pick.id.type == "station") {
            this.entity = pick
          } else {
            this.entity = undefined
          }
          this.isHoverShow = false
        }
        //    return
        // }
        if (pick.id.type == "point") {
          let index = (this.showHour - this.nowHour) + 7 // 获取数据在数组中位值
          let wind = this.windInfo[pick.id.runway][(pick.id.name).replace(/^\s*|\s*$/g, "")]
          let other = this.otherInfo[pick.id.runway][(pick.id.name).replace(/^\s*|\s*$/g, "")]
          for (let i = 0; i < this.infoType.length; i++) {
            if (wind[this.infoType[i]] != undefined) {
              this.info[this.infoType[i]] = wind[this.infoType[i]][index]
            }
            if (other[this.infoType[i]] != undefined) {
              this.info[this.infoType[i]] = other[this.infoType[i]][index]
            }
          }
          this.infoTime = "2019-11-04 " + this.showHour + ":00:00"
          if (this.entity) {
            if (this.entity.id.name == pick.id.name) {
              return
            } else {
              this.entity = pick
              pick.id.label.scale = 1.5
              pick.id.label.fillColor = Cesium.Color.fromCssColorString('#ffffff')
              pick.id.label.backgroundColor = Cesium.Color.fromCssColorString(pick.id.textColor)
              this.isHoverShow = true
              let Echarts1 = this._initEcharts1()
              this.potail(Echarts1, pick.id.id, pick.id.runway)
              this.stationname = pick.id.id;
            }
          } else {
            this.entity = pick
            pick.id.label.scale = 1.5
            pick.id.label.fillColor = Cesium.Color.fromCssColorString('#ffffff')
            pick.id.label.backgroundColor = Cesium.Color.fromCssColorString(pick.id.textColor)
            this.isHoverShow = true
            let Echarts1 = this._initEcharts1()
            this.potail(Echarts1, pick.id.id, pick.id.runway)
            this.stationname = pick.id.id;
          }
        }
      },
      /**
       * 剖面风点击
       */
      wallHandler: function (click) {
        var pick = this.viewer.scene.pick(click.position);
        if (pick) {
          if (pick.id.name == "windWall") {
            this.changeRunway(pick.id.type)
          }
        }
      },
      /**
       * 格式化时间数据 获取开始时间与结束时间
       * @param date
       * @returns {string}
       */
      formateDate: function (date) {
        var dateTime = null;
        var dateTime = date.getFullYear() + '-';
        if (("" + (date.getUTCMonth() + 1)).length == 1) {
          dateTime += '0' + (date.getUTCMonth() + 1) + '-';
        } else {
          dateTime += date.getUTCMonth() + 1 + '-';
        }
        if (("" + date.getUTCDate()).length == 1) {
          dateTime += '0' + date.getUTCDate() + ' '
        } else {
          dateTime += date.getUTCDate() + ' ';
        }
        if (("" + date.getUTCHours()).length == 1) {
          dateTime += '0' + date.getUTCHours() + ':'
        } else {
          dateTime += date.getUTCHours() + ':';
        }
        if (("" + date.getUTCMinutes()).length == 1) {
          dateTime += '0' + date.getUTCMinutes() + ':'
        } else {
          dateTime += date.getUTCMinutes() + ':';
        }
        if (("" + date.getUTCSeconds()).length == 1) {
          dateTime += '0' + date.getUTCSeconds()
        } else {
          dateTime += date.getUTCSeconds();
        }
        return dateTime
      },
      /**
       *
       * @param index 跑道编号
       * @param hour 数据时间
       * @param stat1 站点1
       * @param stat2 站点2
       * @param stat3 站点3
       */
      changeColor: function (index, hour, stat1, stat2, stat3) {
        var r = this.viewer.entities.getById(this.runLists[index]) // 获取跑道
        let runInfoList = this.windInfo[index]
        if (runInfoList)
          r.polyline.material = new Cesium.ImageMaterialProperty({
            image: this.drawRunWays([this.getColor(12, stat1, runInfoList), this.getColor(12, stat1, runInfoList), this.getColor(12, stat2, runInfoList), this.getColor(12, stat3, runInfoList), this.getColor(12, stat3, runInfoList)])
          })
      },
      /**
       *
       * @param hour
       * @param stat
       * @param runList
       */
      getColor: function (hour, stat, runList) {
        let value = parseInt(runList[stat]["SPD"][(hour - this.nowHour) + 7])
        if (value == null || value == undefined) {
          value = 0
        }
        let color = ""
        let textColor = ""
        if (0 <= value && value <= 5) {
          color = this.windColor[0]
          textColor = this.labelColor[0]
        } else if (5 < value && value < 17) {
          color = this.windColor[1]
          textColor = this.labelColor[1]
        } else if (value >= 17) {
          color = this.windColor[2]
          textColor = this.labelColor[2]
        }
        var s = this.viewer.entities.getById(stat) // 获取站点
        s.label.fillColor = Cesium.Color.fromCssColorString(color)    //字体颜色
        s.backColor = textColor
        s.textColor = color
        s.label.backgroundColor = Cesium.Color.fromCssColorString(textColor)   //背景颜色
        return color
      },

      closename() {
        this.isShow = this.isShow == false ? true : false

      },
      _initEcharts1() {
        var existInstance = this.$echarts.getInstanceByDom(document.getElementById('windEcharts'))
        if (existInstance == undefined) {
          var Echart = this.$echarts.init(document.getElementById('windEcharts'), "", {})
          return Echart
        }
        return existInstance
      },

      windDen(wind) {
        if (wind > 0 && wind <= 30) {
          return '30';
        } else if (wind > 30 && wind <= 60) {
          return '60';
        } else if (wind > 60 && wind <= 90) {
          return '90';
        } else if (wind > 90 && wind <= 120) {
          return '120';
        } else if (wind > 120 && wind <= 150) {
          return '150';
        } else if (wind > 150 && wind <= 180) {
          return '180';
        } else if (wind > 180 && wind <= 210) {
          return '210';
        } else if (wind > 210 && wind <= 240) {
          return '240';
        } else if (wind > 240 && wind <= 270) {
          return '270';
        } else if (wind > 270 && wind <= 300) {
          return '300';
        } else if (wind > 300 && wind <= 330) {
          return '330';
        } else if (wind > 330 && wind <= 360) {
          return '360';
        }
      },
      potail(Echarts1, id, runway) {


        let Data = {
          times: ["2019-11-04 06:00:00", "2019-11-04 07:00:00", "2019-11-04 08:00:00", "2019-11-04 09:00:00", "2019-11-04 10:00:00", "2019-11-04 11:00:00", "2019-11-04 12:00:00", "2019-11-04 13:00:00", "2019-11-04 14:00:00", "2019-11-04 15:00:00", "2019-11-04 16:00:00", "2019-11-04 17:00:00", "2019-11-04 18:00:00"],
          timeData: ["-6h", "-5h", "-4h", "-3h", "-2h", "-1h", "当前", "+1h", "+2h", "+3h", "+4h", "+5h", "+6h"],
          windxData: this.windInfo[runway][id].DIR,
          // windsData: ["2.8/2", "1.4/1", "2.7/2", "3/2", "2.2/2", "1.4/1", "1.5/1", "1.9/2", "1.4/1", "1.8/2", "2/2", "3.4/3", "3/2"],
          temData: this.windInfo[runway][id].SPD,
          //rainData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          //humData: [59, 67, 70, 74, 77, 77, 65, 63, 60, 47, 40, 36, 38],
        }
        let option = {
          backgroundColor: "transparent",
          color: 'rgba(136,136,136,1)',
          tooltip: {
            trigger: 'axis',
            axisPointer: {type: 'cross'},
            formatter: function (params, ticket, callback) {
              let index = params[0].dataIndex;
              let Htm = `${Data.times[index]}<br>
                    风速:${Data.temData[index]}m/s <br>
                    风向:${Data.windxData[index]}°`
              return Htm;
            }
          },
          grid: {
            top: 30,
            left: "5%",
            right: "5%"
          },
          xAxis: [
            {
              name: '风向',
              type: 'category',
              position: 'bottom',
              offset: 20,
              axisTick: {show: false},
              axisLine: {show: false},
              axisLabel: {
                show: true,
                textStyle: {color: 'rgba(136, 136, 136, 1)', fontSize: 14, lineHeight: 20},
                interval: 0,
                formatter: (value) => {
                  return '{' + this.windDen(value) + '| }';
                },
                rich: {
                  value: {
                    lineHeight: 16,
                    align: 'left'
                  },
                  30: {
                    height: 16,
                    width: 16,
                    align: 'left',
                    backgroundColor: {
                      image: `/images/风向箭头@2x.png`
                    }
                  },
                  60: {
                    height: 16,
                    align: 'left',
                    backgroundColor: {
                      image: `/images/风向箭头@2x-30.png`
                    }
                  },
                  90: {
                    height: 16,
                    align: 'left',
                    backgroundColor: {
                      image: `/images/风向箭头@2x-60.png`
                    }
                  },
                  120: {
                    height: 16,
                    align: 'left',
                    backgroundColor: {
                      image: `/images/风向箭头@2x-90.png`
                    }
                  },
                  150: {
                    height: 16,
                    align: 'left',
                    backgroundColor: {
                      image: `/images/风向箭头@2x-120.png`
                    }
                  },
                  180: {
                    height: 16,
                    align: 'left',
                    backgroundColor: {
                      image: `/images/风向箭头@2x-150.png`
                    }
                  },
                  210: {
                    height: 16,
                    align: 'left',
                    backgroundColor: {
                      image: `/images/风向箭头@2x-180.png`
                    }
                  },
                  240: {
                    height: 16,
                    align: 'left',
                    backgroundColor: {
                      image: `/images/风向箭头@2x-210.png`
                    }
                  },
                  270: {
                    height: 16,
                    align: 'left',
                    backgroundColor: {
                      image: `/images/风向箭头@2x-240.png`
                    }
                  },
                  300: {
                    height: 16,
                    align: 'left',
                    backgroundColor: {
                      image: `/images/风向箭头@2x-270.png`
                    }
                  },
                  330: {
                    height: 16,
                    align: 'left',
                    backgroundColor: {
                      image: `/images/风向箭头@2x-300.png`
                    }
                  },
                  360: {
                    height: 16,
                    align: 'left',
                    backgroundColor: {
                      image: `/images/风向箭头@2x-330.png`
                    }
                  }
                }
              },
              nameTextStyle: {color: 'rgba(136, 136, 136, 1)', padding: [0, 0, -38]},
              nameLocation: 'start',
              data: Data.windxData
            },
            {
              type: 'category',
              axisLine: {show: false},
            },
            {
              type: 'category',
              position: 'bottom',
              offset: 0,
              nameTextStyle: {color: "#BBBBBB"},
              axisLabel: {color: "#BBBBBB"},
              axisTick: {show: false},
              data: Data.timeData
            }
          ],
          yAxis: [{
            type: 'value',
            name: '风速(°C)',
            scale: true,
            position: 'left',
            offset: 0,
            axisTick: {show: false},
            nameTextStyle: {color: "#BBBBBB", align: "right"},
            axisLabel: {color: "#BBBBBB"},
            splitLine: {show: false}
          },
            {
              type: 'value',
              name: '(单位：m/s)',
              scale: true,
              position: 'right',
              offset: 0,
              nameTextStyle: {color: "#BBBBBB", align: "right"},
              axisLabel: {color: "#BBBBBB"},
              splitLine: {show: false}
            }
          ],
          series: [{
            name: '风速',
            type: 'line',
            step: false,
            label: {normal: {show: false, position: 'top'}},
            lineStyle: {
              color: "#fff"
            },
            itemStyle: {
              opacity: 0
            },
            smooth: true,
            data: Data.temData
          },

          ]
        };
        Echarts1.setOption(option);
        window.addEventListener("resize", function (event) {
          Echarts1.resize()
        })

      },
      windToggle(windType) {
        if (windType == "section") {
          this.activeWind = "sectionwind"
          this.$el.querySelector("#planewind").classList.remove('active')
          this.$el.querySelector("#sectionwind").classList.add('active')
          this.isLegendChange = false
          for (let i = 0; i < this.pointName.length; i++) {
            let entity = this.viewer.entities.getById(this.pointName[i]);
            entity.show = this.isLegendChange
          }
          let entity1 = this.viewer.entities.getById("wall1");
          entity1.show = !this.isLegendChange
          entity1 = this.viewer.entities.getById("wall2");
          entity1.show = !this.isLegendChange
          entity1 = this.viewer.entities.getById("wall3");
          entity1.show = !this.isLegendChange
          this.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
              116.481554, 40.013338,
              6961.9883961571
            ),
            orientation: {
              heading: Cesium.Math.toRadians(400.668148999818),
              pitch: Cesium.Math.toRadians(-30.8329210486802),
              roll: Cesium.Math.toRadians(0)
            }
          });
        } else {
          this.isLegendChange = true
          this.activeWind = "planewind"
          this.$el.querySelector("#sectionwind").classList.remove('active')
          this.$el.querySelector("#planewind").classList.add('active')
          for (let i = 0; i < this.pointName.length; i++) {
            let entity = this.viewer.entities.getById(this.pointName[i]);
            entity.show = this.isLegendChange
          }
          let entity1 = this.viewer.entities.getById("wall1");
          entity1.show = !this.isLegendChange
          entity1 = this.viewer.entities.getById("wall2");
          entity1.show = !this.isLegendChange
          entity1 = this.viewer.entities.getById("wall3");
          entity1.show = !this.isLegendChange
          this.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
              116.603738, 39.944974,
              4961.9883961571
            ),
            orientation: {
//          heading: Cesium.Math.toRadians(359.668148999818),
//          pitch: Cesium.Math.toRadians(-88.8329210486802),
//          roll: Cesium.Math.toRadians(0)
              heading: Cesium.Math.toRadians(359.668148999818),
              pitch: Cesium.Math.toRadians(-20.8329210486802),
              roll: Cesium.Math.toRadians(0)
            }
          });
        }
      },

      changeRunway(type) {
        this.runType = type
        let self = this
        this.$refs.canvas.innerHTML = ''
        request({
          url:
          "http://161.189.11.216:8090/gis/BJPEK/ModelForecast/Parabolic?dataCode=ABC&dataSet=XLONG,XLAT,hight,U,V,W&time=2019-11-01%2000:00:00&resolution=1000M&runway=" +
          type,
          method: "get"
        }).then(resp => {
          self.draw(resp.data);
        });
      },
      getSpeedIconId(speed) {
        var t = Math.round(speed, 1);
        // 计算风速图标
        var iconid = 36;
        if (speed < 0.3) {
          iconid = 0;
        } else if (speed < 2.1) {
          iconid = 2;
        } else if (speed < 4.1) {
          iconid = 4;
        } else if (speed < 6.1) {
          iconid = 6;
        } else if (speed < 8.1) {
          iconid = 8;
        } else if (speed < 10.1) {
          iconid = 10;
        } else if (speed < 12.1) {
          iconid = 12;
        } else if (speed < 14.1) {
          iconid = 14;
        } else if (speed < 16.1) {
          iconid = 16;
        } else if (speed < 20.1) {
          iconid = 20;
        } else if (speed < 24.1) {
          iconid = 24;
        } else if (speed < 28.1) {
          iconid = 28;
        } else if (speed < 32.1) {
          iconid = 32;
        } else {
          iconid = 36;
        }
        return iconid;
      },
      draw(data) {
        var finList = this.formatData(data);
        this.drawDiv(finList);
      },
      formatData(data) {
        var v = data["data"]["V"];
        var w = data["data"]["W"];
        var xlat = data["data"]["XLAT"];
        var sortList = [];

        //每行数据按纬度xlat排序
        for (let i = 0, len = xlat.length / this.height_num; i < len; i++) {
          var jList = [];
          for (let j = 0; j < this.height_num; j++) {
            if (jList.length == 0) {
              jList.push(j);
            } else if (
              xlat[i * this.height_num + j] <
              xlat[i * this.height_num + jList[jList.length - 1]]
            ) {
              jList.push(j);
            } else if (
              xlat[i * this.height_num + j] > xlat[i * this.height_num + jList[0]]
            ) {
              jList.unshift(j);
            } else {
              for (let k = 1, klen = jList.length; k < klen; k++) {
                if (
                  xlat[i * this.height_num + j] >
                  xlat[i * this.height_num + jList[k]] &&
                  xlat[i * this.height_num + j] <
                  xlat[i * this.height_num + jList[k - 1]]
                ) {
                  jList.splice(k, 0, j);
                }
              }
            }
          }
          sortList.push(jList);
        }
        //整理最后的数据[xlat,w,v,speed,speed_direction]
        var finList = [];
        for (let i = 0, len = xlat.length / this.height_num; i < len; i++) {
          var xList = [];
          for (let j = 0; j < this.height_num; j++) {
            var w1 =
              w[[i * this.height_num + sortList[i][j]]] == null
                ? 0
                : w[[i * this.height_num + sortList[i][j]]];
            var v1 = v[[i * this.height_num + sortList[i][j]]];
            var speed = Math.sqrt(w1 * w1 + v1 * v1);
            var r2d = 45.0 / Math.atan(1.0);
            var speed_dir = 0;
            if (v1 == 0 && w1 > 0) {
              speed_dir = 0;
            } else if (v1 == 0 && w1 < 0) {
              speed_dir = 180;
            } else {
              // speed_dir=Math.atan((-1*w1)/(-1/v1))*r2d
              speed_dir = Math.atan((-1 * v1) / (-1 * w1 * 10)) * r2d;
            }

            if (speed_dir < 0) {
              speed_dir = speed_dir + 360;
            }

            speed_dir += 180;
            //  if(speed_dir>360){speed_dir -= 180}
            xList.push([
              xlat[i * this.height_num + sortList[i][j]],
              w1,
              v1,
              speed,
              speed_dir,
              i
            ]);
          }
          finList.push(xList);
        }
        // console.log(xlat);
        // console.log(sortList);
        // console.log(finList);
        // console.log(JSON.stringify(finList));

        return finList;
      },
      drawDiv(finList) {
        //draw canvas
        var body = document.getElementById("body");
        var canvast = document.getElementById("canvas");
        body.removeChild(canvast);

        var canvas = document.createElement("div");
        canvas.setAttribute("id", "canvas");
        body.appendChild(canvas);

        if (finList.length < 1) {
          return;
        }
        for (let len = finList.length, j = len - 1; j >= 0; j--) {
          var div_0 = document.createElement("div");
          div_0.setAttribute(
            "style",
            "text-align:center; vertical-align: center;display:flex;"
          );
          for (let i = 0, len1 = finList[0].length; i < len1; i++) {
            var div_1 = document.createElement("div");
            div_1.setAttribute("class", "demo");
            var b_1 = document.createElement("b");

            var speed = finList[j][i][3];
            var iconid = this.getSpeedIconId(speed);
            b_1.setAttribute("class", "icon-" + iconid);
            var color = "";
            b_1.setAttribute(
              "style",
              "transform: rotate(" + Math.round(finList[j][i][4]) + "deg)" + color
            );
            div_1.appendChild(b_1);
            div_0.appendChild(div_1);
          }
          var div_sp = document.createElement("div");
          div_sp.setAttribute("class", "clear");
          canvas.appendChild(div_sp);
          canvas.appendChild(div_0);
        }
      },
      startSlider(event) {
        this.flag = true;
        this.mouseXstart = window.event.screenX;
        console.log("this.mouseXstart", this.mouseXstart);
        let mySlider = this.$refs.mySlider;
        this.initLeft = parseInt(mySlider.style.left.replace("px", ""));
      },
      startMove(event) {
        if (this.flag) {
          this.mouseX = window.event.screenX;
          console.log("this.mouseXstart", this.mouseXstart);
          console.log("this.mouseX", this.mouseX);
          this.distance = this.mouseX - this.mouseXstart;
          console.log("距离变化", this.distance);
          let mySlider = this.$refs.mySlider;

          mySlider.style.left = this.initLeft + this.distance + "px";
          console.log("鼠标结束距离", this.mouseX);
          console.log("元素左间距", mySlider.style.left);
        }
      },
      stopMove(event) {
        this.flag = false;
      }

    },
    mounted() {
      this.$el.querySelector("#planewind").classList.add('active')
      let self = this;
      request({
        url:
          "http://161.189.11.216:8090/gis/BJPEK/ModelForecast/Parabolic?dataCode=ABC&dataSet=XLONG,XLAT,hight,U,V,W&time=2019-11-01%2000:00:00&resolution=1000M&runway=runway1",
        method: "get"
      }).then(resp => {
        self.draw(resp.data);
      });
      // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(71.39628233299722, 17.90751494736041, 137.14821935043528, 49.06704603525708)
      this.viewer = new Cesium.Viewer('cesiumContainer', {
        geocoder: false,
        animation: false,
        shouldAnimate: true,
        homeButton: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        sceneModePicker: false,
        timeline: false,
        navigationHelpButton: false,
//        imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
//          url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
//          enablePickFeatures: false
//        }),
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
          url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
        })
      });
      this.viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
        url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
      }));
      //摄像机定位
      let camera = this.viewer.camera;
      camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(116.576534748692, 40.0780145185529, 500),
        orientation: {
          heading: 359.668148999818,
          pitch: -88.8329210486802,
          roll: 0.0
        }
      });
      this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      //定位北京首都机场
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          116.595534748692,
          40.0580145185529,
          21961.9883961571
        ),
        orientation: {
          heading: Cesium.Math.toRadians(359.668148999818),
          pitch: Cesium.Math.toRadians(-88.8329210486802),
          roll: Cesium.Math.toRadians(0)
        }
      });
      this.viewer._cesiumWidget._creditContainer.style.display = "none";
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZjY5ODg0MS1lZTMxLTRmMGMtOTRhYi00N2M2YjQ3ZDMzNjgiLCJpZCI6NDgwLCJpYXQiOjE1MjUyNTE1Nzh9.5Mi3ijReKCRQ_Shupv2w-wl2eJBRLOOW3Bmeq0IL5Y4'
      let val = 2;
      //加载风场
      if (val === 1) {
        this.loadNetCDF(this.urlNetCDF).then((data) => {
          this.windData = data
        })
      } else if (val === 2) {
        let time = "2019-10-31%2000:00:00";
        let level = 0

        let jsonPath = "http://161.189.11.216:8090/gis/BJPEK/ModelForecast?datacode=ABC&dataset=XLONG,XLAT,U,V&time=" + time + "&bbox=110,30,120,42&z=" + level + "&resolution=1000M";//fileOptions.dataDirectory + "wind/wind_"+time+"_L"+level+".json";
        Cesium.Resource.fetchJson({url: jsonPath}).then((resData) => {
          resData = resData.data
          let data = {};

          data.dimensions = {};
          data.dimensions.lon = 120;//dimensions['lon'].size;
          data.dimensions.lat = 120;//dimensions['lat'].size;
          data.dimensions.lev = 1;//dimensions['lev'].size;

          data.lon = {};
          data.lon.array = new Float32Array(resData.XLONG);
          data.lon.min = Math.min.apply(null, data.lon.array);//Math.min(...data.lon.array);
          data.lon.max = Math.max.apply(null, data.lon.array);//Math.max(...data.lon.array);

          data.lat = {};
          data.lat.array = new Float32Array(resData.XLAT);
          data.lat.min = Math.min.apply(null, data.lat.array);//Math.min(...data.lat.array);
          data.lat.max = Math.max.apply(null, data.lat.array);//Math.max(...data.lat.array);

          data.lev = {};
          data.lev.array = new Float32Array([1.0]);
          data.lev.min = Math.min.apply(null, data.lev.array);//Math.min(...data.lev.array);
          data.lev.max = Math.max.apply(null, data.lev.array);//Math.max(...data.lev.array);

          data.U = {};
          data.U.array = new Float32Array(resData.U);//new Float32Array(resData.U);
          data.U.min = Math.min.apply(null, data.U.array);//Math.min(...data.U.array);
          data.U.max = Math.max.apply(null, data.U.array);//Math.max(...data.U.array);

          data.V = {};
          data.V.array = new Float32Array(resData.V);//new Float32Array(resData.V);
          data.V.min = Math.min.apply(null, data.V.array);//Math.min(...data.V.array);
          data.V.max = Math.max.apply(null, data.V.array);//Math.max(...data.V.array);

          this.windData = data
          this.windData.colorTable = loadColorTable()
          let particlecount = 100
          let particleSystemOptions = {
            particlesTextureSize: particlecount,
            maxParticles: particlecount * particlecount,
            particleHeight: 100.0,
            fadeOpacity: 0.92,
            dropRate: 0.03,
            dropRateBump: 0.01,
            speedFactor: 3.0,
            lineWidth: 4
          }
          let windDataMap = this.windData
          let particleSystemOptionsMap = particleSystemOptions;
          let wind3D = new Wind3D(this.viewer, windDataMap, particleSystemOptionsMap)

          this.viewer.entities.add({
            show: this.isLegendChange,
            id: "runway1",
            name: 'Runway',
            station: 'runway1',
            polyline: { // 多线段
              positions: Cesium.Cartesian3.fromDegreesArray([116.575473, 40.10303,
                116.580113, 40.074035]), //方位
              width: 10, //折线的宽度（以像素为单位）
              material: new Cesium.ImageMaterialProperty({
                image: this.drawRunWays(["#0BD3A7", "#86C86F", "#FFBE3A", "#D8C24C", "#0BD3A7"])
              })
            }
          });
          this.viewer.entities.add({
            show: !this.isLegendChange,
            id: "wall1",
            name: 'windWall',
            type: "runway1",
            wall: {
              positions: Cesium.Cartesian3.fromDegreesArrayHeights([116.575473, 40.10303, 2100, 116.580113, 40.074035, 2100]),
              material: new Cesium.ImageMaterialProperty({
                image: "/images/windImg.png"
              }),
              outline: true,
//              outlineColor:Cesium.Color.fromCssColorString('#FF2C55'), //边框颜色
//              outlineWidth:15, //边框宽度
              minimumHeights: [100, 100],
            }
          });
          this.viewer.entities.add({
            show: this.isLegendChange,
            id: "runway2",
            name: 'Runway',
            station: 'runway2',
            polyline: { // 多线段
              positions: Cesium.Cartesian3.fromDegreesArray([116.600573, 40.089862,
                116.605809, 40.056497]), //方位
              width: 10, //折线的宽度（以像素为单位）
              material: new Cesium.ImageMaterialProperty({
                image: this.drawRunWays(["#FFBE3A", "#FFBE3A", "#FFBE3A", "#FF7C46", "#FF3752"])
              })
            }
          });
          this.viewer.entities.add({
            show: !this.isLegendChange,
            id: "wall2",
            name: 'windWall',
            type: "runway2",
            wall: {
              positions: Cesium.Cartesian3.fromDegreesArrayHeights([116.600573, 40.089862, 2100, 116.605809, 40.056497, 2100]),
              material: new Cesium.ImageMaterialProperty({
                image: "/images/windImg.png"
              }),
              outline: true,
              minimumHeights: [100, 100],
            }
          });
          this.viewer.entities.add({
            show: this.isLegendChange,
            id: "runway3",
            name: 'Runway',
            station: 'runway3',
            polyline: { // 多线段
              positions: Cesium.Cartesian3.fromDegreesArrayHeights([116.617997, 40.094787, 0,
                116.623469, 40.059059, 0]), //方位
              width: 10, //折线的宽度（以像素为单位）
              material: new Cesium.ImageMaterialProperty({
                image: this.drawRunWays(["#FFBE3A", "#15D2A3", "#42CE8E", "#A4C663", "#FEBE3B"])
              }),
              shadows: Cesium.ShadowMode.ENABLED
            }
          });
          this.viewer.entities.add({
            show: !this.isLegendChange,
            id: "wall3",
            name: 'windWall',
            type: "runway3",
            wall: {
              positions: Cesium.Cartesian3.fromDegreesArrayHeights([116.617997, 40.094787, 2100, 116.623469, 40.059059, 2100]),
              material: new Cesium.ImageMaterialProperty({
                image: "/images/windImg.png"
              }),
              outline: true,
              minimumHeights: [100, 100],
            }
          });
          this.drawPoint(" 18R ", 116.575473, 40.10303, 0)
          this.drawPoint("MID1", 116.577925, 40.088623, 0)
          this.drawPoint(" 36L ", 116.580113, 40.074035, 0)
          this.drawPoint(" 18L ", 116.600573, 40.089862, 1)
          this.drawPoint("MID2", 116.603528, 40.07174, 1)
          this.drawPoint(" 36R ", 116.605809, 40.056497, 1)
          this.drawPoint("  19  ", 116.617997, 40.094787, 2)
          this.drawPoint("MID3", 116.621128, 40.074618, 2)
          this.drawPoint("  01  ", 116.623469, 40.059059, 2)
          var handlerVideo = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
          var that = this
          /**
           * 鼠标移动事件
           */
          handlerVideo.setInputAction(function (movement) {
            that.pointHandler(movement)
          }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
          /**
           * 鼠标左键点击事件
           */
          handlerVideo.setInputAction(function (click) {
            that.wallHandler(click)
          }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
          /**
           * 相机高度监听事件
           */
          this.viewer.scene.camera.moveEnd.addEventListener(function () {
            //获取当前相机高度
            let height = Math.ceil(that.viewer.camera.positionCartographic.height);
            if(height>60000){
              for (let i = 0; i < that.pointName.length; i++) {
                let entity = that.viewer.entities.getById(that.pointName[i]);
                entity.show = false
              }
            }else{
              for (let i = 0; i < that.pointName.length; i++) {
                let entity = that.viewer.entities.getById(that.pointName[i]);
                entity.show = true
              }
            }
          })
          this.getStationInfo()

          function loadColorTable() {
            let json = {
              ncolors: 1,
              colorTable: [
                1,
                1,
                1.000000,
                0.8
              ]
            }
            let colorNum = json['ncolors']
            let colorTable = json['colorTable']
            // let colorsArray = new Float32Array(3 * colorNum)
            // for (let i = 0; i < colorNum; i++) {
            //   colorsArray[3 * i] = colorTable[3 * i]
            //   colorsArray[3 * i + 1] = colorTable[3 * i + 1]
            //   colorsArray[3 * i + 2] = colorTable[3 * i + 2]
            // }

            let channel = 4;
            let colorsArray = new Float32Array(channel * colorNum);
            for (var i = 0; i < colorNum; i++) {
              for (var j = 0; j < channel; j++) {
                colorsArray[channel * i + j] = colorTable[channel * i + j];
              }
              //colorsArray[channel * i + 1] = colorTable[channel * i + 1];
              //colorsArray[channel * i + 2] = colorTable[channel * i + 2];
            }
            let result = {}
            result.colorNum = colorNum
            result.array = colorsArray
            return result
          }

          function objToStrMap(obj) {
            let strMap = new Map();
            for (let k of Object.keys(obj)) {
              strMap.set(k, obj[k]);
            }
            return strMap;
          }
        })
      }
      ;
    },

    async loadNetCDF(filePath) {
      let _this = this
      return new Promise(function (resolve) {
        let request = new XMLHttpRequest()
        request.open('GET', filePath)
        request.responseType = 'arraybuffer'
        request.onload = function () {
          var arrayToMap = function (array) {
            return array.reduce(function (map, object) {
              map[object.name] = object
              return map
            }, {})
          }
          var NetCDF = new NetCDFReader(request.response)
          let data = {}
          var dimensions = arrayToMap(NetCDF.dimensions)
          data.dimensions = {}
          data.dimensions.lon = dimensions['lon'].size
          data.dimensions.lat = dimensions['lat'].size
          data.dimensions.lev = dimensions['lev'].size
          var variables = arrayToMap(NetCDF.variables)
          var uAttributes = arrayToMap(variables['U'].attributes)
          var vAttributes = arrayToMap(variables['V'].attributes)
          data.lon = {}
          data.lon.array = new Float32Array(NetCDF.getDataVariable('lon').flat())
          data.lon.min = Math.min(...data.lon.array)
          data.lon.max = Math.max(...data.lon.array)
          data.lat = {}
          data.lat.array = new Float32Array(NetCDF.getDataVariable('lat').flat())
          data.lat.min = Math.min(...data.lat.array)
          data.lat.max = Math.max(...data.lat.array)
          data.lev = {}
          data.lev.array = new Float32Array(NetCDF.getDataVariable('lev').flat())
          data.lev.min = Math.min(...data.lev.array)
          data.lev.max = Math.max(...data.lev.array)
          data.U = {}
          data.U.array = new Float32Array(NetCDF.getDataVariable('U').flat())
          data.U.min = uAttributes['min'].value
          data.U.max = uAttributes['max'].value
          data.V = {}
          data.V.array = new Float32Array(NetCDF.getDataVariable('V').flat())
          data.V.min = vAttributes['min'].value
          data.V.max = vAttributes['max'].value
          resolve(data)
        }
        request.send()
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

  @font-face {
    font-family: "icomoon";
    src: url("./fonts/icomoon.eot?rl3qay");
    src: url("./fonts/icomoon.eot?rl3qay#iefix") format("embedded-opentype"),
    url("./fonts/icomoon.ttf?rl3qay") format("truetype"),
    url("./fonts/icomoon.woff?rl3qay") format("woff"),
    url("./fonts/icomoon.svg?rl3qay#icomoon") format("svg");
    font-weight: normal;
    font-style: normal;
    font-display: block;
  }

  #closename {
    float: right;
    position: absolute;
    right: 1%;
    top: 3%;
  }

  #menu {
    border-radius: 3px;
    color: white;
  }

  #menu1 {
    position: absolute;
    z-index: 10;
    bottom: 43%;
    left: 1%;
    width: 6%;
    height: 4%;
    background-color: #242236;
    border-radius: 5px;
  }

  #menu11 {
    display: none;
    position: absolute;
    z-index: 10;
    bottom: 43%;
    left: 1%;
    width: 6%;
    height: 4%;
    background: rgba(227, 222, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(59, 55, 87, 1);
  }

  #menu2 {
    position: absolute;
    z-index: 10;
    bottom: 43%;
    left: 8%;
    width: 6%;
    height: 4%;
    background-color: #242236;
    border-radius: 5px;
  }

  #menu22 {
    display: none;
    position: absolute;
    z-index: 10;
    bottom: 43%;
    left: 8%;
    width: 6%;
    height: 4%;
    background: rgba(227, 222, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(59, 55, 87, 1);
  }

  .nearmenu {
    color: white;
    font-size: 14px;
    list-style: none;
    margin: 5px;
  }

  .input {
    position: absolute;
    z-index: 10;
    margin: 0;
    height: 5%;
    width: 17%;
    background-color: white;
  }

  #string {
    position: absolute;
    z-index: 10;
    width: 4px;
    height: 22px;
    background: rgba(0, 255, 71, 1);
    border-radius: 1px;
    left: 1%;
    top: 3%;
  }

  #search {
    top: 2%;
    left: 2%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 6px 19px 0px rgba(0, 0, 0, 0.12);
    border-radius: 4px;
  }

  #pointname {
    position: absolute;
    z-index: 10;
    left: 2%;
    top: 2%;
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 30px;
  }

  #search-input {
    width: 70%;
    margin-left: -12%;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(172, 172, 172, 1);
    line-height: 30px;
    pointer-events: none; /* a标签禁止点击 */
  }

  #search-icon {
    float: left;
    margin: 3px;
  }

  #date {
    top: 20%;
    text-align: left;
    margin-left: 1%;
    color: white;
    width: 10%;
    float: left;
  }

  #dateshow {
    width: 100px;
    font-size: 14px;
  }

  #back {
    bottom: 0%;
    left: 1%;
    width: 98%;
    height: 42%;
    background-color: rgba(36, 34, 54, 1);
    position: absolute;
    z-index: 10;
    box-shadow: 0px 12px 32px 1px rgba(16, 15, 23, 0.15);
    border-radius: 4px;
  }

  #rule {
    width: 100%;
    height: 2px;
    margin-top: 24px;
    border: none;
    border-top: 2px solid #555555;
  }

  #airport {
    margin-left: 2%;
    float: left;
    width: 12%;
  }

  #airporticon {
    float: left;
    width: 25%;
    height: 25%;
  }

  #airportname {
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(136, 136, 136, 1);
    line-height: 18px;
    float: left;
  }

  #airportBJ {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 22px;
    float: left;
  }

  #windspeed {
    margin-left: 1%;
    float: left;
    width: 10%;
  }

  #windspeedicon {
    float: left;
    width: 35%;
    height: 35%;
  }

  #windspeedname {
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(136, 136, 136, 1);
    line-height: 18px;
    float: left;
  }

  #windspeedBJ {
    font-size: 14px;
    font-family: DINMittelschriftStd;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 22px;
    float: left;
  }

  #winddirection {
    margin-left: 1%;
    float: left;
    width: 9%;
  }

  #winddirectionicon {
    float: left;
    width: 40%;
    height: 40%;
  }

  #winddirectionname {
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(136, 136, 136, 1);
    line-height: 18px;
    float: left;
  }

  #winddirectionBJ {
    font-size: 14px;
    font-family: DINMittelschriftStd;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 22px;
    float: left;
  }

  #airpressure {
    margin-left: 2%;
    float: left;
    width: 13%;
  }

  #airpressureicon {
    float: left;
    width: 25%;
    height: 25%;
  }

  #airpressurename {
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(136, 136, 136, 1);
    line-height: 18px;
    float: left;
  }

  #airpressureBJ {
    font-size: 14px;
    font-family: DINMittelschriftStd;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 22px;
    float: left;
  }

  #T {
    float: left;
    width: 7%;
  }

  #Ticon {
    float: left;
    width: 55%;
    height: 55%;
  }

  #Tname {
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(136, 136, 136, 1);
    line-height: 18px;
    float: left;
  }

  #TBJ {
    font-size: 14px;
    font-family: DINMittelschriftStd;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 22px;
    float: left;
  }

  #rain {
    margin-left: 3%;
    float: left;
    width: 10%;
  }

  #rainicon {
    float: left;
    width: 35%;
    height: 35%;
  }

  #rainname {
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(136, 136, 136, 1);
    line-height: 18px;
    float: left;
  }

  #rainBJ {
    font-size: 14px;
    font-family: DINMittelschriftStd;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 22px;
    float: left;
  }

  #humidity {
    margin-left: 2%;
    float: left;
    width: 8%
  }

  #humidityicon {
    float: left;
    width: 50%;
    height: 50%;
  }

  #humidityname {
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(136, 136, 136, 1);
    line-height: 18px;
    float: left;
  }

  #humidityBJ {
    font-size: 14px;
    font-family: DINMittelschriftStd;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 22px;
    float: left;
  }

  #tag {
    top: 30%;
    left: 1%;
    position: absolute;
    z-index: 12;
    width: 100%;
    height: 71%;
  }

  #Y {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(187, 187, 187, 1);
    line-height: 20px;
    float: left;
    margin-left: 1%;
  }

  #Unit {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(187, 187, 187, 1);
    line-height: 20px;
    margin-right: 4%;
    float: right;
  }

  #X {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(187, 187, 187, 1);
    line-height: 20px;
    float: left;
    margin-top: 9%;
    margin-left: -2.2%;
  }

  .closename-normal {
    transform: rotate(0deg);
  }

  .closename-inverse {
    transform: rotate(180deg);
  }

  #flat {
    display: none;
    top: 3%;
    left: 40%;
    width: 8%;
    height: 5%;
    position: absolute;
    background: rgba(5, 137, 42, 1);
    box-shadow: 0px 6px 19px 0px rgba(0, 0, 0, 0.12);
    border-radius: 4px;
  }

  #flat1 {
    display: none;
    list-style: none;
    top: 10%;
    margin-top: -3%;
    text-align: center;
    margin: 10%;
  }

  #profile {
    display: none;
    top: 3%;
    left: 49%;
    width: 8%;
    height: 5%;
    position: absolute;
    background: rgba(5, 137, 42, 1);
    -webkit-box-shadow: 0px 6px 19px 0px rgba(0, 0, 0, 0.12);
    box-shadow: 0px 6px 19px 0px rgba(0, 0, 0, 0.12);
    border-radius: 4px;
  }

  #profile1 {
    display: none;
    list-style: none;
    top: 10%;
    margin-top: -3%;
    text-align: center;
    margin: 10%;
  }

  #tone {
    position: absolute;
    z-index: 10;
    top: 3%;
    right: 3%;
    background: rgba(36, 34, 54, 1);
    box-shadow: 0px 12px 32px 1px rgba(16, 15, 23, 0.15);
    border-radius: 4px;
    width: 10%;
    height: 20%;
  }

  #tonenameback {
    float: left;
    width: 100%;
    height: 20%;
  }

  #stringR {
    width: 2%;
    height: 15%;
    position: absolute;
    background: rgba(5, 137, 42, 1);
    border-radius: 1px;
    margin-top: 3%;
  }

  #pointgroundname {
    font-size: 13px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(225, 225, 225, 1);
    line-height: 21px;
    padding: 3px;
    float: right;
    margin-right: 6%;
  }

  #ruletwo {
    width: 100%;
    height: 3px;
    margin-top: 23%;
    border: none;
    border-top: 2px solid #555555;
  }

  #small {
    width: 10%;
    height: 20%;
    position: absolute;
    float: left;
    left: 10%;
    background: rgba(11, 211, 167, 1);
    border-radius: 2px 2px 0px 0px;
    top: 30%;
  }

  #smallname {
    float: right;
    margin-right: 15%;
    margin-top: 6%;
  }

  #centre {
    width: 10%;
    height: 20%;
    position: absolute;
    float: left;
    left: 10%;
    border-radius: 2px 2px 0px 0px;
    background: rgba(255, 190, 58, 1);
    top: 50%;
  }

  #centrename {
    float: right;
    margin-right: 10%;
    margin-top: 10%;
  }

  #big {
    width: 10%;
    height: 20%;
    position: absolute;
    float: left;
    left: 10%;
    border-radius: 0px 0px 2px 2px;
    background: rgba(255, 44, 85, 1);
    top: 70%;
  }

  #bigname {
    float: right;
    margin-right: 15px;
    margin-top: 10%;
  }

  .tag {
    display: flex;
  }

  #windEcharts {
    height: 98%;
    width: 100%;
  }

  .station_hover_info {
    width: 33.33rem;
    height: 15.08rem;
    background: rgba(36, 34, 54, 1);
    box-shadow: 0rem 1rem 2.67rem 0.08rem rgba(16, 15, 23, 0.15);
    border-radius: 0.33rem;
    position: absolute;
    top: 12.08rem;
    left: 8.25rem;
    z-index: 9999;
    display: flex;
    flex-direction: column;
  }

  .station_hover_header {
    height: 3.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .station_hover_line {
    height: 0.17rem;
    background-color: #45416F;
  }

  .station_hover_container {
    flex-grow: 1;
    display: flex;
    flex-wrap: wrap;

  }

  .station_hover_container div {
    min-width: 40%;
    /*min-height: 33.33333%;*/
    flex-shrink: 1;
    margin-left: 1rem;
    display: flex;
    align-items: center;
  }

  .station_hover_container div span:nth-child(odd) {
    font-size: 1.25rem;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 800;
    color: rgba(170, 170, 170, 1);
    line-height: 1.75rem;
    text-align: left;
  }

  .station_hover_container div span:nth-child(even) {
    font-size: 1.25rem;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 800;
    color: rgba(255, 255, 255, 1);
    line-height: 1.75rem;
    text-align: left;
  }

  .station_hover_footer {
    height: 3.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start
  }

  .header_icon {
    width: 0.33rem;
    height: 1.33rem;
    background: rgba(0, 255, 71, 1);
    border-radius: 0.08rem;
    margin-left: 1rem;
  }

  .header_title {
    width: 3.83rem;
    height: 2.33rem;
    font-size: 1.67rem;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 2.34rem;
    margin-left: 0.5rem;
  }

  .footer_time {
    width: 18.5rem;
    height: 1.42rem;
    font-size: 1rem;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(170, 170, 170, 1);
    line-height: 1.42rem;
    margin-left: 1rem;
    text-align: left;
  }

  .reverseenteractive {
    animation: bounce-in 0.5s forwards;
  }

  .reverseleaveactive {
    animation: bounce-out 0.5s forwards;
  }

  @keyframes bounce-in {
    0% {
      transform: rotate(0);
    }
    50% {
      transform: rotate(90deg);
    }
    100% {
      transform: rotate(180deg);
    }
  }

  @keyframes bounce-out {
    0% {
      transform: rotate(180deg);
    }
    50% {
      transform: rotate(90deg);
    }
    100% {
      transform: rotate(0);
    }
  }

  .move_in1 {
    -webkit-animation: move1 0.5s linear 1;
    -moz-animation: move1 0.5s linear 1;
    -ms-animation: move1 0.5s linear 1;
    -o-animation: move1 0.5s linear 1;
    animation: move1 0.5s linear 1;
    -webkit-animation-fill-mode: forwards;
    -moz-animation-fill-mode: forwards;
    -ms-animation-fill-mode: forwards;
    -o-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
  }

  .move_out1 {
    -webkit-animation: moveOut1 0.5s linear 1;
    -moz-animation: moveOut1 0.5s linear 1;
    -ms-animation: moveOut1 0.5s linear 1;
    -o-animation: moveOut1 0.5s linear 1;
    animation: moveOut1 0.5s linear 1;
    -webkit-animation-fill-mode: forwards;
    -moz-animation-fill-mode: forwards;
    -ms-animation-fill-mode: forwards;
    -o-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
  }

  @keyframes move1 {
    from {
      bottom: -28%;
    }
    to {
      bottom: 0px;
    }
  }

  @keyframes moveOut1 {
    from {
      bottom: 0%;
    }
    to {
      bottom: -28%;
    }
  }
  .move_in2 {
    -webkit-animation: move2 0.5s linear 1;
    -moz-animation: move2 0.5s linear 1;
    -ms-animation: move2 0.5s linear 1;
    -o-animation: move2 0.5s linear 1;
    animation: move2 0.5s linear 1;
    -webkit-animation-fill-mode: forwards;
    -moz-animation-fill-mode: forwards;
    -ms-animation-fill-mode: forwards;
    -o-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
  }

  .move_out2 {
    -webkit-animation: moveOut2 0.5s linear 1;
    -moz-animation: moveOut2 0.5s linear 1;
    -ms-animation: moveOut2 0.5s linear 1;
    -o-animation: moveOut2 0.5s linear 1;
    animation: moveOut2 0.5s linear 1;
    -webkit-animation-fill-mode: forwards;
    -moz-animation-fill-mode: forwards;
    -ms-animation-fill-mode: forwards;
    -o-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
  }

  @keyframes move2 {
    from {
      bottom: 43%;
    }
    to {
      bottom: 15%;
    }
  }

  @keyframes moveOut2 {
    from {
      bottom: 15%;
    }
    to {
      bottom: 43%;
    }
  }
  /* 测试 */
  .slide-fade-enter-active {
    transition: all .3s ease;
  }

  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  /* 测试 */
  .wind {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    .search {
      position: absolute;
      top: 5%;
      left: 3rem;
      width: 25.6rem;
      height: 4rem;
      z-index: 999;
    }
    .wind_header {
      display: flex;
      justify-content: center;
      position: absolute;
      top: 5%;

      // .el-input {
      //   width: 256px;
      // }
      .el-button {
        font-size: 15px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 21px;
        padding: 9px 6px 10px 12px;
        background-color: #006426;
        &.active {
          background-color: #05892a
        }
      }
      .button_color {
        background-color: #05892a;
      }
      .pic_icon {
        width: 256px;
      }

    }
    .wind_content {
      position: absolute;
      top: 20%;
      background: #242236;
      .wind_header_icon {
        display: flex;
        span {
          line-height: 40px;
          font-size: 15px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(0, 255, 71, 1);
          line-height: 21px;
          text-shadow: 0px 5px 5px rgba(36, 34, 54, 0.14);
          text-decoration: underline;
        }
      }
      #canvas {
        overflow: scroll;
        width: 100%;
        height: 52vh;
      }
      .demo {
        b {
          display: block;
          width: 35px;
          height: 35px;
        }
        margin-right: 5px;
      }
      [class^="icon-"],
      [class*=" icon-"] {
        /* use !important to prevent issues with browser extensions that change fonts */
        font-family: "icomoon" !important;
        font-style: normal;
        font-weight: normal;
        font-variant: normal;
        text-transform: none;
        line-height: 1;

        /* Better Font Rendering =========== */
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

        font-size: 25px;
      }

      .icon-0:before {
        content: "\e900";
        color: #1200a9;
        font-size: 10px;
        position: relative;
        top: 0px;
      }
      .icon-2:before {
        content: "\e901";
        color: #1739e7;
        position: relative;
        top: 5px;
      }
      .icon-4:before {
        content: "\e902";
        color: #1266e8;
        position: relative;
        top: 5px;
      }
      .icon-6:before {
        content: "\e903";
        color: #00dae3;
        position: relative;
        top: 5px;
      }
      .icon-8:before {
        content: "\e904";
        color: #00e5cb;
        position: relative;
        top: 5px;
      }
      .icon-10:before {
        content: "\e905";
        color: #02e7af;
        position: relative;
        top: 5px;
      }
      .icon-12:before {
        content: "\e906";
        color: #1ee77e;
        position: relative;
        top: 5px;
      }
      .icon-14:before {
        content: "\e907";
        color: #3be84d;
        position: relative;
        top: 5px;
      }
      .icon-16:before {
        content: "\e908";
        color: #61e80b;
      }
      .icon-20:before {
        content: "\e909";
        color: #8ce800;
        position: relative;
        top: 5px;
      }
      .icon-24:before {
        content: "\e90a";
        color: #c2e800;
        position: relative;
        top: 5px;
      }
      .icon-28:before {
        content: "\e90b";
        color: #e5d600;
        position: relative;
        top: 5px;
      }
      .icon-32:before {
        content: "\e90c";
        color: #e6b000;
        position: relative;
        top: 5px;
      }
      .icon-36:before {
        content: "\e90d";
        color: #e62408;
        position: relative;
        top: 5px;
      }

      .clear {
        clear: both;
      }

      .hidden {
        /* display:none; */
        width: 20px;
        height: 30px;
      }
    }
    .wind_footer {
      .wind_footer_header {
        text-align: left;
        margin-bottom: 8px;
        .select_color {
          background: #242236 !important;
          color: rgba(255, 255, 255, 1) !important;
        }
        /deep/ .el-button {
          width: 80px !important;
          height: 28px !important;
          background: rgba(227, 222, 255, 1);
          border-radius: 4px;
          width: 37px;
          height: 20px;
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          line-height: 5px;
        }
      }
      .wind_footer_body {
        padding: 10px 0 17px 16px;
        background: #242236;
        .title {
          display: flex;
          font-size: 22px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          line-height: 30px;
          .title_icon {
            width: 4px;
            height: 20px;
            background: rgba(0, 255, 71, 1);
            border-radius: 1px;
            margin-top: 5px;
            margin-right: 5px;
          }
        }

        .progress_bar {
          box-shadow: 0 0 2px 0 #ff242236;
          display: inline-block;
          user-select: none;
          list-style: none;
          display: inline-block;
          vertical-align: top;
          font-size: 0;
          padding: 0;
          margin: 0;
          width: 100%;
          li {
            padding: 0 4px;
            background: #242236;
            vertical-align: top;
            display: inline-block;
            font-size: 14px;
            font-family: DINMittelschriftStd;
            color: rgba(187, 187, 187, 1);
            height: 28px;
            line-height: 28px;
            cursor: pointer;
            box-sizing: border-box;
            margin: 0;
            width: 7.69%;
            text-align: left;
          }
          li:last-child {
            width: 21px;
          }
        }
        .pentagon {
          margin-top: 14px;
          position: relative;
          width: 12px;
          border-width: 12px 0px 0;
          border-style: solid;
          border-color: #fff2f2f2 transparent;
        }
        .pentagon:before {
          content: "";
          position: absolute;
          height: 0;
          width: 0;
          top: -18px;
          left: 0px;
          border-width: 0px 6px 6px;
          border-style: solid;
          border-color: transparent transparent #fff2f2f2;
        }
      }
      position: absolute;
      bottom: 20px;
      left: 20px;
      right: 20px;
    }
  }

</style>


