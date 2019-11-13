<template>
  <div>
    <div id="cesiumContainer"></div>
    <!-- <div id="windEcharts" ref="chart"></div> -->
    <div id="menu">
      <div class="input" id="search">
        <img src="../../../public/images/icon_sousuo@2x.png" id="search-icon">
        <a id="search-input">输入查询的机场名称或拼音</a>
        <!--<input type="text" placeholder="输入查询的机场名称或拼音" autocomplete="off" id="search-input">-->
      </div>

      <div>
        <div id="flat">
          <li id="flat1">平面风向展示</li>
        </div>
        <div id="profile">
          <li id="profile1">剖面风向展示</li>
        </div>
      </div>

      <div id="menu1">
        <li class="nearmenu">临近预报</li>
      </div>
      <div id="menu11">
        <li class="nearmenu">临近预报</li>
      </div>
      <div id="menu2">
        <li class="nearmenu">短时预报</li>
      </div>
      <div id="menu22">
        <li class="nearmenu">短时预报</li>
      </div>

      <div class="">
        <div id="back">
          <div style="text-align:left;">
            <a id="string"></a>&nbsp;<a id="pointname">ZBAA</a>
          </div>
          <div id="closename">
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
            <a id="windspeedBJ">10m/s</a>
          </div>

          <div id="winddirection">
            <img src="../../../public/images/icon_fengxiang@2x.png" id="winddirectionicon">
            <a id="winddirectionname">地面风向</a>
            <a id="winddirectionBJ">66°</a>
          </div>

          <div id="airpressure">
            <img src="../../../public/images/icon_qiya@2x.png" id="airpressureicon">
            <a id="airpressurename">修正海平面气压</a>
            <a id="airpressureBJ">1024hPa</a>
          </div>

          <div id="T">
            <img src="../../../public/images/icon_wendu@2x.png" id="Ticon">
            <a id="Tname">温度</a><br/>
            <a id="TBJ">24℃</a>
          </div>

          <div id="rain">
            <img src="../../../public/images/icon_jiangyu@2x.png" id="rainicon">
            <a id="rainname">一小时降水量</a>
            <a id="rainBJ">00mm</a>
          </div>

          <div id="humidity">
            <img src="../../../public/images/icon_shidu@2x.png" id="humidityicon">
            <a id="humidityname">相对湿度</a>
            <a id="humidityBJ">40%</a>
          </div>

        </div>
        <div id="tag" v-show="isShow">
          <div id="windEcharts" style="width: 100%;height:100%;"></div>
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

  </div>

