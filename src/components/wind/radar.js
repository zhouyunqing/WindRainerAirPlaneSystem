import Cesium from 'cesium/Cesium'

const time = []
const hour = []
let NAME = []
let index = 0
let time2 = null

const radar = (viewer, state) => {
  setRainMapName(viewer, state)
}

const setRainMapName = (viewer, state) => {
  if (state) {
    if (!NAME || NAME.length === 0) {
      for (var i = 0; i < 59; i++) {
        if (i >= 0 && i % 6 === 0) {
          if (i < 10) {
            i = '0' + i
          } else {
            i = i + ''
          }
          time.push(i)
        }
      }
      for (var j = 0; j < 2; j++) {
        if (j < 10) {
          j = '0' + j
        } else {
          j = j + ''
        }
        hour.push(j)
      }
      for (var o = 0; o < hour.length; o++) {
        for (var z = 0; z < time.length; z++) {
          NAME.push(hour[o] + time[z])
        }
      }
      setRainMap(viewer)
    } else {
      time2 = setInterval(() => {
        add(viewer)
      }, 50)
    }
  } else {
    clearInterval(time2)
    setEntity(viewer)
  }
}

const setRainMap = (viewer) => {
  NAME.forEach((item, i) => {
    viewer.entities.add({
      id: 'rainMap' + i,
      rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(62.2, 3.24, 137, 54),
        material: `./images/text/Z_RADA_C_BABJ_20190805${NAME[i]}00_P_DOR_RDCP_CR_ACHN 拷贝.png`
      }
    })
    const entity = viewer.entities.getById('rainMap' + i)
    if (entity) {
      entity.show = false
    }
  })
  time2 = setInterval(() => {
    add(viewer)
  }, 50)
}

const add = (viewer) => {
  if (window.location.href.indexOf('wind') < 0) {
    NAME = []
    clearInterval(time2)
    return
  }
  let entity
  if (index >= NAME.length) {
    entity = viewer.entities.getById('rainMap' + index)
    if (entity) {
      entity.show = false
    }
    entity = viewer.entities.getById('rainMap' + (index - 1))
    if (entity) {
      entity.show = false
    }
    entity = viewer.entities.getById('rainMap' + (index - 2))
    if (entity) {
      entity.show = false
    }
    index = 0
  }
  if (index < NAME.length) {
    entity = viewer.entities.getById('rainMap' + index)
    if (entity) {
      entity.show = true
    }
    index++
  }
  if (index > 1) {
    entity = viewer.entities.getById('rainMap' + (index - 2))
    if (entity) {
      entity.show = false
    }
  }
}

const setEntity = (viewer) => {
  let entity
  NAME.forEach((item, i) => {
    entity = viewer.entities.getById('rainMap' + i)
    if (entity) {
      entity.show = false
    }
  })
}

export default radar
