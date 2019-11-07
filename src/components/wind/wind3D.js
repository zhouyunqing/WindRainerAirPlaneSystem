import Cesium from 'cesium/Cesium'
import ParticleSystem from './particleSystem'
import Util from './util'
import ColorImage from './ColorImage'
class Wind3D {
  constructor (viewer, data, particleSystemOptions) {
    this.viewer = viewer
    this.scene = this.viewer.scene
    this.camera = this.viewer.camera
    this.data = data

    this.gradientWind = {
			'1.0':'rgb(255,255,0)',
			'0.9':'rgb(0,255,0)',
			'0.8':'rgb(0,255,88)',
			'0.7':'rgb(0,255,178)',
			'0.6':'rgb(0,255,255)',
			'0.3':'rgb(0,178,255)',
			'0.0':'rgb(0,0,255)'
		}
    this.viewerParameters = {
      lonRange: new Cesium.Cartesian2(),
      latRange: new Cesium.Cartesian2(),
      pixelSize: 0.0
      // lonDataRange: new Cesium.Cartesian2(),
      // latDataRange: new Cesium.Cartesian2()
    }
    // use a smaller earth radius to make sure distance to camera > 0
    this.globeBoundingSphere = new Cesium.BoundingSphere(
      Cesium.Cartesian3.ZERO,
      0.99 * 6378137.0
    )
    this.updateViewerParameters()
    this.particleSystem = new ParticleSystem(
      this.scene.context,
      data,
      particleSystemOptions,
      this.viewerParameters
    )

    this.addPrimitives()
    this.setupEventListeners()
    this.imageryLayers = this.viewer.imageryLayers
    // this.drawWindLayer(this.data)
    this.drawWindHeatLayer(this.data)
  }

  // drawWindLayer(data){//绘制风向图
  //   if(this.overlayer != Overlayers.wind)
  //     return;
    
  //   var that=this;
  //   var points = [];
  //   var max = 0;
  //   var width = 1000;
  //   var height = 1000;		
    
  //   var longdata = data.lon.array;
  //   var latdata = data.lat.array;
  //   var udata = data.U.array;
  //   var vdata = data.V.array;
    
  //   var minLat = data.lat.min;
  //   var minLong = data.lon.min;
  //   var maxLat = data.lat.max;
  //   var maxLong = data.lon.max;
  //   var minSpeed= 1000000;
  //   var maxSpeed = 0;
  
    
  //   var extent = [minLong,minLat,maxLong,maxLat];
    
  //   if(that.colorImage){
  //     that.colorImage.redraw(that.viewer, extent, data,that.gradientWind);
  //   }
  //   else{
  //     that.colorImage = new WindImage(that.viewer, extent, data,that.gradientWind);
  //   }
  // }
  drawWindHeatLayer(data){//绘制风场热力图
    // if(this.overlayer != Overlayers.wind)
    //   return;
    
    var that=this;
    var points = [];
    var max = 0;
    var width = 1000;
    var height = 1000;		
    
    var longdata = data.lon.array;
    var latdata = data.lat.array;
    var udata = data.U.array;
    var vdata = data.V.array;
    
    var minLat = data.lat.min;
    var minLong = data.lon.min;
    var maxLat = data.lat.max;
    var maxLong = data.lon.max;
    var minSpeed= 1000000;
    var maxSpeed = 0;
    var max = 0;
    var speeds = [];
    for(var i=0;i<data.lat.array.length;i++){	
      var speed = Math.sqrt(udata[i]*udata[i]+vdata[i]*vdata[i]);
      speeds.push(speed);
      minSpeed = Math.min(minSpeed, speed);	
      maxSpeed = Math.max(maxSpeed, speed);
    }
    //minSpeed = 0;
    //maxSpeed = 100;
    for(var i=0;i<data.lat.array.length;i++){	
      //var speed = Math.sqrt(udata[i]*udata[i]+vdata[i]*vdata[i]);
      var value=(speeds[i]-minSpeed)*(1/(maxSpeed-minSpeed));	
      max = Math.max(max, value);			
      var point = {
        x:(longdata[i]-minLong)*(1000/(maxLong-minLong)),
        y:(maxLat - latdata[i])*(1000/(maxLat-minLat)),
        value:value	
      };
      points.push(point);
        
    }
    //max = 4;
    var coordinate3 = [minLong,minLat,maxLong,maxLat];
    
    if(that.colorImage){
      that.colorImage.redraw(that.viewer, coordinate3,max, points,that.gradientWind);
    }
    else{
      that.colorImage = new ColorImage(that.viewer, coordinate3,max, points,that.gradientWind);
    }
  }

