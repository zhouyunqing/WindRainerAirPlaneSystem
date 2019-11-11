// rem等比适配配置文件
// 设置 rem 函数
function setRem() {
  var whdef = 100 / 1440 // 表示1920的设计图,使用100PX的默认值
  var bodyWidth = document.body.clientWidth // 当前窗口的宽度
  var rem = bodyWidth * whdef * 0.2 // 以默认比例值乘以当前窗口宽度,得到该宽度下的相应FONT-SIZE值
  if (rem > 12) {
    rem = 12
  }
  document.getElementsByTagName('html')[0].style.fontSize = rem + 'px'
}

// 初始化
setRem()
// 改变窗口大小时重新设置 rem
window.onresize = function() {
  setRem()
}
