const { default: wxp } = require("../../lib/wxp")
const util = require("../../utils/util.js")
const simulate = require("../../utils/bus-track")

// 模拟为位置点(id=10000)
const INIT_MARKER = {
  id: 10000,
	latitude: 24.4955238,
	longitude: 118.1180946,
	iconPath: './imgs/Marker3_Activated@3x.png',
	width: '34px',
	height: '34px',
	rotate: 0,
	alpha: 1
};

// polyline需要有一个points初始值INIT_POLYLINE，不然会出现渲染警告提示
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
    // 是否正在报站 true:正在报站 false:结束报站
    locationFlg: false,
    // 报站定时器
    setInter: 0,
    // 报站按钮文本（“开始报站”，“结束报站”）
    btnText: '开始报站',

    // 到达站点id：初始值为-1，到达终点时，到达站点id为markers.length - 1
    arrive_station_id: -1,
    arrive_station_name: '',
    // 下一个站点id：初始值为0，到达终点站时，下一个站点id为markers.length
    next_station_id: 0,
    next_station_name: '',
    next_station_distance: 0,

    // 班车方向标示
    direction_checked: true,
    // 班车方向名称
    direction_name: '万达广场方向',

    // 指定中心点坐标
    latitude: 24.4955238,
    longitude: 118.1180946,
    
    // 班车站点标记点
    markers: [],
    
    // 班车路线轨迹线
    polyline: [{
			...INIT_POLYLINE
    }],
    
    // 班车站点数量
    station_count: 0,

    // 演示版本打开后，模拟位置索引（针对polyline数组）
    simulate_position_index: 0
    
    // covers已废弃
    /*
    covers: [{
      latitude: 23.099994,
      longitude: 113.344520,
      iconPath: 'location.png'
    }, {
      latitude: 23.099994,
      longitude: 113.304520,
      iconPath: 'location.png'
    }]
    */
  },

  // 在页面onReady函数中创建地图对象
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')

    this.mapCtx.moveToLocation({
      latitude: this.data.latitude, 
      longitude: this.data.longitude
    })

    // 初始化标记站点（正向）
    this.setMarkersAndPolyline(true)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      console.log("page set selected:", 1)      
      this.getTabBar().setData({
        selected: 1
      })
    }
  },

  startStopLocation: function () {
    console.log('exec startStopLocation', this.data.locationFlg)

    const version = wx.getSystemInfoSync().SDKVersion
    console.log('基础库版本号:', version)
    // 判断基础库版本号
    if (util.compareVersion(version, '2.8.0') < 0) {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
      return
    }

    if (this.data.locationFlg == false) {
      this.data.locationFlg = true

      // 初始化到达站点，到达站点索引为-1，下一站点索引为0
      this.setData({
        arrive_station_id: -1,
        next_station_id: 0,
        arrive_station_name: '',
        next_station_name: this.data.markers[0].title,
      })

      var that = this
      let interval_time = 2000
      if (app.globalData.demoFlg) {
        interval_time = 1000
      }
      // 将计时器赋值给setInter
      this.data.setInter = setInterval(function () {
        if (app.globalData.demoFlg) {
          console.log('演示模式，使用模拟GPS位置')
          let simulate_position_index = that.data.simulate_position_index
          // 将模拟定位点移到当前位置
          that.translateMarker({
            latitude: parseFloat(that.data.polyline[0].points[simulate_position_index].latitude),
            longitude: parseFloat(that.data.polyline[0].points[simulate_position_index].longitude)
          })
          // 将地图中心移动到模拟数据点（注意：不会显示绿色当前位置，需要使用自定义Marker标注当前位置）
          that.mapCtx.moveToLocation({
            latitude: parseFloat(that.data.polyline[0].points[simulate_position_index].latitude), 
            longitude: parseFloat(that.data.polyline[0].points[simulate_position_index].longitude),
            success(res) {
              console.log('res:', res)
            }
          })
        } else {
          console.log('演示模式，使用真实GPS位置')
          // 地图中心跟随当前的位置移动
          that.mapCtx.moveToLocation({
            success(res) {
              console.log('res:', res)
            }
          })
        }

        // 计算是否到站
        that.calDistanceToStation()
        
        if (app.globalData.demoFlg) {
          let simulate_position_index = that.data.simulate_position_index
          // 将索引值 + 1，便于下一个轮询使用，如果到达polyline底部，索引值就不再改变
          console.log('that.data.polyline[0].points.length:', that.data.polyline[0].points.length)
          if (simulate_position_index < that.data.polyline[0].points.length - 1) {
            that.setData({ 
              simulate_position_index: simulate_position_index + 1
            })
          }
        }
        // 打印下一次执行信息
        console.log('setInterval==', '等待2s后再执行')
      }, interval_time)
      this.setData({ btnText: '结束报站'})
    } else {
      this.data.locationFlg = false
      // 恢复初始值
      this.setData({
        arrive_station_id: -1,
        next_station_id: -1,
        arrive_station_name: '',
        next_station_name: '',
        next_station_distance: 0,
        simulate_position_index: 0
      })

      clearInterval(this.data.setInter)
      this.mapCtx.moveToLocation({
        latitude: this.data.latitude, 
        longitude: this.data.longitude,
      })
      this.setData({ btnText: '开始报站'})
    }
  },
  
  // 获取当前位置，计算当前位置到下一个站点的距离
  calDistanceToStation: function() {
    if (app.globalData.demoFlg) {
      const simulate_position_index = this.data.simulate_position_index
      const latitude = this.data.polyline[0].points[simulate_position_index].latitude
      const longitude = this.data.polyline[0].points[simulate_position_index].longitude

      console.log('simulate_position:', simulate_position_index, latitude, longitude)
      this.calDistanceArithmetic(latitude, longitude)
    } else {
      var that = this;
      wx.getLocation({
        type: 'gcj02',
        isHighAccuracy: true,
        success (res) {
          // 获取当前的经纬度
          const latitude = String(res.latitude)
          const longitude = String(res.longitude)
          const speed = res.speed
          const accuracy = res.accuracy

          console.log('real gps position:', res, latitude, longitude, speed, accuracy)
          that.calDistanceArithmetic(latitude, longitude)
        }
      })
    }
  },

  // 计算当前点到下个站点的距离算法
  calDistanceArithmetic: function(latitude, longitude) {
    console.log(this.data.arrive_station_id, this.data.arrive_station_name, this.data.next_station_id, this.data.next_station_name, this.data.station_count)

    // 如果未到终点站，则计算是否到达下一个站点，以及距离下一个站点还有多远
    if (this.data.arrive_station_id < this.data.station_count - 1) {
      const distance = util.getMapDistance(this.data.markers[this.data.next_station_id].latitude, this.data.markers[this.data.next_station_id].longitude, latitude, longitude)

      console.log('distance:', distance)

      let updateNextStationFlg = false

      // 如果距离下一站点的距离小于到站范围，则判断为已到站，更新到达站点及下一个站点
      if (distance < util.arrive_distance) {
        let arrive_station_id = this.data.next_station_id
        let next_station_id = this.data.next_station_id + 1

        // 获取下一个站点的名称
        let next_station_title = (next_station_id >= this.data.station_count) ? '无' : this.data.markers[next_station_id].title

        console.log("已到站:", arrive_station_id, this.data.markers[arrive_station_id].title, next_station_id, next_station_title)

        this.setData({
          arrive_station_id: arrive_station_id,
          arrive_station_name: this.data.markers[arrive_station_id].title,
          next_station_id: next_station_id,
          next_station_name: next_station_title
        })
        updateNextStationFlg = true
      }

      if (updateNextStationFlg) {
        let distance_new = 0
        // 更新了下一个站点索引，因此要重新计算到下一个站点的距离
        if (this.data.next_station_id < this.data.station_count) {
          // 有下一个站点，重新计算到下一个节点的距离
          const distance_new = util.getMapDistance(this.data.markers[this.data.next_station_id].latitude, this.data.markers[this.data.next_station_id].longitude, latitude, longitude)
        }
        this.setData({
          next_station_distance: distance_new,
        })
      } else {
        // 直接使用上面计算过的距离，更新页面
        this.setData({
          next_station_distance: distance,
        })
      }
    }
  },

  // 点击方向复选框的处理函数
  onChange(event) {
    console.log(event.detail)
    if (event.detail) {
      this.setData({
        direction_checked: event.detail,
        direction_name: '万达广场方向',
      })
    } else {
      this.setData({
        direction_checked: event.detail,
        direction_name: '岳阳小区方向',
      })
    }
    this.setMarkersAndPolyline(event.detail)
  },

  setMarkersAndPolyline: function(direction_checked) {
    let srcVal = []
    let station_info = []
    if (direction_checked) {
      // 正向：先从storage中读取，如果获取不到，再读取缺省值
      let value = wx.getStorageSync('stations_positive_info')
      if (value) {
        srcVal = JSON.parse(value)
      } else {
        srcVal = simulate.stations_positive_info
      }
    } else {
      // 反向：先从storage中读取，如果获取不到，再读取缺省值
      let value = wx.getStorageSync('stations_opposite_info')
      if (value) {
        srcVal = JSON.parse(value)
      } else {
        srcVal = simulate.stations_opposite_info
      }    
    }
    if (srcVal) {
      for (var i = 0; i < srcVal.length; i++) {
        let temp = {
          callout: {
            content: srcVal[i].name,
            padding: 10,
            borderRadius: 2,
            display: 'ALWAYS'
          },
          id: srcVal[i].id,
          latitude: srcVal[i].latitude,
          longitude: srcVal[i].longitude,
          title: srcVal[i].name,
        };
        if (srcVal[i].latitude && srcVal[i].longitude) {
          station_info.push(temp)
        }
      }
    }
    
    station_info.push(INIT_MARKER)
    console.log("station_info:", station_info)
    this.setData({
      markers: station_info,
      station_count: srcVal.length
    })

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

  // 获取地图中心点位置
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function(res){
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },

  // 将中心点移动到当前定位的位置
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },

  // 将标注1移动到指定位置
  translateMarker: function(e) {
    console.log('translateMarker destination:', e)
    this.mapCtx.translateMarker({
      markerId: 10000,
      autoRotate: false,
      duration: 100,
      destination: e,
      animationEnd() {
        console.log('animation end')
      },
      success(res) {
        console.log('translateMarker res:', res)
      }
    })
  },

  // 将多个标记点同时展示在视野中
  includePoints: function() {
    this.mapCtx.includePoints({
      padding: [20],
      points: this.data.markers
    })
  }
})