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
    latitude: '24.49625623',
    longitude: '118.11751817'
  }, {
    id: 1,
    name: '福德堡小区',
    latitude: '24.49707709',
    longitude: '118.11701090'
  },
  {
    id: 2,
    name: '白果山',
    latitude: '24.49847059',
    longitude: '118.11622395'
  }, {
    id: 3,
    name: '中医院',
    latitude: '24.49822238',
    longitude: '118.11476345'
  }
]

// 24路车岳阳方向（反向）站点数据
const stations_opposite_info = [{
    id: 0,
    name: '泓爱医院',
    latitude: '24.49757188',
    longitude: '118.11417507'
  }, {
    id: 1,
    name: '湖边',
    latitude: '24.49675645',
    longitude: '118.11458034'
  },
  {
    id: 2,
    name: '金山',
    latitude: '24.49616889',
    longitude: '118.11595621'
  }, {
    id: 3,
    name: '金山小学',
    latitude: '24.49581651',
    longitude: '118.11713487'
  }
]

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//const ipAddress = "http://localhost:3000"
const ipAddress = "http://192.168.31.115:3000"

//进行经纬度转换为距离的计算
function Rad(d){
  return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
}

/*
计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
默认单位km
*/
const getMapDistance = (lat1, lng1, lat2, lng2) => {
  var radLat1 = Rad(lat1);
  var radLat2 = Rad(lat2);
  var a = radLat1 - radLat2;
  var b = Rad(lng1) - Rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000; //输出为公里
  s = s * 1000; // 输出为米
  //s=s.toFixed(2);
  return s;
}

// 判断到站的距离（20米）
const arrive_distance = 20

module.exports = {
  formatTime: formatTime,
  ipAddress: ipAddress,
  stations_positive_info: stations_positive_info,
  stations_opposite_info: stations_opposite_info,
  getMapDistance: getMapDistance,
  arrive_distance: arrive_distance
}