  addPrimitives () {
    // the order of primitives.add() should respect the dependency of primitives
    this.scene.primitives.add(
      this.particleSystem.particlesComputing.primitives.getWind
    )
    this.scene.primitives.add(
      this.particleSystem.particlesComputing.primitives.updateSpeed
    )
    this.scene.primitives.add(
      this.particleSystem.particlesComputing.primitives.updatePosition
    )
    this.scene.primitives.add(
      this.particleSystem.particlesComputing.primitives.postProcessingPosition
    )
    this.scene.primitives.add(
      this.particleSystem.particlesComputing.primitives.postProcessingSpeed
    )

    this.scene.primitives.add(
      this.particleSystem.particlesRendering.primitives.segments
    )
    this.scene.primitives.add(
      this.particleSystem.particlesRendering.primitives.trails
    )
    this.scene.primitives.add(
      this.particleSystem.particlesRendering.primitives.screen
    )
  }

  removePrimitives () {
    this.scene.primitives.remove(
      this.particleSystem.particlesRendering.primitives.screen
    )
    this.scene.primitives.remove(
      this.particleSystem.particlesRendering.primitives.trails
    )
    this.scene.primitives.remove(
      this.particleSystem.particlesRendering.primitives.segments
    )
    this.scene.primitives.remove(
      this.particleSystem.particlesComputing.primitives.postProcessingSpeed
    )
    this.scene.primitives.remove(
      this.particleSystem.particlesComputing.primitives.postProcessingPosition
    )
    this.scene.primitives.remove(
      this.particleSystem.particlesComputing.primitives.updatePosition
    )
    this.scene.primitives.remove(
      this.particleSystem.particlesComputing.primitives.updateSpeed
    )
    this.scene.primitives.remove(
      this.particleSystem.particlesComputing.primitives.getWind
    )
  }

  updateViewerParameters () {
    var viewRectangle = this.camera.computeViewRectangle(
      this.scene.globe.ellipsoid
    )
    var lonLatRange = Util.viewRectangleToLonLatRange(viewRectangle)
    if(this.data){
      this.viewerParameters.lonRange.x = this.data.lon.min 
      this.viewerParameters.lonRange.y = this.data.lon.max 
      this.viewerParameters.latRange.x = this.data.lat.min
      this.viewerParameters.latRange.y = this.data.lat.max  
    }
    else{
      this.viewerParameters.lonRange.x = lonLatRange.lon.min
      this.viewerParameters.lonRange.y = lonLatRange.lon.max
      this.viewerParameters.latRange.x = lonLatRange.lat.min
      this.viewerParameters.latRange.y = lonLatRange.lat.max
    }

    var pixelSize = this.camera.getPixelSize(
      this.globeBoundingSphere,
      this.scene.drawingBufferWidth,
      this.scene.drawingBufferHeight
    )

    if (pixelSize > 0) {
      this.viewerParameters.pixelSize = pixelSize
    }
  }

  moveStartListener () {
    this.scene.primitives.show = false
  }

  moveEndListener () {
    this.updateViewerParameters()
    this.particleSystem.applyViewerParameters(this.viewerParameters)
    this.scene.primitives.show = true
  }

  preRenderListener () {
    if (this.resized) {
      this.particleSystem.canvasResize(this.scene.context)
      this.resized = false
      this.addPrimitives()
      this.scene.primitives.show = true
    }
  }

  setupEventListeners () {
    const that = this

    this.camera.moveStart.addEventListener(this.moveStartListener, this)
    this.camera.moveEnd.addEventListener(this.moveEndListener, this)

    this.resized = false
    window.addEventListener('resize', function () {
      that.resized = true
      that.scene.primitives.show = false
      that.scene.primitives.removeAll()
    })

    this.scene.preRender.addEventListener(this.preRenderListener, this)
  }

  destroy () {
    this.removePrimitives()
    this.camera.moveStart.removeEventListener(this.moveStartListener, this)
    this.camera.moveEnd.removeEventListener(this.moveEndListener, this)
    this.scene.preRender.removeEventListener(this.preRenderListener, this)
  }
}

export default Wind3D
