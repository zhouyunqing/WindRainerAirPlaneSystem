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

// const textList = [
//   {}
// ]

const route = (viewer, state) => {
  if (state) {
    if (viewer.entities.getById(circleIn[0].name)) {
      setEntity(viewer, state)
    } else {
      setRange(viewer)
    }
  } else {
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

const setEntity = (viewer, state) => {
  let entity
  circleIn.forEach(item => {
    entity = viewer.entities.getById(item.name)
    if (entity) {
      entity.show = state
    }
  })
}

export default route
