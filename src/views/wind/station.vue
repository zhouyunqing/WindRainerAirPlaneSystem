<template>
  <div id="cesiumContainer">
    <div class="station_hover_info" v-show="isHoverShow">
      <div class="station_hover_header">
        <div class="header_icon"></div>
        <div class="header_title">MID1</div>
      </div>
      <div class="station_hover_line"></div>
      <div class="station_hover_container">
        <div><span>地面风速：</span><span>{{info.SPD}}m/s</span></div>
        <div><span>一小时降水量：</span><span>{{info.T2}}MM</span></div>
        <div><span>地面风向：</span><span>{{info.DIR}}°</span></div>
        <div><span>相对湿度：</span><span>{{info.RH}}%</span></div>
        <div><span>温度：</span><span>{{info.T}}℃</span></div>
        <div><span>修正海平面气压：</span><span>{{info.SLP}}hPa</span></div>
      </div>
      <div class="station_hover_footer">
        <div class="footer_time">数据更新时间：{{infoTime}}</div>
      </div>
    </div>
  </div>
</template>
<script>

  import Cesium from 'cesium/Cesium'
  import ElementUI from 'element-ui'
  import widgets from 'cesium/Widgets/widgets.css'

  export default {
    data() {
      return {
        isHoverShow: false, //悬浮数据框显示控制
        windInfo: [], // 风数据,按高度获取
        otherInfo: [], // 其他数据,只有地面2米数据
        nowHour: 12, // 当前时间
        showHour: 12, // 数据展示时间
        infoType: ["DIR", "SPD", "SLP", "T2", "RH", "T"], // 展示数据类型
        windColor: ['#0BD3A7', "#FFBE3A", "#FF2C55"], //跑道色值
        labelColor: ["#DDFBF5", "#FFF1D4", "#FFD8DF"], //站点框色值
        runLists: ["runway1", "runway2", "runway3"], //跑道
        infoTime: "", // 当前展示数据时间
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
    name: 'cesiumContainer',
    mounted() {
      // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(71.39628233299722, 17.90751494736041, 137.14821935043528, 49.06704603525708)
      this.viewer = new Cesium.Viewer('cesiumContainer', {
        geocoder: false,
        animation: false,
        shouldAnimate: true,
        homeButton: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        sceneModePicker: true,
        timeline: false,
        shadows: true,
        terrainShadows: Cesium.ShadowMode.ENABLED,
        navigationHelpButton: false,
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
          url: 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}',
          enablePickFeatures: false
        }),
//        imageryProvider: new Cesium.UrlTemplateImageryProvider({
//          url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
////                layer: "tdtVecBasicLayer",
////                style: "default",
////                format: "image/png",
////                tileMatrixSetID: "GoogleMapsCompatible",
////                show: false
//        })
      })
//      this.viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
//        url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=7",
//        //            layer: "tdtAnnoLayer",
//        //            style: "default",
//        //            format: "image/jpeg",
//        //            tileMatrixSetID: "GoogleMapsCompatible"
//      }));

      this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
      this.viewer.scene.globe.enableLighting = true
      this.viewer.shadows = true
      //摄像机定位
      let camera = this.viewer.camera
      camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(116.576534748692, 40.0780145185529, 500),
        orientation: {
          heading: 359.668148999818,
          pitch: -88.8329210486802,
          roll: 0.0
        }
      })

      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(116.606534748692, 40.0780145185529, 21961.9883961571),
        orientation: {
          heading: Cesium.Math.toRadians(359.668148999818),
          pitch: Cesium.Math.toRadians(-88.8329210486802),
          roll: Cesium.Math.toRadians(0)
        }
      })
      this.viewer._cesiumWidget._creditContainer.style.display = "none"
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZjY5ODg0MS1lZTMxLTRmMGMtOTRhYi00N2M2YjQ3ZDMzNjgiLCJpZCI6NDgwLCJpYXQiOjE1MjUyNTE1Nzh9.5Mi3ijReKCRQ_Shupv2w-wl2eJBRLOOW3Bmeq0IL5Y4'
      this.viewer.entities.add({
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
      })
      this.viewer.entities.add({
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
      })
      this.viewer.entities.add({
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
      })
      this.drawPoint(" 18R ", 116.575473, 40.10303, 0)
      this.drawPoint("MID1", 116.577925, 40.088623, 0)
      this.drawPoint(" 36L ", 116.580113, 40.074035, 0)
      this.drawPoint(" 18L ", 116.600573, 40.089862, 1)
      this.drawPoint("MID2", 116.603528, 40.07174, 1)
      this.drawPoint(" 36R ", 116.605809, 40.056497, 1)
      this.drawPoint("  19  ", 116.617997, 40.094787, 2)
      this.drawPoint("MID3", 116.621128, 40.074618, 2)
      this.drawPoint("  01  ", 116.623469, 40.059059, 2)
      var handlerVideo = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
      var that = this
      handlerVideo.setInputAction(function (movement) {
        that.pointHandler(movement)
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
      this.getStationInfo()
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
        let url = "http://161.189.11.216:8090/gis/BJPEK/RunwaysHistory"
        info.url = url
        info.params = params
        this.$store.dispatch("station/getRankInfo", info).then((res) => { // 按高度获取风数据
          if (res.data.returnCode == 0) {
            this.windInfo = res.data.runways
            this.changeColor(0, 12, "18R", "MID1", "36L")
            this.changeColor(1, 12, "18L", "MID2", "36R")
            this.changeColor(2, 12, "19", "MID3", "01")
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
        var canvas = document.createElement('canvas')     //创建canvas标签
        var ctx = canvas.getContext('2d');
        var grd = ctx.createLinearGradient(0, 0, 300, 0)
        for (var i = 0; i < point.length; i++) {
          grd.addColorStop(point[i], colors[i])
        }
        ctx.shadowBlur = 10
        ctx.shadowOffsetX = 10
        ctx.shadowColor = "black"
        ctx.rect(0, 0, 300, 150)
        ctx.fillStyle = grd
        ctx.fill()
        return canvas
      },
      /**
       * 画站点
       * @param text 站点名称
       * @param lat 站点坐标
       * @param lng 站点坐标
       */
      drawPoint(text, lat, lng, runway) {
        var r = '<table style="width: 200px;"><tr><th scope="col" colspan="4"  style="text-align:center;font-size:15px;">' + '</th></tr><tr><td >住用单位：</td><td >XX单位</td></tr><tr><td >建筑面积：</td><td >43平方米</td></tr><tr><td >建筑层数：</td><td >2</td></tr><tr><td >建筑结构：</td><td >钢混</td></tr><tr><td >建筑年份：</td><td >2006年</td></tr><tr><td colspan="4" style="text-align:right;"></td></tr></table>'
        this.viewer.entities.add({
          id: text.replace(/^\s*|\s*$/g, ""),
          name: text,
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
        var pick = this.viewer.scene.pick(movement.endPosition)
        if (!pick) {
          if (this.entity && this.entity.id.label.scale != 1) {
            this.entity.id.label.scale = 1
            this.entity.id.label.fillColor = Cesium.Color.fromCssColorString(this.entity.id.textColor)
            this.entity.id.label.backgroundColor = Cesium.Color.fromCssColorString(this.entity.id.backColor)
            this.entity = pick
            this.isHoverShow = false
          }
          return
        }
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
            }
          } else {
            this.entity = pick
            pick.id.label.scale = 1.5
            pick.id.label.fillColor = Cesium.Color.fromCssColorString('#ffffff')
            pick.id.label.backgroundColor = Cesium.Color.fromCssColorString(pick.id.textColor)
            this.isHoverShow = true
          }
        }
      },
      /**
       * 格式化时间数据 获取开始时间与结束时间
       * @param date
       * @returns {string}
       */
      formateDate: function (date) {
        var dateTime = null
        var dateTime = date.getFullYear() + '-'
        if (("" + (date.getUTCMonth() + 1)).length == 1) {
          dateTime += '0' + (date.getUTCMonth() + 1) + '-'
        } else {
          dateTime += date.getUTCMonth() + 1 + '-'
        }
        if (("" + date.getUTCDate()).length == 1) {
          dateTime += '0' + date.getUTCDate() + ' '
        } else {
          dateTime += date.getUTCDate() + ' '
        }
        if (("" + date.getUTCHours()).length == 1) {
          dateTime += '0' + date.getUTCHours() + ':'
        } else {
          dateTime += date.getUTCHours() + ':'
        }
        if (("" + date.getUTCMinutes()).length == 1) {
          dateTime += '0' + date.getUTCMinutes() + ':'
        } else {
          dateTime += date.getUTCMinutes() + ':'
        }
        if (("" + date.getUTCSeconds()).length == 1) {
          dateTime += '0' + date.getUTCSeconds()
        } else {
          dateTime += date.getUTCSeconds()
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
        console.log(s)
        s.label.fillColor = Cesium.Color.fromCssColorString(color)    //字体颜色
        s.backColor = textColor
        s.textColor = color
        s.label.backgroundColor = Cesium.Color.fromCssColorString(textColor)   //背景颜色
        return color
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .station_hover_info {
    width: 3.333rem;
    height: 1.508rem;
    background: rgba(36, 34, 54, 1);
    box-shadow: 0rem 0.1rem 0.267rem 0.008rem rgba(16, 15, 23, 0.15);
    border-radius: 0.033rem;
    position: absolute;
    top: 1.608rem;
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
    margin-left: 0.1rem;
    display: flex;
    align-items: center;
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
    width: 1.75rem;
    height: 0.142rem;
    font-size: 0.1rem;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(170, 170, 170, 1);
    line-height: 0.142rem;
    margin-left: 0.1rem;
  }
</style>

