const { default: wxp } = require("../../lib/wxp")
const util = require("../../utils/util.js")

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
    
    // 指定标记点，目前指向中心位置
    markers: [],
    
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
    this.setMarkers(true)

    // 计算中心点距离标记站点的位置
    for(var i = 0; i < this.data.markers.length; i++) {
      const distance = util.getMapDistance(this.data.markers[i].latitude, this.data.markers[i].longitude, this.data.latitude, this.data.longitude)
      console.log(`the center point distance markers ${i}`, distance)
    }
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
    if (this.data.locationFlg == false) {
      this.data.locationFlg = true

      // 初始化到达站点，到达站点索引为-1，下一站点索引为0
      this.setData({
        arrive_station_id: -1,
        next_station_id: 0,
        arrive_station_name: '',
        next_station_name: this.data.markers[0].title,
      })

      var that = this;
      // 将计时器赋值给setInter
      this.data.setInter = setInterval(function () {
        // 地图中心跟随当前的位置移动
        that.mapCtx.moveToLocation({
          success(res) {
            console.log('res:', res)
          }
        })

        // 计算是否到站
        that.calDistanceToStation(that)
        
        // 打印下一次执行信息
        console.log('setInterval==', '等待2s后再执行')
      }, 2000)
      this.setData({ btnText: '结束报站'})
    } else {
      this.data.locationFlg = false
      // 恢复初始值
      this.setData({
        arrive_station_id: -1,
        next_station_id: -1,
        arrive_station_name: '',
        next_station_name: '',
        next_station_distance: 0
      })

      clearInterval(this.data.setInter)
      this.mapCtx.moveToLocation({
        latitude: this.data.latitude, 
        longitude: this.data.longitude,
      })
      this.setData({ btnText: '开始报站'})
    }
  },
  
  // 计算当前点到站点的距离，改变站点的markers颜色
  calDistanceToStation: function() {
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

        console.log(res, latitude, longitude, speed, accuracy)
        console.log(that.data.arrive_station_id, that.data.arrive_station_name, that.data.next_station_id, that.data.next_station_name)

        // 如果未到终点站，则计算是否到达下一个站点，以及距离下一个站点还有多远
        if (that.data.arrive_station_id < that.data.markers.length - 1) {
          const distance = util.getMapDistance(that.data.markers[that.data.next_station_id].latitude, that.data.markers[that.data.next_station_id].longitude, latitude, longitude)
          
          console.log('distance:', distance)

          let updateNextStationFlg = false

          // 如果距离下一站点的距离小于到站范围，则判断为已到站，更新到达站点及下一个站点
          if (distance < util.arrive_distance) {
            let arrive_station_id = that.data.next_station_id
            let next_station_id = that.data.next_station_id + 1

            // 获取下一个站点的名称
            let next_station_title = (next_station_id >= that.data.markers.length)? '无' : that.data.markers[next_station_id].title

            console.log("已到站:", arrive_station_id, that.data.markers[arrive_station_id].title, next_station_id, next_station_title)

            that.setData({
              arrive_station_id: arrive_station_id,
              arrive_station_name: that.data.markers[arrive_station_id].title,
              next_station_id: next_station_id,
              next_station_name: next_station_title
            })
            updateNextStationFlg = true
          }

          if (updateNextStationFlg) {
            // 更新了下一个站点索引，因此要重新计算到下一个站点的距离
            const distance_new = util.getMapDistance(that.data.markers[that.data.next_station_id].latitude, that.data.markers[that.data.next_station_id].longitude, latitude, longitude)

            that.setData({
              next_station_distance: distance_new,
            })
          } else {
            // 直接使用上面计算过的距离，更新页面
            that.setData({
              next_station_distance: distance,
            })
          }
        }
      }
    })
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
    this.setMarkers(event.detail)
  },

  setMarkers: function(direction_checked) {
    let srcVal
    let station_info = []
    if (direction_checked) {
      // 正向：先从storage中读取，如果获取不到，再读取缺省值
      var value = wx.getStorageSync('stations_positive_info')
      if (value) {
        srcVal = JSON.parse(value)
      } else {
        srcVal = util.stations_positive_info
      }
    } else {
      // 反向：先从storage中读取，如果获取不到，再读取缺省值
      var value = wx.getStorageSync('stations_opposite_info')
      if (value) {
        srcVal = JSON.parse(value)
      } else {
        srcVal = util.stations_opposite_info
      }    
    }
    if (srcVal) {
      for (var i = 0; i < srcVal.length; i++) {
        var temp = {
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
    console.log("station_info:", station_info)
    this.setData({
      markers: station_info
    })
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
  translateMarker: function() {
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude:23.10229,
        longitude:113.3345211,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },

  // 将多个标记点同时展示在视野中
  includePoints: function() {
    this.mapCtx.includePoints({
      padding: [50],
      points: this.data.markers
    })
  }
})