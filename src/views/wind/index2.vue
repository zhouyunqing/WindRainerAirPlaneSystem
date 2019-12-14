<template>
  <div class="wind">
    <div class="all-type">
      <div @click="changePage('global')">全球</div>
      <div @click="changePage('land')">五边形</div>
      <div @click="changePage('route')">航线</div>
      <div @click="changePage('message')">报文</div>
      <div @click="changePage('wind')">风</div>
    </div>
    <div id="cesiumContainer" />
    <div v-if="page ==='wind'">
      <!-- 顶部 展示切换 start -->
      <ul class="top-tap">
        <li :class="{sp: activeWind == 'plane'}" @click="windToggle('plane')">平面风展示</li>
        <li :class="{sp: activeWind == 'section'}" @click="windToggle('section')">剖面风展示</li>
      </ul>
      <!-- 顶部 展示切换 end -->

      <!-- 右上角 图列组件 start -->
      <rightCard v-if="activeWind == 'plane'" card-title="机场跑道地面风速" normal="正常 0-5 m/s" light="轻度 5-17 m/s" serious="严重 >17 m/s" />
      <!-- 右上角 图列组件 end -->

      <!-- 右侧 距地面高度 start -->
      <slider v-show="activeWind == 'plane'" @change="changeHeightLevel" />
      <!-- 右侧 距地面高度 end -->

      <!-- 平面风展示 底部图表 start -->
      <div v-show="!sectionwindDetail">
        <bottomCard v-if="!!info.T" :time="day" :site="clickSite" :detail="info" :active="activeWind" @change="changeForecastTab" @changeHeight="changeHeight" />
      </div>
      <!-- 平面风展示 底部图表 end -->

      <!-- 九站点 hover时展示的 card start -->
      <hoverCard v-if="isHoverShow && hoverSite != 'ZBAA'" :index="hoverIndex" :site="hoverSite" :detail="info" :style="hoverStyle" :time="dataStartTime" />
      <!-- 九站点 hover时展示的 card end -->

      <!-- 剖面风 start -->
      <div v-show="activeWind == 'section' && sectionwindDetail" class="shadow">
        <div class="wind_header_icon">
          <img v-if="!isDetail" src="../../assets/images/profileIcon.png">
          <span v-if="!isDetail" @click="detail(true)">详细</span>
          <img v-if="isDetail" src="../../assets/images/reduction.png">
          <span v-if="isDetail" @click="detail(false)">还原</span>
        </div>

        <article class="wind_content">
          <div class="myScroll_btn_div">
            <div class="myScroll_btn el-icon-arrow-left" @click="moveMyScroll('left')" />
            <div class="myScroll_btn el-icon-arrow-right" @click="moveMyScroll('right')" />
          </div>
          <div ref="height_dom" class="height_font">
            (高度：m)
            <div class="close-button" @click="closeWindow">
              <i class="el-icon-close" />
            </div>
            <div class="height_value">
              <div>2000</div>
              <div />
              <div />
              <div>1500</div>
              <div />
              <div />
              <div />
              <div>1000</div>
              <div />
              <div />
              <div />
              <div>500</div>
              <div />
              <div />
              <div />
              <div>0</div>
            </div>
          </div>
          <el-scrollbar ref="myScrollbar" class="scroll_parent" :native="false" :noresize="false">
            <div id="body">
              <div v-show="isLegendChange" id="canvas" ref="canvas" class="canvas" />
            </div>
          </el-scrollbar>
          <div v-if="runType == 'runway1'" class="run-name">
            <span>18R</span>
            <span>MID1</span>
            <span>36L</span>
          </div>
          <div v-if="runType == 'runway2'" class="run-name">
            <span>18L</span>
            <span>MID2</span>
            <span>36R</span>
          </div>
          <div v-if="runType == 'runway3'" class="run-name">
            <span>19</span>
            <span>MID3</span>
            <span>01</span>
          </div>
          <div class="unit">
            <span class="length_font">(长度:KM)</span>
          </div>
        </article>

        <article ref="wind_footer" class="wind_footer">
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
              <div class="title_icon" />
              <span>{{ runName }}</span>
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
              v-model="runwayTime"
              :step="100/24"
              :format-tooltip="getTime"
              @input="changeTime"
              @change="changeTimeToPic"
            />
          </div>
        </article>
      </div>
      <!-- 剖面风 end -->

      <!-- 控制条 start -->
      <div class="control" :style="{ bottom: enlargBottom + 'rem' }" />
      <!-- 控制条 end -->
    </div>

    <video id="trailer" muted autoplay loop crossorigin controls style="position:absolute;z-index:200;bottom:50px;width:25%;right:100px;opacity: 0;">
      <source src="/statics/20191210.mp4" type="video/mp4">
    </video>
  </div>