</template>
<script>
  import Cesium from "cesium/Cesium";
  import widgets from "cesium/Widgets/widgets.css";
  export default {
    name: "cesiumContainer",
    data(){
      return {
        isShow:true
      }
    },
    methods: {
      closename(){
          this.isShow = this.isShow == false ? true : false
          
      },
      _initEcharts1() {
        var existInstance = this.$echarts.getInstanceByDom(document.getElementById('windEcharts'))
        if (existInstance == undefined) {
          var Echart = this.$echarts.init(document.getElementById('windEcharts'), "", {})
          return Echart
        }
        console.log(existInstance);
        return existInstance
      },

      windDen(wind) {
        if( wind>0&&wind<=30){
          return '30';
        }else if( wind>30&&wind<=60) {
             return '60';
        }else if( wind>60&&wind<=90) {
             return '90';
        }else if( wind>90&&wind<=120) {
             return '120';
        }else if( wind>120&&wind<=150) {
             return '150';
        }else if( wind>150&&wind<=180) {
             return '180';
        }else if( wind>180&&wind<=210) {
             return '210';
        }else if( wind>210&&wind<=240) {
             return '240';
        }else if( wind>240&&wind<=270) {
             return '270';
        }else if( wind>270&&wind<=300) {
             return '300';
        }else if( wind>300&&wind<=330) {
             return '330';
        }else if( wind>330&&wind<=360) {
             return '360';
        }           
      },
      potail(Echarts1) {       

        let Data = {
          times: ["2019-11-04 06:00:00", "2019-11-04 07:00:00", "2019-11-04 08:00:00", "2019-11-04 09:00:00", "2019-11-04 10:00:00", "2019-11-04 11:00:00", "2019-11-04 12:00:00", "2019-11-04 13:00:00", "2019-11-04 14:00:00", "2019-11-04 15:00:00", "2019-11-04 16:00:00", "2019-11-04 17:00:00", "2019-11-04 18:00:00"],
          timeData: ["-6h", "-5h", "-4h", "-3h", "-2h", "-1h", "当前", "+1h", "+2h", "+3h", "+4h", "+5h", "+6h"],
          windxData: ["7.59151","26.12602","17.44157","80.52180","127.83835","96.42430","189.94893","216.46542","140.57217","105.21339","118.94572","140.49603","159.54471"],
          windsData: ["2.8/2", "1.4/1", "2.7/2", "3/2", "2.2/2", "1.4/1", "1.5/1", "1.9/2", "1.4/1", "1.8/2", "2/2", "3.4/3", "3/2"],
          temData: [25.4, 24.3, 24, 23, 22.1, 21.8, 22.7, 23, 25.3, 28.9, 31.3, 32.5, 33],
          rainData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          humData: [59, 67, 70, 74, 77, 77, 65, 63, 60, 47, 40, 36, 38],
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
                    风速:${Data.windsData[index].split('/')[0]}m/s <br>
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
                  return '{' + this.windDen(value) + '| }' ;
                },
                rich: {
                  value: {
                    lineHeight: 16,
                    align: 'left'
                  },
                  30: {
                    height: 16,
                    width:16,
                    align: 'left',
                    backgroundColor: {
                      image:`/images/风向箭头@2x.png`
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
            nameTextStyle: {color: "#BBBBBB",align:"right"},
            axisLabel: {color: "#BBBBBB"},
            splitLine: {show: false}
          },
          {
            type: 'value',
            name: '(单位：m/s)',
            scale: true,
            position: 'right',
            offset:0,
            nameTextStyle:{color:"#BBBBBB",align:"right"},
            axisLabel:{color:"#BBBBBB"},
            splitLine: { show: false }
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

      }
    },

    mounted() {


      let Echarts1 = this._initEcharts1();
      this.potail(Echarts1);


      /**
       * times:YYYY-mm-dd HHMMSS
       * timeData:时间
       * windsData:风速
       * windxData:风向/等级
       * temData:温度
       * ,rainData:降水
       * humData:湿度
       */






      // let wind3d = new Wind();
      // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(71.39628233299722, 17.90751494736041, 137.14821935043528, 49.06704603525708)
      this.viewer = new Cesium.Viewer("cesiumContainer", {
        geocoder: false,
        animation: false,
        shouldAnimate: false,
        homeButton: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        sceneModePicker: false,
        timeline: false,
        navigationHelpButton: false,
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
          url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
//                layer: "tdtVecBasicLayer",
//                style: "default",
//                format: "image/png",
//                tileMatrixSetID: "GoogleMapsCompatible",
//                show: false
        })
      });
      this.viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
        url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
        //            layer: "tdtAnnoLayer",
        //            style: "default",
        //            format: "image/jpeg",
        //            tileMatrixSetID: "GoogleMapsCompatible"
      }));


      let camera = this.viewer.camera;
      camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          117.576534748692,
          40.0780145185529,
          800
        ),
        orientation: {
          heading: 359.668148999818,
          pitch: -88.8329210486802,
          roll: 0.0
        }
      });


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
      Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
        114,
        39,
        120,
        41
      );


    }
  };
</script>

<style>
  .a{
    font-size:0.12rem;
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
    bottom: 38%;
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
    bottom: 38%;
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
    bottom: 38%;
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
    bottom: 38%;
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
    background-color: rgb(36, 34, 54, 1);
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
    top: 71%;
    left: 1%;
    position: absolute;
    z-index: 12;
    width: 100%;
    height: 29%;
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
  .closename-normal{
		transform:rotate(0deg);
	}
			
	.closename-inverse{
		transform: rotate(180deg);
	}
  #flat {
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
    list-style: none;
    top: 10%;
    margin-top: -3%;
    text-align: center;
    margin: 10%;
  }

  #profile {
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
    font-size:0.12rem;
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
    
    font-size:0.12rem;
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
</style>


