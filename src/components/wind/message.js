import Cesium from 'cesium/Cesium'
let dataSources

const message = (viewer, state) => {
  if (!state) {
    if (dataSources) {
      dataSources.show = false
    }
  } else {
    setAirport(viewer)
  }
}

const setAirport = (viewer) => {
  var airport = Cesium.GeoJsonDataSource.load('/statics/SampleData/windData/airport.geojson')
  airport.then(res => {
    dataSources = res
    viewer.dataSources.add(res)
    var entities = res.entities.values
    entities.forEach((item, i) => {
      if (item.name === '[ZBAA]BEIJING-CAPITAL') {
        item.billboard.image = '/images/airport2.png'
      } else {
        item.billboard.image = '/images/airport.png'
      }
    })
  })
}

export default message
