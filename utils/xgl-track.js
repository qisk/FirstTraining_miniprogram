 // 仙阁里 民立二小方向（正向）站点数据
 const stations_positive_info = [{
    id: 0,
    name: '中航技',
    latitude: '24.49625623',
    longitude: '118.11751817'
  }, {
    id: 1,
    name: '仙阁幼儿园',
    latitude: '24.49707709',
    longitude: '118.11701090'
  },
  {
    id: 2,
    name: '仙阁里17号',
    latitude: '24.49847059',
    longitude: '118.11622395'
  }, {
    id: 3,
    name: '民立二小',
    latitude: '24.49822238',
    longitude: '118.11476345'
  }
]

// 仙阁里 中航技方向（反向）站点数据
const stations_opposite_info = [{
    id: 0,
    name: '民立二小',
    latitude: '24.49757188',
    longitude: '118.11417507'
  }, {
    id: 1,
    name: '停车场',
    latitude: '24.49675645',
    longitude: '118.11458034'
  },
  {
    id: 2,
    name: '侨建花园',
    latitude: '24.49616889',
    longitude: '118.11595621'
  }, {
    id: 3,
    name: '中航技',
    latitude: '24.49581651',
    longitude: '118.11713487'
  }
]

// 正向轨迹点
const positive_polyline_points_info = [
  {"latitude":"24.49603217230903","longitude":"118.11766411675347"},{"latitude":"24.49603217230903","longitude":"118.11766411675347"},{"latitude":"24.49621527777778","longitude":"118.11759521484375"},{"latitude":"24.49639214409722","longitude":"118.11754720052083"},{"latitude":"24.496571180555556","longitude":"118.11745035807292"},{"latitude":"24.496702202690972","longitude":"118.11728786892361"},{"latitude":"24.49681423611111","longitude":"118.11712076822917"},{"latitude":"24.49671115451389","longitude":"118.11737141927084"},{"latitude":"24.497064073350696","longitude":"118.11705403645833"},{"latitude":"24.497354600694443","longitude":"118.11685791015626"},{"latitude":"24.497521430121527","longitude":"118.11678141276042"},{"latitude":"24.49770046657986","longitude":"118.11669026692708"},{"latitude":"24.49787353515625","longitude":"118.1165744357639"},{"latitude":"24.498030598958334","longitude":"118.11645643446181"},{"latitude":"24.49822536892361","longitude":"118.11637586805556"},{"latitude":"24.498402506510416","longitude":"118.11630696614583"},{"latitude":"24.49843967013889","longitude":"118.11610514322916"},{"latitude":"24.49835286458333","longitude":"118.11591037326389"},{"latitude":"24.498477647569445","longitude":"118.11576741536459"},{"latitude":"24.49845893012153","longitude":"118.11554660373264"},{"latitude":"24.4984130859375","longitude":"118.11535101996527"},{"latitude":"24.498368326822916","longitude":"118.1151388888889"},{"latitude":"24.49830322265625","longitude":"118.11493815104167"},{"latitude":"24.498212348090277","longitude":"118.11474934895833"},{"latitude":"24.498077528211805","longitude":"118.114609375"},
  {"latitude":"24.49794650607639","longitude":"118.11445583767362"}
]

// 反向轨迹点
const opposite_polyline_points_info =[

]

module.exports = {
  stations_positive_info: stations_positive_info,
  stations_opposite_info: stations_opposite_info,
  positive_polyline_points_info: positive_polyline_points_info,
  opposite_polyline_points_info: opposite_polyline_points_info,
}