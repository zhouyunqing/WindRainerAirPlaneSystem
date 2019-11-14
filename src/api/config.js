import request from '../utils/request1'
const base_url = 'http://161.189.11.216:8090'
//获得风险配置
export function getLevelConfigList(params) {
  console.log(params)
  return request({
    url: base_url + 'gis/dictionary/getOptions',
    method: 'get',
    params
  })
}

export function getLevelValue(params, level) {
  console.log(level)
  return request({
    url: base_url + 'gis/dictionary/getOptions?key='+level,
    method: 'get',
    params
  })
}

