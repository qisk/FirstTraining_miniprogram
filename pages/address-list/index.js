const { default: wxp } = require("../../lib/wxp")
const util = require("../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedAddressId: 0,
    addressList: [],
    slideButtons: [{
      type: 'warn',
      text: '删除'   
    }]
  },

  getAddressFromWeixin(e) {
    if (wx.canIUse('chooseAddress.success.userName')) {
      // 异步接口
      wx.chooseAddress({
        success: async (result) => {
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

          console.log('send request, insert new address to database')
          // 会自动生成一个id
          let address = {
            userName: result.userName,
            telNumber: result.telNumber,
            region: [result.provinceName, result.cityName, result.countyName],
            detailInfo: result.detailInfo
          }

          let res_request = await wxp.request_with_login({
            url: util.ipAddress + '/user/my/address',
            method: 'post',
            data: address
          })

          console.log(res_request)
          if (res_request.data.msg == 'ok') {
            let item = res_request.data.data
            addressList.push(item)
            this.setData({
              addressList,
              selectedAddressId: item.id
            })
          } else {
            wx.showToast({
              title: '添加地址失败',
            })
          }
        },
      })
    }
  },

  onSavedAddress(address) {
    console.log(address)
    let addressList = this.data.addressList
  
    let existedAddress = addressList.find(item=>item.id == address.id)
    if (existedAddress) {
      // 使用some函数，对数组中的记录进行更新操作
      addressList.some((item, index)=>{
        if (item.id == address.id) {
          addressList[index] = address
          return true
        }
      })
    } else {
      // 新增地址记录的处理逻辑
      addressList.push(address)
    }

    this.setData({
      addressList,
      selectedAddressId: address.id
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

  edit(e) {
    console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    let addressList = this.data.addressList 
    let address = addressList.find(item=>item.id == id)
    wx.navigateTo({
      url: '/pages/new-address/index',
      success: (res)=> {
        // 将对象发送给目标页面
        res.eventChannel.emit('editAddress', address)
        // 监听目标页面回传的信息
        res.eventChannel.on('savedNewAddress', this.onSavedAddress)
      }
    })
  },

  async onSlideButtonTap(e) {
    let id = e.currentTarget.dataset.id
    console.log('slide button tap', e.detail, id)

    let res = await wxp.request_with_login({
      url: util.ipAddress + `/user/my/address/${id}`,
      method: 'delete',
    })
    console.log(res)
    if (res && res.data.msg == 'ok') {
      // 刷新页面数据，去除删除的记录
      let addressList = this.data.addressList
      for (let i=0; i<addressList.length; i++) {
        if (addressList[i].id == id) {
          addressList.splice(i, 1)
          break
        }
      }
      this.setData({
        addressList
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let res = await wxp.request_with_login({
      url: util.ipAddress + '/user/my/address',
      method: 'get',
    })
    console.log('onLoad: res.data.data=', res.data.data)
    let addressList = res.data.data
    let selectedAddressId = addressList[0].id
    this.setData({
      addressList,
      selectedAddressId
    })
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