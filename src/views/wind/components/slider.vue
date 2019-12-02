<template>
  <div v-if="!!space.length" class="slider">
    <div ref="slider" class="slider-wrap" @click="clickSlider($event)">
      <span v-for="(item, i) in space" :key="i" :class="{sp: item.key == 13}" :data-key="item.key" @mousemove="hoverSapn($event, i)" @click="clickSpan($event, i)">
        <i v-if="item.key == 13">{{ item.val }}</i>
      </span>
      <div ref="cardSp" class="slider-card sp" :style="{ top: spClientY + 'px' }">
        <div v-if="!!space[spaceSpIndex].hPa">{{ space[spaceSpIndex].hPa }}hPa</div>
        <div class="num">
          <span>{{ space[spaceSpIndex].val }}</span>
          <span v-if="!!space[spaceSpIndex].ft">{{ space[spaceSpIndex].ft }}ft</span>
        </div>
      </div>
    </div>
    <div ref="card" class="slider-card" :style="{ top: clientY + 'px' }" @mousedown="dragSliderStart($event)">
      <div v-if="!!space[spaceIndex].hPa">{{ space[spaceIndex].hPa }}hPa</div>
      <div class="num">
        <span>{{ space[spaceIndex].val }}</span>
        <span v-if="!!space[spaceIndex].ft">{{ space[spaceIndex].ft }}ft</span>
      </div>
    </div>
  </div>
</template>
<script>
import { getOptions } from '@/api/wind'
export default {
  props: [],
  data() {
    return {
      clientY: 0,
      spClientY: 0,
      height: 0,
      space: [],
      spaceIndex: 0,
      spaceSpIndex: 0,
      cHeight: 0
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      getOptions({
        catagory: 'interp_levels',
        nsukey: 'UTAAsDwiYaznS1ZkZoXvuVxYMuaxdN9jLfzr792Q2EFqNZuVDweA1cGIjKf6oF0ahPTnsj0NPcyI5u2GbzqStoATMBucWwiWjsvZKpcfnKIjzxjDcr9xKZ88XaIwpYUWD9TkCpGhT50r49beFGZCth0D9nQsRnow5XfZ%2Bci1GyYIw8cDRaL%2B%2FWqZvO8yxlws9pgc%2FXKj1%2FYP5WkLUpWMAg%3D%3D'
      }).then(res => {
        res.data.data.forEach(item => {
          const val = item.value.split('/')
          item.val = val[0] + 'm'
          item.ft = parseInt(Number(val[0]) * 3.28)
          item.hPa = Number(val[1]) || 0
        })
        this.space = [].concat(res.data.data).reverse()
        this.space.push({
          val: '地面',
          key: '0'
        })
        return this.space
      }).then(res => {
        const sTop = this.$refs.slider.offsetTop
        const sHeight = this.$refs.slider.offsetHeight
        this.cHeight = this.$refs.card.offsetHeight / 3
        this.clientY = sTop + sHeight - this.cHeight
        this.height = sHeight
        this.spaceIndex = res.length - 1
        const sp = sHeight / this.space.length
        this.space.forEach((item, i) => {
          item.sp = parseInt(sTop + sp * i)
        })
      })
    },
    clickSlider(e) {
      const cHeight = this.$refs.cardSp.offsetHeight / 2
      this.clientY = e.clientY - cHeight
      this.$emit('change', this.space[this.spaceIndex].key)
    },
    clickSpan(e, i) {
      this.spaceIndex = i
    },
    hoverSlider(e) {
      const cHeight = this.$refs.cardSp.offsetHeight / 2
      this.spClientY = e.clientY - cHeight
    },
    hoverSapn(e, i) {
      this.spaceSpIndex = i
      this.hoverSlider(e)
    },
    dragSliderStart(e) {
      this.$refs.card.style.cursor = 'move'
      document.onmousemove = e => {
        const cHeight = this.$refs.card.offsetHeight / 2
        const sTop = this.$refs.slider.offsetTop
        const sHeight = this.$refs.slider.offsetHeight
        if (e.clientY >= (sTop + sHeight - cHeight)) {
          this.clientY = sTop + sHeight - cHeight
          this.spaceIndex = this.space.length - 1
          return
        } else if (e.clientY - sTop <= 0) {
          this.clientY = sTop - cHeight
          this.spaceIndex = 0
          return
        } else {
          this.clientY = e.clientY - cHeight
        }
        this.setIndex(this.clientY + cHeight)
      }
      document.onmouseup = e => {
        document.onmousemove = null
        document.onmouseup = null
        this.$emit('change', this.space[this.spaceIndex].key)
      }
    },
    setIndex(y) {
      const sHeight = this.$refs.slider.offsetHeight
      const sp = sHeight / this.space.length
      this.space.forEach((item, i) => {
        const h = y - item.sp
        if (h > 0 && h < sp) {
          this.spaceIndex = i
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.slider {
  .slider-wrap {
    display: flex;
    flex-direction: column;
    position: fixed;
    right: 0.4rem;
    top: 2rem;
    z-index: 10;
    height: 1.72rem;
    width: 0.08rem;
    background:rgba(0,0,0,0.37);
    border-radius: 4px;
    cursor: pointer;
    span {
      font-size: 10px;
      flex-grow: 1;
      i {
        position: absolute;
        top: -8px;
        left: -0.5rem;
        color: #ff8e10;
        font-size: 0.13rem;
        font-weight: 500;
        font-style: normal;
        pointer-events: none;
      }
      &.sp {
        position: relative;
        &:before {
          content: '';
          position: absolute;
          top: 0;
          left: -5px;
          right: -5px;
          height: 1px;
          background: #ff8e10;
        }
      }
    }
    .slider-card.sp {
      display: none;
    }
    &:hover {
      .slider-card.sp {
        display: block;
      }
    }
  }
  .slider-card {
    position: relative;
    position: fixed;
    right: 0.6rem;
    z-index: 20;
    line-height: 0.2rem;
    padding: 0 0.1rem;
    background: #21A550;
    box-shadow: 0px 6px 19px 0px rgba(36,34,54,0.1);
    border-radius: 4px;
    color: #ffffff;
    font-size: 0.12rem;
    font-weight: 500;
    cursor: pointer;
    text-align: left;
    user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      right: -0.1rem;
      margin-top: -0.04rem;
      background: url(../../../assets/images/jiao.svg) 0 0 no-repeat;
      width: 0.1rem;
      height: 0.12rem;
    }
    &.sp {
      z-index: 10;
      background: rgba(0, 0, 0, 0.3);
      &::before {
        background: url(../../../assets/images/jiao2.svg) 0 0 no-repeat;
        opacity: 0.3;
      }
    }
    .num {
      display: flex;
      justify-content: space-between;
      span {
        min-width: 0.5rem;
      }
    }
  }
}
</style>

