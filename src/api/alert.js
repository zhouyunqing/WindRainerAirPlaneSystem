import request from '../utils/request1'
// const base_url = 'http://161.189.11.216:8090'
const base_url = 'http://52.82.54.61:8090'
// 获得风险配置
export function getRiskConfigList(params) {
  console.log(params)
  return request({
    url: base_url + '/gis/riskConfig/getRiskConfigList',
    method: 'get',
    params
  })
}

// 获得数据字典
// catagory=['RiskServerity','isActive','RiskSource','RiskState','runwanHistoryData']
// RiskServerity:// {"returnCode":0,"data":[{"value":"一般","key":"1"},{"value":"紧急","key":"2"},{"value":"严重","key":"3"}],"returnMessage":"success"}
export function getOptions(params) {
  return request({
    url: base_url + '/gis/dictionary/getOptions',
    method: 'get',
    params
  })
}

// 获得系统群组
export function getGroupList(params) {
  // params={
  //   isActive:1
  // }
  console.log(params)
  return request({
    url: base_url + '/gis/group/getGroupList',
    method: 'get',
    params
  })
}

export function updateRiskInfo(params) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: base_url + '/gis/riskInfoes/updateRiskInfo',
    method: 'post',
    data: params
  })
}
// 新建预警配置提交
export function createRiskConfig(params) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: base_url + '/gis/riskConfig/createRiskConfig',
    method: 'post',
    data: params
  })
}

// 删除预警配置
export function deleteRiskConfig(params) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: base_url + '/gis/riskConfig/deleteRiskConfig',
    method: 'post',
    data: params
  })
}

// 修改预警配置提交
export function updateRiskConfig(params) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: base_url + '/gis/riskConfig/updateRiskConfig',
    method: 'post',
    data: params
  })
}

//  获得报警记录
export function getRiskInfoes(params) {
  // params={
  //   configId:-1,
  //   isActive:-1,
  //   pageSize:10,
  //   skipped:0,
  //   state:-1
  // }
  return request({
    url: base_url + '/gis/riskInfoes/getRiskInfoes',
    method: 'get',
    params
  })
}

//  删除报警记录
export function deleteRiskInfoes(params) {
  // params={
  //   configId:-1,
  //   isActive:-1,
  //   pageSize:10,
  //   skipped:0,
  //   state:-1
  // }
  return request({
    url: base_url + '/gis/riskInfoes/deleteRiskInfoes',
    method: 'get',
    params
  })
}

export function getRiskConfig(id) {
  return request({
    url: base_url + '/gis/riskConfig/getRiskConfig?id=' + id,
    method: 'get'
  })
}

// 时间戳转日期格式化
export function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000)//时间戳为10位需*1000，时间戳为13位的话不需乘1000
 var Y = date.getFullYear() + '-'
 var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
 var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
 var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
 var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
 var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
  return Y + M + D + h + m + s
}
