const { default: wxp } = require("../../lib/wxp")
const util = require("../../utils/util.js")

Page({
  data: {
    // 是否正在定位 true:正在定位 false:结束定位
    setInter: 0,
    locationFlg: false,
    btnText: '开始定位',
    direction_checked: true,
    direction_name: '万达广场方向',

    stations: [],

    // 指定中心点坐标
    latitude: 24.4955238,
    longitude: 118.1180946,
    
    // 指定标记点，目前指向中心位置
    markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      title: '标记点1'
    }, {
      id: 2,
      latitude: 23.099994,
      longitude: 113.304520,
      title: '标记点2'
    }, {
      id: 3,
      latitude: 23.10229,
      longitude: 113.3345211,
      title: '标记点3'
    }],
    
    // covers已废弃
    covers: [{
      latitude: 23.099994,
      longitude: 113.344520,
      iconPath: 'location.png'
    }, {
      latitude: 23.099994,
      longitude: 113.304520,
      iconPath: 'location.png'
    }]
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
        console.log(util.stations_positive_info)
        this.setData({
          stations: util.stations_positive_info
        })
        wx.setStorage({
          key:"stations_positive_info",
          data:`${JSON.stringify(util.stations_positive_info)}`
        }) 
      }
    } catch (e) {
      console.log('wx.getStorageSync fail:', e)
    }
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
      this.data.locationFlg = true
      var that = this;
      //将计时器赋值给setInter
      this.data.setInter = setInterval(function () {
        that.mapCtx.moveToLocation()
        console.log('setInterval==', '等待2s后再执行')
      }, 2000)
      this.setData({ btnText: '结束定位'})
    } else {
      this.data.locationFlg = false
      clearInterval(this.data.setInter)
      this.mapCtx.moveToLocation({
        latitude: this.data.latitude, 
        longitude: this.data.longitude,
      })
      this.setData({ btnText: '开始定位'})
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
      }
     })
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
            stations: util.stations_positive_info
          })
          wx.setStorage({
            key:"stations_positive_info",
            data:`${JSON.stringify(util.stations_positive_info)}`
          }) 
        }
      } catch (e) {
        console.log('wx.getStorageSync fail:', e)
      }
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
            stations: util.stations_opposite_info
          })
          wx.setStorage({
            key:"stations_opposite_info",
            data:`${JSON.stringify(util.stations_opposite_info)}`
          }) 
        }
      } catch (e) {
        console.log('wx.getStorageSync fail:', e)
      }
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
      points: [{
        latitude: 23.099994,
        longitude: 113.324520,
      }, {
        latitude: 23.099994,
        longitude: 113.304520,
      }, {
        latitude:23.10229,
        longitude:113.3345211,
      }]
    })
  }
})
