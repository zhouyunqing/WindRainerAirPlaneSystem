import Cesium from 'cesium/Cesium'
import axios from 'axios'

let satellite = {
  satellitename: 'FY3D',
  id: '3D',
  groundId: 'D',
  sername: 'ser3D',
  arrname: 'arr3D',
  width: '70',
  height: '100',
  imgURL: '/images/FY-3D.png'
}

let t3 = null
let arr3 = null
let FYDbet = null
let FYD = null
let FY3D = null
let FYDen = null
let i = 0
const entityList = [
  '静止卫星全球拼图',
  'FY4A',
  'equator',
  'FY4A_Gray',
  'FY3D',
  '3D',
  'D',
  'arr3D'
]

const global = (viewer, name, state) => {
  setDian(viewer)
  if (name === 'FY4A') {
    setFY4A(viewer)
  }
  if (name === 'FY3D') {
    setFY3D(viewer)
  }
  if (name === 'start') {
    t3 = setInterval(() => { showD() }, 1000)
  }
  if (name === 'stop') {
    clearTimeout(t3)
  }
  if (name === 'entity') {
    setEntityState(viewer, state)
  }
}

const setDian = (viewer) => {
  const entity = viewer.entities.getById('JMSZ')
  if (entity) return
  var circleIn4 = new Cesium.CircleOutlineGeometry({
    center: Cesium.Cartesian3.fromDegrees(130.31, 46.80),
    radius: 1.0,
    granularity: 0.001
  })
  var geometryIn = Cesium.CircleOutlineGeometry.createGeometry(circleIn4)
  var float64ArrayPositionsIn = geometryIn.attributes.position.values
  var positionsIn = [].slice.call(float64ArrayPositionsIn)
  var oneArrL1 = positionsIn.length
  var erArrL1 = positionsIn.length / 3
  var er1 = new Array()
  for (var p = 0; p < erArrL1; p++) {
    er1[p] = new Array()
  }
  var k1 = 0
  for (var o = 0; o < erArrL1; o++) {
    for (var u = 0; u < 3; u++) {
      er1[o][u] = positionsIn[k1]
      k1++
      if (k1 > oneArrL1 - 1) {
        break
      }
    }
  }
  var posCir1 = []
  for (var i = 0; i < er1.length; i++) {
    posCir1.push(new Cesium.Cartesian3(er1[i][0], er1[i][1], er1[i][2]))
  }
  viewer.entities.add({
    id: 'JMSZ',
    polyline: {
      positions: posCir1,
      width: 1,
      material: Cesium.Color.BLUE
    }
  })
}

const setFY4A = (viewer) => {
  viewer.entities.add({
    id: 'equator',
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights([0.0, 0.0, 3000000.0, 90.0, 0.0, 3000000.0, 180.0, 1.0, 3000000.0, 270.0, 0.0, 3000000.0, 360.0, 0.0, 3000000.0]),
      width: 1,
      material: new Cesium.PolylineDashMaterialProperty({
        color: Cesium.Color.YELLOW
      })
    }
  })
  viewer.entities.add({
    id: 'FY4A',
    position: Cesium.Cartesian3.fromDegrees(104.7, 0, 3000000),
    billboard: {
      image: '/images/FY-4A.png',
      width: 150,
      height: 90
    },
    label: {
      text: 'FY4A',
      name: 'FY4A',
      font: '14pt monospace',
      fillColor: Cesium.Color.YELLOW,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      verticalOrigin: Cesium.VerticalOrigin.TOP,
      pixelOffset: new Cesium.Cartesian2(0, 40)
    }
  })
  viewer.entities.add({
    id: 'FY4A_Gray',
    position: Cesium.Cartesian3.fromDegrees(104.7, 0),
    point: {
      pixelSize: 6,
      color: Cesium.Color.GRAY,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 1
    }
  })
}

const setFY3D = (viewer) => {
  axios.get('/statics/SampleData/windData/fy3d.json').then(res => {
    satellite.name = res.data.resource
    if (!satellite.name) {
      return satellite
    }
    return satellite
  }).then(res => {
    satellite = res
    addEntityD(viewer)
  })
}

