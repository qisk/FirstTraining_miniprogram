Page({
  data: {
    // 是否正在定位 true:正在定位 false:结束定位
    setInter: 0,
    locationFlg: false,
    btnText: '开始定位',
    direction_checked: true,
    direction_name: '万达广场方向',

    stations: [],
    stations_positive_direction: [{
        id: 1,
        name: '仙岳花园',
        latitude: '23.099994',
        longitude: '113.324520'
      }, {
        id: 2,
        name: '福德堡小区',
        latitude: '23.099994',
        longitude: '113.304520'
      },
      {
        id: 3,
        name: '白果山',
        latitude: '23.10229',
        longitude: '113.3345211'
      },{
        id: 4,
        name: '中医院',
        latitude: '23.10229',
        longitude: '113.3345211'
      }
    ],

    stations_opposite_direction: [{
      id: 100,
      name: '泓爱医院',
      latitude: '23.099994',
      longitude: '113.324520'
    }, {
      id: 101,
      name: '湖边',
      latitude: '23.099994',
      longitude: '113.304520'
    },
    {
      id: 102,
      name: '金山',
      latitude: '23.10229',
      longitude: '113.3345211'
    },{
      id: 103,
      name: '金山小学',
      latitude: '23.10229',
      longitude: '113.3345211'
    }],

    // 指定中心点坐标
    latitude: 23.099994,
    longitude: 113.324520,
    
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
    this.setData({
      stations: this.data.stations_positive_direction
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
        latitude: 23.099994, 
        longitude: 113.324520
      })
      this.setData({ btnText: '开始定位'})
    }
  },

  setStationCoordinate: function (e) {
    let stationId = e.currentTarget.dataset.id
    console.log('stationId:', stationId)
  },

  onChange(event) {
    console.log(event.detail)
    if (event.detail) {
      this.setData({
        direction_checked: event.detail,
        direction_name: '万达广场方向',
        stations: this.data.stations_positive_direction
      })
    } else {
      this.setData({
        direction_checked: event.detail,
        direction_name: '岳阳小区方向',
        stations: this.data.stations_opposite_direction
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
