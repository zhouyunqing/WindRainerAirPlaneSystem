<template>
  <el-card class="box-card" :body-style="{ padding: '0px' }">
    <div class="title">{{ site }}</div>
    <ul class="item">
      <li>
        <span>顺风风速：</span>
        <em>{{ parseFloat(detail.HWIND[index]).toFixed(2) }}m/s</em>
      </li>
      <li>
        <span>侧风风速：</span>
        <em>{{ parseFloat(detail.CWIND[index]).toFixed(2) }}m/s</em>
      </li>
      <li>
        <span>一小时降水量：</span>
        <em>{{ parseFloat(detail.RAIN[index]).toFixed(1) }}mm</em>
      </li>
      <li>
        <span>地面风向：</span>
        <em>{{ parseInt(detail.DIR[index]) }}°</em>
      </li>
      <li>
        <span>相对湿度：</span>
        <em>{{ parseInt(detail.RH[index]) }}%</em>
      </li>
      <li>
        <span>温度：</span>
        <em>{{ parseInt(detail.T[index] - 272.15) }}℃</em>
      </li>
      <li>
        <span>修正海压：</span>
        <em>{{ parseInt(detail.SLP[index]) }}hPa</em>
      </li>
    </ul>
    <div class="time">数据更新时间：{{ time }}</div>
  </el-card>
</template>
<script>
export default {
  props: ['site', 'detail', 'time', 'index'],
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.box-card {
  position: fixed;
  z-index: 100;
  font-size: 0.14rem;
  font-weight: 500;
  color: #888;
  border: none;
  background: rgba(36,34,54,1);
  box-shadow: 0px 12px 32px 1px rgba(16,15,23,0.15);
  border-radius: 4px;
  text-align: left;
  width: 4rem;
  font-size: 0.15rem;
  font-weight: 400;
  color: #aaaaaa;
  pointer-events: none;
  .title {
    position: relative;
    height: 0.46rem;
    line-height: 0.46rem;
    padding: 0 0.24rem;
    color: #ffffff;
    font-size: 0.2rem;
    border-bottom: 1px #45416F solid;
    font-weight: 500;
    &::before {
      content: '';
      position: absolute;
      left: 0.15rem;
      top: 0.15rem;
      bottom: 0.15rem;
      background: rgba(0,255,71,1);
      border-radius: 1px;
      width: 4px;
    }
  }
  .item {
    display: flex;
    margin: 0;
    padding: 0.15rem;
    list-style: none;
    flex-wrap: wrap;
    li {
      width: 50%;
      line-height: 0.22rem;
      flex-shrink: 0;
      em {
        font-style: normal;
        color: #ffffff;
      }
    }
  }
  .time {
    font-weight: 400;
    color: rgba(170,170,170,1);
    font-size: 0.12rem;
    padding: 0 0.15rem 0.15rem 0.15rem;
  }
}
</style>

