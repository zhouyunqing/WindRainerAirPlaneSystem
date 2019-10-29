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

    this.viewer._cesiumWidget._creditContainer.style.display = "none";
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZjY5ODg0MS1lZTMxLTRmMGMtOTRhYi00N2M2YjQ3ZDMzNjgiLCJpZCI6NDgwLCJpYXQiOjE1MjUyNTE1Nzh9.5Mi3ijReKCRQ_Shupv2w-wl2eJBRLOOW3Bmeq0IL5Y4'
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

