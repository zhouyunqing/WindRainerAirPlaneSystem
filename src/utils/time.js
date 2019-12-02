const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const timeObj = (date) => {
  const myDate = new Date(date)
  const year = myDate.getFullYear()
  let month = myDate.getMonth() + 1
  let day = myDate.getDate()
  let hour = myDate.getHours()
  let minutes = myDate.getMinutes()
  let seconds = myDate.getSeconds()
  if (month < 10) {
    month = `0${month}`
  }
  if (day < 10) {
    day = `0${day}`
  }
  if (hour === 0) {
    hour = '00'
  } else if (hour > 0 && hour < 10) {
    hour = `0${hour}`
  }

  if (minutes === 0) {
    minutes = '00'
  } else if (minutes > 0 && minutes < 10) {
    minutes = `0${minutes}`
  }

  if (seconds === 0) {
    seconds = '00'
  } else if (seconds > 0 && seconds < 10) {
    seconds = `0${seconds}`
  }

  let week
  switch (myDate.getDay()) {
    case 0:
      week = '日'
      break
    case 1:
      week = '一'
      break
    case 2:
      week = '二'
      break
    case 3:
      week = '三'
      break
    case 4:
      week = '四'
      break
    case 5:
      week = '五'
      break
    case 6:
      week = '六'
      break
  }
  const myArray = {
    y: year,
    m: month,
    dm: myDate.getMonth() + 1,
    d: day,
    dd: myDate.getDate(),
    w: week,
    hh: hour,
    mm: minutes,
    ss: seconds
  }
  return myArray
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export default {
  timeObj: timeObj,
  formatTime: formatTime,
  formatDate: formatDate
}
