<template>
  <div class="wind">
    <el-input class="search" v-model="searchInput" placeholder="输入查询机场名称或拼音">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
     <el-slider
      v-model="heightLevel"
      :min="0"
      :max="15"
      :step="1"
      :show-tooltip="true"
      @change="changeHeightLevel"
      :format-tooltip="showHeightLevelToolTip"
      vertical
      class="windheightcontroller">
      >
    </el-slider>
     

    <div id="cesiumContainer"></div>

    <!---->
    <div
      class="station_hover_info"
      id="hover_info"
      v-if="activeWind=='planewind'"
      v-show="isHoverShow"
    >
      <div class="station_hover_header">
        <div class="header_icon"></div>
        <div class="header_title">{{stationname}}</div>
      </div>
      <div class="station_hover_line"></div>
      <div class="station_hover_container">
        <div>
          <span>地面风速：</span>
          <span>{{parseFloat(info.SPD).toFixed(2)}}m/s</span>
        </div>
        <div>
          <span>一小时降水量：</span>
          <span>{{parseFloat(info.RAIN).toFixed(1)}}mm</span>
        </div>
        <div>
          <span>地面风向：</span>
          <span>{{parseInt(info.DIR)}}°</span>
        </div>
        <div>
          <span>相对湿度：</span>
          <span>{{parseInt(info.RH)}}%</span>
        </div>
        <div>
          <span>温度：</span>
          <span>{{parseInt(info.T - 272.15)}}℃</span>
        </div>
        <div>
          <span>修正海平面气压：</span>
          <span>{{parseInt(info.SLP)}}hPa</span>
        </div>
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
      </div>-->

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

      <div class>
        <div id="back" :class="{move_in1:isShow,move_out1:!isShow}">
          <div style="text-align:left;">
            <a id="string"></a>
            <a id="pointname">{{stationname}}</a>
          </div>
          <div
            id="closename"
            v-bind:class="{reverseenteractive : !isShow, reverseleaveactive : isShow}"
          >
            <img src="../../../public/images/icon_xiangxia@2x.png" @click="closename()" />
          </div>

          <hr id="rule" />

          <div id="date">
            <span id="dateshow">2019.11.04 星期一 12:00:00</span>
          </div>

          <div id="airport">
            <img src="../../../public/images/icon_jichang@2x.png" id="airporticon" />
            <div id="airname" class="menunamelong">
              <a id="airportname">机场名称</a>
              <a id="airportBJ">北京首都机场</a>
            </div>
          </div>

          <div id="windspeed">
            <img src="../../../public/images/icon_fengsu@2x.png" id="windspeedicon" />
            <div class="menunameshort">
              <a id="windspeedname">地面风速</a>
              <a id="windspeedBJ">{{parseFloat(info.SPD).toFixed(2)}}m/s</a>
            </div>
          </div>

          <div id="winddirection">
            <img src="../../../public/images/icon_fengxiang@2x.png" id="winddirectionicon" />
            <div class="menunameshort">
              <a id="winddirectionname">地面风向</a>
              <a id="winddirectionBJ">{{parseInt(info.DIR)}}°</a>
            </div>
          </div>

          <div id="airpressure">
            <img src="../../../public/images/icon_qiya@2x.png" id="airpressureicon" />
            <div class="menunamelong" @click="pressure()">
              <a id="airpressurename">修正海平面气压</a>
              <a id="airpressureBJ">{{parseInt(info.SLP)}}hPa</a>
            </div>
          </div>

          <div id="T">
            <img src="../../../public/images/icon_wendu@2x.png" id="Ticon" />
            <div class="menunameT">
              <a id="Tname">温度</a>
              <br />
              <a id="TBJ">{{parseInt(info.T - 272.15)}}℃</a>
            </div>
          </div>

          <div id="rain">
            <img src="../../../public/images/icon_jiangyu@2x.png" id="rainicon" />
            <div class="menunamelong">
              <a id="rainname">一小时降水量</a>
              <a id="rainBJ">{{parseFloat(info.RAIN).toFixed(1)}}mm</a>
            </div>
          </div>

          <div id="humidity">
            <img src="../../../public/images/icon_shidu@2x.png" id="humidityicon" />
            <div class="menunameshort">
              <a id="humidityname">相对湿度</a>
              <a id="humidityBJ">{{parseInt(info.RH)}}%</a>
            </div>
          </div>
          <div id="tag" v-show="isShow">
            <div id="windEcharts" style="width: 100%;height:100%;"></div>
          </div>
        </div>
      </div>

      <div id="tone">
        <div id="tonenameback">
          <a id="stringR"></a>
          <a id="pointgroundname">机场跑道地面风速</a>
        </div>
        <hr id="ruletwo" />
        <div>
          <a id="small"></a>
          <a id="smallname">正常 0-5 m/s</a>
          <br />
          <a id="centre"></a>
          <a id="centrename">轻度 5-17 m/s</a>
          <br />
          <a id="big"></a>
          <a id="bigname">严重 ≧17 m/s</a>
          <br />
        </div>
      </div>
    </div>

    <article class="wind_header">
      <div class="wind_header_btn">
        <el-button id="planewind" type="primary" @click="windToggle('plane')">平面风展示</el-button>
        <el-button id="sectionwind" type="primary" @click="windToggle('section')">剖面风展示</el-button>
      </div>
      <div v-if="activeWind=='sectionwind' && sectionwindDetail" class="wind_header_icon">
        <img v-if="!isDetail" src="../../assets/images/profileIcon.png" />
        <span @click="detail(true)" v-if="!isDetail">详细</span>
        <img v-if="isDetail" src="../../assets/images/reduction.png" />
        <span @click="detail(false)" v-if="isDetail">还原</span>
      </div>
    </article>
    <div class="shadow" v-show="activeWind=='sectionwind' && sectionwindDetail">
      <article v-show="activeWind=='sectionwind' && sectionwindDetail" class="wind_content">
        <div class="myScroll_btn_div">
          <div class="myScroll_btn el-icon-arrow-left" @click="moveMyScroll('left')">
          </div>
          <div class="myScroll_btn el-icon-arrow-right" @click="moveMyScroll('right')">
          </div>
        </div>
        <div ref="height_dom" class="height_font">
          (高度：m)
          <div class="close-button" @click="closeWindow">
            <i class="el-icon-close"></i>
          </div>
          <div class="height_value">
            <div>2000</div>
            <div></div>
            <div></div>
            <div>1500</div>
            <div></div>
            <div></div>
            <div></div>
            <div>1000</div>
            <div></div>
            <div></div>
            <div></div>
            <div>500</div>
            <div></div>
            <div></div>
            <div></div>
            <div>0</div>
          </div>
        </div>
        <el-scrollbar class="scroll_parent" :native="false" :noresize="false" ref="myScrollbar">
          <!-- <GeminiScrollbar ref="mycom" class="scroll_parent"> -->
          <div id="body">
            <div ref="canvas" id="canvas" class="canvas" v-show="isLegendChange"></div>
          </div>
        </el-scrollbar>
        <!-- </GeminiScrollbar> -->
        <!-- <div class="scroll_parent">
           <div id="body">
              <div ref="canvas" id="canvas" class="canvas" v-show="isLegendChange"></div>
            </div>
        </div>-->
        <div class="unit">
          <span class="length_font">(长度:KM)</span>
        </div>
      </article>
      <!--</transition>-->

      <article
        v-if="activeWind=='sectionwind' && sectionwindDetail"
        class="wind_footer"
        ref="wind_footer"
      >
        <div class="wind_footer_header">
          <el-button
            :class="{ 'select_color': runType=='runway1' }"
            @click="changeRunway('runway1')"
          >跑道1</el-button>
          <el-button
            :class="{ 'select_color': runType=='runway2' }"
            @click="changeRunway('runway2')"
          >跑道2</el-button>
          <el-button
            :class="{ 'select_color': runType=='runway3' }"
            @click="changeRunway('runway3')"
          >跑道3</el-button>
        </div>
        <div class="wind_footer_body">
          <div class="title">
            <div class="title_icon"></div>
            <span>跑道一</span>
          </div>
          <div class="progress_bar_div">
            <ul class="progress_bar">
              <li>
                <span>0h</span>
              </li>
              <li>
                <span class="span_normal">2h</span>
              </li>
              <li>
                <span class="span_normal">4h</span>
              </li>
              <li>
                <span class="span_normal">6h</span>
              </li>
              <li>
                <span class="span_normal">8h</span>
              </li>
              <li>
                <span class="span_normal">10h</span>
              </li>
              <li>
                <span class="span_normal">12h</span>
              </li>
              <li>
                <span class="span_normal">14h</span>
              </li>
              <li>
                <span class="span_normal">16h</span>
              </li>
              <li>
                <span class="span_normal">18h</span>
              </li>
              <li>
                <span class="span_normal">20h</span>
              </li>
              <li>
                <span class="span_normal">22h</span>
                <span class="span_last">24h</span>
              </li>
            </ul>
          </div>
          <el-slider 
            @input="changeTime"
            v-model="runwayTime"
            :step="100/24"
            @change="changeTimeToPic"
            :format-tooltip="getTime"
          ></el-slider>
        </div>
      </article>
    </div>
  </div>
