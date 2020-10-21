const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

 // 24路车万达方向（正向）站点数据
 const stations_positive_info = [{
    id: 0,
    name: '仙岳花园',
    latitude: '24.4986',
    longitude: '118.112721'
  }, {
    id: 1,
    name: '福德堡小区',
    latitude: '24.499405',
    longitude: '118.112269'
  },
  {
    id: 2,
    name: '白果山',
    latitude: '24.49983',
    longitude: '118.111214'
  }, {
    id: 3,
    name: '中医院',
    latitude: '24.500559',
    longitude: '118.110642'
  }
]

// 24路车岳阳方向（反向）站点数据
const stations_opposite_info = [{
    id: 0,
    name: '泓爱医院',
    latitude: '24.499914',
    longitude: '118.110354'
  }, {
    id: 1,
    name: '湖边',
    latitude: '24.498835',
    longitude: '118.110932'
  },
  {
    id: 2,
    name: '金山',
    latitude: '24.499166',
    longitude: '118.111873'
  }, {
    id: 3,
    name: '金山小学',
    latitude: '24.498517',
    longitude: '118.112362'
  }
]

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//const ipAddress = "http://localhost:3000"
const ipAddress = "http://192.168.31.115:3000"

module.exports = {
  formatTime: formatTime,
  ipAddress: ipAddress,
  stations_positive_info: stations_positive_info,
  stations_opposite_info: stations_opposite_info
}
