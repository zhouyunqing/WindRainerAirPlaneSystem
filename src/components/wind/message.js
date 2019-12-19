import Cesium from 'cesium/Cesium'
let dataSources

const message = (viewer, state) => {
  if (state) {
    if (dataSources) {
      dataSources.show = true
    } else {
      setAirport(viewer)
    }
  } else {
    if (dataSources) {
      dataSources.show = false
    }
  }
}

const setAirport = (viewer) => {
  var airport = Cesium.GeoJsonDataSource.load('/statics/SampleData/windData/airport.geojson')
  airport.then(res => {
    dataSources = res
    viewer.dataSources.add(res)
    var entities = res.entities.values
    entities.forEach((item, i) => {
      item.billboard.image = '/images/airport.png'
    })
  })
}

export default message
