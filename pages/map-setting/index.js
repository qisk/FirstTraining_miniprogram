const { default: wxp } = require("../../lib/wxp")
const util = require("../../utils/util.js")
const simulate = require("../../utils/bus-track")

const INIT_POLYLINE = {
  points: [
    {latitude: 24.4955238, longitude: 118.1180946},
    {latitude: 24.4955238, longitude: 118.1180946}
  ],
  color: '#3875FF',
  width: 8,
  dottedLine: false,
  borderWidth: 2
};

//获取应用实例
const app = getApp()

Page({
  data: {
    // 是否正在定位 true:正在定位 false:结束定位
    setInter: 0,
    locationFlg: false,
    btnText: '开始定位',
    direction_checked: true,
    direction_name: '万达广场方向',

    stations: [],

		polyline: [{
			...INIT_POLYLINE
    }],
    /*
    polyline: [{
      points: [
        {latitude: 24.4955238, longitude: 118.1180946},
        {latitude: 24.49625623, longitude: 118.11751817}
      ],
      color: '#3875FF',
      width: 6,
      dottedLine: false,
      borderWidth: 2
    }],
    */
    
    previous_polyline_point : {
      latitude: 0, 
      longitude: 0
    },

    polyline_point_distance: 0,

    // 指定中心点坐标
    latitude: 24.4955238,
    longitude: 118.1180946,
    
    // 指定更新的标记点，目前指向中心位置
    markers: [],

    // 演示版本，在界面上屏蔽“开始定位”按钮
    demoFlg: false
  },

  // 在页面onReady函数中创建地图对象
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
    
    // 从storage中获取站点数据，如果获取不到，则从Util中获取初始数据
    try {
      var value = wx.getStorageSync('stations_positive_info')
      if (value) {
        this.setData({
          stations: JSON.parse(value)
        })
      } else {
        console.log(simulate.stations_positive_info)
        this.setData({
          stations: simulate.stations_positive_info
        })
        wx.setStorage({
          key:"stations_positive_info",
          data:`${JSON.stringify(simulate.stations_positive_info)}`
        }) 
      }
    } catch (e) {
      console.log('wx.getStorageSync fail:', e)
    }

    // 在地图上初始化站点和轨迹
    this.initMarkerAndPolyline(true)

    // 根据app.js的演示版配置，设置按钮可用属性
    console.log('app.globalData.demoFlg:', app.globalData.demoFlg)
    this.setData({
      demoFlg: app.globalData.demoFlg
    })
  },

 /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      console.log("page set selected:", 0)
      this.getTabBar().setData({
        selected: 0
      })
    }
  },

  startStopLocation: function () {
    console.log('exec startStopLocation', this.data.locationFlg)
    if (this.data.locationFlg == false) {
      // 更新界面
      this.setData({ 
        btnText: '结束定位',
        locationFlg: true
      })

      // 运动轨迹初始化
      this.setData({
        'polyline[0]': {
          ...INIT_POLYLINE
        },
        previous_polyline_point: {
          latitude: 0, 
          longitude: 0
        }
      })

      // 设置定时器，并将计时器赋值给setInter
      var that = this;
      this.data.setInter = setInterval(function () {
        // 地图中心跟随当前位置变化
        that.mapCtx.moveToLocation()
        // 绘制运动轨迹
        that.drawMovePath()
        console.log('setInterval==', '等待2s后再执行')
      }, 2000)
    } else {
      // 更新界面
      this.setData({
        btnText: '开始定位',
        locationFlg: false
      })

      // 关闭定时器
      clearInterval(this.data.setInter)
      
      // 存储运动轨迹至storage中
      this.saveMovePath()
      
      // 重新设置地图位置到初始点
      this.mapCtx.moveToLocation({
        latitude: this.data.latitude, 
        longitude: this.data.longitude,
      })
    }
  },

  setStationCoordinate: function (e) {
    // 这里需要转成Int，否则setData时会报
    // Only digits (0-9) can be put inside [] in the path string: stations_positive_direction[0 ].latitude
    let stationId = parseInt(e.currentTarget.dataset.id)
    console.log('stationId:', stationId, e.currentTarget.dataset.id)
    // 获取当前位置的经纬度，更新stations_positive_direction或stations_opposite_direction数组中对应id的经纬度信息，并将数据存入storage中

    var that = this;
    // 默认的type=wgs84，是真实的gps坐标，这个坐标值放到地图中，会出现位置偏移；
    // 需要使用type=gcj02，获取的坐标放到地图中，才不会出现位置偏移
    // gcj02坐标系是由中国国家测绘局制订的地理信息系统的坐标系统。由WGS84坐标系经加密后的坐标系，也称火星坐标系，谷歌中国地图、搜搜中国地图、高德地图采用的是GCJ02地理坐标系。
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      success (res) {
        const latitude = String(res.latitude)
        const longitude = String(res.longitude)
        const speed = res.speed
        const accuracy = res.accuracy

        console.log(res, latitude, longitude, speed, accuracy)
        
        // 更新站点数据
        that.setData({
          [`stations[${stationId}].latitude`]: latitude,
          [`stations[${stationId}].longitude`]: longitude,
        })
        
        // 更新storage中的数据
        let updateKey = 'stations_positive_info'
        if (that.data.direction_checked == false) {
          updateKey = 'stations_opposite_info'
        }
          
        // 将新的stations存入storage
        wx.setStorage({
          key: `${updateKey}`,
          data: `${JSON.stringify(that.data.stations)}`
        })

        // 将更新的站点位置设置到地图中
        that.setMarker(that.data.stations[stationId])
      }
     })
  },

  // 在地图上绘制运动轨迹
  drawMovePath: function() {
    var that = this
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      success (res) {
        // 获取当前的经纬度
        const latitude = String(res.latitude)
        const longitude = String(res.longitude)
        const speed = res.speed
        const accuracy = res.accuracy

        console.log(res, latitude, longitude, speed, accuracy)
        
        if ((that.data.previous_polyline_point.latitude == 0) || (that.data.previous_polyline_point.longitude == 0)) {
          // 如果是初始数据，则直接将当前点存入polyline中，做为前两个点
          that.setPolyline({
            latitude: latitude,
            longitude: longitude,
            initFlg: true
          })
        } else {
          // 判断当前点和上一个位置点的距离，大于50米就添加到polyline中
          const distance = util.getMapDistance(that.data.previous_polyline_point.latitude, that.data.previous_polyline_point.longitude, latitude, longitude)

          console.log('distance:', distance)
          that.setData({
            polyline_point_distance: distance
          })

          if (distance > util.polyline_point_distance) {
            console.log('add position to')
            that.setPolyline({
              latitude: latitude,
              longitude: longitude,
              initFlg: false
            })
          }
        }
      }
    })
  },

  // 将运动轨迹保存到storage中
  saveMovePath: function() {
    if (this.data.direction_checked) {
      wx.setStorage({
        key: "positive_polyline_points",
        // 由于轨迹点较多，为提升效率，不用JSON.stringify转换成字符串，直接存储为对象
        data: this.data.polyline[0].points
      }) 
    } else {
      wx.setStorage({
        key:"opposite_polyline_points",
        // 由于轨迹点较多，为提升效率，不用JSON.stringify转换成字符串，直接存储为对象
        data: this.data.polyline[0].points
      }) 
    }
 
  },

  // 将站点设置到地图中
  setMarker: function(e) {
    let station_info = this.data.markers
    console.log(station_info, e)
    if (e.latitude && e.longitude) {
      var temp = {
        id: 0, //this.data.markers.length,
        latitude: e.latitude,
        longitude: e.longitude,
        title: e.name,
      };
      station_info.push(temp)

      console.log("station_info:", station_info)
      this.setData({
        markers: station_info
      })
    }
  },

  // 将轨迹线设置到地图中
  setPolyline: function (e) {
    let polyline_points_info = []
    if (e.initFlg) {
      // 初始化polyline_points_info，填写两次数据，避免出现渲染层错误
      polyline_points_info.push({
        latitude: e.latitude,
        longitude: e.longitude,
      })
      polyline_points_info.push({
        latitude: e.latitude,
        longitude: e.longitude,
      })
    } else {
      polyline_points_info = this.data.polyline[0].points
      console.log(polyline_points_info, e)
      if (e.latitude && e.longitude) {
        polyline_points_info.push({
          latitude: e.latitude,
          longitude: e.longitude,
        })
      }
    }

    // 设置新的polyline数据
    console.log("polyline_points_info:", polyline_points_info)
    this.setData({
      'polyline[0].points': polyline_points_info,
      previous_polyline_point: {
        latitude: e.latitude,
        longitude: e.longitude,
      }
    })
  },
  

  initMarkerAndPolyline: function(direction_checked) {
    let srcStation = []

    if (direction_checked) {
      // 正向：先从storage中读取，如果获取不到，再读取缺省值
      var value = wx.getStorageSync('stations_positive_info')
      if (value) {
        srcStation = JSON.parse(value)
      } else {
        srcStation = simulate.stations_positive_info
      }
    } else {
      // 反向：先从storage中读取，如果获取不到，再读取缺省值
      var value = wx.getStorageSync('stations_opposite_info')
      if (value) {
        srcStation = JSON.parse(value)
      } else {
        srcStation = simulate.stations_opposite_info
      }    
    }

    console.log('srcStation.length:', srcStation.length)

    // 构造makers信息
    let markers_info = []
    if (srcStation.length > 0) {
      for (var i = 0; i < srcStation.length; i++) {
        var temp = {
          id: srcStation[i].id,
          latitude: srcStation[i].latitude,
          longitude: srcStation[i].longitude,
          title: srcStation[i].name,
        };
        if (srcStation[i].latitude && srcStation[i].longitude) {
          markers_info.push(temp)
        }
      }

      console.log("markers_info:", markers_info)
      this.setData({
        markers: markers_info
      })
    }
    
    // 尝试从storage中获取polyline信息，由于存入的为JSON对象，这里不需要转换，直接获取
    let polyline_info = []
    if (direction_checked) {
      polyline_info = wx.getStorageSync('positive_polyline_points')
      console.log('polyline_info:', polyline_info)
      if (!polyline_info){
        polyline_info = simulate.positive_polyline_points_info
        wx.setStorage({
          key:"positive_polyline_points",
          data: simulate.positive_polyline_points_info
        }) 
      }
    } else {
      polyline_info = wx.getStorageSync('opposite_polyline_points')
      if (!polyline_info){
        polyline_info = simulate.opposite_polyline_points_info
        wx.setStorage({
          key:"opposite_polyline_points",
          data: simulate.opposite_polyline_points_info
        }) 
      }
    }

    if (polyline_info.length > 0) {
      console.log("polyline_info:", polyline_info)
      this.setData({
        'polyline[0].points': polyline_info
      })
    }
  },

  // 点击方向复选框的处理函数
  onChange(event) {
    console.log(event.detail)
    if (event.detail) {
      try {
        var value = wx.getStorageSync('stations_positive_info')
        if (value) {
          this.setData({
            direction_checked: event.detail,
            direction_name: '万达广场方向',
            stations: JSON.parse(value)
          })
        } else {
          this.setData({
            direction_checked: event.detail,
            direction_name: '万达广场方向',
            stations: simulate.stations_positive_info
          })
          wx.setStorage({
            key:"stations_positive_info",
            data:`${JSON.stringify(simulate.stations_positive_info)}`
          }) 
        }
      } catch (e) {
        console.log('wx.getStorageSync fail:', e)
      }

      this.initMarkerAndPolyline(true)
    } else {
      try {
        var value = wx.getStorageSync('stations_opposite_info')
        if (value) {
          this.setData({
            direction_checked: event.detail,
            direction_name: '岳阳小区方向',
            stations: JSON.parse(value)
          })
        } else {
          this.setData({
            direction_checked: event.detail,
            direction_name: '岳阳小区方向',
            stations: simulate.stations_opposite_info
          })
          wx.setStorage({
            key:"stations_opposite_info",
            data:`${JSON.stringify(simulate.stations_opposite_info)}`
          }) 
        }
      } catch (e) {
        console.log('wx.getStorageSync fail:', e)
      }
      this.initMarkerAndPolyline(false)
    }
  },
  
  // 将多个标记点同时展示在视野中
  includePoints: async function() {
    this.mapCtx.includePoints({
      padding: [20],
      points: this.data.markers,
    })
  },

  uploadStorageData: async function () {
    /*
    // 在本地用户文件目录下创建一个文件 hello.txt，写入内容 "hello, world"
    const fs = wx.getFileSystemManager()
    console.log('wx.env.USER_DATA_PATH', wx.env.USER_DATA_PATH)
    fs.writeFile({
      filePath: `${wx.env.USER_DATA_PATH}/hello.txt`,
      data: 'hello, world',
      encoding: 'utf8',
      success(res) {
        console.log(' successres:', res)
      },
      fail(res) {
        console.log('fail res:', res)
      },
    })
    */
    /*
    // 将storage中的站点数据发送到服务端
    let positive_info = wx.getStorageSync('stations_positive_info')
    let opposite_info = wx.getStorageSync('stations_opposite_info')
 
    let data = {
      positive_info,
      opposite_info,
    }
    */

    /*
    // 将storage中的轨迹数据发送到服务端
    let positive_info = JSON.stringify(wx.getStorageSync('positive_polyline_points'))
    let opposite_info = JSON.stringify(wx.getStorageSync('opposite_polyline_points'))

    let data = {
      positive_info,
      opposite_info,
    }
    */

    // 将storage中的站点数据发送到服务端
    let positive_info = wx.getStorageSync('stations_positive_info')
    let opposite_info = wx.getStorageSync('stations_opposite_info')

    let data = {
      positive_info,
      opposite_info,
    }

    let res = await wxp.request_without_login({
      url: util.ipAddress + `/goods/goods-test/`,
      method: 'post',
      data
    })
    if (res.data.msg == 'ok') {
      wx.showToast({
        title: '发送成功',
      })
    }
  }
})
