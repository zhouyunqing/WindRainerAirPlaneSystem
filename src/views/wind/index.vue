<template>
  <div id="wind" @mouseup="stopMove">
    <section>
      <article class="wind_header">
        <div>
          <el-input v-model="searchInput" placeholder="输入查询机场名称或拼音">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <div>
          <el-button type="primary">平面风向展示</el-button>
          <el-button class="button_color" type="primary">部面风向展示</el-button>
        </div>
        <div class="wind_header_icon">
          <div class="pic_icon"></div>
          <span>详细</span>
        </div>
      </article>

      <article class="wind_content">
        <div id="body">
          <div  ref="canvas" id="canvas" class="canvas"></div>
        </div>
      </article>

      <article class="wind_footer">
        <div class="wind_footer_header">
          <el-button :class="{ 'select_color': runType=='runway1' }"  @click="changeRunway('runway1')">跑道1</el-button>
          <el-button :class="{ 'select_color': runType=='runway2' }" @click="changeRunway('runway2')">跑道2</el-button>
          <el-button :class="{ 'select_color': runType=='runway3' }" @click="changeRunway('runway3')">跑道3</el-button>
        </div>
        <div class="wind_footer_body">
          <div @mousemove="startMove">
            <div class="title">
              <div class="title_icon"></div>
              <span>跑道一</span>
            </div>
            <ul class="progress_bar">
              <li>0h</li>
              <li>2h</li>
              <li>4h</li>
              <li>6h</li>
              <li>8h</li>
              <li>10h</li>
              <li>12h</li>
              <li>14h</li>
              <li>16h</li>
              <li>18h</li>
              <li>20h</li>
              <li>22h</li>
              <li>24h</li>
            </ul>
            <div
              class="pentagon"
              ref="mySlider"
              :style="{left:mySliderLeft+'px'}"
              @mousedown="startSlider"
            ></div>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>
