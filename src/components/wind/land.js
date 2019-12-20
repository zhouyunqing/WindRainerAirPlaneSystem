import Cesium from 'cesium/Cesium'
import Heatmap from 'heatmap.js'
const line = [
  116.620741094571, 40.076284245746, 0,
  116.618008856637, 40.094626475820, 0,

  116.600150136220, 40.206145228496, 460,
  116.599215932560, 40.207355596472, 470,
  116.598474985233, 40.208195444039, 480,
  116.597218543125, 40.209084698313, 490,
  116.595929846938, 40.209875141677, 500,
  116.594351153252, 40.210542069328, 510,
  116.592869095232, 40.210838463360, 520,
  116.591580325928, 40.211134851212, 530,
  116.590323758671, 40.211381828342, 540,

  116.546926090802, 40.205893425211, 910,
  116.545774626920, 40.205144300182, 920,
  116.544344054892, 40.204314902744, 930,
  116.543297333709, 40.203431996624, 940,
  116.542180862964, 40.202442066785, 950,
  116.541064436490, 40.201264851082, 960,
  116.540296968117, 40.199873613045, 970,
  116.539878410879, 40.198589403556, 980,
  116.539738961963, 40.197465729754, 990,
  116.539773960175, 40.196315307856, 1000,

  116.577491421847, 39.928552238093, 1000,
  116.577860941306, 39.927610366648, 980,
  116.578570022659, 39.926643097879, 970,
  116.579214706458, 39.925913071995, 960,
  116.580034109960, 39.925208838841, 950,
  116.580931926138, 39.924391896474, 940,
  116.581894666512, 39.923773147777, 930,
  116.583001252165, 39.923294764493, 920,
  116.584367519719, 39.922796591641, 910,

  116.634510477220, 39.927126295639, 700,
  116.635219177823, 39.927216484482, 690,
  116.637840423129, 39.928047220885, 680,
  116.638867387075, 39.928862392483, 670,
  116.639439910540, 39.929343248681, 660,
  116.640099188576, 39.929864172248, 650,
  116.640532930115, 39.930451877189, 640,
  116.640810530322, 39.931039581999, 630,
  116.640949334827, 39.931560503440, 620,
  116.641001387734, 39.932148212346, 610,

  116.623480637647, 40.059181548547, 0,
  116.621773206119, 40.069763961446, 0
]

const data = [
  [
    { longitude: 116.620741094571, dimension: 40.076284245746, height: 0, time: 0 },
    { longitude: 116.618008856637, dimension: 40.094626475820, height: 0, time: 10 },

    { longitude: 116.600150136220, dimension: 40.206145228496, height: 460, time: 60 },
    { longitude: 116.599215932560, dimension: 40.207355596472, height: 470, time: 61 },
    { longitude: 116.598474985233, dimension: 40.208195444039, height: 480, time: 62 },
    { longitude: 116.597218543125, dimension: 40.209084698313, height: 490, time: 63 },
    { longitude: 116.595929846938, dimension: 40.209875141677, height: 500, time: 64 },
    { longitude: 116.594351153252, dimension: 40.210542069328, height: 510, time: 65 },
    { longitude: 116.592869095232, dimension: 40.210838463360, height: 520, time: 66 },
    { longitude: 116.591580325928, dimension: 40.211134851212, height: 530, time: 67 },
    { longitude: 116.590323758671, dimension: 40.211381828342, height: 540, time: 68 },

    { longitude: 116.546926090802, dimension: 40.205893425211, height: 910, time: 98 },
    { longitude: 116.545774626920, dimension: 40.205144300182, height: 920, time: 99 },
    { longitude: 116.544344054892, dimension: 40.204314902744, height: 930, time: 100 },
    { longitude: 116.543297333709, dimension: 40.203431996624, height: 940, time: 101 },
    { longitude: 116.542180862964, dimension: 40.202442066785, height: 950, time: 102 },
    { longitude: 116.541064436490, dimension: 40.201264851082, height: 960, time: 103 },
    { longitude: 116.540296968117, dimension: 40.199873613045, height: 970, time: 104 },
    { longitude: 116.539878410879, dimension: 40.198589403556, height: 980, time: 105 },
    { longitude: 116.539738961963, dimension: 40.197465729754, height: 990, time: 106 },
    { longitude: 116.539773960175, dimension: 40.196315307856, height: 1000, time: 107 },

    { longitude: 116.577491421847, dimension: 39.928552238093, height: 980, time: 246 },
    { longitude: 116.578570022659, dimension: 39.926643097879, height: 990, time: 247 },
    { longitude: 116.579214706458, dimension: 39.925913071995, height: 970, time: 248 },
    { longitude: 116.580034109960, dimension: 39.925208838841, height: 960, time: 249 },
    { longitude: 116.580931926138, dimension: 39.924391896474, height: 950, time: 251 },
    { longitude: 116.581894666512, dimension: 39.923773147777, height: 940, time: 252 },
    { longitude: 116.583001252165, dimension: 39.923294764493, height: 930, time: 253 },
    { longitude: 116.584367519719, dimension: 39.922796591641, height: 920, time: 254 },

    { longitude: 116.634510477220, dimension: 39.927126295639, height: 700, time: 284 },
    { longitude: 116.635219177823, dimension: 39.927216484482, height: 690, time: 285 },
    { longitude: 116.637840423129, dimension: 39.928047220885, height: 680, time: 288 },
    { longitude: 116.638867387075, dimension: 39.928862392483, height: 670, time: 289 },
    { longitude: 116.639439910540, dimension: 39.929343248681, height: 660, time: 290 },
    { longitude: 116.640099188576, dimension: 39.929864172248, height: 650, time: 291 },
    { longitude: 116.640532930115, dimension: 39.930451877189, height: 640, time: 292 },
    { longitude: 116.640810530322, dimension: 39.931039581999, height: 630, time: 293 },
    { longitude: 116.640949334827, dimension: 39.931560503440, height: 620, time: 294 },
    { longitude: 116.641001387734, dimension: 39.932148212346, height: 610, time: 295 },

    { longitude: 116.621720, dimension: 40.071255, height: 0, time: 500 },
    { longitude: 116.621149, dimension: 40.074496, height: 0, time: 515 }
  ]
]

