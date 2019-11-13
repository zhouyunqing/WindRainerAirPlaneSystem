<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  html, body, #cesiumContainer {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
.el-notification {
  background: #242236;
  width: 462px;
  border:none;
  box-shadow: 0 2px 12px 0 #191313;
  padding: 0;
  padding-bottom: 11px;
}
.el-notification__group {
    margin-left: 0px;
    margin-right: 0px;
}
.el-notification__title {
  padding: 12px 20px;
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 20px;
}
.tips {
  .wind_forecast {
    padding: 0.12rem 0.20rem 0.06rem;
    width: 4.62rem;
    background-color: #D92D39;
    .wind_forecast_tittle {
      font-size: 0.18rem;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 0.25rem;
      text-align: left;
    }
    .wind_forecast_body {
      margin-top: 0.05rem;
      display: flex;
      justify-content: space-between;
      font-size: 0.12rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 0.17rem;
    }
  }
  .happen_time {
    padding: 0.12rem 0.20rem 0.06rem;
    text-align: left;
    .happen_time_tittle {
      font-size: 0.14rem;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(187, 187, 187, 1);
      line-height: 0.20rem;
      margin-bottom: 0.05rem;
    }
    .happen_time_body {
      font-size: 0.16rem;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 0.22rem;
    }
  }
}
</style>
