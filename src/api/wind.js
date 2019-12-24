import request from '../utils/request1'
const base_url = 'http://161.189.11.216:8090'
// const base_url = 'http://52.82.54.61:8090'

export function getOptions(params) {
  return request({
    url: base_url + '/gis/dictionary/getOptions',
    method: 'get',
    params
  })
}

export function getRunwayPointForecastData(params) {
  return request({
    url: base_url + '/gis/BJPEK/RunwayPointForecastData',
    method: 'get',
    params
  })
}

export function getParabolic(params) {
  return request({
    url: base_url + '/gis/BJPEK/ModelForecast/Parabolic',
    method: 'get',
    params
  })
}

export function getModelForecast(params) {
  return request({
    url: base_url + '/gis/BJPEK/ModelForecast',
    method: 'get',
    params
  })
}

export function getRunwaysForecast(params) {
  return request({
    url: base_url + '/gis/BJPEK/RunwaysForecast',
    method: 'get',
    params
  })
}

export function getQueryThunderData(params) {
  return request({
    url: base_url + '/gis/BJPEK/queryThunderData',
    method: 'get',
    params
  })
}