</template>
<script>
import Cesium from 'cesium/Cesium'
import widgets from 'cesium/Widgets/widgets.css'
import utilTime from '@/utils/time'
import { getRunwayPointForecastData, getParabolic, getModelForecast, getRunwaysForecast } from '@/api/wind'
import windImgUrl from '@/assets/images/windImg.png'
import slider from './components/slider.vue'
import bottomCard from './components/chart.vue'
import rightCard from './components/card.vue'
import hoverCard from './components/hover-card.vue'
import ColorImage from '@/components/wind/ColorImage'
import Wind3D from '@/components/wind/wind3D.js'
import axios from 'axios'
import setLand from '@/components/wind/land.js'
import airImgUrl from '@/assets/images/airbg.png'
import Heatmap from 'heatmap.js'
var i = 0
var t3 = null
var FYD = null
var FYDen = null
var FYDbet = null
var FY3D = null
var arr3 = null
var speed = 500
var speedSate = 1000
var j = Date.now()
var p3 = 0
var onTick = null
export default {
  components: {
    hoverCard,
    rightCard,
    bottomCard,
    slider
  },
  data() {
    return {
      selectedPlane:null,
      targetY :0.0,
      yellowPlane0:new Cesium.Plane(new Cesium.Cartesian3(0,0, -1), 0.0),
      targetX :0.0,
      redPlane0:new Cesium.Plane(new Cesium.Cartesian3(0,1, 0), 0.0),
      targetZ :0.0,
      bluePlane0:new Cesium.Plane(new Cesium.Cartesian3(1,0, 0), 0.0),
      page: '', // global 全球；wind 风；land 飞机起降；route 航线；message 报文
      gray: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}',
      windMap: 'http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      landMap: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      mapBG: '',
      viewer: null,
      fsData: [],
      pointName: [
        {
          name: '18R',
          lat: 116.575473,
          lng: 40.10303,
          runway: 0,
          id: '18R'
        },
        {
          name: 'MID1',
          lat: 116.577925,
          lng: 40.088623,
          runway: 0,
          id: 'MID1'
        },
        {
          name: '36L',
          lat: 116.580113,
          lng: 40.074035,
          runway: 0,
          id: '36L'
        },
        {
          name: '18L',
          lat: 116.600573,
          lng: 40.089862,
          runway: 1,
          id: '18L'
        },
        {
          name: 'MID2',
          lat: 116.603528,
          lng: 40.07174,
          runway: 1,
          id: 'MID2'
        },
        {
          name: '36R',
          lat: 116.605809,
          lng: 40.056497,
          runway: 1,
          id: '36R'
        },
        {
          name: '19',
          lat: 116.617997,
          lng: 40.094787,
          runway: 2,
          id: '19'
        },
        {
          name: 'MID3',
          lat: 116.621128,
          lng: 40.074618,
          runway: 2,
          id: 'MID3'
        },
        {
          name: '01',
          lat: 116.623469,
          lng: 40.059059,
          runway: 2,
          id: '01'
        }
      ], // 九站点名
      ways: [
        {
          name: 'Runway1',
          fromDegreesArray: [116.575473, 40.10303, 116.580113, 40.074035],
          color: ['18R', 'MID1', '36L'],
          runway: 0
        },
        {
          name: 'Runway2',
          fromDegreesArray: [116.600573, 40.089862, 116.605809, 40.056497],
          color: ['18L', 'MID2', '36R'],
          runway: 1
        },
        {
          name: 'Runway3',
          fromDegreesArray: [116.617997, 40.094787, 116.623469, 40.059059],
          color: ['19', 'MID3', '01'],
          runway: 2
        }
      ], // 跑道
      waysName: [
        {
          name: '跑道1',
          lat: 116.580113,
          lng: 40.074035,
          runway: 0,
          id: 'pd1'
        },
        {
          name: '跑道2',
          lat: 116.605809,
          lng: 40.056497,
          runway: 1,
          id: 'pd2'
        },
        {
          name: '跑道3',
          lat: 116.623469,
          lng: 40.059059,
          runway: 2,
          id: 'pd3'
        }
      ], // 跑道名称
      walls: [
        {
          name: 'runway1',
          fromDegreesArrayHeights: [116.575473, 40.10303, 2100, 116.580113, 40.074035, 2100]
        },
        {
          name: 'runway2',
          fromDegreesArrayHeights: [116.600573, 40.089862, 2100, 116.605809, 40.056497, 2100]
        },
        {
          name: 'runway3',
          fromDegreesArrayHeights: [116.617997, 40.094787, 2100, 116.623469, 40.059059, 2100]
        }
      ], // 剖面风
      activeWind: 'plane', // plane 平面风；section 剖面风
      heightLevel: 0,
      sectionwindDetail: false,
      info: {},
      site: 'ZBAA',
      clickSite: 'ZBAA',
      hoverSite: 'ZBAA',
      changeT: false,
      hoverStyle: {
        top: '',
        left: ''
      },
      forecastTab: 'near', // near：临近预报；short：短时预报
      hoverIndex: 0,
      dataStartTime: '',
      day: '',
      enlargBottom: 3.3,
      isHoverShow: false,
      infoTime: '',
      entity: null,
      runType: 'runway1',
      runwayTime: 1,
      isDetail: false,
      isLegendChange: true,
      runName: '跑道1',
      height_num: 35,
      hot: true,
      particle: true,
      windData: null,
      gradientWind: {
        '1.0': 'rgb(255,255,0)',
        '0.9': 'rgb(0,255,0)',
        '0.8': 'rgb(0,255,88)',
        '0.7': 'rgb(0,255,178)',
        '0.6': 'rgb(0,255,255)',
        '0.3': 'rgb(0,178,255)',
        '0.0': 'rgb(0,0,255)'
      },
      wind3D: null,
      satellite: [
        {
          'satellitename': 'FY3B',
          'id': '3B',
          'groundId': 'B',
          'sername': 'ser3B',
          'arrname': 'arr3B',
          'width': '80.5',
          'height': '85',
          'imgURL': '/images/FY-3B.png'
        },
        {
          'satellitename': 'FY3C',
          'id': '3C',
          'groundId': 'C',
          'sername': 'ser3C',
          'arrname': 'arr3C',
          'width': '80.5',
          'height': '67',
          'imgURL': '/images/FY-3C.png'
        },
        {
          'satellitename': 'FY3D',
          'id': '3D',
          'groundId': 'D',
          'sername': 'ser3D',
          'arrname': 'arr3D',
          'width': '70',
          'height': '100',
          'imgURL': '/images/FY-3D.png'
        }
      ]
    }
  },
  mounted() {
    this.setMap()
  },
  methods: {
    // ---------- 切换场景 start ---------- //
    changePage(val) {
      // global 全球；wind 风；land 飞机起降；route 航线；message 报文
      if (this.page === val) return
      this.page = val
      this.setWindPage(false)
      this.setGlobalPage(false)
      this.setLandPage(false)
      this.deleteEntity()
      switch (val) {
        case 'wind':
          this.mapBG = this.gray
          this.setWindPage(true)
          break
        case 'global':
          this.mapBG = this.globalMap
          this.setGlobalPage(true)
          break
        case 'land':
          this.mapBG = this.landMap
          this.setLandPage(true)
          break
        case 'route':
          this.setRoutePage()
          break
        case 'message':
          this.setMessagePage()
          break
      }

      // 加载一个新的层
      var gdsat = new Cesium.UrlTemplateImageryProvider({
        url: this.mapBG,
        minimumLevel: 3,
        maximumLevel: 18
      })
      this.viewer.imageryLayers.addImageryProvider(gdsat)
    },
    deleteEntity() {
      if (this.wind3D) {
        this.wind3D.removeWindPrimitives()
      }
      if (this.colorImage) {
        this.colorImage.remove(this.viewer)
      }
      if (onTick) {
        this.viewer.clock.onTick.removeEventListener(onTick)
      }
      clearInterval(t3)
    },
    setWindPage(state) {
      this.activeWind = 'plane'
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          116.595534748692,
          40.0580145185529,
          21961.9883961571
        )
      })
      this.getChartData(this.site)
      // 当前时间显示
      let time = this.getNowTime()
      this.day = `${time.y}-${time.m}-${time.d} 星期${time.w} ${time.hh}:${time.mm}:${time.ss}`
      setInterval(() => {
        time = this.getNowTime()
        this.day = `${time.y}-${time.m}-${time.d} 星期${time.w} ${time.hh}:${time.mm}:${time.ss}`
      }, 1000)

      let entity
      this.pointName.forEach((item, i) => {
        entity = this.viewer.entities.getById(item.id)
        if (entity) {
          entity.show = state
        }
      })
      this.waysName.forEach((item, i) => {
        entity = this.viewer.entities.getById(item.id)
        if (entity) {
          entity.show = false
        }
      })
      this.walls.forEach((item, i) => {
        entity = this.viewer.entities.getById(item.name)
        if (entity) {
          entity.show = false
        }
      })
      this.ways.forEach((item, i) => {
        entity = this.viewer.entities.getById(item.name)
        if (entity) {
          entity.show = state
        }
      })
      // 数据渲染
      if (state) {
        setTimeout(() => {
          this.getModelForecastData()
        }, 1000)
      }
      if (state && !entity) {
        setTimeout(() => {
          this.getSiteData()
        }, 1000)
      }
    },
    // 生成len个随机数据
    getData(len) {
        //构建一些随机数据点
        var points = [];
        var max = 0;
        var width = 1000;
        var height = 1000;
        while (len--) {
            var val = Math.floor(Math.random() * 1000);
            max = Math.max(max, val);
            var point = {
                x: Math.floor(Math.random() * width),
                y: Math.floor(Math.random() * height),
                value: val
            };
            points.push(point);
        }
        return {max: max, data: points}
    },

    // 创建热力图
    createHeatMap(max, data) {
        // 创建元素
        let heatDoc = document.createElement("div");
        heatDoc.setAttribute("style", "width:1000px;height:1000px;margin: 0px;display: none;");
        document.body.appendChild(heatDoc);
        // 创建热力图对象
        let heatmap = Heatmap.create({
            container: heatDoc,
            radius: 20,
            maxOpacity: .5,
            minOpacity: 0,
            blur: .75,
            gradient: {
                '1.0': 'rgb(255,255,0)',
          '0.9': 'rgb(0,255,0)',
          '0.8': 'rgb(0,255,88)',
          '0.7': 'rgb(0,255,178)',
          '0.6': 'rgb(0,255,255)',
          '0.3': 'rgb(0,178,255)',
          '0.0': 'rgb(0,0,255)'
            },
        });
        // 添加数据
        heatmap.setData({
            max: max,
            data: data
        });
        return heatmap;
    },
    setLandPage(state) {
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          116.481554,
          39.684974,
          25961.9883961571
        ),
        orientation: {
          heading: Cesium.Math.toRadians(400.668148999818),
          pitch: Cesium.Math.toRadians(-30.8329210486802),
          roll: Cesium.Math.toRadians(0)
        }
      })
      let entity = this.viewer.entities.getById('landLine')
      if (state) {
        if (!entity) {
          setTimeout(() => {
            setLand(this.viewer, airImgUrl)
          }, 4000)
        }
      }
      if (entity) {
        entity.show = state
      }
      entity = this.viewer.entities.getById('air')
      if (entity) {
        entity.show = state
      }


      let coordinate3 = [-109.0, 41.0, -80.0, 50.0];
      let gradiant={
        '1.0': 'rgb(255,255,0)',
        '0.9': 'rgb(0,255,0)',
        '0.8': 'rgb(0,255,88)',
        '0.7': 'rgb(0,255,178)',
        '0.6': 'rgb(0,255,255)',
        '0.3': 'rgb(0,178,255)',
        '0.0': 'rgb(0,0,255)'
      }
      let heatMap3 = this.createHeatMap(this.getData(10000).max, this.getData(10000).data,gradiant);

      let bluePlane=this.viewer.entities.add({
        name: 'BluePlane',
        position: Cesium.Cartesian3.fromDegrees(116.519855, 40.07209, 300.0),
        plane: {
          // plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_X, 0.0),
          plane:new Cesium.CallbackProperty(this.createPlaneUpdateFunction2(this.bluePlane0), false),
         
          dimensions: new Cesium.Cartesian2(40000.0, 4000.0),
          material: heatMap3._renderer.canvas
        }
      })

      let redPlane = this.viewer.entities.add({
        name: 'RedPlane',
         position: Cesium.Cartesian3.fromDegrees(116.58823, 39.91376, 300.0),
        plane: {
          plane: new Cesium.CallbackProperty(this.createPlaneUpdateFunction1(this.redPlane0), false),
          dimensions: new Cesium.Cartesian2(12000.0, 4000.0),
          material: heatMap3._renderer.canvas
        }
      })
      let yellowPlane = this.viewer.entities.add({
        name: 'YellowPlane',
        position: Cesium.Cartesian3.fromDegrees(116.59303, 40.07061, 0.0),
        plane: {
          // plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_Z, 0.0),
          // plane: this.yellowPlane0,
          plane:new Cesium.CallbackProperty(this.createPlaneUpdateFunction(this.yellowPlane0), false),
          dimensions: new Cesium.Cartesian2(12000.0, 40000.0),
          material: heatMap3._renderer.canvas
        }
      })
      // handlerVideo.setInputAction((movement) => {
      //   if (this.activeWind === 'plane') {
      //     this.pointHandler(movement)
      //   }
      // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
      // 鼠标按下选中平面
      let downHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
      downHandler.setInputAction((movement) => {
          this.planeDownHandler(movement)

      },Cesium.ScreenSpaceEventType.LEFT_DOWN)

      // 鼠标松开释放面板
      let upHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
      upHandler.setInputAction(()=> {
        this.planeUpHandler()
      }, Cesium.ScreenSpaceEventType.LEFT_UP)

      // 更新plane
      let moveHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
      moveHandler.setInputAction((movement)=> {
        this.planeMoveHandler(movement)
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },

    // createPlaneUpdateFunction(plane) {
    //     return function () {
    //        let yellowPlane0=new Cesium.Plane(Cesium.Cartesian3.UNIT_Z, 0.0)
    //       // plane.distance = this.targetY;
    //       return yellowPlane0;
    //     }
    // },
    setGlobalPage(state) {
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          110, 40, 20000000
        )
      })
      if (state) {
        this.playearth()
      }
      let entity
      entity = this.viewer.entities.getById('静止卫星全球拼图')
      if (!entity) {
        var videoElement = document.getElementById('trailer')
        this.viewer.entities.add({
          id: '静止卫星全球拼图',
          rectangle: {
            coordinates: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90),
            material: videoElement
          }
        })
        this.setEquatorY4A()
        this.setFY3D()
        this.dian()
      } else {
        setTimeout(() => {
          if (entity) {
            entity.show = state
          }
          entity = this.viewer.entities.getById('equator')
          if (entity) {
            entity.show = state
          }
          entity = this.viewer.entities.getById('FY4A')
          if (entity) {
            entity.show = state
          }
          entity = this.viewer.entities.getById('FY4A_Gray')
          if (entity) {
            entity.show = state
          }
          entity = this.viewer.entities.getById('JMSZ')
          if (entity) {
            entity.show = state
          }
          entity = this.viewer.entities.getById('FY3D')
          if (entity) {
            entity.show = state
          }
          entity = this.viewer.entities.getById('3D')
          if (entity) {
            entity.show = state
          }
          entity = this.viewer.entities.getById('D')
          if (entity) {
            entity.show = state
          }
          entity = this.viewer.entities.getById('arr3D')
          if (entity) {
            entity.show = state
          }
          t3 = setInterval(() => { this.showD(2) }, 1000)
        }, 5000)
      }
    },
    setEquatorY4A() {
      this.viewer.entities.add({
        id: 'equator',
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([0.0, 0.0, 3000000.0, 90.0, 0.0, 3000000.0, 180.0, 1.0, 3000000.0, 270.0, 0.0, 3000000.0, 360.0, 0.0, 3000000.0]),
          width: 1,
          material: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.YELLOW
          })
        }
      })
      this.viewer.entities.add({
        id: 'FY4A',
        position: Cesium.Cartesian3.fromDegrees(104.7, 0, 3000000),
        billboard: {
          image: '/images/FY-4A.png',
          width: 150,
          height: 90
        },
        label: {
          text: 'FY4A',
          name: 'FY4A',
          font: '14pt monospace',
          fillColor: Cesium.Color.YELLOW,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.TOP,
          pixelOffset: new Cesium.Cartesian2(0, 40)
        }
      })
      this.viewer.entities.add({
        id: 'FY4A_Gray',
        position: Cesium.Cartesian3.fromDegrees(104.7, 0),
        point: {
          pixelSize: 6,
          color: Cesium.Color.GRAY,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 1
        }
      })
    },
    setFY3D() {
      clearInterval(t3)
      p3 = 1
      const SUCCESS = this.satellite
      // SUCCESS.forEach((item, i) => {
      axios.get('/statics/SampleData/windData/fy3d.json').then(res => {
        SUCCESS[2].name = res.data.resource
        if (!SUCCESS[2].name) {
          return SUCCESS
        }
        return SUCCESS
      }).then(res => {
        this.satellite = res
        this.addEntityD('FY3D')
      })
      // })
    },
    addEntityD(name) {
      const SUCCESS = this.satellite
      SUCCESS.forEach((item, i) => {
        if (item.satellitename == name) {
          if (!!SUCCESS[i].name && SUCCESS[i].name.length > 0) {
            FYDen = this.viewer.entities.add({
              id: SUCCESS[i].satellitename,
              position: Cesium.Cartesian3.fromDegrees(30, 30, 1000000),
              billboard: {
                image: SUCCESS[i].imgURL,
                width: SUCCESS[i].width,
                height: SUCCESS[i].height
              },
              label: {
                text: SUCCESS[i].name[0].satellitename,
                font: '14pt monospace',
                style: Cesium.LabelStyle.FULL_AND_OUTLINE,
                outlineWidth: 3,
                fillColor: Cesium.Color.YELLOW,
                verticlOrigin: Cesium.VerticalOrigin.TOP,
                pixelOffset: new Cesium.Cartesian2(20, 45)
              }
            })
            FYD = this.viewer.entities.add({
              id: SUCCESS[i].id,
              position: Cesium.Cartesian3.fromDegrees(30, 30),
              point: {
                pixelSize: 6,
                color: Cesium.Color.GRAY,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 1
              }
            })
            FYDbet = this.viewer.entities.add({
              id: SUCCESS[i].groundId,
              polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights([0, 0, 1000000,
                  0, 0, 1000000, 0, 0, 1000000, 0, 0, 1000000, 0, 0, 1000000, 0, 0, 1000000]),
                width: 3,
                material: new Cesium.PolylineDashMaterialProperty({
                  color: Cesium.Color.YELLOW
                })
              }
            })
            FY3D = this.viewer.entities.add({
              id: SUCCESS[i].arrname,
              polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights([0, 0, 1000000, 0, 0, 1000000,
                  0, 0, 1000000, 0, 0, 1000000, 0, 0, 1000000, 0, 0, 1000000]),
                width: 3,
                material: Cesium.Color.YELLOW
              }
            })
          }
          t3 = setInterval(() => { this.showD(2) }, 1000)
        }
      })
    },
    showD(q) {
      const SUCCESS = this.satellite
      arr3 = SUCCESS[q].name
      if (!!arr3 && !!arr3.length && i < arr3.length - 100) {
        var date = arr3[i].time
        var Latitude = arr3[i].lat
        var Longitude = arr3[i].lon
        var Latitude1 = arr3[i + 10].lat
        var Longitude1 = arr3[i + 10].lon
        var Latitude2 = arr3[i + 20].lat
        var Longitude2 = arr3[i + 20].lon
        var Latitude3 = arr3[i + 30].lat
        var Longitude3 = arr3[i + 30].lon
        var Latitude4 = arr3[i + 40].lat
        var Longitude4 = arr3[i + 40].lon
        var Latitude5 = arr3[i + 50].lat
        var Longitude5 = arr3[i + 50].lon
        var Latitude6 = arr3[i + 60].lat
        var Longitude6 = arr3[i + 60].lon
        var Latitude7 = arr3[i + 70].lat
        var Longitude7 = arr3[i + 70].lon
        var Latitude8 = arr3[i + 80].lat
        var Longitude8 = arr3[i + 80].lon
        var Latitude9 = arr3[i + 90].lat
        var Longitude9 = arr3[i + 90].lon
        var Latitude10 = arr3[i + 100].lat
        var Longitude10 = arr3[i + 100].lon
        FYDbet.polyline.positions = Cesium.Cartesian3.fromDegreesArrayHeights([Longitude5, Latitude5, 1000000,
          Longitude6, Latitude6, 1000000,
          Longitude7, Latitude7, 1000000,
          Longitude8, Latitude8, 1000000,
          Longitude9, Latitude9, 1000000,
          Longitude10, Latitude10, 1000000])
        FYD.position = Cesium.Cartesian3.fromDegrees(Longitude5, Latitude5)
        FY3D.polyline.positions = Cesium.Cartesian3.fromDegreesArrayHeights([Longitude, Latitude, 1000000,
          Longitude1, Latitude1, 1000000,
          Longitude2, Latitude2, 1000000,
          Longitude3, Latitude3, 1000000,
          Longitude4, Latitude4, 1000000,
          Longitude5, Latitude5, 1000000])
        FYDen.position = Cesium.Cartesian3.fromDegrees(Longitude5, Latitude5, 1000000)
      }
      i++
      if (!!arr3 && !!arr3.length && i >= arr3.length - 100) {
        i = 0
      }
    },
    playearth() {
      var _this = this
      onTick = function onTickCallback() {
        var a = 0.3
        var t = Date.now()
        var n = (t - j) / 1e3
        j = t
        _this.viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, a * n)
      }
      this.viewer.clock.onTick.addEventListener(onTick)
    },
    dian() {
      var circleIn4 = new Cesium.CircleOutlineGeometry({
        center: Cesium.Cartesian3.fromDegrees(130.31, 46.80),
        radius: 1.0,
        granularity: 0.001
      })
      var geometryIn = Cesium.CircleOutlineGeometry.createGeometry(circleIn4)
      var float64ArrayPositionsIn = geometryIn.attributes.position.values
      var positionsIn = [].slice.call(float64ArrayPositionsIn)
      var oneArrL1 = positionsIn.length
      var erArrL1 = positionsIn.length / 3
      var er1 = new Array()
      for (var p = 0; p < erArrL1; p++) {
        er1[p] = new Array()
      }
      var k1 = 0
      for (var o = 0; o < erArrL1; o++) {
        for (var u = 0; u < 3; u++) {
          er1[o][u] = positionsIn[k1]
          k1++
          if (k1 > oneArrL1 - 1) {
            break
          }
        }
      }
      var posCir1 = []
      for (var i = 0; i < er1.length; i++) {
        posCir1.push(new Cesium.Cartesian3(er1[i][0], er1[i][1], er1[i][2]))
      }
      var JMS = this.viewer.entities.add({
        id: 'JMSZ',
        polyline: {
          positions: posCir1,
          width: 1,
          material: Cesium.Color.BLUE
        }
      })
    },
    setRoutePage() {},
    setMessagePage() {},
    // ---------- 切换场景 end ---------- //

    // 设置地图
    setMap() {
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
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
          url: this.gray
        })
      })
      // 去掉版权号
      this.viewer._cesiumWidget._creditContainer.style.display = 'none'
      // 删除logo
      this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_CLICK
      )
      // 限制视角高度
      this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 2500// 相机的高度的最小值
      this.viewer.scene.screenSpaceCameraController.maximumZoomDistance = 18000000 // 相机高度的最大值
      this.viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(110, 40, 20000000)
      })
      setTimeout(() => {
        this.changePage('global')
      }, 1000)
    },
    // 获取九点信息
    getSiteData() {
      const time = this.getNowTime()
      getRunwaysForecast({
        datacode: 'ZBAA',
        airport: 'ZBAA',
        runway: 'runway1,runway2,runway3',
        starttime: `${time.y}-${time.m}-${time.d} ${time.hh}:00:00`,
        endtime: `${time.y}-${time.m}-${time.d} ${time.hh}:59:59`,
        dataset: 'SPD',
        resolution: '1000M',
        hight: '0010m'
      }).then(res => {
        if (res.data.returnCode * 1 === 0) {
          this.fsData = res.data.runways
          this.setSite()
        } else {
          this.$message.error(res.data.returnMessage)
        }
      })
    },
    // 设置跑道 九点 剖面风
    setSite() {
      this.pointName.forEach((item, i) => {
        this.drawPoint(item.name, item.id, item.lat, item.lng, item.runway, this.getRunWayColor(this.fsData[item.runway], [item.name])[0], this.getPointColor(this.fsData[item.runway], [item.name])[0], this.activeWind === 'plane')
      })
      this.ways.forEach((item, i) => {
        this.drawRunWays(item.name, item.fromDegreesArray, item.color, 10, item.runway)
      })
      this.waysName.forEach((item, i) => {
        this.drawPoint(item.name, item.id, item.lat, item.lng, item.runway, '#000000', '', this.activeWind === 'section')
      })
      this.walls.forEach((item, i) => {
        this.drawWall(item.name, item.fromDegreesArrayHeights, this.activeWind === 'section')
      })

      var handlerVideo = new Cesium.ScreenSpaceEventHandler(
        this.viewer.scene.canvas
      )
      // 鼠标移动事件
      handlerVideo.setInputAction((movement) => {
        if (this.activeWind === 'plane') {
          this.pointHandler(movement)
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
      // 鼠标左键点击事件
      handlerVideo.setInputAction((click) => {
        this.wallHandler(click)
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },



    createPlaneUpdateFunction(plane) {
      let that= this
      return function () {
          plane.distance = that.targetY;
          return plane;
      };
    },
    createPlaneUpdateFunction1(plane) {
      let that= this
      return function () {
          plane.distance = that.targetX;
          return plane;
      };
    },
    createPlaneUpdateFunction2(plane) {
      let that= this
      return function () {
          plane.distance = that.targetZ;
          return plane;
      };
    },
    // 切换平面风 和 剖面风
    windToggle(type) {
      if (this.activeWind === type) return
      this.activeWind = type
      if (type === 'plane') {
        if (this.particle) {
          this.drawParticleMap()
        }
        this.isLegendChange = true
        this.sectionwindDetail = false
        this.viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            116.595534748692,
            40.0580145185529,
            21961.9883961571
          )
        })
      } else {
        if (this.particle) {
          this.wind3D.removeWindPrimitives()
        }
        this.isLegendChange = false
        this.viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            116.481554,
            39.984974,
            6961.9883961571
          ),
          orientation: {
            heading: Cesium.Math.toRadians(400.668148999818),
            pitch: Cesium.Math.toRadians(-30.8329210486802),
            roll: Cesium.Math.toRadians(0)
          }
        })
      }
      let entity
      this.pointName.forEach((item, i) => {
        entity = this.viewer.entities.getById(item.id)
        if (type === 'plane') {
          entity.show = true
        } else {
          entity.show = false
        }
      })
      this.waysName.forEach((item, i) => {
        entity = this.viewer.entities.getById(item.id)
        if (type === 'section') {
          entity.show = true
        } else {
          entity.show = false
        }
      })
      this.walls.forEach((item, i) => {
        entity = this.viewer.entities.getById(item.name)
        if (type === 'section') {
          entity.show = true
        } else {
          entity.show = false
        }
      })
    },
    // 切换地面高度
    changeHeightLevel(val) {
      this.heightLevel = val.level
      this.getModelForecastData()
    },
    // ---------- 曲线部分 start ---------- //
    // 获取曲线数据
    getChartData(site) {
      getRunwayPointForecastData({
        starttime: this.getStartTime(),
        endtime: this.getEndTime(),
        site: site,
        frequency: '10min',
        dataset: 'RH,SLP,T,PSFC,DIR,RAIN,SPD,U,V',
        resolution: '1000M'
      }).then(res => {
        if (res.data.returnCode * 1 === 0) {
          this.info = res.data.data
          if (this.changeT) {
            this.site = 'ZBAA'
            this.clickSite = 'ZBAA'
            this.hoverSite = 'ZBAA'
            this.changeT = false
          }
        } else {
          this.$message.error(res.data.returnMessage)
        }
      })
    },
    // 切换预报时间 near：临近预报；short：短时预报
    changeForecastTab(val) {
      this.forecastTab = val
      this.changeT = true
      this.clickSite = ''
      this.getChartData('ZBAA')
    },
    changeHeight(val) {
      if (val) {
        this.enlargBottom = 3.3
      } else {
        this.enlargBottom = 1.4
      }
    },
    // ---------- 曲线部分 end ---------- //
    // 获取当前时间对象
    getNowTime() {
      const nowTime = new Date().getTime()
      return utilTime.timeObj(nowTime)
    },
    // ---------- 画跑道 点 剖面风 start ---------- //
    /**
     * 画站点
     * @param text 站点名称
     * @param id 站点id
     * @param lat 站点坐标
     * @param lng 站点坐标
     * @param runway 站点所在跑道
     * @param color 站点字体颜色
     * @param backcolor 站点背景色
     */
    drawPoint(text, id, lat, lng, runway, color, backcolor, show) {
      var r =
          '<table style="width: 200px;"><tr><th scope="col" colspan="4"  style="text-align:center;font-size:15px;">' +
          '</th></tr><tr><td >住用单位：</td><td >XX单位</td></tr><tr><td >建筑面积：</td><td >43平方米</td></tr><tr><td >建筑层数：</td><td >2</td></tr><tr><td >建筑结构：</td><td >钢混</td></tr><tr><td >建筑年份：</td><td >2006年</td></tr><tr><td colspan="4" style="text-align:right;"></td></tr></table>'
      this.viewer.entities.add({
        show: show,
        id: id,
        name: text,
        runway: runway,
        type: 'point',
        position: Cesium.Cartesian3.fromDegrees(lat, lng, 0),
        backColor: backcolor,
        textColor: color,
        label: {
          text: text,
          font: '12px Source Han Sans CN', // 字体样式
          fillColor: Cesium.Color.fromCssColorString(color), // 字体颜色
          backgroundColor: Cesium.Color.fromCssColorString(backcolor), // 背景颜色
          showBackground: show, // 是否显示背景颜色
          style: Cesium.LabelStyle.FILL_AND_OUTLINE, // label样式 TEXT的样式填充以及边框
          outlineWidth: 1,
          outlineColor: Cesium.Color.BLACK,
          verticalOrigin: Cesium.VerticalOrigin.CENTER, // 垂直位置
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT, // 水平位置
          pixelOffset: new Cesium.Cartesian2(10, 0), // 偏移
          scale: 1
        },
        tooltip: { html: r, anchor: [0, -12] }
      })
    },
    // 画跑道
    drawRunWays(name, fromDegreesArray, color, width, runway) {
      this.viewer.entities.add({
        show: true,
        id: name,
        name: name,
        station: name,
        polyline: {
          // 多线段
          positions: Cesium.Cartesian3.fromDegreesArray(fromDegreesArray), // 方位
          width: width, // 折线的宽度（以像素为单位）
          material: new Cesium.ImageMaterialProperty({
            image: this.drawRunWaysColor(this.getRunWayColor(this.fsData[runway], color))
          })
        }
      })
    },
    drawRunWaysColor(colors) {
      var point = [0, 0.5, 1]
      var canvas = document.createElement('canvas') // 创建canvas标签
      var ctx = canvas.getContext('2d')
      var grd = ctx.createLinearGradient(0, 0, 300, 0)
      for (var i = 0; i < point.length; i++) {
        grd.addColorStop(point[i], colors[i])
      }
      ctx.shadowBlur = 10
      ctx.shadowOffsetX = 10
      ctx.shadowColor = 'black'
      ctx.rect(0, 0, 300, 150)
      ctx.fillStyle = grd
      ctx.fill()
      return canvas
    },
    // 画剖面风
    drawWall(name, fromDegreesArrayHeights, show) {
      this.viewer.entities.add({
        show: show,
        id: name,
        name: name,
        type: name,
        wall: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(fromDegreesArrayHeights),
          material: new Cesium.ImageMaterialProperty({
            image: windImgUrl
          }),
          outline: true,
          minimumHeights: [100, 100]
        }
      })
    },
    // 跑道点的颜色
    getRunWayColor(runWay, arr) {
      const runWayColor = []
      arr.forEach(item => {
        if (runWay[item].SPD[0] > 0 && runWay[item].SPD[0] < 5) {
          runWayColor.push('#0BD3A7')
        } else if (runWay[item].SPD[0] >= 5 && runWay[item].SPD[0] < 17) {
          runWayColor.push('#FFBE3A')
        } else if (runWay[item].SPD[0] >= 17) {
          runWayColor.push('#FF2C55')
        }
      })
      return runWayColor
    },
    getPointColor(runWay, arr) {
      const backColor = []
      arr.forEach(item => {
        if (runWay[item].SPD[0] > 0 && runWay[item].SPD[0] < 5) {
          backColor.push('#DDFBF5')
        } else if (runWay[item].SPD[0] >= 5 && runWay[item].SPD[0] < 17) {
          backColor.push('#FFF1D4')
        } else if (runWay[item].SPD[0] >= 17) {
          backColor.push('#FFD8DF')
        }
      })
      return backColor
    },

    planeDownHandler(movement) {
      let pickedObject = this.viewer.scene.pick(movement.position)
      if (Cesium.defined(pickedObject) &&
              Cesium.defined(pickedObject.id) &&
              Cesium.defined(pickedObject.id.plane)) {
          this.selectedPlane = pickedObject.id.plane
          this.selectedPlane.name= pickedObject.id.name+"s"
          // this.selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.05)
          this.selectedPlane.outlineColor = Cesium.Color.WHITE
          this.viewer.scene.screenSpaceCameraController.enableInputs = false
      }
    },
    planeUpHandler(){
      if (Cesium.defined(this.selectedPlane)) {
              // this.selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.1)
              // this.selectedPlane.outlineColor = Cesium.Color.WHITE
              this.selectedPlane = undefined
          }
          this.viewer.scene.screenSpaceCameraController.enableInputs = true

    },     
    planeMoveHandler(movement){
      if(Cesium.defined(this.selectedPlane)){
        if(this.selectedPlane.name=="YellowPlanes"){
          let deltaY = movement.startPosition.y - movement.endPosition.y;
          this.targetY += deltaY;
        }else if(this.selectedPlane.name=="RedPlanes"){
          let deltaX = movement.startPosition.x - movement.endPosition.x;
          this.targetX += deltaX;
        }else if(this.selectedPlane.name=="BluePlanes"){
          let deltaZ = movement.startPosition.y - movement.endPosition.y;
          this.targetZ += deltaZ;
        }
      }
    },        
    // 九点hover事件
    pointHandler(movement) {
      var pick = this.viewer.scene.pick(movement.endPosition)
      if (!!pick && !!pick.id && !!pick.id.name && this.activeWind === 'plane') {
        const name = this.pointName.some(item => {
          return item.name == pick.id.name.trim()
        })
        this.isHoverShow = true
        if (name && pick.id.name.trim() != this.hoverSite) {
          this.hoverSite = pick.id.name.trim()
          this.getChartData(this.hoverSite)
          this.hoverStyle.top = movement.endPosition.y + 'px'
          this.hoverStyle.left = movement.endPosition.x + 130 + 'px'
          this.infoTime = '2019-12-03 ' + this.showHour + ':00:00'
        }
      } else {
        this.isHoverShow = false
      }
      if (this.entity && this.entity.id.label.scale != 1) {
        if (!pick || this.entity.id.id != pick.id.id) {
          this.entity.id.label.scale = 1
          this.entity.id.label.fillColor = Cesium.Color.fromCssColorString(
            this.entity.id.textColor
          )
          this.entity.id.label.backgroundColor = Cesium.Color.fromCssColorString(
            this.entity.id.backColor
          )
          if (pick && pick.id.type === 'station') {
            this.entity = pick
          } else {
            this.entity = undefined
          }
        }
      }
      if (pick && pick.id.type === 'point') {
        this.entity = pick
        pick.id.label.scale = 1.5
        pick.id.label.fillColor = Cesium.Color.fromCssColorString('#ffffff')
        pick.id.label.backgroundColor = Cesium.Color.fromCssColorString(
          pick.id.textColor
        )
      }
    },
    // 九点、剖面风click事件
    wallHandler(data) {
      var pick = this.viewer.scene.pick(data.position)
      if (this.activeWind === 'plane') {
        if (pick.id.name) {
          this.clickSite = pick.id.name.trim()
        }
      } else {
        if (pick) {
          if (pick.id.name.indexOf('runway') >= 0) {
            this.sectionwindDetail = true
            this.changeRunway(pick.id.type)
          }
        }
      }
    },
    // ---------- 画跑道 点 剖面风 end ---------- //
    // ---------- 获取曲线开始时间 start ---------- //
    getStartTime() {
      const nowTime = new Date().getTime()
      const dataStartTime = utilTime.timeObj(nowTime)
      var mm = dataStartTime.mm
      if (mm < 10 && mm >= 0) {
        mm = 0 + '0'
      } else if (mm < 20 && mm >= 10) {
        mm = 10
      } else if (mm < 30 && mm >= 20) {
        mm = 20
      } else if (mm < 40 && mm >= 30) {
        mm = 30
      } else if (mm < 50 && mm >= 40) {
        mm = 40
      } else if (mm <= 59 && mm >= 50) {
        mm = 50
      }
      this.dataStartTime = `${dataStartTime.y}-${dataStartTime.m}-${dataStartTime.d} ${dataStartTime.hh}:${mm}:00`
      if (this.forecastTab === 'near') {
        const sTime = utilTime.timeObj(nowTime - 6 * 60 * 60 * 1000)
        this.hoverIndex = 6 * 6
        return `${sTime.y}-${sTime.m}-${sTime.d} ${sTime.hh}:${mm}:00`
      } else {
        const sTime = utilTime.timeObj(nowTime - 12 * 60 * 60 * 1000)
        this.hoverIndex = 12 * 6
        return `${sTime.y}-${sTime.m}-${sTime.d} ${sTime.hh}:${mm}:00`
      }
    },
    getEndTime() {
      const nowTime = new Date().getTime()
      if (this.forecastTab === 'near') {
        const sTime = utilTime.timeObj(nowTime + 6 * 60 * 60 * 1000)
        return `${sTime.y}-${sTime.m}-${sTime.d} ${sTime.hh}:00:00`
        // return '2019-11-22 20:00:00'
      } else {
        const sTime = utilTime.timeObj(nowTime + 24 * 60 * 60 * 1000)
        return `${sTime.y}-${sTime.m}-${sTime.d} ${sTime.hh}:00:00`
        // return '2019-11-21 22:00:00'
      }
    },
    // ---------- 获取曲线开始时间 end ---------- //
    // ---------- 剖面风 start ----------//
    changeRunway(type) {
      switch (type) {
        case 'runway1':
          this.runName = '跑道1'
          break
        case 'runway2':
          this.runName = '跑道2'
          break
        case 'runway3':
          this.runName = '跑道3'
          break
      }
      this.runType = type
      this.runwayTime = 1
      this.$refs.canvas.innerHTML = ''
      const time = this.getNowTime()
      getParabolic({
        dataCode: 'ABC',
        dataSet: 'XLONG,XLAT,hight,U,V,W',
        time: `${time.y}-${time.m}-${time.d} 00:00:00`,
        resolution: '1000M',
        runway: type
      }).then(res => {
        this.$refs['myScrollbar'].wrap.scrollLeft = 0
        return res.data
      }).then(res => {
        this.drawDiv(this.formatData(res))
      })
    },
    formatData(data) {
      var v = data['data']['V']
      var w = data['data']['W']
      var xlat = data['data']['XLAT']
      this.height_num = Math.ceil(data['data']['count'] / 16)
      var sortList = []
      // 每行数据按纬度xlat排序
      for (let i = 0, len = xlat.length / this.height_num; i < len; i++) {
        var jList = []
        for (let j = 0; j < this.height_num; j++) {
          if (jList.length == 0) {
            jList.push(j)
          } else if (
            xlat[i * this.height_num + j] <=
            xlat[i * this.height_num + jList[jList.length - 1]]
          ) {
            jList.push(j)
          } else if (
            xlat[i * this.height_num + j] >=
            xlat[i * this.height_num + jList[0]]
          ) {
            jList.unshift(j)
          } else {
            for (let k = 1, klen = jList.length; k < klen; k++) {
              if (
                xlat[i * this.height_num + j] >=
                  xlat[i * this.height_num + jList[k]] &&
                xlat[i * this.height_num + j] <=
                  xlat[i * this.height_num + jList[k - 1]]
              ) {
                jList.splice(k, 0, j)
              }
            }
          }
        }
        sortList.push(jList)
      }
      // 整理最后的数据[xlat,w,v,speed,speed_direction]
      var finList = []
      for (let i = 0, len = xlat.length / this.height_num; i < len; i++) {
        var xList = []
        for (let j = 0; j < this.height_num; j++) {
          var w1 =
            w[[i * this.height_num + sortList[i][j]]] == null
              ? 0
              : w[[i * this.height_num + sortList[i][j]]]
          var v1 = v[[i * this.height_num + sortList[i][j]]]
          var speed = Math.sqrt(w1 * w1 + v1 * v1)
          var r2d = 45.0 / Math.atan(1.0)
          var speed_dir = 0
          if (v1 == 0 && w1 > 0) {
            speed_dir = 0
          } else if (v1 == 0 && w1 < 0) {
            speed_dir = 180
          } else {
            // speed_dir=Math.atan((-1*w1)/(-1/v1))*r2d
            speed_dir = Math.atan((-1 * v1) / (-1 * w1 * 10)) * r2d
          }
          if (speed_dir < 0) {
            speed_dir = speed_dir + 360
          }
          speed_dir += 180
          //  if(speed_dir>360){speed_dir -= 180}
          xList.push([
            xlat[i * this.height_num + sortList[i][j]],
            w1,
            v1,
            speed,
            speed_dir,
            i
          ])
        }
        finList.push(xList)
      }
      return finList
    },
    drawDiv(finList) {
      var body = document.getElementById('body')
      var canvast = document.getElementById('canvas')
      body.removeChild(canvast)
      var canvas = document.createElement('div')
      canvas.setAttribute('id', 'canvas')
      body.appendChild(canvas)
      if (finList.length < 1) {
        return
      }
      // calc(105vh + 1050px);
      const stylestr = 'width : calc(' + (finList[0].length * 3) + 'vh + ' + (finList[0].length * 30) + 'px)'
      body.setAttribute('style', stylestr)
      for (let len = finList.length, j = len - 1; j >= 0; j--) {
        var div_0 = document.createElement('div')
        div_0.setAttribute(
          'style',
          'text-align:center;display:flex;padding-left: 5px;background: linear-gradient(180deg,rgba(242, 247, 255, 1) 0%,rgba(250, 252, 255, 1) 100%);'
        )
        for (let i = 0, len1 = finList[0].length; i < len1; i++) {
          var div_1 = document.createElement('div')
          div_1.setAttribute('class', 'demo')
          if (i == 14) {
            div_1.style =
              'border-left:2px dashed red;box-shadow:inset 15px 0px  10px -15px red;'
          }
          if (i == 14 && j == finList.length - 1) {
            div_1.style =
              'border-left:2px dashed red;border-top:2px dashed red;box-shadow:inset 8px 8px 9px -8px red;'
          }
          if (j == finList.length - 1 && i > 14 && i < 20) {
            div_1.style =
              'border-top:2px dashed red;box-shadow:inset -1px 11px 13px -15px red'
          }
          if (i == 20) {
            div_1.style =
              'border-right:2px dashed red;box-shadow:inset -15px 0px  10px -15px red'
          }
          if (i == 20 && j == finList.length - 1) {
            div_1.style =
              'border-right:2px dashed red;border-top:2px dashed red;box-shadow:inset -8px 8px  9px -8px red'
          }
          if (j == 0 && i > 14 && i < 20) {
            div_1.style =
              'border-bottom:2px dashed red;box-shadow:inset -1px -11px 13px -15px red'
          }
          if (j == 0 && i == 14) {
            div_1.style =
              'border-bottom:2px dashed red; border-left:2px dashed red;box-shadow:inset 8px -8px 9px -8px red;'
          }
          if (j == 0 && i == 20) {
            div_1.style =
              'border-bottom:2px dashed red; border-right:2px dashed red;box-shadow:inset -8px -8px 9px -8px red;'
          }
          var b_1 = document.createElement('b')
          var speed = finList[j][i][3]
          var iconid = this.getSpeedIconId(speed)
          b_1.setAttribute('class', 'icon-' + iconid)
          var color = ''
          b_1.setAttribute(
            'style',
            'transform: rotate(' + Math.round(finList[j][i][4]) + 'deg)' + color
          )
          div_1.appendChild(b_1)
          div_0.appendChild(div_1)
        }
        var div_sp = document.createElement('div')
        div_sp.setAttribute('class', 'clear')
        canvas.appendChild(div_sp)
        canvas.appendChild(div_0)
      }
      let value_num = -16
      const hang = document.createElement('div')
      hang.setAttribute(
        'style',
        'text-align:center;display:flex;width: fit-content;padding-left:5px;font-size: 16px;font-family: DINMittelschriftStd;color: rgba(255,255,255,1);line-height: 19px;margin-top: 0.20rem;'
      )
      for (let k = 0; k < 35; k++) {
        const div_child = document.createElement('div')
        div_child.setAttribute('class', 'demo')
        if (k % 2 == 1) {
          div_child.innerHTML = value_num
          value_num = value_num + 2
        }
        hang.appendChild(div_child)
      }
      var div_sp1 = document.createElement('div')
      div_sp1.setAttribute('class', 'clear')
      canvas.appendChild(div_sp1)
      canvas.appendChild(hang)
      // canvas.appendChild(hang2)
    },
    // 详情
    detail(type) {
      this.isDetail = type
    },
    // 点击左右
    moveMyScroll(type) {
      const leftDistance = this.$refs['myScrollbar'].wrap.scrollLeft
      if (type === 'left') {
        if (leftDistance - 30 < 0) {
          this.$refs['myScrollbar'].wrap.scrollLeft = 0
        } else {
          this.$refs['myScrollbar'].wrap.scrollLeft = this.$refs['myScrollbar'].wrap.scrollLeft - 30
        }
      } else {
        if (leftDistance + 30 > this.$refs['myScrollbar'].wrap.scrollWidth) {
          this.$refs['myScrollbar'].wrap.scrollLeft = this.$refs['myScrollbar'].wrap.scrollWidth
        } else {
          this.$refs['myScrollbar'].wrap.scrollLeft = this.$refs['myScrollbar'].wrap.scrollLeft + 30
        }
      }
    },
    closeWindow() {
      this.sectionwindDetail = false
    },
    changeTime() {
      this.sliderTime = new Date(
        new Date(new Date().toLocaleDateString()).getTime() +
          (Math.floor(this.runwayTime * 24) / 100) * 60 * 60 * 1000
      )
    },
    getTime(value) {
      this.searchTime = this.$moment(this.sliderTime)
        .format('YYYY.MM.DD HH:mm')
        .toString()
      return this.searchTime
    },
    changeTimeToPic() {
      this.$refs.canvas.innerHTML = ''
      const timeArray = this.searchTime.split(' ')
      const secondArray = timeArray[1].split(':')
      const time = this.getNowTime()
      // const timestr = '2019-11-01%20' + secondArray[0] + ':' + secondArray[1] + ':00'
      const timestr = `${time.y}-${time.m}-${time.d} ${secondArray[0]}:${secondArray[1]}:00`
      getParabolic({
        dataCode: 'ABC',
        dataSet: 'XLONG,XLAT,hight,U,V,W',
        time: timestr,
        resolution: '1000M',
        runway: this.runType
      }).then(res => {
        this.drawDiv(this.formatData(res.data))
      })
    },
    getSpeedIconId(speed) {
      var t = Math.round(speed, 1)
      // 计算风速图标
      var iconid = 36
      if (speed < 0.3) {
        iconid = 0
      } else if (speed < 2.1) {
        iconid = 2
      } else if (speed < 4.1) {
        iconid = 4
      } else if (speed < 6.1) {
        iconid = 6
      } else if (speed < 8.1) {
        iconid = 8
      } else if (speed < 10.1) {
        iconid = 10
      } else if (speed < 12.1) {
        iconid = 12
      } else if (speed < 14.1) {
        iconid = 14
      } else if (speed < 16.1) {
        iconid = 16
      } else if (speed < 20.1) {
        iconid = 20
      } else if (speed < 24.1) {
        iconid = 24
      } else if (speed < 28.1) {
        iconid = 28
      } else if (speed < 32.1) {
        iconid = 32
      } else {
        iconid = 36
      }
      return iconid
    },
    // ---------- 剖面风 end ----------//
    // ---------- 热力图 粒子 start ----------//
    getModelForecastData() {
      const time = this.getNowTime()
      getModelForecast({
        datacode: 'ABC',
        dataset: 'XLONG,XLAT,U,V',
        time: `${time.y}-${time.m}-${time.d} ${time.hh}:00:00`,
        // time: '2019-12-09 11:00:00',
        bbox: '110,30,120,42',
        z: this.heightLevel,
        resolution: '1000M'
      }).then(res => {
        const resData = res.data.data
        const data = {}
        data.dimensions = {}
        data.dimensions.lon = 120 // dimensions['lon'].size;
        data.dimensions.lat = 120 // dimensions['lat'].size;
        data.dimensions.lev = 1 // dimensions['lev'].size;
        data.lon = {}
        data.lon.array = new Float32Array(resData.XLONG)
        data.lon.min = Math.min.apply(null, data.lon.array) // Math.min(...data.lon.array);
        data.lon.max = Math.max.apply(null, data.lon.array) // Math.max(...data.lon.array);
        data.lat = {}
        data.lat.array = new Float32Array(resData.XLAT)
        data.lat.min = Math.min.apply(null, data.lat.array) // Math.min(...data.lat.array);
        data.lat.max = Math.max.apply(null, data.lat.array) // Math.max(...data.lat.array);
        data.lev = {}
        data.lev.array = new Float32Array([1.0])
        data.lev.min = Math.min.apply(null, data.lev.array) // Math.min(...data.lev.array);
        data.lev.max = Math.max.apply(null, data.lev.array) // Math.max(...data.lev.array);
        data.U = {}
        data.U.array = new Float32Array(resData.U) // new Float32Array(resData.U);
        data.U.min = Math.min.apply(null, data.U.array) // Math.min(...data.U.array);
        data.U.max = Math.max.apply(null, data.U.array) // Math.max(...data.U.array);
        data.V = {}
        data.V.array = new Float32Array(resData.V) // new Float32Array(resData.V);
        data.V.min = Math.min.apply(null, data.V.array) // Math.min(...data.V.array);
        data.V.max = Math.max.apply(null, data.V.array) // Math.max(...data.V.array);
        data.colorTable = this.loadColorTable()
        this.windData = data
        if (this.hot) {
          this.drawHotMap()
        }
        if (this.particle) {
          this.drawParticleMap()
        }
      })
    },
    drawHotMap() {
      const data = this.windData
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
      var points = []
      data.lat.array.forEach((item, i) => {
        const speed = Math.sqrt(udata[i] * udata[i] + vdata[i] * vdata[i])
        speeds.push(speed)
        minSpeed = Math.min(minSpeed, speed)
        maxSpeed = Math.max(maxSpeed, speed)
      })
      data.lat.array.forEach((item, i) => {
        const value = (speeds[i] - minSpeed) * (1 / (maxSpeed - minSpeed))
        max = Math.max(max, value)
        const point = {
          x: (longdata[i] - minLong) * (1000 / (maxLong - minLong)),
          y: (maxLat - latdata[i]) * (1000 / (maxLat - minLat)),
          value: value
        }
        points.push(point)
      })
      const coordinate3 = [minLong, minLat, maxLong, maxLat]
      if (this.colorImage) {
        this.colorImage.redraw(this.viewer, coordinate3, max, points, this.gradientWind)
      } else {
        this.colorImage = new ColorImage(this.viewer, coordinate3, max, points, this.gradientWind)
      }
    },
    drawParticleMap() {
      const particlecount = 100
      const particleSystemOptions = {
        particlesTextureSize: particlecount,
        maxParticles: particlecount * particlecount,
        particleHeight: 200.0,
        fadeOpacity: 0.92,
        dropRate: 0.5,
        dropRateBump: 0.01,
        speedFactor: 3.0,
        lineWidth: 4
      }
      if (this.wind3D) {
        this.wind3D.removeWindPrimitives()
      }
      this.wind3D = new Wind3D(
        this.viewer,
        this.windData,
        particleSystemOptions
      )
    },
    loadColorTable() {
      const json = {
        ncolors: 1,
        colorTable: [1, 1, 1.0, 0.8]
      }
      const colorNum = json['ncolors']
      const colorTable = json['colorTable']
      const channel = 4
      const colorsArray = new Float32Array(channel * colorNum)
      for (var i = 0; i < colorNum; i++) {
        for (var j = 0; j < channel; j++) {
          colorsArray[channel * i + j] = colorTable[channel * i + j]
        }
      }
      const result = {}
      result.colorNum = colorNum
      result.array = colorsArray
      return result
    }
    // ---------- 热力图 粒子 end ----------//
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scopde>
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
.all-type {
  position: fixed;
  top: 0.16rem;
  left: 0.8rem;
  right: 0;
  z-index: 10;
  display: flex;
  div {
    height: 0.4rem;
    line-height: 0.4rem;
    background: rgba(0,100,38,1);
    box-shadow: 0px 6px 19px 0px rgba(36,34,54,0.1);
    border-radius: 4px;
    cursor: pointer;
    margin: 0 4px;
    color: #fff;
    font-weight: 500;
    font-size: 0.15rem;
    padding: 0 20px;
  }
}
.wind {
  height: 100vh;
  #cesiumContainer {
    height: 100vh;
    width: 100%;
  }
  .control {
    position: fixed;
    right: 0;
    height: 0.28rem;
    font-size: 0.14rem;
    transition: bottom 0.3s;
    -ms-transition: bottom 0.3s;
    -moz-transition: bottom 0.3s; /* Firefox 4 */
    -webkit-transition: bottom 0.3s; /* Safari 和 Chrome */
    -o-transition: bottom 0.3s; /* Opera */
  }
  .top-tap {
    position: fixed;
    top: 0.2rem;
    left: 0.8rem;
    right: 0;
    z-index: 1;
    display: flex;
    justify-content: center;
    list-style: none;
    height: 0.4rem;
    margin: 0;
    padding: 0;
    li {
      width: 1.08rem;
      text-align: center;
      height: 0.4rem;
      line-height: 0.4rem;
      background: rgba(0,100,38,1);
      box-shadow: 0px 6px 19px 0px rgba(36,34,54,0.1);
      border-radius: 4px;
      cursor: pointer;
      margin: 0 4px;
      color: #fff;
      font-weight: 500;
      font-size: 0.15rem;
      &:hover,
      &.sp {
        background: rgba(5,137,42,1);
        box-shadow: 0px 6px 19px 0px rgba(0,0,0,0.12);
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
    .run-name {
      display: flex;
      justify-content: center;
      font-size: 0.16rem;
      color: rgba(0, 255, 71, 1);
      line-height: 0.19rem;
      margin: -20px 0 0 0.65rem;
      span {
        margin: 0 0.2rem;
      }
    }
    .wind_header_icon {
      position: fixed;
      right: 0.2rem;
      top: 0.2rem;
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
    .wind_content {
      position: absolute;
      top: 15%;
      left: 0;
      right: 0.2rem;
      .myScroll_btn_div {
        padding-left: 0.89rem;
        padding-right: 0.24rem;
        display: flex;
        justify-content: space-between;
        position: absolute;
        width: 91vw;
        z-index: 1002;
        top: 34%;
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
        bottom: 20px;
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
        right: 0;
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
        // #canvas {
        //   padding-left: 0.1rem;
        // }
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
          font-family: "icomoon" !important;
          font-style: normal;
          font-weight: normal;
          font-variant: normal;
          text-transform: none;
          line-height: 1;
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
        }
        .icon-4:before {
          content: "\e902";
          color: #1266e8;
          position: relative;
        }
        .icon-6:before {
          content: "\e903";
          color: #00dae3;
          position: relative;
        }
        .icon-8:before {
          content: "\e904";
          color: #00e5cb;
          position: relative;
        }
        .icon-10:before {
          content: "\e905";
          color: #02e7af;
          position: relative;
        }
        .icon-12:before {
          content: "\e906";
          color: #1ee77e;
          position: relative;
        }
        .icon-14:before {
          content: "\e907";
          color: #3be84d;
          position: relative;
        }
        .icon-16:before {
          content: "\e908";
          color: #61e80b;
        }
        .icon-20:before {
          content: "\e909";
          color: #8ce800;
          position: relative;
        }
        .icon-24:before {
          content: "\e90a";
          color: #c2e800;
          position: relative;
        }
        .icon-28:before {
          content: "\e90b";
          color: #e5d600;
          position: relative;
        }
        .icon-32:before {
          content: "\e90c";
          color: #e6b000;
          position: relative;
        }
        .icon-36:before {
          content: "\e90d";
          color: #e62408;
          position: relative;
        }
        .clear {
          clear: both;
        }
        .hidden {
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
        margin-bottom: 0.19rem;
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
          border-bottom-right-radius: 2px;
          border-bottom-left-radius: 2px;
          border-style: solid;
          height: 0.1rem;
          border-color: #F2F2F2 transparent;
        }
        /deep/.el-slider__button:before {
          content: "";
          position: absolute;
          height: 0;
          width: 0;
          top: -0.2rem;
          left: 0;
          border-left: 0.06rem solid transparent;
          border-right: 0.06rem solid transparent;
          border-bottom: 0.08rem solid #F2F2F2;
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
}
</style>
