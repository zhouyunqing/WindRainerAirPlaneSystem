class WindImage {
	constructor (viewer,extent, data,gradient) {
		this.resolution = 0.0008;
		this.imageEntity = null;
		this.canvas = null;
		this.drawCanvas(data,extent);
		this.createRectangle(viewer, extent, this.canvas);	
		
	}
	drawCanvasTest(data,extent){//画圆
		if(!this.canvas){
			if(!extent || extent.length < 4)
				return;
			this.canvas = document.createElement('canvas');      //创建canvas标签
			this.canvas.width = parseInt(Math.abs(extent[2]-extent[0]) / this.resolution);//1000;     
			this.canvas.height = parseInt(Math.abs(extent[3]-extent[1]) / this.resolution);//1000; 
		}
		var ctx = this.canvas.getContext('2d');
		
		ctx.fillStyle="#FFFF00";
		ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

		ctx.fillStyle="#00FFFF";
		ctx.beginPath();
		var r = Math.min(this.canvas.width / 2,this.canvas.height / 2);
		ctx.arc(this.canvas.width / 2,this.canvas.height / 2,r,0,2*Math.PI,true);
		ctx.closePath();
		ctx.fill();
		
	}
	getSpeedColor(speed,min,max){
		var h = (speed-min)*(360/(max-min));	
		if(h >= 360) h = 359;//h - 360;
		if(h < 0) h = 0;//h + 360;
		h = 360 - h;
		//console.log("h:"+h);
		var s = 0.9;
		var v =0.9;
		var c = v * s;
		var m = v - c;
		var x = c * Math.abs(parseInt(h/60) % 2 - 1);
		
		var r = 0;
		var g = 0;
		var b = 0;
		if(h<60){
			r = c;
			g = x;
		}
		else if(h<120){
			r = x;
			g = c;
		}
		else if(h<180){
			g = c;
			b = x;
		}
		else if(h<240){
			g = x;
			b = c;
		}
		else if(h<300){
			r = x;
			b = c;
		}
		else if(h<360){
			r = c;
			b = x;
		}
		
		r = parseInt((r+m)*255);
		g = parseInt((g+m)*255);
		b = parseInt((b+m)*255);
		//console.log("hsv:"+h + ","+s+","+v+"; c="+c+";m="+m+";x="+x+"; rgb:"+r+","+g+","+b);
		return "rgba("+r+","+g+","+b+",0.4)";
		
	}
	drawArrow(context,x,y,len,angel,color){
		context.lineWidth=2;
		context.strokeStyle=color;//;
		context.beginPath();
		var r = len/2;
		var x0 = x - r * Math.cos(angel);
		var x1 = x + r * Math.cos(angel);
		var y0 = y + r * Math.sin(angel);
		var y1 = y - r * Math.sin(angel);
		
		context.moveTo(x0,y0);
		context.lineTo(x1,y1);
		var a = Math.max(3,len/5);
		var x2 = x1 + a * Math.cos(angel + Math.PI *3 / 4);
		var y2 = y1 - a * Math.sin(angel + Math.PI *3 / 4);
		context.lineTo(x2,y2);
		context.moveTo(x1,y1);
		
		var x3 = x1 + a * Math.cos(angel - Math.PI *3 / 4);
		var y3 = y1 - a * Math.sin(angel - Math.PI *3 / 4);
		context.lineTo(x3,y3);
		
		context.lineCap="butt";
		context.stroke();
		
	}
	drawCanvas(data,extent){
		if(!this.canvas){
			if(!extent || extent.length < 4)
				return;
			this.canvas = document.createElement('canvas');      //创建canvas标签
			this.canvas.width = parseInt(Math.abs(extent[2]-extent[0]) / this.resolution);//1000;     
			this.canvas.height = parseInt(Math.abs(extent[3]-extent[1]) / this.resolution);//1000; 
		}
		var ctx = this.canvas.getContext('2d');
		ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		//ctx.fillStyle="#00000000";
		//ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

		var udata = data.U.array;
		var vdata = data.V.array;
		var longdata = data.lon.array;
		var latdata = data.lat.array;
		var minSpeed= 1000000;
		var maxSpeed = 0;
		for(var i=0;i<data.lat.array.length;i++){	
			var speed = Math.sqrt(udata[i]*udata[i]+vdata[i]*vdata[i]);
			minSpeed = Math.min(minSpeed, speed);	
			maxSpeed = Math.max(maxSpeed, speed);
			
			var x = (longdata[i]-extent[0]) / this.resolution;
			var y = (extent[3] - latdata[i]) / this.resolution;
			//ctx.fillStyle = this.getSpeedColor(speed,0,5);//"rgb(255,0,0)";
			//ctx.fillRect(x-3,y-3,7,7);
			
			var angel = Math.atan2(vdata[i],udata[i]);
			//var angel = Math.atan2(udata[i],vdata[i]);
			// if(vdata[i] != 0)
				// angel = Math.atan2(vdata[i],udata[i]);
			// else{
				// if(udata[i] > 0)
					// angel = Math.PI/ 2;
				// else if(udata[i] < 0)
					// angel = Math.PI/ 2 * (-1);
			// }
			
			this.drawArrow(ctx,x,y,12,angel,"#dddd00");
		}
		
		//测试画箭头
		// var u = 5;//东西向
		// var v = -5;//南北向
		// var angel = Math.atan2(v,u);
		// this.drawArrow(ctx,this.canvas.width / 2,this.canvas.height / 2,this.canvas.height / 2,angel,"#ff0000");
		
	}
	// createHeatmap (max, data,gradient) {
		// // 创建元素
		// if(!this.heatDoc){
			// this.heatDoc = document.createElement("div");
			// this.heatDoc.setAttribute("style", "width:1000px;height:1000px;margin: 0px;display: none;");
			// document.body.appendChild(this.heatDoc);
		// }
		// // 创建热力图对象
		// var heatmap = h337.create({
			// container: this.heatDoc,
			// radius: 15,
			// maxOpacity: 0.5,
			// minOpacity: 0,
			// blur: .75,
			// gradient:gradient
		// });
		// // 添加数据
		// heatmap.setData({
			// max: max,
			// data: data
		// });
		// return heatmap;
	// }

	createRectangle (viewer, coordinate, canvas) {
		var lastImageEntity = this.imageEntity;
		
		this.imageEntity = viewer.entities.add({
			//name: 'Rotating rectangle with rotating texture coordinate',
			show: true,
			rectangle: {
				coordinates: Cesium.Rectangle.fromDegrees(coordinate[0], coordinate[1], coordinate[2], coordinate[3]),
				//height: 1000,
				material: canvas//heatMap._renderer.canvas // 核心语句，填充热力图
			}
		});
		
		if(lastImageEntity)
		{
			viewer.entities.remove(lastImageEntity);
		}
	}
	redraw (viewer,extent, data,gradient) {
		//this.heatMap =  this.createHeatmap(max, points,gradient);
		//this.createRectangle(viewer, extent, this.heatMap);
		this.drawCanvas(data,extent);
		this.createRectangle(viewer, extent, this.canvas);	
		
	}
}
export default WindImage