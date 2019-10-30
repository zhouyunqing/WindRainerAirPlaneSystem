<template>
  <div id="cesiumContainer">
  </div>
</template>
<script>

import Cesium from 'cesium/Cesium'; 
import  widgets from'cesium/Widgets/widgets.css';

export default {
   name: 'cesiumContainer',
   mounted(){
      // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(71.39628233299722, 17.90751494736041, 137.14821935043528, 49.06704603525708)
      this.viewer = new Cesium.Viewer('cesiumContainer', {
      animation: false,
      shouldAnimate: true,
      homeButton: true,
      baseLayerPicker: true,
      fullscreenButton: false,
      sceneModePicker: true,
      timeline: false,
      navigationHelpButton: false,
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
        enablePickFeatures: false
      })
    })
    let camera = this.viewer.camera;
    camera.setView({
        destination : Cesium.Cartesian3.fromDegrees(116.576534748692, 40.0780145185529, 500),
        orientation: {
            heading : 359.668148999818,
            pitch : -88.8329210486802,
            roll : 0.0
        }
    });

    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(116.576534748692, 40.0780145185529, 21961.9883961571),
      orientation: {
        heading: Cesium.Math.toRadians(359.668148999818),
        pitch: Cesium.Math.toRadians(-88.8329210486802),
        roll: Cesium.Math.toRadians(0)
      }
    })
    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZjY5ODg0MS1lZTMxLTRmMGMtOTRhYi00N2M2YjQ3ZDMzNjgiLCJpZCI6NDgwLCJpYXQiOjE1MjUyNTE1Nzh9.5Mi3ijReKCRQ_Shupv2w-wl2eJBRLOOW3Bmeq0IL5Y4'
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