const addEntityD = (viewer, name) => {
  FYDen = viewer.entities.add({
    id: satellite.satellitename,
    position: Cesium.Cartesian3.fromDegrees(30, 30, 1000000),
    billboard: {
      image: satellite.imgURL,
      width: satellite.width,
      height: satellite.height
    },
    label: {
      text: satellite.name[0].satellitename,
      font: '14pt monospace',
      style: Cesium.LabelStyle.FULL_AND_OUTLINE,
      outlineWidth: 3,
      fillColor: Cesium.Color.YELLOW,
      verticlOrigin: Cesium.VerticalOrigin.TOP,
      pixelOffset: new Cesium.Cartesian2(20, 45)
    }
  })

  FYD = viewer.entities.add({
    id: satellite.id,
    position: Cesium.Cartesian3.fromDegrees(30, 30),
    point: {
      pixelSize: 6,
      color: Cesium.Color.GRAY,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 1
    }
  })

  FYDbet = viewer.entities.add({
    id: satellite.groundId,
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights([0, 0, 1000000,
        0, 0, 1000000, 0, 0, 1000000, 0, 0, 1000000, 0, 0, 1000000, 0, 0, 1000000]),
      width: 3,
      material: new Cesium.PolylineDashMaterialProperty({
        color: Cesium.Color.YELLOW
      })
    }
  })

  FY3D = viewer.entities.add({
    id: satellite.arrname,
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights([0, 0, 1000000, 0, 0, 1000000,
        0, 0, 1000000, 0, 0, 1000000, 0, 0, 1000000, 0, 0, 1000000]),
      width: 3,
      material: Cesium.Color.YELLOW
    }
  })

  t3 = setInterval(() => { showD() }, 1000)
}

const showD = () => {
  arr3 = satellite.name
  if (!!arr3 && !!arr3.length && i < arr3.length - 100) {
    var date = arr3[i].time
    var Latitude = arr3[i].lat
    var Longitude = arr3[i].lon
    var Latitude1 = arr3[i + 10].lat
    var Longitude1 = arr3[i + 10].lon
    var Latitude2 = arr3[i + 20].lat
    var Longitude2 = arr3[i + 20].lon
    var Latitude3 = arr3[i + 30].lat
    var Longitude3 = arr3[i + 30].lon
    var Latitude4 = arr3[i + 40].lat
    var Longitude4 = arr3[i + 40].lon
    var Latitude5 = arr3[i + 50].lat
    var Longitude5 = arr3[i + 50].lon
    var Latitude6 = arr3[i + 60].lat
    var Longitude6 = arr3[i + 60].lon
    var Latitude7 = arr3[i + 70].lat
    var Longitude7 = arr3[i + 70].lon
    var Latitude8 = arr3[i + 80].lat
    var Longitude8 = arr3[i + 80].lon
    var Latitude9 = arr3[i + 90].lat
    var Longitude9 = arr3[i + 90].lon
    var Latitude10 = arr3[i + 100].lat
    var Longitude10 = arr3[i + 100].lon
    FYDbet.polyline.positions = Cesium.Cartesian3.fromDegreesArrayHeights([Longitude5, Latitude5, 1000000,
      Longitude6, Latitude6, 1000000,
      Longitude7, Latitude7, 1000000,
      Longitude8, Latitude8, 1000000,
      Longitude9, Latitude9, 1000000,
      Longitude10, Latitude10, 1000000])
    FYD.position = Cesium.Cartesian3.fromDegrees(Longitude5, Latitude5)
    FY3D.polyline.positions = Cesium.Cartesian3.fromDegreesArrayHeights([Longitude, Latitude, 1000000,
      Longitude1, Latitude1, 1000000,
      Longitude2, Latitude2, 1000000,
      Longitude3, Latitude3, 1000000,
      Longitude4, Latitude4, 1000000,
      Longitude5, Latitude5, 1000000])
    FYDen.position = Cesium.Cartesian3.fromDegrees(Longitude5, Latitude5, 1000000)
  }
  i++
  if (!!arr3 && !!arr3.length && i >= arr3.length - 100) {
    i = 0
  }
}

const setEntityState = (viewer, state) => {
  let entity
  entityList.forEach(item => {
    entity = viewer.entities.getById(item)
    if (entity) {
      entity.show = state
    }
  })
}
export default global
