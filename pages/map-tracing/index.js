Page({
  data: {
    // 是否正在定位 true:正在定位 false:结束定位
    setInter: 0,
    locationFlg: false,
    btnText: '开始定位',

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

    // 从storage中读取站点数据（正向），设置到markers中
    let srcVal = JSON.parse(wx.getStorageSync('stations_positive_info'))
    if (srcVal) {
      let station_info = []
      for(var i = 0; i < srcVal.length; i++){
        var temp = {
          id : srcVal[i].id,
          latitude: srcVal[i].latitude,
          longitude: srcVal[i].longitude,
          title : srcVal[i].name,
        };
        if (srcVal[i].latitude && srcVal[i].longitude) {
          station_info.push(temp)
        }
      }
      console.log("station_info:", station_info)
      this.setData({
        markers: station_info
      })  
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