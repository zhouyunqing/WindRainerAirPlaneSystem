// import h337 from './heatmap'
import Heatmap from 'heatmap.js'
import Cesium from 'cesium/Cesium'
class ColorImage {
  constructor(viewer, extent, max, points, gradient) {
    this.imageEntity = null
    this.heatMap = this.createHeatmap(max, points, gradient)
    this.createRectangle(viewer, extent, this.heatMap)
  }

  createHeatmap(max, data, gradient) {
    // 创建元素
    if (!this.heatDoc) {
      this.heatDoc = document.createElement('div')
      this.heatDoc.setAttribute('style', 'width:1000px;height:1000px;margin: 0px;display: none;')
      this.heatDoc.setAttribute('ID', 'heatDoc')
      document.body.appendChild(this.heatDoc)
    }
    // 创建热力图对象
    var heatmap = Heatmap.create({
      container: this.heatDoc,
      radius: 15,
      maxOpacity: 0.5,
      minOpacity: 0.5,
      blur: 0.75,
      gradient: gradient
    })
    // 添加数据
    heatmap.setData({
      min: 0,
      max: max,
      data: data
    })
    return heatmap
  }

  createRectangle(viewer, coordinate, heatMap) {
    var lastImageEntity = this.imageEntity
    if (lastImageEntity) {
      viewer.entities.remove(lastImageEntity)
    }

    this.imageEntity = viewer.entities.add({
      // name: 'Rotating rectangle with rotating texture coordinate',
      show: true,
      rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(coordinate[0], coordinate[1], coordinate[2], coordinate[3]),
        material: heatMap._renderer.canvas // 核心语句，填充热力图
      }
    })
  }
  redraw(viewer, extent, max, points, gradient) {
    this.heatMap = this.createHeatmap(max, points, gradient)
    this.createRectangle(viewer, extent, this.heatMap)
  }
  remove(viewer) {
    viewer.entities.remove(this.imageEntity)
  }
}

export default ColorImage
