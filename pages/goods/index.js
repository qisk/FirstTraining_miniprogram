// pages/goods/index.js
const { default: wxp } = require("../../lib/wxp")
const util = require("../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsId:0,
    goodsData:{}, // res.data是一个json字符串，所以用{}定义
    goodsImages: [], // goodsImages是一个数组，所以用[]定义
    showSkuPanel: false, // 商品规格选择面板
    goodsContentInfo:{},
    goodsSkuData:{}, // 有两个属性：goodsSku为sku表的内容，goodsAttrKeys为规格数据
    selectedGoodsSku:{},
    selectedAttrValue:{},
    selectedGoodsSkuObject:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // options.goodsId,就是前面navigateTo中url传递的参数
    this.data.goodsId = options.goodsId
    console.log("goods page: this.data.goodsId=", this.data.goodsId)
    // 接收goodsData事件，将商品数据设置到页面上
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('goodsData', (res)=> {
      console.log("goods page onLoad:", res)
      // 过滤出
      let goodsImages = res.data.goods_infos.filter(item=>(item.kind == 0))
      // 获取第0条商品描述信息
      let goodsContentInfo = res.data.goods_infos.filter(item=>(item.kind == 1))[0]

      this.setData({
        goodsData:res.data,
        goodsImages,
        goodsContentInfo
      })
    })

    // 拉取sku规格数据
    let goodsSkuDataRes = await wxp.request_with_login({
      url: util.ipAddress + `/goods/goods/${this.data.goodsId}/sku`
    })
    if (goodsSkuDataRes) {
      let goodsSkuData = goodsSkuDataRes.data.data
      this.setData({
        goodsSkuData
      })
    }
  },


  showSkuPanelPopup() {
    this.setData({showSkuPanel:true})
  },


  onCloseSkuPanel() {
    this.setData({showSkuPanel:false})
  },

  onTapSkuTag(e) {
    // 获取用户选择的规格
    let attrvalue = e.currentTarget.dataset.attrvalue
    let attrkey = e.currentTarget.dataset.attrkey

    console.log('attravlueid', attrvalue, attrkey)
    let selectedAttrValue = this.data.selectedAttrValue
    selectedAttrValue[attrkey] = attrvalue
    this.setData({
      selectedAttrValue
    })
    console.log("selectedAttrValue:", selectedAttrValue)
    // 计算价格及库存
    let totalIdValue = 0
    // 获取该商品所有的规格数据，将所选规格value的id取出相加，为的是和sku表的goods_attr_path做对应，获取价格和库存
    let goodsAttrKeys = this.data.goodsSkuData.goodsAttrKeys

    // 从selectedAttrValue中取出每种规格对应的规格值，并取出相加。
    for (let j=0; j<goodsAttrKeys.length; j++) {
      let attrName = goodsAttrKeys[j].attr_name
      if (selectedAttrValue[attrName]) {
        console.log("selectedAttrValue[attrName]:", selectedAttrValue[attrName])
        totalIdValue += selectedAttrValue[attrName].id
      }
    }
    console.log("totalIdValue:", totalIdValue)

    let goodsSku = this.data.goodsSkuData.goodsSku
    let tempTotalIdValue = 0
    for (let j=0; j<goodsSku.length; j++) {
      let goodsAttrPath = goodsSku[j].goods_attr_path
      // 判断goodsAttrPath长度和该商品的规格长度是否一致
      if (goodsAttrPath.length != goodsAttrKeys.length) {
        break
      }

      // 计算该商品sku表中goodsAttrPath的累加值
      tempTotalIdValue = 0
      goodsAttrPath.forEach(item=>tempTotalIdValue+=item)
      console.log("tempTotalIdValue", tempTotalIdValue)

      // 如果选择的商品规格和goodsAttrPath对应上，则设置选择的商品sku
      if (tempTotalIdValue == totalIdValue) {
        let selectedGoodsSku = goodsSku[j]
        this.setData({
          selectedGoodsSku
        })
        break
      }
    }
  },

  onConfirmGoodsSku(){
     let goodsSkuData = this.data.goodsSkuData
     let selectedGoodsSkuObject = this.data.selectedGoodsSkuObject
     selectedGoodsSkuObject.sku = Object.assign({}, this.data.selectedGoodsSku)
     selectedGoodsSkuObject.text = ''
     for (let j=0; j<goodsSkuData.goodsAttrKeys.length;j++) {
       let item = goodsSkuData.goodsAttrKeys[j]

       // 如果只选择一个规格，this.data.selectedAttrValue[item.attr_name]就会为null导致程序出错
       if (!this.data.selectedAttrValue[item.attr_name]) {
         wx.showModal({
           title: '没有选择全部规格',
           showCancel:false
         })
         return
       }
       selectedGoodsSkuObject.text += this.data.selectedAttrValue[item.attr_name].attr_value + ' '
     }
     this.setData({
       selectedGoodsSkuObject,
       showSkuPanel: false
     })
  },

  async addToCart(e) {
    if (!this.data.selectedGoodsSkuObject.sku) {
      wx.showModal({
        title: '请选择商品规格',
        showCancel: false
      })
      this.showSkuPanelPopup()
      return
    }
    let goods_id = this.data.goodsId
    let goods_sku_id = this.data.selectedGoodsSkuObject.sku.id
    let goods_sku_desc = this.data.selectedGoodsSkuObject.text
    let data = {
      goods_id,
      goods_sku_id,
      goods_sku_desc
    }

    let res = await wxp.request_with_login({
      url: util.ipAddress + `/user/my/carts/`,
      method: 'post',
      data
    })
    if (res.data.msg == 'ok') {
      wx.showToast({
        title: '已添加',
      })
    }
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