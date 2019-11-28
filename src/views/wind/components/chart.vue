<template>
  <div class="wind-chart">
    <ul v-if="active == 'plane'" class="tab">
      <li :class="{sp: forecastTab == 'near'}" @click="changeForecastTab('near')">临近预报</li>
      <li :class="{sp: forecastTab == 'short'}" @click="changeForecastTab('short')">短时预报</li>
    </ul>
    <div class="content">
      <div class="content-title">
        <div>{{ params.site || 'ZBAA' }}</div>
        <i v-if="active == 'plane'" :class="{sp: chartShow}" @click="upAndDown" />
      </div>
      <div class="content-tab">
        <div class="time">{{ time }}</div>
        <div class="right-tab">
          <div class="right-tab-scroll">
            <ul>
              <li v-for="(item, i) in tab" :key="i" @click="changeTab(item.name)">
                <img :src="item.icon" alt="">
                <div v-if="item.name != 'NAME'" :class="{sp: chartTab == item.name}">
                  <div class="tit">{{ item.tit }}</div>
                  <div v-if="!!info[item.name] && item.name == 'SPD'" class="txt">{{ parseFloat(info[item.name][chartIndex]).toFixed(2) || '' }}{{ item.unit }}</div>
                  <div v-if="!!info[item.name] && item.name == 'RAIN'" class="txt">{{ parseFloat(info[item.name][chartIndex]).toFixed(1) || '' }}{{ item.unit }}</div>
                  <div v-if="!!info[item.name] && item.name == 'T'" class="txt">{{ parseInt(info[item.name][chartIndex] - 272.15) || 0 }}{{ item.unit }}</div>
                  <div v-if="!!info[item.name] && item.name == 'DIR'" class="txt">{{ parseInt(info[item.name][chartIndex]) }}{{ item.unit }}</div>
                  <div v-if="!!info[item.name] && item.name == 'RH'" class="txt">{{ parseInt(info[item.name][chartIndex]) }}{{ item.unit }}</div>
                  <div v-if="!!info[item.name] && item.name == 'SLP'" class="txt">{{ parseInt(info[item.name][chartIndex]) }}{{ item.unit }}</div>
                </div>
                <div v-else class="sp">
                  <div class="tit">{{ item.tit }}</div>
                  <div class="txt">{{ item.data }}{{ item.unit }}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>
      <div class="content-chart" :class="{sp: chartShow}">
        <div ref="windEcharts" class="chart-wrap" />
      </div>
    </div>
  </div>
