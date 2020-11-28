// mock address-list中引用的文件
jest.mock('../lib/wxp')
jest.mock('../utils/util.js')

import '../pages/address-list/index';
const { default: wxp } = require("../lib/wxp")

const page = global.wxPageInstance;

describe('收货地址设置页面', () => {
  // 所有测试前要做的工作
  beforeAll(() => {
    console.log('before all')
  })

  // onLoad加载数据测试
  describe('onLoad', () => {
    // 每个测试前要做的工作 
    beforeEach(() => {
      console.log('before each')
      TestConfig.fakeResponse_normal = true
    })

    it('get address data successfully', async () => {
      await page.onLoad();
      expect(page.data.selectedAddressId).toBe(1);
      expect(page.data.addressList.length).toBe(4);
    });

    it('get address data failed', async () => {
      TestConfig.fakeResponse_normal = false
      await page.onLoad()
      expect(wx.showToast).toBeCalledWith({
        title: '地址列表获取错误',
      })
    });
  });

  // 删除数据测试
  describe('delete', () => {
    beforeEach(() => {
      console.log('before each')
      TestConfig.fakeResponse_normal = true
      // 注意，初始化数据需要使用“深拷贝”，如果是“浅拷贝”，因为指向同一个地址，数据删除后，wxp中的原始数据也会被删除
      page.data.addressList = JSON.parse(JSON.stringify(wxp.addressList))
      //console.log(page.data.addressList)
    })

    it('delete address successfully', async () => {
      let e = {
        currentTarget: {
          dataset: {
            id: 7
          }
        }
      }
      await page.onSlideButtonTap(e);
      expect(page.data.addressList.length).toBe(3);
    });

    it('delete address failed', async () => {
      TestConfig.fakeResponse_normal = false 
      await page.onSlideButtonTap({
        currentTarget: {
          dataset: {
            id: 7
          }
        }
      });
      expect(wx.showModal).toBeCalledWith({
          title: "提示",
          content: "删除地址失败"
      })
      expect(page.data.addressList.length).toBe(3);
    });
  });

})