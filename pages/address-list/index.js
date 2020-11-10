// test jenkins SCM change
// test jenkins SCM change for pipeline 
// pages/address-list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedAddressId: 0,
    addressList: [
    {
      id: 0,
      userName: '小王',
      telNumber: '0',
      region: ['广东省', '广州市', '海珠区'],
      detailInfo: '详细地址'
    }, 
    {
      id: 1,
      userName: '小李',
      telNumber: '0',
      region: ['广东省', '广州市', '海珠区'],
      detailInfo: '详细地址'
    }]
  },

  getAddressFromWeixin(e) {
    if (wx.canIUse('chooseAddress.success.userName')) {
      // 异步接口
      wx.chooseAddress({
        success: (result) => {
          console.log(result)

          let addressList = this.data.addressList
          // 判断地址是否重复，如果重复就不添加到地址列表，直接设置改地址选中态
          let res = addressList.find(item=>item.telNumber == result.telNumber)
          console.log('res:', res)
          if (res) {
            this.setData({
              selectedAddressId: res.id
            })
            return
          }

          let address = {
            id: addressList.length,
            userName: result.userName,
            telNumber: result.telNumber,
            region: [result.provinceName, result.cityName, result.countyName],
            detailInfo: result.detailInfo
          }
          addressList.push(address)
          console.log('addressList[addressList.length - 1]', addressList[addressList.length - 1])
          this.setData({
            selectedAddressId: addressList[addressList.length - 1].id,
            addressList
          })
        },
      })
    }
  },

  onAddressIdChangge(e) {
    let id = e.detail
    this.setData({
      selectedAddressId: id
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})