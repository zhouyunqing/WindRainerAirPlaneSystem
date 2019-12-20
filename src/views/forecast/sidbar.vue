<template>
  <div class="all-type">
    <div class="logo" />
    <div @click="jumpTo('wind')">
      <div class="icon">
        <img src="@/assets/images/icon/wind.png" alt="">
      </div>
      <div class="tit">风</div>
    </div>
    <div @click="jumpTo('route')">
      <div class="icon">
        <img src="@/assets/images/icon/air.png" alt="">
      </div>
      <div class="tit">航线</div>
    </div>
    <div @click="jumpTo('message')">
      <div class="icon">
        <img src="@/assets/images/icon/message.png" alt="">
      </div>
      <div class="tit">报文</div>
    </div>
    <div @click="jumpTo('radar')">
      <div class="icon">
        <img src="@/assets/images/icon/radar.png" alt="">
      </div>
      <div class="tit">雷达</div>
    </div>
    <div>
      <div class="icon sp">
        <img src="@/assets/images/icon/forecast.png" alt="">
      </div>
      <div class="tit">预警</div>
    </div>
    <div class="more">
      <div class="icon">
        <img src="@/assets/images/icon/more.png" alt="">
      </div>
      <div class="tit">航线</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 'forecast'
    }
  },
  methods: {
    jumpTo(name) {
      this.$router.push({
        path: '/wind',
        query: {
          page: name
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.all-type {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 10;
  background: rgba(29,38,50,0.98);
  width: 0.64rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  .logo {
    background: url("../../assets/images/mainpage-logo.png") center center no-repeat;
    background-size: 100% 100%;
    height: 0.46rem;
    width: 0.46rem;
    margin-top: 0.14rem;
  }
  > div {
    width: 0.4rem;
    cursor: pointer;
    color: #fff;
    font-weight: 500;
    font-size: 0.15rem;
    margin-bottom: 0.23rem;
    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 0.36rem;
      width: 0.4rem;
      background: rgba(33,165,80,0.2);
      border-radius: 4px;
      margin-bottom: 4px;
      &.sp {
        background: rgba(33,165,80,1);
      }
      img {
        height: 0.28rem;
        width: 0.28rem;
      }
    }
    .tit {
      height: 0.17rem;
      line-height: 0.17rem;
      font-size: 0.12rem;
      font-weight: 300;
      color: rgba(255,255,255,1);
      text-align: center;
      margin-bottom: 0;
    }
    &.more {
      .icon {
        background: transparent;
        border: 1px dashed rgba(255,255,255,1);
      }
    }
  }
}
</style>