const gradiant = {
  '1.0': 'rgb(255,255,0)',
  '0.9': 'rgb(0,255,0)',
  '0.8': 'rgb(0,255,88)',
  '0.7': 'rgb(0,255,178)',
  '0.6': 'rgb(0,255,255)',
  '0.3': 'rgb(0,178,255)',
  '0.0': 'rgb(0,0,255)'
}

const entityList = [
  'landLine',
  'air',
  'planeY'
]

const hotData = {
  planeX: new Cesium.Plane(new Cesium.Cartesian3(0, 1, 0), 0.0),
  targetX: 0.0,
  planeY: new Cesium.Plane(new Cesium.Cartesian3(0, 0, -1), 0.0),
  targetY: 0.0,
  planeZ: new Cesium.Plane(new Cesium.Cartesian3(1, 0, 0), 0.0),
  targetZ: 0.0
}

const hotList = [
  {
    name: 'X',
    id: 'planeX',
    position: Cesium.Cartesian3.fromDegrees(116.58823, 39.92276, 300.0),
    heading: Cesium.Math.toRadians(-6.3),
    pitch: 0,
    roll: 0,
    plane: new Cesium.Plane(new Cesium.Cartesian3(0, 1, 0), 0.0),
    dimensions: new Cesium.Cartesian2(12000.0, 4000.0)
  },
  {
    name: 'Y',
    id: 'planeY',
    position: Cesium.Cartesian3.fromDegrees(116.59303, 40.07061, 0.0),
    heading: Cesium.Math.toRadians(-6.3),
    pitch: 0,
    roll: 0,
    plane: new Cesium.Plane(new Cesium.Cartesian3(0, 0, -1), 0.0),
    dimensions: new Cesium.Cartesian2(12000.0, 40000.0)
  },
  {
    name: 'Z',
    id: 'planeZ',
    position: Cesium.Cartesian3.fromDegrees(116.545855, 40.07209, 300.0),
    heading: Cesium.Math.toRadians(-6.3),
    pitch: 0,
    roll: 0,
    plane: new Cesium.Plane(new Cesium.Cartesian3(1, 0, 0), 0.0),
    dimensions: new Cesium.Cartesian2(40000.0, 4000.0)
  }
]

let selectedPlane = null

// 起始时间
const start = Cesium.JulianDate.fromDate(new Date(2019, 12, 10))
// 结束时间
const stop = Cesium.JulianDate.addSeconds(start, 720, new Cesium.JulianDate())

const land = (viewer, name, state) => {
  if (name === 'create') {
    setRoute(viewer)
    setAir(viewer)
    setHot(viewer)
  }
  if (name === 'entity') {
    setEntityState(viewer, state)
  }
}

const setRoute = (viewer) => {
  viewer.entities.add({
    id: 'landLine',
    show: true,
    polyline: {
      // 多线段
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(line), // 方位
      width: 5, // 折线的宽度（以像素为单位）
      material: Cesium.Color.GREY,
      shadows: Cesium.ShadowMode.ENABLED
    }
  })
}

