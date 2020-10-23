const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

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

// 判断到站的距离（40米）
const arrive_distance = 40

// 花轨迹线时两点间的距离（50米）
const polyline_point_distance = 20

// 注意：需要导出后才能正常使用常量和函数
module.exports = {
  formatTime: formatTime,
  ipAddress: ipAddress,
  getMapDistance: getMapDistance,
  arrive_distance: arrive_distance,
  polyline_point_distance: polyline_point_distance
}
