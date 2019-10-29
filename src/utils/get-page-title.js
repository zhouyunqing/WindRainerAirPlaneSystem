import defaultSettings from '@/settings'

const title = defaultSettings.title || '风雨者航空气象服务系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
