import Cesium from 'cesium/Cesium'
const circleIn = [
  {
    lat: 116.60195,
    lng: 40.08387,
    radius: 3000.0,
    granularity: 0.001,
    name: 'range0',
    color: Cesium.Color.RED
  },
  {
    lat: 116.60195,
    lng: 40.08387,
    radius: 5000.0,
    granularity: 0.001,
    name: 'range1',
    color: Cesium.Color.GRAY
  },
  {
    lat: 116.60195,
    lng: 40.08387,
    radius: 10000.0,
    granularity: 0.001,
    name: 'range2',
    color: Cesium.Color.GRAY
  }
]

const textList = [
  {
    name: 'routeLine1',
    text: '3公里',
    lat: 116.60000,
    lng: 40.08387
  },
  {
    name: 'routeLine2',
    text: '5公里',
    lat: 116.65000,
    lng: 40.08387
  },
  {
    name: 'routeLine3',
    text: '10公里',
    lat: 116.70000,
    lng: 40.08387
  }
]

const airList = [
  {
    name: 'routeAir1',
    position: Cesium.Cartesian3.fromDegrees(114.336111, 39.314167000000111),
    rotation: 2
  },
  {
    name: 'routeAir2',
    position: Cesium.Cartesian3.fromDegrees(117.21500000000015, 36.833333),
    rotation: 1
  },
  {
    name: 'routeAir3',
    position: Cesium.Cartesian3.fromDegrees(104.12472200000013, 36.279444),
    rotation: 1.5
  }
]

let dataSources

const route = (viewer, state) => {
  if (state) {
    if (viewer.entities.getById(circleIn[0].name)) {
      setEntity(viewer, state)
    } else {
      setRange(viewer)
      setText(viewer)
      setAirLine(viewer)
    }
  } else {
    if (dataSources) {
      dataSources.show = false
    }
    if (viewer.entities.getById(circleIn[0].name)) {
      setEntity(viewer, state)
    }
  }
}

const setRange = (viewer) => {
  circleIn.forEach(item => {
    const circleIn = new Cesium.CircleOutlineGeometry({
      center: Cesium.Cartesian3.fromDegrees(item.lat, item.lng),
      radius: item.radius,
      granularity: item.granularity
    })
    const geometryIn = Cesium.CircleOutlineGeometry.createGeometry(circleIn)
    const float64ArrayPositionsIn = geometryIn.attributes.position.values
    const positionsIn = [].slice.call(float64ArrayPositionsIn)
    const oneArrL = positionsIn.length
    const erArrL = positionsIn.length / 3
    const er = new Array()
    for (var p = 0; p < erArrL; p++) {
      er[p] = new Array()
    }
    let k = 0
    for (var o = 0; o < erArrL; o++) {
      for (var u = 0; u < 3; u++) {
        er[o][u] = positionsIn[k]
        k++
        if (k > oneArrL - 1) {
          break
        }
      }
    }
    var posCir = []
    for (var i = 0; i < er.length; i++) {
      posCir.push(new Cesium.Cartesian3(er[i][0], er[i][1], er[i][2]))
    }
    viewer.entities.add({
      id: item.name,
      polyline: {
        positions: posCir,
        width: 1,
        material: new Cesium.PolylineDashMaterialProperty({
          color: item.color
        })
      }
    })
  })
}

const setText = (viewer) => {
  textList.forEach(item => {
    viewer.entities.add({
      show: true,
      id: item.name,
      position: Cesium.Cartesian3.fromDegrees(item.lat, item.lng, 0),
      label: {
        text: item.text,
        font: '12px Source Han Sans CN', // 字体样式
        fillColor: Cesium.Color.fromCssColorString('#666666'), // 字体颜色
        backgroundColor: Cesium.Color.fromCssColorString('rgba(0,0,0,0.2)'), // 背景颜色
        showBackground: true, // 是否显示背景颜色
        style: Cesium.LabelStyle.FILL_AND_OUTLINE, // label样式 TEXT的样式填充以及边框
        outlineWidth: 1,
        outlineColor: Cesium.Color.BLACK,
        verticalOrigin: Cesium.VerticalOrigin.CENTER, // 垂直位置
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT, // 水平位置
        pixelOffset: new Cesium.Cartesian2(10, 0), // 偏移
        scale: 1
      }
    })
  })
  viewer.entities.add({
    id: 'routeLocation',
    position: Cesium.Cartesian3.fromDegrees(116.60195, 40.09387, 0),
    billboard: { // 图标
      image: '/images/location.png',
      width: 28,
      height: 36
    }
  })
}

const setAirLine = (viewer) => {
  const options = {
    camera: viewer.scene.camera,
    canvas: viewer.scene.canvas,
    clampToGround: true
  }
  var airLine = viewer.dataSources.add(Cesium.KmlDataSource.load('/statics/SampleData/windData/airline.kml', options))
  airLine.then(res => {
    dataSources = res
    viewer.add(airLine)
    return res
  })
  airList.forEach(item => {
    const entity = viewer.entities.getById(item.name)
    if (entity) {
      entity.show = true
    } else {
      viewer.entities.add({
        id: item.name,
        position: item.position,
        billboard: {
          image: "/images/rair.png",
          scale: 1,
          rotation: item.rotation,
          color: Cesium.Color.RED,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        }
      })
    }
  })
}

const setEntity = (viewer, state) => {
  let entity
  circleIn.forEach(item => {
    entity = viewer.entities.getById(item.name)
    if (entity) {
      entity.show = state
    }
  })
  textList.forEach(item => {
    entity = viewer.entities.getById(item.name)
    if (entity) {
      entity.show = state
    }
  })
  entity = viewer.entities.getById('routeLocation')
  entity.show = state
  airList.forEach(item => {
    entity = viewer.entities.getById(item.name)
    if (entity) {
      entity.show = state
    }
  })
  dataSources.show = state
}

export default route