<script>
import data from "@/assets/data/j1.json";
import request from "@/utils/request1";
export default {
  data() {
    return {
      searchInput: "",
      mySliderLeft: 0,
      mouseX: 0,
      mouseXstart: 0,
      flag: false,
      height_num: 35,
      initLeft: 0,
      runType: 'runway1'
    };
  },
  mounted() {
    let self = this;
    request({
      url:
        "http://161.189.11.216:8090/gis/BJPEK/ModelForecast/Parabolic?dataCode=ABC&dataSet=XLONG,XLAT,hight,U,V,W&time=2019-11-01%2000:00:00&resolution=1000M&runway=runway1",
      method: "get"
    }).then(resp => {
      self.draw(resp.data);
    });
  },
  methods: {
    changeRunway(type) {
      this.runType = type
      let self = this
      this.$refs.canvas.innerHTML = ''
      request({
        url:
          "http://161.189.11.216:8090/gis/BJPEK/ModelForecast/Parabolic?dataCode=ABC&dataSet=XLONG,XLAT,hight,U,V,W&time=2019-11-01%2000:00:00&resolution=1000M&runway=" +
          type,
        method: "get"
      }).then(resp => {
        self.draw(resp.data);
      });
    },
    getSpeedIconId(speed) {
      var t = Math.round(speed, 1);
      // 计算风速图标
      var iconid = 36;
      if (speed < 0.3) {
        iconid = 0;
      } else if (speed < 2.1) {
        iconid = 2;
      } else if (speed < 4.1) {
        iconid = 4;
      } else if (speed < 6.1) {
        iconid = 6;
      } else if (speed < 8.1) {
        iconid = 8;
      } else if (speed < 10.1) {
        iconid = 10;
      } else if (speed < 12.1) {
        iconid = 12;
      } else if (speed < 14.1) {
        iconid = 14;
      } else if (speed < 16.1) {
        iconid = 16;
      } else if (speed < 20.1) {
        iconid = 20;
      } else if (speed < 24.1) {
        iconid = 24;
      } else if (speed < 28.1) {
        iconid = 28;
      } else if (speed < 32.1) {
        iconid = 32;
      } else {
        iconid = 36;
      }
      return iconid;
    },
    draw(data) {
      var finList = this.formatData(data);
      this.drawDiv(finList);
    },
    formatData(data) {
      var v = data["data"]["V"];
      var w = data["data"]["W"];
      var xlat = data["data"]["XLAT"];
      var sortList = [];

      //每行数据按纬度xlat排序
      for (let i = 0, len = xlat.length / this.height_num; i < len; i++) {
        var jList = [];
        for (let j = 0; j < this.height_num; j++) {
          if (jList.length == 0) {
            jList.push(j);
          } else if (
            xlat[i * this.height_num + j] <
            xlat[i * this.height_num + jList[jList.length - 1]]
          ) {
            jList.push(j);
          } else if (
            xlat[i * this.height_num + j] > xlat[i * this.height_num + jList[0]]
          ) {
            jList.unshift(j);
          } else {
            for (let k = 1, klen = jList.length; k < klen; k++) {
              if (
                xlat[i * this.height_num + j] >
                  xlat[i * this.height_num + jList[k]] &&
                xlat[i * this.height_num + j] <
                  xlat[i * this.height_num + jList[k - 1]]
              ) {
                jList.splice(k, 0, j);
              }
            }
          }
        }
        sortList.push(jList);
      }
      //整理最后的数据[xlat,w,v,speed,speed_direction]
      var finList = [];
      for (let i = 0, len = xlat.length / this.height_num; i < len; i++) {
        var xList = [];
        for (let j = 0; j < this.height_num; j++) {
          var w1 =
            w[[i * this.height_num + sortList[i][j]]] == null
              ? 0
              : w[[i * this.height_num + sortList[i][j]]];
          var v1 = v[[i * this.height_num + sortList[i][j]]];
          var speed = Math.sqrt(w1 * w1 + v1 * v1);
          var r2d = 45.0 / Math.atan(1.0);
          var speed_dir = 0;
          if (v1 == 0 && w1 > 0) {
            speed_dir = 0;
          } else if (v1 == 0 && w1 < 0) {
            speed_dir = 180;
          } else {
            // speed_dir=Math.atan((-1*w1)/(-1/v1))*r2d
            speed_dir = Math.atan((-1 * v1) / (-1 * w1 * 10)) * r2d;
          }

          if (speed_dir < 0) {
            speed_dir = speed_dir + 360;
          }

          speed_dir += 180;
          //  if(speed_dir>360){speed_dir -= 180}
          xList.push([
            xlat[i * this.height_num + sortList[i][j]],
            w1,
            v1,
            speed,
            speed_dir,
            i
          ]);
        }
        finList.push(xList);
      }
      // console.log(xlat);
      // console.log(sortList);
      // console.log(finList);
      // console.log(JSON.stringify(finList));

      return finList;
    },
    drawDiv(finList) {
      //draw canvas
      var body = document.getElementById("body");
      var canvast = document.getElementById("canvas");
      body.removeChild(canvast);

      var canvas = document.createElement("div");
      canvas.setAttribute("id", "canvas");
      body.appendChild(canvas);

      if (finList.length < 1) {
        return;
      }
      for (let len = finList.length, j = len - 1; j >= 0; j--) {
        var div_0 = document.createElement("div");
        div_0.setAttribute(
          "style",
          "text-align:center; vertical-align: center;display:flex;"
        );
        for (let i = 0, len1 = finList[0].length; i < len1; i++) {
          var div_1 = document.createElement("div");
          div_1.setAttribute("class", "demo");
          var b_1 = document.createElement("b");

          var speed = finList[j][i][3];
          var iconid = this.getSpeedIconId(speed);
          b_1.setAttribute("class", "icon-" + iconid);
          var color = "";
          b_1.setAttribute(
            "style",
            "transform: rotate(" + Math.round(finList[j][i][4]) + "deg)" + color
          );
          div_1.appendChild(b_1);
          div_0.appendChild(div_1);
        }
        var div_sp = document.createElement("div");
        div_sp.setAttribute("class", "clear");
        canvas.appendChild(div_sp);
        canvas.appendChild(div_0);
      }
    },
    startSlider(event) {
      this.flag = true;
      this.mouseXstart = window.event.screenX;
      console.log("this.mouseXstart", this.mouseXstart);
      let mySlider = this.$refs.mySlider;
      this.initLeft = parseInt(mySlider.style.left.replace("px", ""));
    },
    startMove(event) {
      if (this.flag) {
        this.mouseX = window.event.screenX;
        console.log("this.mouseXstart", this.mouseXstart);
        console.log("this.mouseX", this.mouseX);
        this.distance = this.mouseX - this.mouseXstart;
        console.log("距离变化", this.distance);
        let mySlider = this.$refs.mySlider;

        mySlider.style.left = this.initLeft + this.distance + "px";
        console.log("鼠标结束距离", this.mouseX);
        console.log("元素左间距", mySlider.style.left);
      }
    },
    stopMove(event) {
      this.flag = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style  lang="scss">
@font-face {
  font-family: "icomoon";
  src: url("./fonts/icomoon.eot?rl3qay");
  src: url("./fonts/icomoon.eot?rl3qay#iefix") format("embedded-opentype"),
    url("./fonts/icomoon.ttf?rl3qay") format("truetype"),
    url("./fonts/icomoon.woff?rl3qay") format("woff"),
    url("./fonts/icomoon.svg?rl3qay#icomoon") format("svg");
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
#wind {
  height: 100vh;
  .wind_header {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    .el-input {
      width: 256px;
    }
    .el-button {
      font-size: 15px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 21px;
      padding: 9px 6px 10px 12px;
      background-color: #006426;
    }
    .button_color {
      background-color: #05892a;
    }
    .pic_icon {
      width: 256px;
    }
    .wind_header_icon {
      display: flex;
      span {
        line-height: 40px;
        font-size: 15px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 255, 71, 1);
        line-height: 21px;
        text-shadow: 0px 5px 5px rgba(36, 34, 54, 0.14);
        text-decoration: underline;
      }
    }
  }
  .wind_content {
    margin-top: 24px;
    #canvas {
      overflow: scroll;
      width: 100%;
      height: 52vh;
    }
    .demo {
      b {
        display: block;
        width: 35px;
        height: 35px;
      }
      margin-right: 5px;
    }
    [class^="icon-"],
    [class*=" icon-"] {
      /* use !important to prevent issues with browser extensions that change fonts */
      font-family: "icomoon" !important;
      font-style: normal;
      font-weight: normal;
      font-variant: normal;
      text-transform: none;
      line-height: 1;

      /* Better Font Rendering =========== */
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;

      font-size: 25px;
    }

    .icon-0:before {
      content: "\e900";
      color: #1200a9;
      font-size: 10px;
      position: relative;
      top: 0px;
    }
    .icon-2:before {
      content: "\e901";
      color: #1739e7;
      position: relative;
      top: 5px;
    }
    .icon-4:before {
      content: "\e902";
      color: #1266e8;
      position: relative;
      top: 5px;
    }
    .icon-6:before {
      content: "\e903";
      color: #00dae3;
      position: relative;
      top: 5px;
    }
    .icon-8:before {
      content: "\e904";
      color: #00e5cb;
      position: relative;
      top: 5px;
    }
    .icon-10:before {
      content: "\e905";
      color: #02e7af;
      position: relative;
      top: 5px;
    }
    .icon-12:before {
      content: "\e906";
      color: #1ee77e;
      position: relative;
      top: 5px;
    }
    .icon-14:before {
      content: "\e907";
      color: #3be84d;
      position: relative;
      top: 5px;
    }
    .icon-16:before {
      content: "\e908";
      color: #61e80b;
    }
    .icon-20:before {
      content: "\e909";
      color: #8ce800;
      position: relative;
      top: 5px;
    }
    .icon-24:before {
      content: "\e90a";
      color: #c2e800;
      position: relative;
      top: 5px;
    }
    .icon-28:before {
      content: "\e90b";
      color: #e5d600;
      position: relative;
      top: 5px;
    }
    .icon-32:before {
      content: "\e90c";
      color: #e6b000;
      position: relative;
      top: 5px;
    }
    .icon-36:before {
      content: "\e90d";
      color: #e62408;
      position: relative;
      top: 5px;
    }

    .clear {
      clear: both;
    }

    .hidden {
      /* display:none; */
      width: 20px;
      height: 30px;
    }
  }
  .wind_footer {
    .wind_footer_header {
      text-align: left;
      margin-bottom: 8px;
      .select_color {
        background: #242236 !important;
        color: rgba(255, 255, 255, 1) !important;
      }
      /deep/.el-button {
        width: 80px !important;
        height: 28px !important;
        background: rgba(227, 222, 255, 1);
        border-radius: 4px;
        width: 37px;
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 5px;
      }
    }
    .wind_footer_body {
      padding: 10px 0 17px 16px;
      background: #242236;
      .title {
        display: flex;
        font-size: 22px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 30px;
        .title_icon {
          width: 4px;
          height: 20px;
          background: rgba(0, 255, 71, 1);
          border-radius: 1px;
          margin-top: 5px;
          margin-right: 5px;
        }
      }

      .progress_bar {
        box-shadow: 0 0 2px 0 #ff242236;
        display: inline-block;
        user-select: none;
        list-style: none;
        display: inline-block;
        vertical-align: top;
        font-size: 0;
        padding: 0;
        margin: 0;
        width: 100%;
        li {
          padding: 0 4px;
          background: #242236;
          vertical-align: top;
          display: inline-block;
          font-size: 14px;
          font-family: DINMittelschriftStd;
          color: rgba(187, 187, 187, 1);
          height: 28px;
          line-height: 28px;
          cursor: pointer;
          box-sizing: border-box;
          margin: 0;
          width: 7.69%;
          text-align: left;
        }
        li:last-child {
          width: 21px;
        }
      }
      .pentagon {
        margin-top: 14px;
        position: relative;
        width: 12px;
        border-width: 12px 0px 0;
        border-style: solid;
        border-color: #fff2f2f2 transparent;
      }
      .pentagon:before {
        content: "";
        position: absolute;
        height: 0;
        width: 0;
        top: -18px;
        left: 0px;
        border-width: 0px 6px 6px;
        border-style: solid;
        border-color: transparent transparent #fff2f2f2;
      }
    }
    position: absolute;
    bottom: 20px;
    left: 20px;
    right: 20px;
  }
}
</style>

