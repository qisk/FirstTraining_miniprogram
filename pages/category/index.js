const { default: wxp } = require("../../lib/wxp")

Page({
  data: {
    vtabs: [],
    activeTab: 0,
    showLoginPanel:false,
    goodsListMap:{},
  },

  async onLoad() {
    let categoriesData = await wxp.request_with_login({
      url: 'http://localhost:3000/goods/categories',
    })
    if (categoriesData){
      // 注意，拿到categories要用两个data才能拿到
      categoriesData = categoriesData.data.data;
    }
    console.log(categoriesData);
    
    // const titles = ['热搜推荐', '手机数码', '家用电器',
    //   '生鲜果蔬', '酒水饮料', '生活美食', 
    //   '美妆护肤', '个护清洁', '女装内衣', 
    //   '男装内衣', '鞋靴箱包', '运动户外', 
    //   '生活充值', '母婴童装', '玩具乐器', 
    //   '家居建材', '计生情趣', '医药保健', 
    //   '时尚钟表', '珠宝饰品', '礼品鲜花', 
    //   '图书音像', '房产', '电脑办公']
    
    /*
    // 这种方式，会造成vtabs跳转位置不对，详见 http://localhost:88/web/#/page/edit/70/1717
    const vtabs = categoriesData.map(item => {
      this.getGoodsListByCategory(item.id)
      return ({title: item.category_name, id: item.id})
    })

    this.setData({vtabs})
    */
   
   let vtabs = []
    for(let j=0;j<categoriesData.length;j++){
      let item = categoriesData[j]
      await this.getGoodsListByCategory(item.id)
      vtabs.push({title: item.category_name, id: item.id})
    }
    this.setData({vtabs})
    
    this.setData({test:111})
    console.log("this.data.test:", this.data.test)
  },

  onTabCLick(e) {
    const index = e.detail.index
    console.log('tabClick', index)
  },

  onChange(e) {
    const index = e.detail.index
    console.log('change', index)
  },

  async getGoodsListByCategory(categoryId){
    let goodsData = await wxp.request_with_login({
      url: `http://localhost:3000/goods/goods?page_index=1&page_size=20&category_id=${categoryId}`,
    })
    if (goodsData){
      goodsData = goodsData.data.data.rows;
    }
    
    console.log("before setData categoryId=", categoryId , "," ,this.data.goodsListMap[categoryId]);
    
    this.setData({
      [`goodsListMap[${categoryId}]`]:goodsData
    })
    
    console.log("after setData categoryId=", categoryId , "," ,this.data.goodsListMap[categoryId]);

    // qisk：这一句可以去掉，setData会自动更新
    //this.data.goodsListMap[categoryId] = goodsData
  }
})