const setAir = (viewer) => {
  // 设置始时钟始时间
  viewer.clock.startTime = start.clone()
  // 设置时钟当前时间
  viewer.clock.currentTime = start.clone()
  // 设置始终停止时间
  viewer.clock.stopTime = stop.clone()
  // 时间速率，数字越大时间过的越快
  viewer.clock.multiplier = 20
  // 循环执行,即为2，到达终止时间，重新从起点时间开始
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP
  for (let j = 0; j < data.length; j++) {
    const property = computeFlight(data[j])
    // 添加模型
    viewer.entities.add({
      id: 'air',
      // 和时间轴关联
      availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
        start: start,
        stop: stop
      })]),
      position: property,
      // 根据所提供的速度计算模型的朝向
      orientation: new Cesium.VelocityOrientationProperty(property),
      // 模型数据
      model: {
        uri: '/CesiumAir/Cesium_Air.glb',
        minimumPixelSize: 100
      }
    })
  }
}

const setHot = (viewer) => {
  const heatMap = createHeatMap(getData(10000).max, getData(10000).data)
  hotList.forEach((item, i) => {
    const hpr = new Cesium.HeadingPitchRoll(item.heading, item.pitch, item.roll)
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(item.position, hpr)
    viewer.entities.add({
      show: false,
      id: item.id,
      position: item.position,
      orientation: orientation,
      plane: {
        plane: new Cesium.CallbackProperty(createPlaneUpdateFunction(item.plane, item.name), false),
        dimensions: item.dimensions,
        // material: heatMap._renderer.canvas
        material: new Cesium.ImageMaterialProperty({
          image: '/images/hot.png'
        })
      }
    })
  })
  const downHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  downHandler.setInputAction((movement) => {
    var pickedObject = viewer.scene.pick(movement.position)
    if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id) && Cesium.defined(pickedObject.id.plane)) {
      selectedPlane = pickedObject.id.plane
      selectedPlane.outlineColor = Cesium.Color.WHITE
      selectedPlane.id = pickedObject.id.id
      viewer.scene.screenSpaceCameraController.enableInputs = false
    }
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN)

  const moveHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  moveHandler.setInputAction((movement) => {
    if (Cesium.defined(selectedPlane)) {
      if (selectedPlane.id === 'planeX') {
        const deltaX = movement.startPosition.x - movement.endPosition.x
        hotData.targetX += deltaX
      }
      if (selectedPlane.id === 'planeY') {
        const deltaY = movement.startPosition.y - movement.endPosition.y
        hotData.targetY += deltaY
      }
      if (selectedPlane.id === 'planeZ') {
        const deltaZ = movement.startPosition.y - movement.endPosition.y
        hotData.targetZ += deltaZ
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

  const upHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  upHandler.setInputAction(() => {
    if (Cesium.defined(selectedPlane)) {
      selectedPlane = undefined
    }
    viewer.scene.screenSpaceCameraController.enableInputs = true
  }, Cesium.ScreenSpaceEventType.LEFT_UP)
}

const createHeatMap = (max, data) => {
  // 创建元素
  const heatDoc = document.createElement('div')
  heatDoc.setAttribute('style', 'width:1000px;height:1000px;margin: 0px;display: none;')
  document.body.appendChild(heatDoc)
  // 创建热力图对象
  const heatmap = Heatmap.create({
    container: heatDoc,
    radius: 20,
    maxOpacity: 0.5,
    minOpacity: 0,
    blur: 0.75,
    gradient: gradiant
  })
  // 添加数据
  heatmap.setData({
    max: max,
    data: data
  })
  return heatmap
}

const getData = (len) => {
  // 构建一些随机数据点
  var points = []
  var max = 0
  var width = 1000
  var height = 1000
  while (len--) {
    var val = Math.floor(Math.random() * 1000)
    max = Math.max(max, val)
    var point = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
      value: val
    }
    points.push(point)
  }
  return { max: max, data: points }
}

const createPlaneUpdateFunction = (plane, line) => {
  if (line === 'X') {
    return function() {
      plane.distance = hotData.targetX
      return plane
    }
  }
  if (line === 'Y') {
    return function() {
      plane.distance = hotData.targetY
      return plane
    }
  }
  if (line === 'Z') {
    return function() {
      plane.distance = hotData.targetZ
      return plane
    }
  }
}

const computeFlight = (source) => {
  // 取样位置 相当于一个集合
  const property = new Cesium.SampledPositionProperty()
  for (let i = 0; i < source.length; i++) {
    const time = Cesium.JulianDate.addSeconds(start, source[i].time, new Cesium.JulianDate())
    const position = Cesium.Cartesian3.fromDegrees(source[i].longitude, source[i].dimension, source[i].height)
    // 添加位置，和时间对应
    property.addSample(time, position)
  }
  return property
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
export default land
