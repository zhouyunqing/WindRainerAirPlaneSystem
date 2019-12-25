<template>
  <div class="wind-chart">
    <ul v-if="active == 'plane'" class="tab">
      <li :class="{sp: forecastTab == 'near'}" @click="changeForecastTab('near')">临近预报</li>
      <li :class="{sp: forecastTab == 'short'}" @click="changeForecastTab('short')">短时预报</li>
    </ul>
    <div class="content">
      <div class="content-title">
        <div>{{ params.site || 'ZBAA' }}</div>
        <span class="time">{{ time }}</span>
        <i v-if="active == 'plane'" :class="{sp: chartShow}" @click="upAndDown" />
      </div>
      <div class="content-tab">
        <div class="air-name">
          <img :src="tab[0].icon" alt="">
          <div>
            <div class="tit">{{ tab[0].tit }}</div>
            <div class="txt">{{ tab[0].data }}</div>
          </div>
        </div>
        <div class="right-tab">
          <div class="right-tab-scroll">
            <ul>
              <li v-for="(item, i) in tab" :key="i" @click="changeTab(item.name)" v-if="item.name != 'NAME'">
                <img :src="item.icon" alt="">
                <div :class="{sp: chartTab == item.name}">
                  <div class="tit">{{ item.tit }}</div>
                  <div v-if="!!info[item.name] && item.name == 'SPD'" class="txt">{{ parseFloat(info[item.name][chartIndex]).toFixed(2) || '-' }} {{ item.unit }}</div>
                  <div v-if="!!info[item.name] && item.name == 'RAIN'" class="txt">{{ parseFloat(info[item.name][chartIndex]).toFixed(1) || '-' }} {{ item.unit }}</div>
                  <div v-if="!!info[item.name] && item.name == 'T'" class="txt">{{ parseInt(info[item.name][chartIndex] - 272.15) || 0 }} {{ item.unit }}</div>
                  <div v-if="!!info[item.name] && item.name == 'DIR'" class="txt">{{ parseInt(info[item.name][chartIndex]) || '-' }} {{ item.unit }}</div>
                  <div v-if="!!info[item.name] && item.name == 'RH'" class="txt">{{ parseInt(info[item.name][chartIndex]) || '-' }} {{ item.unit }}</div>
                  <div v-if="!!info[item.name] && item.name == 'SLP'" class="txt">{{ parseInt(info[item.name][chartIndex]) || '-' }} {{ item.unit }}</div>
                  <div v-if="!!info[item.name] && item.name == 'CWIND'" class="txt">{{ parseFloat(info[item.name][chartIndex]).toFixed(2) || '-' }} {{ item.unit }}</div>
                  <div v-if="!!info[item.name] && item.name == 'HWIND'" class="txt">{{ parseFloat(info[item.name][chartIndex]).toFixed(2) || '-' }} {{ item.unit }}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>
      <div class="content-chart" :class="{sp: chartShow}">
        <div ref="windEcharts" class="chart-wrap" />
        <div class="xa-bg" />
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
        //   icon: require('../../../../public/images/icon_fengsu@2x.png'),
        //   tit: '地面风速',
        //   name: 'SPD',
        //   unit: 'm/s',
        //   data: ''
        // }, {
          icon: require('../../../../public/images/dingfeng.png'),
          tit: '顶风',
          name: 'HWIND',
          unit: 'm/s',
          data: ''
        }, {
          icon: require('../../../../public/images/cefeng.png'),
          tit: '侧风',
          name: 'CWIND',
          unit: 'm/s',
          data: ''
        }, {
          icon: require('../../../../public/images/icon_qiya@2x.png'),
          tit: '修正海压',
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
      chartTab: 'HWIND',
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
            unit: '%',
            lineName: '湿度(%)'
          }
          break
        case 'RAIN':
          this.chartTit = {
            tooltip: '降水量',
            tooltipUnit: 'mm',
            unit: 'mm',
            lineName: '降水量(mm)'
          }
          break
        case 'T':
          this.chartTit = {
            tooltip: '温度',
            tooltipUnit: '℃',
            unit: '℃',
            lineName: '温度(℃)'
          }
          break
        case 'SLP':
          this.chartTit = {
            tooltip: '气压',
            tooltipUnit: 'hPa',
            unit: 'hPa',
            lineName: '气压(hPa)'
          }
          break
        case 'DIR':
          break
        case 'SPD':
          this.chartTit = {
            tooltip: '风速',
            tooltipUnit: 'm/s',
            unit: 'm/s',
            lineName: '风速(m/s)'
          }
          break
        case 'CWIND':
          this.chartTit = {
            tooltip: '侧风',
            tooltipUnit: 'm/s',
            unit: 'm/s',
            lineName: '侧风(m/s)'
          }
          break
        case 'HWIND':
          this.chartTit = {
            tooltip: '顶风',
            tooltipUnit: 'm/s',
            unit: 'm/s',
            lineName: '顶风(m/s)'
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
      this.$emit('changeHeight', this.chartShow)
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
      const colors = ['#0BD3A7', '#FFBE3A', '#FF2C55']

      const option = {
        animation: false,
        color: colors,
        backgroundColor: 'transparent',
        tooltip: { // 显示提示框
          trigger: 'axis', // axis
          axisPointer: { type: 'cross' },
          formatter: (params, ticket, callback) => {
            const index = params[0].dataIndex
            this.chartIndex = index
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
        dataZoom: {
          type: 'slider', // 图表下方的伸缩条
          show: true, // 是否显示
          realtime: true, // 拖动时，是否实时更新系列的视图
          start: 0, // 伸缩条开始位置（1-100），可以随时更改
          end: 100, // 伸缩条结束位置（1-100），可以随时更改
          bottom: '0%',
          height: '18',
          dataBackground: {
            lineStyle: { color: '#39977D' },
            areaStyle: { color: 'rgba(57,151,125,1)' }
          },
          borderColor: 'rgba(57,151,125,0.2)',
          textStyle: { color: '#39977D' },
          xAxisIndex: [0, 1, 2, 3]
        },
        xAxis: [
          {
            name: ' ',
            type: 'category',
            position: 'bottom',
            offset: 0,
            nameTextStyle: { color: '#BBBBBB' },
            axisLabel: { interval: 5, color: '#BBBBBB' },
            axisTick: { alignWithLabel: true, show: true, inside: true },
            data: Data.timeData
          },
          {
            name: '风向',
            type: 'category',
            position: 'bottom',
            offset: 15,
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
              interval: 5,
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
            axisLabel: { interval: 5, color: '#BBBBBB' },
            axisTick: { show: false }

          }
        ],
        yAxis: [
          {
            type: 'value',
            name: this.chartTit.lineName,
            scale: true,
            position: 'left',
            offset: 10,
            nameGap: 30,
            nameLocation: 'middle',
            axisTick: { lineStyle: { color: '#BBBBBB' }, inside: true },
            nameTextStyle: {
              color: '#BBBBBB'
            },
            axisLabel: { color: '#BBBBBB' },
            splitLine: { show: false }
          }
          // splitLine: { show: this.chartTab == 'SPD', lineStyle: { color: '#555' }}
          // },
          // {
          //   type:"value",
          //   name: this.chartTit.unit,
          //   scale:false,
          //   position:'left',
          //   offset:50,
          //   nameGap:-65,
          //   nameTextStyle:{color:'#BBBBBB'},
          //   axisLine: {show:false},
          //   axisTick: {show:false},
          // }
        ],
        visualMap: {
          top: 10,
          right: -100,
          smooth: false,
          pieces: [{
            gt: 0,
            lte: 5,
            color: colors[0]
          }, {
            gt: 5,
            lte: 17,
            color: colors[1]
          }, {
            gt: 17,
            color: colors[2]
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
            //  color: {
            //    type: 'linear',
            //    x: 0,
            //    y: 0,
            //    x2: 0,
            //    y2: 1,
            //    colorStops: [{
            //     offset: 0, color: colors[4] // 0% 处的颜色
            //    }, {
            //     offset: 0.25, color: colors[3] // 25% 处的颜色
            //    },{
            //     offset: 0.5, color: colors[2] // 50% 处的颜色
            //    },{
            //     offset: 0.75, color: colors[1] // 75% 处的颜色
            //    },{
            //     offset: 1, color: colors[0] // 100% 处的颜色
            //    }],
            //    global: false
            //  },
            smooth: false,
            data: Data[this.chartTab],
            symbol: 'circle',
            itemStyle: {
              normal: {
                borderColor: '#fff',
                borderWidth: 1
              }
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0.3, 0, 1, [{
                offset: 0,
                color: 'rgba(0,255,220,0.15)'
              }, {
                offset: 1,
                color: 'rgba(5,137,42,0.001)'
              }])
            },
            markLine: {
              label: {
                show: false
              },
              normal: {
                borderWidth: 1,
                lineStyle: 2,
                label: {
                  formatter: ''
                }
              },

              symbol: 'none',
              silent: false,
              data: [{
                name: '',
                xAxis: '当前'
              }, {
                yAxis: 5
              }, {
                yAxis: 17
              }]
            },
            symbol: 'none',
            label: { normal: { show: false, position: 'top' }}
          }
        ]
      }
      Echarts.setOption(option)
      window.addEventListener('resize', (event) => {
        Echarts.resize()
      })
    },
    windDen(wind) {
      if (wind >= 0 && wind <= 30) {
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
      const CWIND = []
      const HWIND = []
      let sTime = 0
      const _this = this
      if (this.forecastTab === 'near') {
        sTime = nowTime - 6 * 60 * 60 * 1000
      } else {
        sTime = nowTime - 12 * 60 * 60 * 1000
      }
      for (var i = 0; i < this.info.DIR.length; i++) {
        const time = utilTime.timeObj(sTime + i * 10 * 60 * 1000)
        var mm = (time.mm)

        // 如果当前时间处于时间段内，返回true，否则返回false
        if (mm < 10 && mm >= 0) {
          mm = 0 + '0'
        } else if (mm < 20 && mm >= 10) {
          mm = 10
        } else if (mm < 30 && mm >= 20) {
          mm = 20
        } else if (mm < 40 && mm >= 30) {
          mm = 30
        } else if (mm < 50 && mm >= 40) {
          mm = 40
        } else if (mm <= 59 && mm >= 50) {
          mm = 50
        }

        times.push(`${time.y}-${time.m}-${time.d} ${time.hh}:${mm}:00`)
        if (nowTime == sTime + i * 10 * 60 * 1000) {
          timeData.push('当前')
          _this.chartIndex = i
        } else {
          timeData.push(`${time.hh}时`)
        }
        // timeData.push(`${time.hh}时`)
        DIR.push(parseInt(this.info.DIR[i]))
        RH.push(parseInt(this.info.RH[i]))
        SLP.push(parseInt(this.info.SLP[i]))
        SPD.push(parseFloat(this.info.SPD[i]).toFixed(2))
        RAIN.push(parseFloat(this.info.RAIN[i]).toFixed(1))
        T.push(parseInt(this.info.T[i] - 272.15))
        CWIND.push(parseFloat(this.info.CWIND[i]).toFixed(2))
        HWIND.push(parseFloat(this.info.HWIND[i]).toFixed(2))
      }
      return {
        times: times,
        timeData: timeData,
        DIR: DIR,
        RH: RH,
        SLP: SLP,
        T: T,
        RAIN: RAIN,
        SPD: SPD,
        CWIND: CWIND,
        HWIND: HWIND
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
          info = parseInt(data)
          console.log(info)
          break
        case 'SLP':
          info = parseInt(data)
          break
        case 'SPD':
          info = parseFloat(data).toFixed(2)
          break
        case 'CWIND':
          info = parseFloat(data).toFixed(2)
          break
        case 'HWIND':
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
  width: calc(100vw - 120px);
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
      span {
        flex: 1;
        text-align: right;
        font-size: 0.13rem;
        color: #fff;
        padding-right: 0.2rem;
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
      .air-name {
        display: flex;
        align-items: center;
        white-space: nowrap;
        width: 1.9rem;
        img {
          width: 0.32rem;
          height: 0.32rem;
          margin-right: 5px;
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
      position: relative;
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
        position: relative;
        z-index: 20;
        height: 2rem;
        margin-top: -13px;
        // padding-bottom: 0.16rem;
      }
      .xa-bg {
        position: absolute;
        bottom: 0.22rem;
        left: 0.75rem;
        right: 0.16rem;
        z-index: 10;
        background: rgba(0,0,0,0.18);
        height: 0.17rem;
      }
    }
  }
}
</style>

