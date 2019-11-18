<template>
  <el-card class="box-card" :body-style="{ padding: '0px' }">
    <div class="title">{{ cardTitle }}</div>
    <ul class="item">
      <li>{{ normal }}</li>
      <li>{{ light }}</li>
      <li>{{ serious }}</li>
    </ul>
  </el-card>
</template>
<script>
export default {
  props: ['cardTitle', 'normal', 'light', 'serious'],
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped>
  .box-card {
    position: fixed;
    top: 20px;
    right: 20px;
    font-size: 0.14rem;
    color: #888;
    border: none;
    background: #242236;
    border-radius: 4px;
    .title {
      height: 0.4rem;
      line-height: 0.4rem;
      border-bottom: 1px #45416F solid;
      padding: 0 0.16rem 0 0.21rem;
      font-size: 0.15rem;
      font-weight:500;
      color:rgba(225,225,225,1);
      position: relative;
      &::before {
        content: '';
        position: absolute;
        top: 0.12rem;
        bottom: 0.12rem;
        left: 0.15rem;
        width: 1px;
        background: #05892A;
      }
    }
    .item {
      margin: 0;
      padding: 0.1rem 0.16rem 0.16rem;
      text-align: left;
      list-style: none;
      li {
        height: 0.32rem;
        line-height: 0.32rem;
        padding-left: 0.24rem;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 0.16rem;
          background: #FFBE3A;
        }
        &:first-child {
          &::before {
            background: #0BD3A7;
            border-radius: 2px 2px 0 0;
          }
        }
        &:last-child {
          &::before {
            background: #FF2C55;
            border-radius: 0 0 2px 2px;
          }
        }
      }
    }
  }
</style>

