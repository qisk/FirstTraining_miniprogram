const { default: wxp } = require("../../lib/wxp")
const util = require("../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedAddressId: 0,
    addressList: []
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
          this.onSavedAddress(address)
        },
      })
    }
  },

  onSavedAddress(address) {
     console.log(address)

     let addressList = this.data.addressList
     addressList.push(address)

     this.setData({
       addressList,
       selectedAddressId:address.id
     })
  },

  onAddressIdChangge(e) {
    let id = e.detail
    this.setData({
      selectedAddressId: id
    })
  },
  
  navigateToNewAddressPage(e) {
    wx.navigateTo({
      url: '/pages/new-address/index',
      success: (res)=>{ 
        // 从新增地址页面，获取新的收货地址
        res.eventChannel.on("savedNewAddress", this.onSavedAddress)
      }
    })
  },

  confirm(e) {
    let selectedAddressId = this.data.selectedAddressId
    let addressList = this.data.addressList
    let item = addressList.find(item=>item.id == selectedAddressId)
    // 向购物车页面发送数据，数据为选择的地址对象
    let opener = this.getOpenerEventChannel()
    opener.emit('selectAddress', item)
    wx.navigateBack({
      delta: 1,
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
  onShow: async function () {
    let res = await wxp.request_with_login({
      url: util.ipAddress + '/user/my/address',
      method: 'get',
    })
    let addressList = res.data.data
    let selectedAddressId = addressList[0].id
    this.setData({
      addressList,
      selectedAddressId
    })
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