</template>
<script>
import windImgUrl1 from '../../../assets/images/wind1.png'
import windImgUrl2 from '../../../assets/images/wind2.png'
import windImgUrl3 from '../../../assets/images/wind3.png'
import windImgUrl4 from '../../../assets/images/wind4.png'
import windImgUrl5 from '../../../assets/images/wind5.png'
import windImgUrl6 from '../../../assets/images/wind6.png'
import windImgUrl7 from '../../../assets/images/wind7.png'
import windImgUrl8 from '../../../assets/images/wind8.png'
import windImgUrl9 from '../../../assets/images/wind9.png'
import windImgUrl10 from '../../../assets/images/wind10.png'
import windImgUrl11 from '../../../assets/images/wind11.png'
import windImgUrl12 from '../../../assets/images/wind12.png'
import utilTime from '@/utils/time'
export default {
  props: ['time', 'site', 'detail', 'active'],
  data() {
    return {
      forecastTab: 'near', // near：临近预报；short：短时预报
      chartShow: true, // 是否展开图表
      tab: [
        {
          icon: require('../../../../public/images/icon_jichang@2x.png'),
          tit: '机场名称',
          name: 'NAME',
          unit: '',
          data: '北京首都机场'
        }, {
          icon: require('../../../../public/images/icon_fengxiang@2x.png'),
          tit: '地面风向',
          name: 'DIR',
          unit: '°',
          data: ''
        }, {
          icon: require('../../../../public/images/icon_fengsu@2x.png'),
          tit: '地面风速',
          name: 'SPD',
          unit: 'm/s',
          data: ''
        }, {
          icon: require('../../../../public/images/icon_qiya@2x.png'),
          tit: '修正海平面气压',
          name: 'SLP',
          unit: 'hPa',
          data: ''
        }, {
          icon: require('../../../../public/images/icon_wendu@2x.png'),
          tit: '温度',
          name: 'T',
          unit: '℃',
          data: ''
        }, {
          icon: require('../../../../public/images/icon_jiangyu@2x.png'),
          tit: '一小时降水量',
          name: 'RAIN',
          unit: 'mm',
          data: ''
        }, {
          icon: require('../../../../public/images/icon_shidu@2x.png'),
          tit: '相对湿度',
          name: 'RH',
          unit: '%',
          data: ''
        }
      ],
      params: {
        site: 'ZBAA'
      },
      Echarts: null,
      chartTab: 'SPD',
      chartIndex: 0,
      info: {},
      chartTit: {}
    }
  },
  watch: {
    'site'(n, o) {
      this.setChartName()
    },
    'active'() {
      this.setActiveWind()
    }
  },
  mounted() {
    this.setChartName()
  },
  methods: {
    setActiveWind() {
      this.forecastTab = 'near'
      if (this.active == 'section') {
        this.chartShow = false
      } else {
        this.chartShow = true
      }
    },
    setChartName() {
      switch (this.chartTab) {
        case 'RH':
          this.chartTit = {
            tooltip: '湿度',
            tooltipUnit: '%',
            lineName: '湿度 %                     '
          }
          break
        case 'RAIN':
          this.chartTit = {
            tooltip: '降水量',
            tooltipUnit: 'mm',
            lineName: '降水量 mm                     '
          }
          break
        case 'T':
          this.chartTit = {
            tooltip: '温度',
            tooltipUnit: '℃',
            lineName: '温度 ℃                     '
          }
          break
        case 'SLP':
          this.chartTit = {
            tooltip: '气压',
            tooltipUnit: 'hPa',
            lineName: '气压 hPa                     '
          }
          break
        case 'DIR':
          break
        case 'SPD':
          this.chartTit = {
            tooltip: '风速',
            tooltipUnit: 'm/s',
            lineName: '风速 m/s                     '
          }
          break
        case 'NAME':
          break
      }
      this.getData(this.site)
    },
    getData(site) {
      this.params.site = site
      this.info = this.detail
      // this.chartIndex = 0
      this.Echarts = this.initEcharts()
      this.potail(this.Echarts)
    },
    changeForecastTab(name) {
      if (name == this.forecastTab) return
      this.chartIndex = 0
      this.forecastTab = name
      this.chartTab = 'SPD'
      this.$emit('change', name)
    },
    upAndDown() {
      this.chartShow = !this.chartShow
    },
    changeTab(name) {
      if (name == this.chartTab) return
      if (name != 'NAME' && name != 'DIR') {
        this.chartIndex = 0
        this.chartTab = name
        this.setChartName()
        this.Echarts = this.initEcharts()
        this.potail(this.Echarts)
      }
    },
    initEcharts() {
      const dom = this.$refs.windEcharts
      var existInstance = this.$echarts.getInstanceByDom(dom)
      if (!existInstance) {
        var Echart = this.$echarts.init(
          dom,
          '',
          {}
        )
        return Echart
      }
      return existInstance
    },
    potail(Echarts) {
      const Data = this.setOptionData()
      const colors = ['#FF6863', '#6EAB40']
      const option = {
        color: colors,
        backgroundColor: 'transparent',
        tooltip: { // 显示提示框
          trigger: 'axis',
          axisPointer: { type: 'cross' },
          formatter: (params, ticket, callback) => {
            const index = params[0].dataIndex
            const Htm = `${(Data.times[index]).substring(0, 16)}<br>
                    ${this.chartTit.tooltip}:${this.setchartData(Data[this.chartTab][index])}${this.chartTit.tooltipUnit}&nbsp;&nbsp;
                    风向:${parseInt(Data.DIR[index])}°`
            return Htm
          }
        },
        grid: {
          top: 20,
          left: '70',
          right: '5'
        },
        xAxis: [
          {
            name: ' ',
            type: 'category',
            position: 'bottom',
            offset: 0,
            nameTextStyle: { color: '#BBBBBB' },
            axisLabel: { color: '#BBBBBB' },
            axisTick: { show: false },
            data: Data.timeData
          },
          {
            name: '风向',
            type: 'category',
            position: 'bottom',
            offset: 20,
            nameGap: 35,
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: {
              show: true,
              textStyle: {
                color: 'rgba(136, 136, 136, 1)',
                fontSize: 14,
                lineHeight: 20
              },
              interval: 0,
              formatter: value => {
                return '{' + this.windDen(value) + '| }'
              },
              rich: {
                value: {
                  lineHeight: 16,
                  align: 'left'
                },
                30: {
                  height: 16,
                  width: 16,
                  align: 'left',
                  backgroundColor: {
                    image: windImgUrl1
                  }
                },
                60: {
                  height: 16,
                  align: 'left',
                  backgroundColor: {
                    image: windImgUrl2
                  }
                },
                90: {
                  height: 16,
                  align: 'left',
                  backgroundColor: {
                    image: windImgUrl3
                  }
                },
                120: {
                  height: 16,
                  align: 'left',
                  backgroundColor: {
                    image: windImgUrl4
                  }
                },
                150: {
                  height: 16,
                  align: 'left',
                  backgroundColor: {
                    image: windImgUrl5
                  }
                },
                180: {
                  height: 16,
                  align: 'left',
                  backgroundColor: {
                    image: windImgUrl6
                  }
                },
                210: {
                  height: 16,
                  align: 'left',
                  backgroundColor: {
                    image: windImgUrl7
                  }
                },
                240: {
                  height: 16,
                  align: 'left',
                  backgroundColor: {
                    image: windImgUrl8
                  }
                },
                270: {
                  height: 16,
                  align: 'left',
                  backgroundColor: {
                    image: windImgUrl9
                  }
                },
                300: {
                  height: 16,
                  align: 'left',
                  backgroundColor: {
                    image: windImgUrl10
                  }
                },
                330: {
                  height: 16,
                  align: 'left',
                  backgroundColor: {
                    image: windImgUrl11
                  }
                },
                360: {
                  height: 16,
                  align: 'left',
                  backgroundColor: {
                    image: windImgUrl12
                  }
                }
              }
            },
            nameTextStyle: {
              color: 'rgba(136, 136, 136, 1)',
              padding: [0, 0, -38]
            },
            nameLocation: 'start',
            data: Data.DIR
          },
          {
            type: 'category',
            axisLine: { show: false }
          },
          {
            type: 'category',
            position: 'bottom',
            offset: 0,
            nameTextStyle: { color: '#BBBBBB' },
            axisLabel: { color: '#BBBBBB' },
            axisTick: { show: false },
            data: Data.timeData
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: this.chartTit.lineName,
            scale: true,
            position: 'left',
            offset: 0,
            nameGap: 5,
            nameLocation: 'end',
            axisTick: { lineStyle: { color: '#BBBBBB' }, inside: true },
            nameTextStyle: { color: '#BBBBBB' },
            axisLabel: { color: '#BBBBBB' },
            splitLine: { show: false }
            // splitLine: { show: this.chartTab == 'SPD', lineStyle: { color: '#555' }}
          }
        ],
        visualMap: {
          top: 10,
          right: -100,
          smooth: false,
          pieces: [{
            gt: 0,
            lte: 5,
            color: '#0BD3A7'
          }, {
            gt: 5,
            lte: 17,
            color: '#FFBE3A'
          }, {
            gt: 17,
            color: '#FF2C55'
          }],
          outOfRange: {
            color: '#999'
          }
        },
        series: [
          {
            name: this.chartTit.tooltip,
            type: 'line',
            step: false,
            color: '#555',
            // color: {
            //   type: 'linear',
            //   x: 0,
            //   y: 0,
            //   x2: 0,
            //   y2: 1,
            //   colorStops: [{
            //     offset: 0, color: colors[0] // 0% 处的颜色
            //   }, {
            //     offset: 1, color: colors[1] // 100% 处的颜色
            //   }],
            //   global: false
            // },
            // smooth: true,
            data: Data[this.chartTab],
            markLine: {
              symbol: 'none',
              silent: true,
              data: [{
                yAxis: 5
              }, {
                yAxis: 17
              }]
            },
            label: { normal: { show: true, position: 'top' }}
          }
        ]
      }
      Echarts.setOption(option)
      window.addEventListener('resize', (event) => {
        Echarts.resize()
      })
      Echarts.on('mouseover', (obj) => {
        this.chartIndex = obj.dataIndex
      })
    },
    windDen(wind) {
      if (wind > 0 && wind <= 30) {
        return '30'
      } else if (wind > 30 && wind <= 60) {
        return '60'
      } else if (wind > 60 && wind <= 90) {
        return '90'
      } else if (wind > 90 && wind <= 120) {
        return '120'
      } else if (wind > 120 && wind <= 150) {
        return '150'
      } else if (wind > 150 && wind <= 180) {
        return '180'
      } else if (wind > 180 && wind <= 210) {
        return '210'
      } else if (wind > 210 && wind <= 240) {
        return '240'
      } else if (wind > 240 && wind <= 270) {
        return '270'
      } else if (wind > 270 && wind <= 300) {
        return '300'
      } else if (wind > 300 && wind <= 330) {
        return '330'
      } else if (wind > 330 && wind <= 360) {
        return '360'
      }
    },
    setOptionData() {
      const nowTime = new Date().getTime()
      const times = []
      const timeData = []
      const DIR = []
      const RH = []
      const SLP = []
      const T = []
      const RAIN = []
      const SPD = []
      let sTime = 0
      const _this = this
      if (this.forecastTab === 'near') {
        sTime = nowTime - 6 * 60 * 60 * 1000
      } else {
        sTime = nowTime - 12 * 60 * 60 * 1000
      }
      for (var i = 0; i < this.info.DIR.length; i++) {
        const time = utilTime.timeObj(sTime + i * 60 * 60 * 1000)
        times.push(`${time.y}-${time.m}-${time.d} ${time.hh}:00:00`)
        if (nowTime == sTime + i * 60 * 60 * 1000) {
          timeData.push('当前')
          _this.chartIndex = i
        } else {
          timeData.push(`${time.hh}时`)
        }
        DIR.push(parseInt(this.info.DIR[i]))
        RH.push(parseInt(this.info.RH[i]))
        SLP.push(parseInt(this.info.SLP[i]))
        SPD.push(parseFloat(this.info.SPD[i]).toFixed(2))
        RAIN.push(parseFloat(this.info.RAIN[i]).toFixed(1))
        T.push(parseInt(this.info.T[i] - 272.15))
      }
      return {
        times: times,
        timeData: timeData,
        DIR: DIR,
        RH: RH,
        SLP: SLP,
        T: T,
        RAIN: RAIN,
        SPD: SPD
      }
    },
    setchartData(data) {
      let info = null
      switch (this.chartTab) {
        case 'RH':
          info = parseInt(data)
          break
        case 'RAIN':
          info = parseFloat(data).toFixed(1)
          break
        case 'T':
          info = parseInt(data - 272.15)
          break
        case 'SLP':
          info = parseInt(data)
          break
        case 'SPD':
          info = parseFloat(data).toFixed(2)
          break
      }
      return info
    }
  }
}
</script>
<style lang="scss" scoped>
.wind-chart {
  position: fixed;
  bottom: 0.2rem;
  left: 1rem;
  right: 0.2rem;
  font-size: 0.14rem;
  text-align: left;
  font-weight: 500;
  .tab {
    display: flex;
    margin: 0 0 0.1rem;
    padding: 0;
    list-style: none;
    li {
      height: 0.28rem;
      line-height: 0.28rem;
      width: 0.8rem;
      height: 0.28rem;
      background:rgba(227,222,255,1);
      border-radius: 4px;
      border: 1px solid rgba(59,55,87,1);
      text-align: center;
      color: #3B3757;
      margin-right: 0.1rem;
      cursor: pointer;
      &.sp {
        background:rgba(36,34,54,1);
        border: 1px solid rgba(36,34,54,1);
        color: #ffffff;
      }
    }
  }
  .content {
    background: rgba(36,34,54,1);
    box-shadow: 0 0.12rem 0.32rem 0.01rem rgba(16,15,23,0.15);
    border-radius: 4px;
    .content-title {
      height: 0.5rem;
      line-height: 0.5rem;
      padding: 0 0.1rem 0 0.16rem;
      border-bottom: 1px #45416F solid;
      display: flex;
      justify-content: space-between;
      align-items: center;
      div {
        color: #ffffff;
        font-size: 0.22rem;
        padding-left: 0.12rem;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.15rem;
          bottom: 0.15rem;
          width: 4px;
          background: rgba(0,255,71,1);
          border-radius: 1px;
        }
      }
      i {
        height: 0.28rem;
        width: 0.28rem;
        background: url('../../../../public/images/icon_xiangxia@2x.png') center center no-repeat;
        cursor: pointer;
        transform: rotate(180deg);
        -ms-transform: rotate(180deg); 	/* IE 9 */
        -moz-transform: rotate(180deg); 	/* Firefox */
        -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
        -o-transform: rotate(180deg); 	/* Opera */
        transition: transform 0.3s;
        -ms-transition: transform 0.3s;
        -moz-transition: transform 0.3s; /* Firefox 4 */
        -webkit-transition: transform 0.3s; /* Safari 和 Chrome */
        -o-transition: transform 0.3s; /* Opera */
        &.sp {
          transform: rotate(360deg);
          -ms-transform: rotate(360deg); 	/* IE 9 */
          -moz-transform: rotate(360deg); 	/* Firefox */
          -webkit-transform: rotate(360deg); /* Safari 和 Chrome */
          -o-transform: rotate(360deg); 	/* Opera */
        }
      }
    }
    .content-tab {
      display: flex;
      color: #fff;
      height: 0.6rem;
      align-items: center;
      padding: 0 0.16rem;
      .time {
        flex-shrink: 0;
        width: 1.9rem;
        font-size: 0.18rem;
        span {
          font-size: 0.16rem;
        }
      }
      .right-tab {
        overflow: hidden;
        flex: 1;
        > div {
          width: 100%;
          overflow-x: scroll;
          &::-webkit-scrollbar {
            display: none;
          }
        }
        ul {
          float: left;
          display: flex;
          list-style: none;
          padding: 0;
        }
        li {
          flex-shrink: 0;
          margin-right: 0.4rem;
          cursor: pointer;
          font-size: 0.16rem;
          display: flex;
          align-items: center;
          white-space: nowrap;
          img {
            width: 0.32rem;
            height: 0.32rem;
            margin-right: 5px;
          }
          > div {
            opacity: 0.5;
            &.sp {
              opacity: 1;
            }
          }
          .tit {
            font-size: 0.13rem;
            color: #888;
            height: 0.18rem;
            line-height: 0.18rem;
          }
          .txt {
            font-size: 0.16rem;
            color: #fff;
            height: 0.22rem;
            line-height: 0.22rem;
          }
          &:nth-child(1),
          &:nth-child(2) {
            cursor: default;
            > div {
              opacity: 1;
            }
          }
        }
      }
    }
    .content-chart {
      height: 0;
      padding: 0 0.16rem;
      overflow: hidden;
      transition: height 0.3s;
      -ms-transition: height 0.3s;
      -moz-transition: height 0.3s; /* Firefox 4 */
      -webkit-transition: height 0.3s; /* Safari 和 Chrome */
      -o-transition: height 0.3s; /* Opera */
      &.sp {
        height: 1.9rem;
      }
      .chart-wrap {
        height: 1.9rem;
        // padding-bottom: 0.16rem;
      }
    }
  }
}
</style>