</template>
<script>
import Cesium from "cesium/Cesium";
import ElementUI from "element-ui";
import widgets from "cesium/Widgets/widgets.css";
import colorTable from "@/components/wind/colorTable.js";
import Wind3D from "@/components/wind/wind3D.js";
import sectionwind from "./sectionwind";
import data from "@/assets/data/j1.json";
import request from "@/utils/request1";
import windImgUrl from "../../assets/images/windImg.png";
import windImgUrl1 from "../../assets/images/wind1.png";
import windImgUrl2 from "../../assets/images/wind2.png";
import windImgUrl3 from "../../assets/images/wind3.png";
import windImgUrl4 from "../../assets/images/wind4.png";
import windImgUrl5 from "../../assets/images/wind5.png";
import windImgUrl6 from "../../assets/images/wind6.png";
import windImgUrl7 from "../../assets/images/wind7.png";
import windImgUrl8 from "../../assets/images/wind8.png";
import windImgUrl9 from "../../assets/images/wind9.png";
import windImgUrl10 from "../../assets/images/wind10.png";
import windImgUrl11 from "../../assets/images/wind11.png";
import windImgUrl12 from "../../assets/images/wind12.png";
import ColorImage from '@/components/wind/ColorImage'
// import config from "../../../vue.config.js"
export default {
  name: "cesiumContainer",
  data() {
    return {
      wind3D:null,
      colorImage:null,
      gradientWind: {
      '1.0': 'rgb(255,255,0)',
      '0.9': 'rgb(0,255,0)',
      '0.8': 'rgb(0,255,88)',
      '0.7': 'rgb(0,255,178)',
      '0.6': 'rgb(0,255,255)',
      '0.3': 'rgb(0,178,255)',
      '0.0': 'rgb(0,0,255)'
      },
      isDetail: false,
      data: Object,
      ops: {
        vuescroll: {},
        scrollPanel: {},
        rail: {
          background: "#01a99a",
          opacity: 0,
          size: "6px",
          specifyBorderRadius: false,
          gutterOfEnds: null,
          gutterOfSide: "2px",
          keepShow: false
        },
        bar: {}
      },
      colorTable: {
        type: Object,
        default: () => {
          return colorTable;
        }
      },
      particleSystemOptions: {
        type: Object,
        default: function() {
          return {
            particlesTextureSize: 128,
            maxParticles: 128 * 128,
            particleHeight: 100.0,
            fadeOpacity: 0.996,
            dropRate: 0.003,
            dropRateBump: 0.01,
            speedFactor: 4.0,
            lineWidth: 4.0
          };
        }
      },
      searchInput: "",
      mySliderLeft: 0,
      mouseX: 0,
      mouseXstart: 0,
      flag: false,
      height_num: 35,
      initLeft: 0,
      runType: "runway1",
      activeWind: "planewind",
      sliderTime: new Date(new Date().toLocaleDateString()),
      runwayTime: 1,
      heightLevel: 0,
      isShow: false,
      isHoverShow: false, //悬浮数据框显示控制
      windInfo: [], // 风数据,按高度获取
      otherInfo: [], // 其他数据,只有地面2米数据
      nowHour: 12, // 当前时间
      showHour: 12, // 数据展示时间
      isLegendChange: true,
      pointName: [
        "18L",
        "MID1",
        "36R",
        "18R",
        "MID2",
        "36L",
        "19",
        "MID3",
        "01"
      ], //九站点名
      infoType: ["DIR", "SPD", "SLP", "RAIN", "RH", "T"], // 展示数据类型
      windColor: ["#0BD3A7", "#FFBE3A", "#FF2C55"], //跑道色值
      labelColor: ["#DDFBF5", "#FFF1D4", "#FFD8DF"], //站点框色值
      runLists: ["runway1", "runway2", "runway3"], //跑道
      infoTime: "", // 当前展示数据时间
      stationname: "ZBAA",
      info: {
        DIR: "0",
        SPD: "0",
        SLP: "0",
        RAIN: "0",
        RH: "0",
        T: "0"
      },
      searchTime: "",
      sectionwindDetail: false
    };
  },
  methods: {
          drawWindHeatLayer(data) { // 绘制风场热力图
      // if(this.overlayer != Overlayers.wind)
      //   return;

      // var that = this
      var points = []
      var max = 0
      var width = 1000
      var height = 1000

      var longdata = data.lon.array
      var latdata = data.lat.array
      var udata = data.U.array
      var vdata = data.V.array

      var minLat = data.lat.min
      var minLong = data.lon.min
      var maxLat = data.lat.max
      var maxLong = data.lon.max
      var minSpeed = 1000000
      var maxSpeed = 0
      var max = 0
      var speeds = []
      for (var i = 0; i < data.lat.array.length; i++) {
        var speed = Math.sqrt(udata[i] * udata[i] + vdata[i] * vdata[i])
        speeds.push(speed);
        minSpeed = Math.min(minSpeed, speed);
        maxSpeed = Math.max(maxSpeed, speed);
      }
      // minSpeed = 0;
      // maxSpeed = 100;
      for (var i = 0; i < data.lat.array.length; i++) {
        // var speed = Math.sqrt(udata[i]*udata[i]+vdata[i]*vdata[i]);
        var value = (speeds[i] - minSpeed) * (1 / (maxSpeed - minSpeed))
        max = Math.max(max, value)
        var point = {
          x: (longdata[i] - minLong) * (1000 / (maxLong - minLong)),
          y: (maxLat - latdata[i]) * (1000 / (maxLat - minLat)),
          value: value
        }
        points.push(point)
      }
      // max = 4;
      var coordinate3 = [minLong, minLat, maxLong, maxLat]

      if (this.colorImage) {
        this.colorImage.redraw(this.viewer, coordinate3, max, points, this.gradientWind)
      }
      else {
        this.colorImage = new ColorImage(this.viewer, coordinate3, max, points, this.gradientWind)
      }
    },
    loadwind(time,level){
      // this.viewer.scene.primitives.clear()
      this.viewer.scene.primitives.show = false;
      // this.viewer.scene.primitives.removeAll();
      if(this.wind3D)
      {
         this.wind3D.removeWindPrimitives()
         this.wind3D.colorImage=null

      }
     
      let jsonPath =
        "http://161.189.11.216:8090/gis/BJPEK/ModelForecast?datacode=ABC&dataset=XLONG,XLAT,U,V&time=" +
        time +
        "&bbox=110,30,120,42&z=" +
        level +
        "&resolution=1000M"; //fileOptions.dataDirectory + "wind/wind_"+time+"_L"+level+".json";
      Cesium.Resource.fetchJson({ url: jsonPath }).then(resData => {
        resData = resData.data;
        let data = {};

        data.dimensions = {};
        data.dimensions.lon = 120; //dimensions['lon'].size;
        data.dimensions.lat = 120; //dimensions['lat'].size;
        data.dimensions.lev = 1; //dimensions['lev'].size;

        data.lon = {};
        data.lon.array = new Float32Array(resData.XLONG);
        data.lon.min = Math.min.apply(null, data.lon.array); //Math.min(...data.lon.array);
        data.lon.max = Math.max.apply(null, data.lon.array); //Math.max(...data.lon.array);

        data.lat = {};
        data.lat.array = new Float32Array(resData.XLAT);
        data.lat.min = Math.min.apply(null, data.lat.array); //Math.min(...data.lat.array);
        data.lat.max = Math.max.apply(null, data.lat.array); //Math.max(...data.lat.array);

        data.lev = {};
        data.lev.array = new Float32Array([1.0]);
        data.lev.min = Math.min.apply(null, data.lev.array); //Math.min(...data.lev.array);
        data.lev.max = Math.max.apply(null, data.lev.array); //Math.max(...data.lev.array);

        data.U = {};
        data.U.array = new Float32Array(resData.U); //new Float32Array(resData.U);
        data.U.min = Math.min.apply(null, data.U.array); //Math.min(...data.U.array);
        data.U.max = Math.max.apply(null, data.U.array); //Math.max(...data.U.array);

        data.V = {};
        data.V.array = new Float32Array(resData.V); //new Float32Array(resData.V);
        data.V.min = Math.min.apply(null, data.V.array); //Math.min(...data.V.array);
        data.V.max = Math.max.apply(null, data.V.array); //Math.max(...data.V.array);

        this.windData = data;
        this.windData.colorTable = loadColorTable();
        let particlecount = 100;
        let particleSystemOptions = {
          particlesTextureSize: particlecount,
          maxParticles: particlecount * particlecount,
          particleHeight: 100.0,
          fadeOpacity: 0.92,
          dropRate: 0.03,
          dropRateBump: 0.01,
          speedFactor: 3.0,
          lineWidth: 4
        };
        let windDataMap = this.windData;
        let particleSystemOptionsMap = particleSystemOptions;
        this.wind3D = new Wind3D(
          this.viewer,
          windDataMap,
          particleSystemOptionsMap
        );
       this.drawWindHeatLayer(windDataMap)
       this.viewer.entities.add({
          show: this.isLegendChange,
          id: "runway1",
          name: "Runway",
          station: "runway1",
          polyline: {
            // 多线段
            positions: Cesium.Cartesian3.fromDegreesArray([
              116.575473,
              40.10303,
              116.580113,
              40.074035
            ]), //方位
            width: 10, //折线的宽度（以像素为单位）
            material: new Cesium.ImageMaterialProperty({
              image: this.drawRunWays([
                "#0BD3A7",
                "#86C86F",
                "#FFBE3A",
                "#D8C24C",
                "#0BD3A7"
              ])
            })
          }
        });
        this.viewer.entities.add({
          show: !this.isLegendChange,
          id: "wall1",
          name: "windWall",
          type: "runway1",
          wall: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
              116.575473,
              40.10303,
              2100,
              116.580113,
              40.074035,
              2100
            ]),
            material: new Cesium.ImageMaterialProperty({
              image: windImgUrl
            }),
            outline: true,
            //              outlineColor:Cesium.Color.fromCssColorString('#FF2C55'), //边框颜色
            //              outlineWidth:15, //边框宽度
            minimumHeights: [100, 100]
          }
        });
        this.viewer.entities.add({
          show: this.isLegendChange,
          id: "runway2",
          name: "Runway",
          station: "runway2",
          polyline: {
            // 多线段
            positions: Cesium.Cartesian3.fromDegreesArray([
              116.600573,
              40.089862,
              116.605809,
              40.056497
            ]), //方位
            width: 10, //折线的宽度（以像素为单位）
            material: new Cesium.ImageMaterialProperty({
              image: this.drawRunWays([
                "#FFBE3A",
                "#FFBE3A",
                "#FFBE3A",
                "#FF7C46",
                "#FF3752"
              ])
            })
          }
        });
        this.viewer.entities.add({
          show: !this.isLegendChange,
          id: "wall2",
          name: "windWall",
          type: "runway2",
          wall: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
              116.600573,
              40.089862,
              2100,
              116.605809,
              40.056497,
              2100
            ]),
            material: new Cesium.ImageMaterialProperty({
              image: windImgUrl
            }),
            outline: true,
            minimumHeights: [100, 100]
          }
        });
        this.viewer.entities.add({
          show: this.isLegendChange,
          id: "runway3",
          name: "Runway",
          station: "runway3",
          polyline: {
            // 多线段
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
              116.617997,
              40.094787,
              0,
              116.623469,
              40.059059,
              0
            ]), //方位
            width: 10, //折线的宽度（以像素为单位）
            material: new Cesium.ImageMaterialProperty({
              image: this.drawRunWays([
                "#FFBE3A",
                "#15D2A3",
                "#42CE8E",
                "#A4C663",
                "#FEBE3B"
              ])
            }),
            shadows: Cesium.ShadowMode.ENABLED
          }
        });


        this.viewer.entities.add({
          show: !this.isLegendChange,
          id: "wall3",
          name: "windWall",
          type: "runway3",
          wall: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
              116.617997,
              40.094787,
              2100,
              116.623469,
              40.059059,
              2100
            ]),
            material: new Cesium.ImageMaterialProperty({
              image: windImgUrl
            }),
            outline: true,
            minimumHeights: [100, 100]
          }
        });

        // this.viewer.entities.add({
        //     id:'SDJCoutline',
        //     name : 'SDJCoutline',
        //     position: Cesium.Cartesian3.fromDegrees( 116.600573,40.089862,0),
        //     box : {
        //         dimensions : new Cesium.Cartesian3(10000.0, 10000.0, 10000.0),
        //         fill : Cesium.Color.RED.withAlpha(0.2),
        //         outline : true,
        //         outlineColor : Cesium.Color.RED
        //     }
        // });

        // this.viewer.entities.add({
        //     id:'SDJCoutline',
        //     name : 'SDJCoutline',
        //     polygon : {
        //         hierarchy : Cesium.Cartesian3.fromDegreesArray([116.55550573,40.020862,
        //                                                         116.645573, 40.020862,
        //                                                         116.645573, 40.129862,
        //                                                         116.55550573, 40.129862]),
        //         extrudedHeight: 5000,
        //         // material : Cesium.Color.RED.withAlpha(0.05),
        //         fill : false,
        //         outline : true,
        //         outlineColor : Cesium.Color.RED.withAlpha(0.8),
        //     }
        // });

        this.drawPoint(" 18R ", 116.575473, 40.10303, 0);
        this.drawPoint("MID1", 116.577925, 40.088623, 0);
        this.drawPoint(" 36L ", 116.580113, 40.074035, 0);
        this.drawPoint(" 18L ", 116.600573, 40.089862, 1);
        this.drawPoint("MID2", 116.603528, 40.07174, 1);
        this.drawPoint(" 36R ", 116.605809, 40.056497, 1);
        this.drawPoint("  19  ", 116.617997, 40.094787, 2);
        this.drawPoint("MID3", 116.621128, 40.074618, 2);
        this.drawPoint("  01  ", 116.623469, 40.059059, 2);
        var handlerVideo = new Cesium.ScreenSpaceEventHandler(
          this.viewer.scene.canvas
        );
        var that = this;
        /**
         * 鼠标移动事件
         */
        handlerVideo.setInputAction(function(movement) {
          that.pointHandler(movement);
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        /**
         * 鼠标左键点击事件
         */
        handlerVideo.setInputAction(function(click) {
          that.wallHandler(click);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        /**
         * 相机高度监听事件
         */
        this.viewer.scene.camera.moveEnd.addEventListener(function() {
          //获取当前相机高度
          let height = Math.ceil(
            that.viewer.camera.positionCartographic.height
          );
          if (height > 60000) {
            for (let i = 0; i < that.pointName.length; i++) {
              let entity = that.viewer.entities.getById(that.pointName[i]);
              entity.show = false;
            }
          } else {
            for (let i = 0; i < that.pointName.length; i++) {
              let entity = that.viewer.entities.getById(that.pointName[i]);
              entity.show = true;
            }
          }
        });
        this.getStationInfo();
       function loadColorTable() {
          let json = {
            ncolors: 1,
            colorTable: [1, 1, 1.0, 0.8]
          };
          let colorNum = json["ncolors"];
          let colorTable = json["colorTable"];
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
          let result = {};
          result.colorNum = colorNum;
          result.array = colorsArray;
          return result;
        }

        function objToStrMap(obj) {
          let strMap = new Map();
          for (let k of Object.keys(obj)) {
            strMap.set(k, obj[k]);
          }
          return strMap;
        }
      });

      
    },
    changeHeightLevel(time,level) {
      let time2 = "2019-11-13%2000:00:00";
      this.loadwind(time2,this.heightLevel)
    },
    showHeightLevelToolTip(value) {
      let tip=""
      if (value===0) {
        tip='地面'
      }else if(value===1){
        tip='30米'
      }else if(value===2){
        tip='50米'
      }else if(value===3){
        tip='100米'
      }else if(value===4){
        tip='150米'
      }else if(value===5){
        tip='200米'
      }else if(value===6){
        tip='250米'
      }else if(value===7){
        tip='300米'
      }else if(value===8){
        tip='400米'
      }else if(value===9){
        tip='500米'
      }else if(value===10){
        tip='600米'
      }else if(value===11){
        tip='900米'
      }else if(value===12){
        tip='1200米'
      }else if(value===13){
        tip='1500米'
      }else if(value===14){
        tip='1800米'
      }else if(value===15){
        tip='2100米'
      }
      return tip;
    },
    moveMyScroll(type){
      let leftDistance = this.$refs['myScrollbar'].wrap.scrollLeft
      if(type=='left'){
        if(leftDistance-30<0){
          this.$refs['myScrollbar'].wrap.scrollLeft = 0
        }else{
          this.$refs['myScrollbar'].wrap.scrollLeft = this.$refs['myScrollbar'].wrap.scrollLeft -30
        }
      }else{
        if(leftDistance+30>this.$refs['myScrollbar'].wrap.scrollWidth){
          this.$refs['myScrollbar'].wrap.scrollLeft = this.$refs['myScrollbar'].wrap.scrollWidth
        }else{
          this.$refs['myScrollbar'].wrap.scrollLeft = this.$refs['myScrollbar'].wrap.scrollLeft +30
        }
      }
      // this.$refs['myScrollbar'].wrap.scrollLeft = this.$refs['myScrollbar'].wrap.scrollWidth
    },
    detail(type) {
      this.isDetail = type;
    },
    closeWindow() {
      this.sectionwindDetail = false;
    },
    changeTimeToPic() {
      let self = this;
      this.$refs.canvas.innerHTML = "";
      let timeArray = this.searchTime.split(" ");
      let yearArray = timeArray[0].split(".");
      let secondArray = timeArray[1].split(":");
      // let timestr =
      //   yearArray[0] +
      //   "-" +
      //   yearArray[1] +
      //   "-" +
      //   yearArray[2] +
      //   "%20" +
      //   secondArray[0] +
      //   ":" +
      //   secondArray[1] +
      //   ":00";
      let timestr =
        "2019-11-01%20" + secondArray[0] + ":" + secondArray[1] + ":00";
      console.log("timestr", timestr);
      request({
        url:
          "http://161.189.11.216:8090/gis/BJPEK/ModelForecast/Parabolic?dataCode=ABC&dataSet=XLONG,XLAT,hight,U,V,W&time=" +
          timestr +
          "&resolution=1000M&runway=" +
          this.runType,
        method: "get"
      }).then(resp => {
        self.draw(resp.data);
      });
    },
    changeTime() {
      // console.log(Math.floor (this.runwayTime*12)/100)
      this.sliderTime = new Date(
        new Date(new Date().toLocaleDateString()).getTime() +
          (Math.floor(this.runwayTime * 24) / 100) * 60 * 60 * 1000
      );
    },
    getTime(value) {
      this.searchTime = this.$moment(this.sliderTime)
        .format("YYYY.MM.DD HH:mm")
        .toString();
      return this.searchTime;
    },
    /**
     * 获取站点数据
     */
    getStationInfo: function() {
      let info = {};
      let params = {};
      params.datacode = "ZBAA";
      params.airport = "ZBAA";
      params.runway = "runway1,runway2,runway3";
      params.dataset = "U,V,DIR,SPD";
      params.starttime = "2019-11-04 06:00:00";
      params.endtime = "2019-11-04 18:00:00";
      params.resolution = "1000M";
      params.hight = "0010m";
      let url = "http://161.189.11.216:8090/gis/BJPEK/RunwaysForecast";
      info.url = url;
      info.params = params;
      this.$store.dispatch("station/getRankInfo", info).then(res => {
        // 按高度获取风数据
        if (res.data.returnCode == 0) {
          this.windInfo = res.data.runways;
          //            this.changeColor(0, 12, "18R", "MID1", "36L")
          //            this.changeColor(1, 12, "18L", "MID2", "36R")
          //            this.changeColor(2, 12, "19", "MID3", "01")
        } else {
          this.$message.error(res.data.returnMessage);
        }
      });
      info = {};
      params = {};
      params.datacode = "ZBAA";
      params.airport = "ZBAA";
      params.runway = "runway1,runway2,runway3";
      params.starttime = "2019-11-04 06:00:00";
      params.endtime = "2019-11-04 18:00:00";
      params.resolution = "1000M";
      params.dataset = "SLP,RH,T,PSFC";
      params.hight = "0002m";
      info.params = params;
      info.url = url;
      this.$store.dispatch("station/getRankInfo", info).then(res => {
        // 获取两米高度其他数据
        if (res.data.returnCode == 0) {
          this.otherInfo = res.data.runways;
        } else {
          this.$message.error(res.data.returnMessage);
        }
      });
      info = {};
      params = {};
      params.datacode = "ZBAA";
      params.airport = "ZBAA";
      params.runway = "runway1,runway2,runway3";
      params.starttime = "2019-11-09 06:00:00";
      params.endtime = "2019-11-09 18:00:00";
      params.resolution = "1000M";
      params.dataset = "RAIN";
      params.hight = "0000m";
      info.params = params;
      info.url = url;
      this.$store.dispatch("station/getRankInfo", info).then(res => {
        // 获取零米高度其他数据
        if (res.data.returnCode == 0) {
          this.rainInfo = res.data.runways;
        } else {
          this.$message.error(res.data.returnMessage);
        }
      });
      //36小时数据
      info = {};
      params = {};
      params.datacode = "ZBAA";
      params.airport = "ZBAA";
      params.runway = "runway1,runway2,runway3";
      params.dataset = "U,V,DIR,SPD";
      params.starttime = "2019-11-04 06:00:00";
      params.endtime = "2019-11-06 06:00:00";
      params.resolution = "1000M";
      params.hight = "0010m";
      info.url = url;
      info.params = params;
      this.$store.dispatch("station/getRankInfo", info).then(res => {
        // 按高度获取风数据
        if (res.data.returnCode == 0) {
          this.wind36Info = res.data.runways;
        } else {
          this.$message.error(res.data.returnMessage);
        }
      });
      info = {};
      params = {};
      params.datacode = "ZBAA";
      params.airport = "ZBAA";
      params.runway = "runway1,runway2,runway3";
      params.starttime = "2019-11-04 06:00:00";
      params.endtime = "2019-11-06 06:00:00";
      params.resolution = "1000M";
      params.dataset = "SLP,RH,T,PSFC";
      params.hight = "0002m";
      info.params = params;
      info.url = url;
      this.$store.dispatch("station/getRankInfo", info).then(res => {
        // 获取两米高度其他数据
        if (res.data.returnCode == 0) {
          this.other36Info = res.data.runways;
        } else {
          this.$message.error(res.data.returnMessage);
        }
      });
      info = {};
      params = {};
      params.datacode = "ZBAA";
      params.airport = "ZBAA";
      params.runway = "runway1,runway2,runway3";
      params.starttime = "2019-11-09 06:00:00";
      params.endtime = "2019-11-11 06:00:00";
      params.resolution = "1000M";
      params.dataset = "RAIN";
      params.hight = "0000m";
      info.params = params;
      info.url = url;
      this.$store.dispatch("station/getRankInfo", info).then(res => {
        // 获取零米高度其他数据
        if (res.data.returnCode == 0) {
          this.rain36Info = res.data.runways;
        } else {
          this.$message.error(res.data.returnMessage);
        }
      });
    },
    /**
     * 画跑道
     * @param colors 跑道颜色数组 根据当前风速取值
     * @returns {Element|HTMLElementTagNameMap[string]}
     */
    drawRunWays: function(colors) {
      var point = [0, 0.25, 0.5, 0.75, 1];
      var canvas = document.createElement("canvas"); //创建canvas标签
      var ctx = canvas.getContext("2d");
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
      var r =
        '<table style="width: 200px;"><tr><th scope="col" colspan="4"  style="text-align:center;font-size:15px;">' +
        '</th></tr><tr><td >住用单位：</td><td >XX单位</td></tr><tr><td >建筑面积：</td><td >43平方米</td></tr><tr><td >建筑层数：</td><td >2</td></tr><tr><td >建筑结构：</td><td >钢混</td></tr><tr><td >建筑年份：</td><td >2006年</td></tr><tr><td colspan="4" style="text-align:right;"></td></tr></table>';
      this.viewer.entities.add({
        show: true,
        id: text.replace(/^\s*|\s*$/g, ""),
        name: text,
        type: "station",
        runway: runway,
        type: "point",
        position: Cesium.Cartesian3.fromDegrees(lat, lng),
        backColor: "#FFF1D4",
        textColor: "#FFDB92",
        label: {
          text: text,
          font: "12px Source Han Sans CN", //字体样式
          fillColor: Cesium.Color.fromCssColorString("#FFDB92"), //字体颜色
          backgroundColor: Cesium.Color.fromCssColorString("#FFF1D4"), //背景颜色
          showBackground: true, //是否显示背景颜色
          style: Cesium.LabelStyle.FILL_AND_OUTLINE, //label样式 TEXT的样式填充以及边框
          outlineWidth: 1,
          outlineColor: Cesium.Color.BLACK,
          verticalOrigin: Cesium.VerticalOrigin.CENTER, //垂直位置
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT, //水平位置
          pixelOffset: new Cesium.Cartesian2(10, 0), //偏移
          scale: 1
        },
        tooltip: { html: r, anchor: [0, -12] }
      });
    },
    /**
     * 站点悬浮事件，获取当前站点时间数据
     * @param movement
     */
    pointHandler: function(movement) {
      var pick = this.viewer.scene.pick(movement.endPosition);
      //      if (!pick) {
      if (this.entity && this.entity.id.label.scale != 1) {
        if (!pick || this.entity.id.id != pick.id.id) {
          this.entity.id.label.scale = 1;
          this.entity.id.label.fillColor = Cesium.Color.fromCssColorString(
            this.entity.id.textColor
          );
          this.entity.id.label.backgroundColor = Cesium.Color.fromCssColorString(
            this.entity.id.backColor
          );
          if (pick && pick.id.type == "station") {
            this.entity = pick;
          } else {
            this.entity = undefined;
          }
          this.isHoverShow = false;
        }
      }
      //    return
      // }
      if (pick && pick.id.type == "point") {
        let index = this.showHour - this.nowHour + 7; // 获取数据在数组中位值
        let wind = this.windInfo[pick.id.runway][
          pick.id.name.replace(/^\s*|\s*$/g, "")
        ];
        let other = this.otherInfo[pick.id.runway][
          pick.id.name.replace(/^\s*|\s*$/g, "")
        ];
        let rain = this.rainInfo[pick.id.runway][
          pick.id.name.replace(/^\s*|\s*$/g, "")
        ];
        let wind36 = this.wind36Info[pick.id.runway][
          pick.id.name.replace(/^\s*|\s*$/g, "")
        ];
        let other36 = this.other36Info[pick.id.runway][
          pick.id.name.replace(/^\s*|\s*$/g, "")
        ];
        let rain36 = this.rain36Info[pick.id.runway][
          pick.id.name.replace(/^\s*|\s*$/g, "")
        ];

        for (let i = 0; i < this.infoType.length; i++) {
          if (wind[this.infoType[i]] != undefined) {
            this.info[this.infoType[i]] = wind[this.infoType[i]][index];
          }
          if (other[this.infoType[i]] != undefined) {
            this.info[this.infoType[i]] = other[this.infoType[i]][index];
          }
          if (rain[this.infoType[i]] != undefined) {
            this.info[this.infoType[i]] = rain[this.infoType[i]][index];
          }
          if (wind36[this.infoType[i]] != undefined) {
            this.info[this.infoType[i]] = wind36[this.infoType[i]][index];
          }
          if (other36[this.infoType[i]] != undefined) {
            this.info[this.infoType[i]] = other36[this.infoType[i]][index];
          }
          if (rain36[this.infoType[i]] != undefined) {
            this.info[this.infoType[i]] = rain36[this.infoType[i]][index];
          }
        }
        this.infoTime = "2019-11-04 " + this.showHour + ":00:00";
        if (this.entity) {
          if (this.entity.id.name == pick.id.name) {
            return;
          } else {
            this.entity = pick;
            pick.id.label.scale = 1.5;
            pick.id.label.fillColor = Cesium.Color.fromCssColorString(
              "#ffffff"
            );
            pick.id.label.backgroundColor = Cesium.Color.fromCssColorString(
              pick.id.textColor
            );
            let hover = document.getElementById("hover_info");
            hover.style.top = movement.endPosition.y + "px";
            hover.style.left = movement.endPosition.x + 50 + "px";
            this.isHoverShow = true;
            let Echarts1 = this._initEcharts1();
            //let Echarts36 = this._initEcharts36();
            this.potail(Echarts1, pick.id.id, pick.id.runway);
            //this.potail36(Echarts36, pick.id.id, pick.id.runway);
            this.stationname = pick.id.id;
          }
        } else {
          this.entity = pick;
          pick.id.label.scale = 1.5;
          pick.id.label.fillColor = Cesium.Color.fromCssColorString("#ffffff");
          pick.id.label.backgroundColor = Cesium.Color.fromCssColorString(
            pick.id.textColor
          );
          let hover = document.getElementById("hover_info");
          hover.style.top = movement.endPosition.y + "px";
          hover.style.left = movement.endPosition.x + 50 + "px";
          this.isHoverShow = true;
          let Echarts1 = this._initEcharts1();
          //let Echarts36 = this._initEcharts36();
          this.potail(Echarts1, pick.id.id, pick.id.runway);
          //this.potail36(Echarts36, pick.id.id, pick.id.runway);
          this.stationname = pick.id.id;
        }
      }
    },
    /**
     * 剖面风点击
     */
    wallHandler: function(click) {
      this.sectionwindDetail = true;
      var pick = this.viewer.scene.pick(click.position);
      if (pick) {
        if (pick.id.name == "windWall") {
          this.changeRunway(pick.id.type);
        }
      }
    },
    /**
     * 格式化时间数据 获取开始时间与结束时间
     * @param date
     * @returns {string}
     */
    formateDate: function(date) {
      var dateTime = null;
      var dateTime = date.getFullYear() + "-";
      if (("" + (date.getUTCMonth() + 1)).length == 1) {
        dateTime += "0" + (date.getUTCMonth() + 1) + "-";
      } else {
        dateTime += date.getUTCMonth() + 1 + "-";
      }
      if (("" + date.getUTCDate()).length == 1) {
        dateTime += "0" + date.getUTCDate() + " ";
      } else {
        dateTime += date.getUTCDate() + " ";
      }
      if (("" + date.getUTCHours()).length == 1) {
        dateTime += "0" + date.getUTCHours() + ":";
      } else {
        dateTime += date.getUTCHours() + ":";
      }
      if (("" + date.getUTCMinutes()).length == 1) {
        dateTime += "0" + date.getUTCMinutes() + ":";
      } else {
        dateTime += date.getUTCMinutes() + ":";
      }
      if (("" + date.getUTCSeconds()).length == 1) {
        dateTime += "0" + date.getUTCSeconds();
      } else {
        dateTime += date.getUTCSeconds();
      }
      return dateTime;
    },
    /**
     *
     * @param index 跑道编号
     * @param hour 数据时间
     * @param stat1 站点1
     * @param stat2 站点2
     * @param stat3 站点3
     */
    changeColor: function(index, hour, stat1, stat2, stat3) {
      var r = this.viewer.entities.getById(this.runLists[index]); // 获取跑道
      let runInfoList = this.windInfo[index];
      if (runInfoList)
        r.polyline.material = new Cesium.ImageMaterialProperty({
          image: this.drawRunWays([
            this.getColor(12, stat1, runInfoList),
            this.getColor(12, stat1, runInfoList),
            this.getColor(12, stat2, runInfoList),
            this.getColor(12, stat3, runInfoList),
            this.getColor(12, stat3, runInfoList)
          ])
        });
    },
    /**
     *
     * @param hour
     * @param stat
     * @param runList
     */
    getColor: function(hour, stat, runList) {
      let value = parseInt(runList[stat]["SPD"][hour - this.nowHour + 7]);
      if (value == null || value == undefined) {
        value = 0;
      }
      let color = "";
      let textColor = "";
      if (0 <= value && value <= 5) {
        color = this.windColor[0];
        textColor = this.labelColor[0];
      } else if (5 < value && value < 17) {
        color = this.windColor[1];
        textColor = this.labelColor[1];
      } else if (value >= 17) {
        color = this.windColor[2];
        textColor = this.labelColor[2];
      }
      var s = this.viewer.entities.getById(stat); // 获取站点
      s.label.fillColor = Cesium.Color.fromCssColorString(color); //字体颜色
      s.backColor = textColor;
      s.textColor = color;
      s.label.backgroundColor = Cesium.Color.fromCssColorString(textColor); //背景颜色
      return color;
    },
    closename() {
      this.isShow = this.isShow == false ? true : false;
    },
    _initEcharts1() {
      var existInstance = this.$echarts.getInstanceByDom(
        document.getElementById("windEcharts")
      );
      if (existInstance == undefined) {
        var Echart = this.$echarts.init(
          document.getElementById("windEcharts"),
          "",
          {}
        );
        return Echart;
      }
      return existInstance;
    },
    
    windDen(wind) {
      if (wind > 0 && wind <= 30) {
        return "30";
      } else if (wind > 30 && wind <= 60) {
        return "60";
      } else if (wind > 60 && wind <= 90) {
        return "90";
      } else if (wind > 90 && wind <= 120) {
        return "120";
      } else if (wind > 120 && wind <= 150) {
        return "150";
      } else if (wind > 150 && wind <= 180) {
        return "180";
      } else if (wind > 180 && wind <= 210) {
        return "210";
      } else if (wind > 210 && wind <= 240) {
        return "240";
      } else if (wind > 240 && wind <= 270) {
        return "270";
      } else if (wind > 270 && wind <= 300) {
        return "300";
      } else if (wind > 300 && wind <= 330) {
        return "330";
      } else if (wind > 330 && wind <= 360) {
        return "360";
      }
    },
    potail(Echarts1, id, runway) {
      let Data = {
        times: [
          "2019-11-04 06:00:00",
          "2019-11-04 07:00:00",
          "2019-11-04 08:00:00",
          "2019-11-04 09:00:00",
          "2019-11-04 10:00:00",
          "2019-11-04 11:00:00",
          "2019-11-04 12:00:00",
          "2019-11-04 13:00:00",
          "2019-11-04 14:00:00",
          "2019-11-04 15:00:00",
          "2019-11-04 16:00:00",
          "2019-11-04 17:00:00",
          "2019-11-04 18:00:00"
        ],
        timeData: [
          "-6h",
          "-5h",
          "-4h",
          "-3h",
          "-2h",
          "-1h",
          "当前",
          "+1h",
          "+2h",
          "+3h",
          "+4h",
          "+5h",
          "+6h"
        ],
        windxData: this.windInfo[runway][id].DIR,
        rhData: this.otherInfo[runway][id].RH,
        slpData: this.otherInfo[runway][id].SLP,
        tData: this.otherInfo[runway][id].T,
        rainData: this.rainInfo[runway][id].RAIN,
        // windsData: ["2.8/2", "1.4/1", "2.7/2", "3/2", "2.2/2", "1.4/1", "1.5/1", "1.9/2", "1.4/1", "1.8/2", "2/2", "3.4/3", "3/2"],
        temData: this.windInfo[runway][id].SPD
        //rainData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //humData: [59, 67, 70, 74, 77, 77, 65, 63, 60, 47, 40, 36, 38],
      };
      let colors = ['#FF6863','#6EAB40'];
      let SLPoption = {
        color:colors,
        backgroundColor: "transparent",
        color: "rgba(136,136,136,1)",
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "cross" },
          formatter: function(params, ticket, callback) {
            let index = params[0].dataIndex;
            let Htm =  `${(Data.times[index]).substring(0,16)}<br>
                    海平面气压:${parseInt(Data.slpData[index])}hPa<br/>
                    风速:${parseFloat(Data.temData[index]).toFixed(1)}m/s&nbsp;&nbsp;
                    风向:${parseInt(Data.windxData[index])}°`; 
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
            name: " ",
            type: "category",
            position: "bottom",
            offset: 0,
            nameTextStyle: { color: "#BBBBBB" },
            axisLabel: { color: "#BBBBBB" },
            axisTick: { show: false },
            data: Data.timeData
          },

          {
            name: "风向",
            type: "category",
            position: "bottom",
            offset: 20,
            nameGap:35,
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: {
              show: true,
              textStyle: {
                color: "rgba(136, 136, 136, 1)",
                fontSize: 14,
                lineHeight: 20
              },
              interval: 0,
              formatter: value => {
                return "{" + this.windDen(value) + "| }";
              },
              rich: {
                value: {
                  lineHeight: 16,
                  align: "left"
                },
                30: {
                  height: 16,
                  width: 16,
                  align: "left",
                  backgroundColor: {
                    image: windImgUrl1
                  }
                },
                60: {
                  height: 16,
                  align: "left",
                  backgroundColor: {
                    image: windImgUrl2
                  }
                },
                90: {
                  height: 16,
                  align: "left",
                  backgroundColor: {
                    image: windImgUrl3
                  }
                },
                120: {
                  height: 16,
                  align: "left",
                  backgroundColor: {
                    image: windImgUrl4
                  }
                },
                150: {
                  height: 16,
                  align: "left",
                  backgroundColor: {
                    image: windImgUrl5
                  }
                },
                180: {
                  height: 16,
                  align: "left",
                  backgroundColor: {
                    image: windImgUrl6
                  }
                },
                210: {
                  height: 16,
                  align: "left",
                  backgroundColor: {
                    image: windImgUrl7
                  }
                },
                240: {
                  height: 16,
                  align: "left",
                  backgroundColor: {
                    image: windImgUrl8
                  }
                },
                270: {
                  height: 16,
                  align: "left",
                  backgroundColor: {
                    image: windImgUrl9
                  }
                },
                300: {
                  height: 16,
                  align: "left",
                  backgroundColor: {
                    image: windImgUrl10
                  }
                },
                330: {
                  height: 16,
                  align: "left",
                  backgroundColor: {
                    image: windImgUrl11
                  }
                },
                360: {
                  height: 16,
                  align: "left",
                  backgroundColor: {
                    image: windImgUrl12
                  }
                }
              }
            },
            nameTextStyle: {
              color: "rgba(136, 136, 136, 1)",
              padding: [0, 0, -38]
            },
            nameLocation: "start",
            data: Data.windxData
          },
          {
            type: "category",
            axisLine: { show: false }
          },
          {
            type: "category",
            position: "bottom",
            offset: 0,
            nameTextStyle: { color: "#BBBBBB" },
            axisLabel: { color: "#BBBBBB" },
            axisTick: { show: false },
            data: Data.timeData
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "风速 m/s                                ",
            scale: true,
            position: "left",
            offset: -20,
            nameLocation:"end",
            nameGap:-15,
          
            axisTick: {lineStyle: { color: colors[0] }, inside: true},
            nameTextStyle: { color: colors[0] },
            axisLabel: { color: colors[0] },
            splitLine: { show: false }
          },
          {
            type: "value",
            name: "海平面气压  hPa",
            scale: true,
            position: "right",
            offset: -20,
            axisTick: {lineStyle: { color: colors[1] }, inside: true},
            nameTextStyle: {color: colors[1],align:""  },
            axisLabel: { color: colors[1] },
            splitLine: { show: false },
            data: Data.slpData
          }
        ],
        series: [
          {
            name: "风速",
            type: "line",
            step: false,
            color: colors[0],
           // label: { normal: { show: false, position: "top" } },
           // lineStyle: { color: "#fff" },
           // itemStyle: { opacity: 0  },
            smooth: true,
            data: Data.temData
          },
          {
            name: '海平面气压',
            type: 'line',
            step: false,
            yAxisIndex: 1,
            color: colors[1],
            //label: { normal: { show: true, position: 'top' } },
            smooth: true,
            data: Data.slpData
          }
        ]
      };
      Echarts1.setOption(SLPoption);
      window.addEventListener("resize", function(event) {
        Echarts1.resize();
      });
    },
    windToggle(windType) {
      if (windType == "section") {
        this.activeWind = "sectionwind";
        this.$el.querySelector("#planewind").classList.remove("active");
        this.$el.querySelector("#sectionwind").classList.add("active");
        this.isLegendChange = false;
        for (let i = 0; i < this.pointName.length; i++) {
          let entity = this.viewer.entities.getById(this.pointName[i]);
          entity.show = this.isLegendChange;
        }
        let entity1 = this.viewer.entities.getById("wall1");
        entity1.show = !this.isLegendChange;
        entity1 = this.viewer.entities.getById("wall2");
        entity1.show = !this.isLegendChange;
        entity1 = this.viewer.entities.getById("wall3");
        entity1.show = !this.isLegendChange;
        this.viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            116.481554,
            40.013338,
            6961.9883961571
          ),
          orientation: {
            heading: Cesium.Math.toRadians(400.668148999818),
            pitch: Cesium.Math.toRadians(-30.8329210486802),
            roll: Cesium.Math.toRadians(0)
          }
        });
      } else {
        this.isLegendChange = true;
        this.sectionwindDetail = false;
        this.activeWind = "planewind";
        this.$el.querySelector("#sectionwind").classList.remove("active");
        this.$el.querySelector("#planewind").classList.add("active");
        for (let i = 0; i < this.pointName.length; i++) {
          let entity = this.viewer.entities.getById(this.pointName[i]);
          entity.show = this.isLegendChange;
        }
        let entity1 = this.viewer.entities.getById("wall1");
        entity1.show = !this.isLegendChange;
        entity1 = this.viewer.entities.getById("wall2");
        entity1.show = !this.isLegendChange;
        entity1 = this.viewer.entities.getById("wall3");
        entity1.show = !this.isLegendChange;
        // entity1 = this.viewer.entities.getById("SDJCoutline");
        // entity1.show = !this.isLegendChange;
        this.viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            116.603738,
            39.944974,
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
      this.runwayTime = 1
      let self = this;
      this.$refs.canvas.innerHTML = "";
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
      this.height_num = Math.ceil(data["data"]["count"] / 16);
      var sortList = [];
      //每行数据按纬度xlat排序
      for (let i = 0, len = xlat.length / this.height_num; i < len; i++) {
        var jList = [];
        for (let j = 0; j < this.height_num; j++) {
          if (jList.length == 0) {
            jList.push(j);
          } else if (
            xlat[i * this.height_num + j] <=
            xlat[i * this.height_num + jList[jList.length - 1]]
          ) {
            jList.push(j);
          } else if (
            xlat[i * this.height_num + j] >=
            xlat[i * this.height_num + jList[0]]
          ) {
            jList.unshift(j);
          } else {
            for (let k = 1, klen = jList.length; k < klen; k++) {
              if (
                xlat[i * this.height_num + j] >=
                  xlat[i * this.height_num + jList[k]] &&
                xlat[i * this.height_num + j] <=
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
      //calc(105vh + 1050px);
      let stylestr = 'width : calc(' + (finList[0].length * 3) + 'vh + ' + (finList[0].length * 30) +'px)'
      body.setAttribute('style',stylestr)
      for (let len = finList.length, j = len - 1; j >= 0; j--) {
        var div_0 = document.createElement("div");
        div_0.setAttribute(
          "style",
          "text-align:center;display:flex;padding-left: 5px;background: linear-gradient(180deg,rgba(242, 247, 255, 1) 0%,rgba(250, 252, 255, 1) 100%);"
        );
        for (let i = 0, len1 = finList[0].length; i < len1; i++) {
          var div_1 = document.createElement("div");
          div_1.setAttribute("class", "demo");
          if (i == 14) {
            div_1.style =
              "border-left:2px dashed red;box-shadow:inset 15px 0px  10px -15px red;";
          }
          if (i == 14 && j == finList.length - 1) {
            div_1.style =
              "border-left:2px dashed red;border-top:2px dashed red;box-shadow:inset 8px 8px 9px -8px red;";
          }
          if (j == finList.length - 1 && i > 14 && i < 20) {
            div_1.style =
              "border-top:2px dashed red;box-shadow:inset -1px 11px 13px -15px red";
          }
          if (i == 20) {
            div_1.style =
              "border-right:2px dashed red;box-shadow:inset -15px 0px  10px -15px red";
          }
          if (i == 20 && j == finList.length - 1) {
            div_1.style =
              "border-right:2px dashed red;border-top:2px dashed red;box-shadow:inset -8px 8px  9px -8px red";
          }
          if (j == 0 && i > 14 && i < 20) {
            div_1.style =
              "border-bottom:2px dashed red;box-shadow:inset -1px -11px 13px -15px red";
          }
          if (j == 0 && i == 14) {
            div_1.style =
              "border-bottom:2px dashed red; border-left:2px dashed red;box-shadow:inset 8px -8px 9px -8px red;";
          }
          if (j == 0 && i == 20) {
            div_1.style =
              "border-bottom:2px dashed red; border-right:2px dashed red;box-shadow:inset -8px -8px 9px -8px red;";
          }
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
      let value_num = -16;
      let hang = document.createElement("div");
      hang.setAttribute(
        "style",
        "text-align:center;display:flex;width: fit-content;padding-left:5px;font-size: 16px;font-family: DINMittelschriftStd;color: rgba(255,255,255,1);line-height: 19px;margin-top: 0.20rem;"
      );
      for (let k = 0; k < 35; k++) {
        let div_child = document.createElement("div");
        div_child.setAttribute("class", "demo");
        if (k % 2 == 1) {
          div_child.innerHTML = value_num;
          value_num = value_num + 2;
        }
        hang.appendChild(div_child);
      }
      value_num = -16;
      let hang2 = document.createElement("div");
      hang2.setAttribute(
        "style",
        "text-align:center;display:flex;width: fit-content;padding-left:5px;font-size: 16px;font-family: DINMittelschriftStd;color: rgba(0, 255, 71, 1);;line-height: 19px;"
      );
      for (let k = 0; k < 35; k++) {
        let div_child = document.createElement("div");
        div_child.setAttribute("class", "demo");
        if (value_num == 1) {
          if (this.runType === "runway1") {
            div_child.innerHTML = "MID1";
          } else if (this.runType === "runway2") {
            div_child.innerHTML = "MID2";
          } else {
            div_child.innerHTML = "MID3";
          }
        } else if (value_num === -2) {
          div_child.innerHTML = "18L";
        } else if (value_num === 4) {
          div_child.innerHTML = "36R";
        } else {
          div_child.innerHTML = "";
        }
        value_num = value_num + 1;
        hang2.appendChild(div_child);
      }
      var div_sp1 = document.createElement("div");
      div_sp1.setAttribute("class", "clear");
      canvas.appendChild(div_sp1);
      canvas.appendChild(hang);
      canvas.appendChild(hang2);
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
    
    // this.$refs.height_dom.style =
    //   "margin-left:" + ((window.innerHeight / 100) * 12 * 3 + 360) + "px;";
    console.log("GeminiScrollbar", this.$refs['myScrollbar']);
    console.log(this.$refs['myScrollbar'].wrap);
    this.$el.querySelector("#planewind").classList.add("active");
    let self = this;
    // request({
    //   url:
    //     "http://161.189.11.216:8090/gis/BJPEK/ModelForecast/Parabolic?dataCode=ABC&dataSet=XLONG,XLAT,hight,U,V,W&time=2019-11-01%2000:00:00&resolution=1000M&runway=runway1",
    //   method: "get"
    // }).then(resp => {
    //   self.draw(resp.data);
    // });
    // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(71.39628233299722, 17.90751494736041, 137.14821935043528, 49.06704603525708)
    this.viewer = new Cesium.Viewer("cesiumContainer", {
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
        url:
          "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
      })
    });
    this.viewer.imageryLayers.addImageryProvider(
      new Cesium.UrlTemplateImageryProvider({
        url:
          "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8"
      })
    );
    //摄像机定位
    let camera = this.viewer.camera;
    camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(
        116.576534748692,
        40.0780145185529,
        500
      ),
      orientation: {
        heading: 359.668148999818,
        pitch: -88.8329210486802,
        roll: 0.0
      }
    });
    this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );
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
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZjY5ODg0MS1lZTMxLTRmMGMtOTRhYi00N2M2YjQ3ZDMzNjgiLCJpZCI6NDgwLCJpYXQiOjE1MjUyNTE1Nzh9.5Mi3ijReKCRQ_Shupv2w-wl2eJBRLOOW3Bmeq0IL5Y4";
    let val = 2;
    //加载风场
    if (val === 1) {
      this.loadNetCDF(this.urlNetCDF).then(data => {
        this.windData = data;
      });
    } else if (val === 2) {
      let time = "2019-11-13%2000:00:00";
      let level = 0;
      this.loadwind(time,level)
    }
  },
  async loadNetCDF(filePath) {
    let _this = this;
    return new Promise(function(resolve) {
      let request = new XMLHttpRequest();
      request.open("GET", filePath);
      request.responseType = "arraybuffer";
      request.onload = function() {
        var arrayToMap = function(array) {
          return array.reduce(function(map, object) {
            map[object.name] = object;
            return map;
          }, {});
        };
        var NetCDF = new NetCDFReader(request.response);
        let data = {};
        var dimensions = arrayToMap(NetCDF.dimensions);
        data.dimensions = {};
        data.dimensions.lon = dimensions["lon"].size;
        data.dimensions.lat = dimensions["lat"].size;
        data.dimensions.lev = dimensions["lev"].size;
        var variables = arrayToMap(NetCDF.variables);
        var uAttributes = arrayToMap(variables["U"].attributes);
        var vAttributes = arrayToMap(variables["V"].attributes);
        data.lon = {};
        data.lon.array = new Float32Array(NetCDF.getDataVariable("lon").flat());
        data.lon.min = Math.min(...data.lon.array);
        data.lon.max = Math.max(...data.lon.array);
        data.lat = {};
        data.lat.array = new Float32Array(NetCDF.getDataVariable("lat").flat());
        data.lat.min = Math.min(...data.lat.array);
        data.lat.max = Math.max(...data.lat.array);
        data.lev = {};
        data.lev.array = new Float32Array(NetCDF.getDataVariable("lev").flat());
        data.lev.min = Math.min(...data.lev.array);
        data.lev.max = Math.max(...data.lev.array);
        data.U = {};
        data.U.array = new Float32Array(NetCDF.getDataVariable("U").flat());
        data.U.min = uAttributes["min"].value;
        data.U.max = uAttributes["max"].value;
        data.V = {};
        data.V.array = new Float32Array(NetCDF.getDataVariable("V").flat());
        data.V.min = vAttributes["min"].value;
        data.V.max = vAttributes["max"].value;
        resolve(data);
      };
      request.send();
    });
  }
};
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
.a {
  font-size: 0.12rem;
}
#closename {
  position: absolute;
  right: 0.1rem;
  top: 0.1rem;
  width: 0.28rem;
  height: 0.28rem;
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
  width: 0.8rem;
  height: 0.28rem;
  background-color: #242236;
  border-radius: 5px;
}
#menu11 {
  display: none;
  position: absolute;
  z-index: 10;
  bottom: 43%;
  left: 1%;
  width: 0.8rem;
  height: 0.28rem;
  background: rgba(227, 222, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(59, 55, 87, 1);
}
#menu2 {
  position: absolute;
  z-index: 10;
  bottom: 43%;
  left: 8%;
  width: 0.8rem;
  height: 0.28rem;
  background-color: #242236;
  border-radius: 5px;
}
#menu22 {
  display: none;
  position: absolute;
  z-index: 10;
  bottom: 43%;
  left: 8%;
  width: 0.8rem;
  height: 0.28rem;
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
    width: 0.04rem;
    height: 0.22rem;
    border-radius: 2px;
    left: 0.16rem;
    top: 0.15rem;
    background: rgba(0,255,71,1);
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
  width: 0.63rem;
  height: 0.3rem;
  z-index: 10;
  left: 0.28rem;
  top: 0.11rem;
  font-size: 0.22rem;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(255,255,255,1);
  line-height: 0.3rem;
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
  float:left;
  width: 1.5rem;
  height: 0.4rem;
  font-family: PingFangSC-Medium,PingFang SC;
    font-weight: 500;
    color: rgba(255,255,255,1);
    line-height: 0.22rem;
    text-align: left;
    margin-left: 0.16rem;
    top: 0.7rem;
}
#dateshow {
  width: 1rem;
  font-size: 0.16rem;
  
}
#back {
  font-size:0.01rem;
  margin-bottom: 1%;
  left: 1%;
  width: 98%;
  height: 40%;
  background-color: rgba(36, 34, 54, 1);
  position: absolute;
  z-index: 10;
  box-shadow: 0px 12px 32px 1px rgba(16, 15, 23, 0.15);
  border-radius: 4px;
}
#rule {
  width: 100%;
  height: 0.02rem;
  margin-top: 0.51rem;
  border: none;
  border-top: 2px solid #555555;
}
#airport {
  margin-left: 0.2rem;
  float: left;
  width: 1.4rem;
}
#airporticon {
  float: left;
  width: 0.32rem;
  height: 0.32rem;
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
  margin-left: 0.02rem;
  float: left;
  width: 1.2rem;
}
#windspeedicon {
  float: left;
  width: 0.32rem;
  height: 0.32rem;
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
  margin-left: 0.02rem;
  float: left;
  width: 1.2rem;
}
#winddirectionicon {
  float: left;
  width: 0.32rem;
  height: 0.32rem;
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
  margin-left: 0.02rem;
  float: left;
  width: 1.5rem;
}
#airpressureicon {
  float: left;
  width: 0.32rem;
  height: 0.32rem;
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
  width:1.0rem;
  float: left;
  margin-left: 0.02rem;
}
#Ticon {
  float: left;
  width: 0.32rem;
  height: 0.32rem;
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
  font-size: 0.14rem;
  font-family: DINMittelschriftStd;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 0.22rem;
  float: left;
  margin-left:0.02rem;
}
#rain {
  margin-left: 0.02rem;
  float: left;
  width: 1.4rem;
}
#rainicon {
  float: left;
  width: 0.32rem;
  height: 0.32rem;
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
  margin-left: 0.02rem;
  float: left;
  width: 1.2rem;
}
#humidityicon {
  float: left;
  width: 0.32rem;
  height: 0.32rem;
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
  top: 35%;
  left: 1%;
  position: absolute;
  z-index: 12;
  width: 100%;
  height: 70%;
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
  top: 5%;
  right: 1%;
  background: rgba(36, 34, 54, 1);
  box-shadow: 0px 12px 32px 1px rgba(16, 15, 23, 0.15);
  border-radius: 4px;
  width: 1.62rem;
  height: 1.64rem;
}
#tonenameback {
  float: left;
  width: 100%;
  height: 20%;
}
#stringR {
    margin-top: 0.12rem;
    width: 0.02rem;
    height: 0.16rem;
    background: #05892a;
    border-radius: 2px;
    left: 0.2rem;
    position: absolute;
    float:left;
}
#pointgroundname {
  width:1.25rem;
  height:0.25rem;
  font-size:14px;
  font-family:PingFangSC-Medium,PingFang SC;
  font-weight:500;
  color:rgba(225,225,225,1);
  line-height:21px;
  padding: 4px;
  float: left;
  margin-left: 0.25rem;
  margin-top: 0.05rem;
}
#ruletwo {
  width: 100%;
  height: 3px;
  margin-top: 23%;
  border: none;
  border-top: 2px solid #555555;
}
#small {
  width: 0.16rem;
  height: 0.32rem;
  position: absolute;
  float: left;
  left: 10%;
  background: rgba(11, 211, 167, 1);
  border-radius: 2px 2px 0px 0px;
  top: 30%;
}
#smallname {
  font-size: 0.14rem;
  float: left;
  margin-left: 0.5rem;
  margin-top: -0.35rem;
  font-family:PingFangSC-Medium,PingFang SC;
  font-weight:500;
  color:#888;
  line-height:18px;
}
#centre {
  width: 0.16rem;
  height: 0.32rem;
  position: absolute;
  float: left;
  left: 10%;
  border-radius: 2px 2px 0px 0px;
  background: rgba(255, 190, 58, 1);
  top: 50%;
}
#centrename {
  font-size: 0.14rem;
  float: left;
  margin-left: 0.5rem;
  margin-top: -1.18rem;
  font-family:PingFangSC-Medium,PingFang SC;
  font-weight:500;
  color:#888;
  line-height:18px;
}
#big {
  width: 0.16rem;
  height: 0.32rem;
  position: absolute;
  float: left;
  left: 10%;
  border-radius: 0px 0px 2px 2px;
  background: rgba(255, 44, 85, 1);
  top: 70%;
}
#bigname {
  font-size: 0.14rem;
  float: left;
  margin-left: 0.5rem;
  margin-top:-2rem;
  font-family:PingFangSC-Medium,PingFang SC;
  font-weight:500;
  color:#888;
  line-height:18px;
}
.tag {
  display: flex;
}
#windEcharts {
  height: 98%;
  width: 100%;
}
.station_hover_info {
  width: 3.333rem;
  height: 1.508rem;
  background: rgba(36, 34, 54, 1);
  box-shadow: 0rem 0.1rem 0.267rem 0.008rem rgba(16, 15, 23, 0.15);
  border-radius: 0.033rem;
  position: absolute;
  top: 1.208rem;
  left: 0.825rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
}
.station_hover_header {
  height: 0.35rem;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.station_hover_line {
  height: 0.017rem;
  background-color: #45416f;
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
  margin-left: 0.1rem;
  display: flex;
  align-items: center;
}
.menunameT{
  width:0.8rem;
  height:0.8rem;
  top:0.05rem;
  left:0.05rem;
}
.menunameshort{
  width:1rem;
  height:1rem;
  top:0.05rem;
  left:0.05rem;
}
.menunamelong{
  widows:1.2rem;
  height:1.2rem;
  top:0.05rem;
  left:0.05rem;
}
.station_hover_container div span:nth-child(odd) {
  font-size: 0.125rem;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 800;
  color: rgba(170, 170, 170, 1);
  line-height: 0.175rem;
  text-align: left;
}
.station_hover_container div span:nth-child(even) {
  font-size: 0.125rem;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 800;
  color: rgba(255, 255, 255, 1);
  line-height: 0.175rem;
  text-align: left;
}
.station_hover_footer {
  height: 0.35rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
.header_icon {
  width: 0.033rem;
  height: 0.133rem;
  background: rgba(0, 255, 71, 1);
  border-radius: 0.008rem;
  margin-left: 0.1rem;
}
.header_title {
  width: 0.383rem;
  height: 0.233rem;
  font-size: 0.167rem;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 0.234rem;
  margin-left: 0.05rem;
}
.footer_time {
  width: 1.85rem;
  height: 0.142rem;
  font-size: 0.1rem;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(170, 170, 170, 1);
  line-height: 0.142rem;
  margin-left: 0.1rem;
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
    bottom: -25%;
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
    bottom: -25%;
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
    bottom: 18%;
  }
}
@keyframes moveOut2 {
  from {
    bottom: 18%;
  }
  to {
    bottom: 43%;
  }
}
/* 测试 */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
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
    left: 0.3rem;
    width: 2.56rem;
    height: 0.4rem;
    z-index: 999;
  }
    .windheightcontroller{
    // background:rgba(0,0,0,1);
    // opacity:0.37;
    position: absolute;
    top: 2.29rem;
    right: 0.37rem;
    width: 0.08rem;
    height: 1.72rem;
    z-index: 999;
    .el-slider__button-wrapper{
      height: auto;
    }
    .el-slider__bar{
      background-color: rgba(0,0,0,1);
      opacity:0.37;
    }
  }
  .wind_header {
    display: flex;
    justify-content: center;
    position: absolute;
    top: 5%;
    z-index: 1000;
    .wind_header_btn {
      display: flex;
    }
    .el-button {
      font-size: 0.15rem;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 21px;
      padding: 9px 6px 10px 12px;
      background-color: #006426;
      &.active {
        background-color: #05892a;
      }
    }
    .button_color {
      background-color: #05892a;
    }
    .pic_icon {
      width: 2.56rem;
    }
    .wind_header_icon {
      position: fixed;
      right: 0.2rem;
      display: flex;
      span {
        cursor: pointer;
        line-height: 0.4rem;
        font-size: 0.15rem;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 255, 71, 1);
        line-height: 21px;
        text-shadow: 0px 5px 5px rgba(36, 34, 54, 0.14);
        text-decoration: underline;
      }
    }
  }
  .shadow {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 998;
    background-color: rgba(0, 0, 0, 0.5);
    display: block;
  }
  .wind_content {
    position: absolute;
    top: 15%;
    width: 91vw;
  }
  .wind_content {
    .myScroll_btn_div {
      padding-left: 0.9rem;
      padding-right: 0.2rem;
      display: flex;
      justify-content: space-between;
      position: absolute;
      width: 91vw;
      z-index: 1002;
      top: 30%;
      [class*=" el-icon-"], [class^=el-icon-] {
        color:white;        
        font-size: 0.2rem;
        line-height: 0.54rem;
      }
      .myScroll_btn {
        cursor: pointer;
        width: 0.2rem;
        height: 0.54rem;
        background: rgba(5, 137, 42, 1);
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
        border-radius: 2px;
      }
    }
    .unit {
      font-size: 0.16rem;
      font-family: DINMittelschriftStd;
      color: rgba(0, 255, 71, 1);
      line-height: 0.19rem;
      text-align: right;
      position: relative;
      bottom: 3vh;
      span:nth-child(2) {
        margin-left: 0.03rem;
        margin-right: 0.03rem;
      }
      .length_font {
        font-size: 0.16rem;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 0.022rem;
      }
    }
    .height_font {
      // margin-left: calc(100vh - 100px);
      font-size: 0.16rem;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      text-align: left;
      margin-left: 0.2rem;
    }
    .height_value {
      position: absolute;
      z-index: 1000;
      div {
        height: 3vh;
        width: 3vh;
      }
    }
    .close-button {
      display: inline;
      width: 0.18rem;
      height: 0.18rem;
      background: rgba(36, 34, 54, 1);
      box-shadow: 0px 0.12rem 0.32rem 0.01rem rgba(16, 15, 23, 0.15);
      border-radius: 4px;
      position: absolute;
      right: 10px;
      [class*=" el-icon-"],
      [class^="el-icon-"] {
        line-height: 1;
      }
      /deep/.el-icon-close:before {
        content: "\E6DB";
        font-size: 17px;
        color: white;
      }
    }
    .scroll_parent {
      margin-left: 0.65rem;
      height: 56vh;
      // div:nth-child(3) {
      //   display: none;
      //}
      // #body::-webkit-scrollbar{
      //   width: 0%!important
      // }
      .is-vertical{
        display: none;
      }
      /deep/.el-scrollbar__wrap {
        overflow-y: hidden;
      }
      /deep/.el-scrollbar__wrap::-webkit-scrollbar {
        display: none;
      }
      /deep/.el-scrollbar__bar {
        opacity: 1;
        bottom: 6vh;
        background: #14122e;
        /deep/.el-scrollbar__thumb {
          background: #dddddd;
        }
      }
      #body {
        width: calc(105vh + 11rem);
      }
      #canvas {
        // overflow-x: scroll
        // width: 2000px;
        padding-left: 0.1rem;
      }
      .bottom_div {
        width: 3vh;
        margin-right: 0.3rem;
      }
      .demo {
        width: 3vh;
        height: 3vh;
        b {
          display: block;
          width: 3vh;
          height: 3vh;
        }
        margin-right: 0.3rem;
      }
      .div_height {
        z-index: 6;
        position: absolute;
        font-size: 0.16rem;
        font-family: DINMittelschriftStd;
        color: rgba(255, 255, 255, 1);
        line-height: 0.19rem;
        text-align: left;
        width: 0.31rem;
        left: 0.2rem;
      }
      .demo_border_left {
        border-left: 2px dashed red;
      }
      .demo_border_top {
        border-top: 2px dashed red;
      }
      .demo_border_right {
        border-right: 2px dashed red;
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
        font-size: 3vh;
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
        // top: 5px;
      }
      .icon-4:before {
        content: "\e902";
        color: #1266e8;
        position: relative;
        // top: 5px;
      }
      .icon-6:before {
        content: "\e903";
        color: #00dae3;
        position: relative;
        // top: 5px;
      }
      .icon-8:before {
        content: "\e904";
        color: #00e5cb;
        position: relative;
        // top: 5px;
      }
      .icon-10:before {
        content: "\e905";
        color: #02e7af;
        position: relative;
        // top: 5px;
      }
      .icon-12:before {
        content: "\e906";
        color: #1ee77e;
        position: relative;
        // top: 5px;
      }
      .icon-14:before {
        content: "\e907";
        color: #3be84d;
        position: relative;
        // top: 5px;
      }
      .icon-16:before {
        content: "\e908";
        color: #61e80b;
      }
      .icon-20:before {
        content: "\e909";
        color: #8ce800;
        position: relative;
        // top: 5px;
      }
      .icon-24:before {
        content: "\e90a";
        color: #c2e800;
        position: relative;
        // top: 5px;
      }
      .icon-28:before {
        content: "\e90b";
        color: #e5d600;
        position: relative;
        // top: 5px;
      }
      .icon-32:before {
        content: "\e90c";
        color: #e6b000;
        position: relative;
        // top: 5px;
      }
      .icon-36:before {
        content: "\e90d";
        color: #e62408;
        position: relative;
        // top: 5px;
      }
      .clear {
        clear: both;
      }
      .hidden {
        /* display:none; */
        width: 0.2rem;
        height: 0.3rem;
      }
    }
  }
  .wind_footer {
    position: absolute;
    bottom: 0.2rem;
    left: 0.2rem;
    right: 0.2rem;
    .wind_footer_header {
      text-align: left;
      margin-bottom: 0.08rem;
      height: 0.92rem;
      .select_color {
        background: #242236 !important;
        color: rgba(255, 255, 255, 1) !important;
      }
      /deep/.el-button {
        width: 0.8rem !important;
        height: 0.28rem !important;
        background: rgba(227, 222, 255, 1);
        border-radius: 0.04rem;
        font-size: 0.14rem;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(36, 34, 54, 1);
        line-height: 0.05rem;
        border: none;
      }
    }
    .wind_footer_body {
      height: 1.28rem;
      padding: 0.1rem 0.16rem 0.17rem 0.1rem;
      background: #242236;
      /deep/.el-slider__button-wrapper {
        /deep/.el-tooltip {
          vertical-align: middle;
          display: block;
        }
      }
      /deep/.el-slider__runway {
        background-color: transparent;
      }
      /deep/.el-slider__bar {
        height: 0.06rem;
        background-color: transparent;
      }
      /deep/.el-slider__button {
        position: relative;
        top: 0.15rem;
        margin-left: 0.15rem;
        width: 0.12rem;
        border-width: 0.12rem 0 0;
        border-radius: 0%;
        border-style: solid;
        height: 0.1rem;
        border-color: #fff2f2f2 transparent;
      }
      /deep/.el-slider__button:before {
        content: "";
        position: absolute;
        height: 0;
        width: 0;
        top: -0.24rem;
        left: 0;
        border-left: 0.06rem solid transparent;
        border-right: 0.06rem solid transparent;
        border-bottom: 0.12rem solid #fff2f2f2;
      }
      .title {
        display: flex;
        font-size: 0.22rem;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 0.3rem;
        .title_icon {
          width: 0.04rem;
          height: 0.2rem;
          background: rgba(0, 255, 71, 1);
          border-radius: 0.01rem;
          margin-top: 0.05rem;
          margin-right: 0.05rem;
        }
      }
      .progress_bar_div {
        height: 0.3rem;
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
          .span_normal {
            position: relative;
            left: -0.05rem;
          }
          .span_last {
            position: absolute;
            right: 0.2rem;
          }
          li {
            background: #242236;
            vertical-align: top;
            display: inline-block;
            font-size: 14px;
            font-family: DINMittelschriftStd;
            color: rgba(187, 187, 187, 1);
            height: 0.28rem;
            line-height: 0.28rem;
            cursor: pointer;
            box-sizing: border-box;
            margin: 0;
            width: 8.3333%;
            text-align: left;
          }
        }
      }
      .pentagon {
        margin-top: 0.14rem;
        position: relative;
        width: 0.12rem;
        border-width: 0.12rem 0rem 0;
        border-style: solid;
        border-color: #fff2f2f2 transparent;
      }
      .pentagon:before {
        content: "";
        position: absolute;
        height: 0;
        width: 0;
        top: -0.18rem;
        left: 0px;
        border-width: 0rem 0.06rem 0.06rem;
        border-style: solid;
        border-color: transparent transparent #fff2f2f2;
      }
      .time_font {
        font-size: 0.15rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 0.21rem;
      }
    }
  }
}
</style>