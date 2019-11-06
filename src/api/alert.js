import request from '../utils/request1'
const base_url = 'http://161.189.11.216:8090'
export function getRiskConfigList(params) {
  return request({
    url: base_url + '/gis/riskConfig/getRiskConfigList?isActive=1&pageSize=10&skipped=20',
    method: 'get'
  })
}

// 获得预警级别
// {"returnCode":0,"data":[{"value":"一般","key":"1"},{"value":"紧急","key":"2"},{"value":"严重","key":"3"}],"returnMessage":"success"}
export function getRiskServerity(params) {
  return request({
    url: base_url + '/gis/dictionary/getOptions?catagory=RiskServerity',
    method: 'get'
  })
}

// 获得预警条件
export function getRunwayHistoryData(params) {
  return request({
    url: base_url + '/gis/dictionary/getOptions?catagory=runwayHistoryData',
    method: 'get'
  })
}

// 获得系统群组
export function getGroupList(params) {
  return request({
    url: base_url + '/gis/group/getGroupList?isActive=1',
    method: 'get'
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

//  获得报警记录
export function getRiskInfoes(params) {
  return request({
    url: base_url + '/gis/riskInfoes/getRiskInfoes?configId=2&isActive=-1&pageSize=3&skipped=1&state=1',
    method: 'get'
  })
}

