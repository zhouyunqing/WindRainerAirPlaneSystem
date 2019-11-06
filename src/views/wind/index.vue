<template>
  <div id="cesiumContainer">
  </div>
</template>
<script>

import Cesium from 'cesium/Cesium'; 
import  widgets from'cesium/Widgets/widgets.css';
import colorTable from '@/components/wind/colorTable.js'
import Wind3D from '@/components/wind/wind3D.js'

export default {
   name: 'cesiumContainer',
   data(){
     return{
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
        }
     }
    
   },
   mounted(){
    // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(71.39628233299722, 17.90751494736041, 137.14821935043528, 49.06704603525708)
    this.viewer = new Cesium.Viewer('cesiumContainer', {
    geocoder:false,
    animation: false,
    shouldAnimate: true,
    homeButton: false,
    baseLayerPicker: false,
    fullscreenButton: false,
    sceneModePicker: false,
    timeline: false,
    navigationHelpButton: false,
    imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
      url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
      enablePickFeatures: false
    }),
//     imageryProvider : new Cesium.UrlTemplateImageryProvider({
//                 url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
//             })
        });
    this.viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
            }));
    //摄像机定位
    let camera = this.viewer.camera;
    camera.setView({
        destination : Cesium.Cartesian3.fromDegrees(116.576534748692, 40.0780145185529, 500),
        orientation: {
            heading : 359.668148999818,
            pitch : -88.8329210486802,
            roll : 0.0
        }
    });
    //定位北京首都机场
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(116.606534748692, 40.0780145185529, 21961.9883961571),
      orientation: {
        heading: Cesium.Math.toRadians(359.668148999818),
        pitch: Cesium.Math.toRadians(-88.8329210486802),
        roll: Cesium.Math.toRadians(0)
      }
    })
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZjY5ODg0MS1lZTMxLTRmMGMtOTRhYi00N2M2YjQ3ZDMzNjgiLCJpZCI6NDgwLCJpYXQiOjE1MjUyNTE1Nzh9.5Mi3ijReKCRQ_Shupv2w-wl2eJBRLOOW3Bmeq0IL5Y4'
    let val=2;
    //加载风场
    if (val === 1){
        this.loadNetCDF(this.urlNetCDF).then((data)=>{
          this.windData = data
        })
      } else if (val === 2){
        let time = "2019-10-31%2000:00:00";
        let level =0

        let jsonPath = "http://161.189.11.216:8090/gis/BJPEK/ModelForecast?datacode=ABC&dataset=XLONG,XLAT,U,V&time="+time+"&bbox=110,30,120,42&z="+level +"&resolution=1000M";//fileOptions.dataDirectory + "wind/wind_"+time+"_L"+level+".json";
        Cesium.Resource.fetchJson({ url: jsonPath }).then((resData) => {
          resData=resData.data 
          let data = {};
      
          data.dimensions = {};
          data.dimensions.lon = 120;//dimensions['lon'].size;
          data.dimensions.lat = 120;//dimensions['lat'].size;
          data.dimensions.lev = 1;//dimensions['lev'].size;

          data.lon = {};
          data.lon.array = new Float32Array(resData.XLONG);
          data.lon.min = Math.min.apply(null,data.lon.array);//Math.min(...data.lon.array);
          data.lon.max = Math.max.apply(null,data.lon.array);//Math.max(...data.lon.array);

          data.lat = {};
          data.lat.array = new Float32Array(resData.XLAT);
          data.lat.min = Math.min.apply(null,data.lat.array);//Math.min(...data.lat.array);
          data.lat.max = Math.max.apply(null,data.lat.array);//Math.max(...data.lat.array);

          data.lev = {};
          data.lev.array = new Float32Array([1.0]);
          data.lev.min = Math.min.apply(null,data.lev.array);//Math.min(...data.lev.array);
          data.lev.max = Math.max.apply(null,data.lev.array);//Math.max(...data.lev.array);

          data.U = {};
          data.U.array = new Float32Array(resData.U);//new Float32Array(resData.U);
          data.U.min = Math.min.apply(null,data.U.array);//Math.min(...data.U.array);
          data.U.max = Math.max.apply(null,data.U.array);//Math.max(...data.U.array);

          data.V = {};
          data.V.array = new Float32Array(resData.V);//new Float32Array(resData.V);
          data.V.min = Math.min.apply(null,data.V.array);//Math.min(...data.V.array);
          data.V.max = Math.max.apply(null,data.V.array);//Math.max(...data.V.array);
           
          this.windData = data
          this.windData.colorTable = loadColorTable()
          let  particlecount=100
          let  particleSystemOptions={
            particlesTextureSize: particlecount,
            maxParticles: particlecount * particlecount,
            particleHeight: 100.0,
            fadeOpacity: 0.92,
            dropRate: 0.03,
            dropRateBump: 0.01,
            speedFactor: 3.0,
            lineWidth: 4
          }
          let windDataMap= this.windData
          let particleSystemOptionsMap=particleSystemOptions;
          let wind3D = new Wind3D(this.viewer,windDataMap,particleSystemOptionsMap) 
          function loadColorTable () {
              let json =  {
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
                  for(var j = 0; j < channel; j++){
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

          function  objToStrMap(obj){
              let strMap = new Map();
              for (let k of Object.keys(obj)) {
                  strMap.set(k,obj[k]);
              }
              return strMap;
          }
        })    
      };
  },

  async loadNetCDF (filePath) {
    let _this = this
    return new Promise(function (resolve) {
      var request = new XMLHttpRequest()
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
<style scoped>
</style>

