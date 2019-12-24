<template>
  <div class="wind">123</div>
</template>
<script>
import { getQueryThunderData } from '@/api/wind'
export default {
  components: {},
  data() {
    return {}
  },
  mounted() {
    this.getQueryThunderData()
  },
  methods: {
    getQueryThunderData() {
      getQueryThunderData({
        startTime: '2019-08-05 00:00:00',
        endTime: '2019-08-05 12:05:00',
        dataSet: 'XLONG,XLAT,time,ER',
        nsukey: 'CDYD%2FOcuTgqV%2FRHJwfn8O4PHwMb3jjuNrOie9of5B7%2BXs9Mbmw7h4zJI7pnu4WM9v%2FYE8lpRzsefnOBBfX72Q7crhgRfMqjwfYz9CwsW8V0sdJOCauRmrxVyvhTtET2UphEpchl0iWv7InjGXvWLXv%2B97AjtGlQfJJdrt3%2B0EGdgzXf1Vuvwf6wrGb67BuJOBvCmEAwP6Siynncv0z60oQ%3D%3D'
      }).then(res => {
        const arr = []
        res.data.data.time.forEach((item, i) => {
          const XLAT0 = res.data.data.XLAT[i].toString().split('.')[0]
          const XLONG0 = res.data.data.XLONG[i].toString().split('.')[0]
          const com0 = XLAT0 + XLONG0
          // if (arr.toString().indexOf(com0) < 0) {}
          let arr0 = []
          if (JSON.stringify(arr).indexOf(com0) < 0) {
            res.data.data.time.forEach((it, j) => {
              const XLAT1 = res.data.data.XLAT[j].toString().split('.')[0]
              const XLONG1 = res.data.data.XLONG[j].toString().split('.')[0]
              const com1 = XLAT1 + XLONG1
              if (com0 === com1) {
                arr0.push({
                  time: res.data.data.time[j],
                  ER: res.data.data.ER[j],
                  XLAT: res.data.data.XLAT[j],
                  XLONG: res.data.data.XLONG[j],
                  com: Number(com1)
                })
              }
            })
            let max = arr0[0].ER
            arr0.forEach((er, q) => {
              let cur = er.ER
              cur > max ? max = cur : null
            })
            arr0.forEach((er, q) => {
              if (max === er.ER) {
                arr.push(er)
              }
            })
          }
        })
        console.log(arr)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scopde>
</style>
