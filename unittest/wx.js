/*
// 第一种moke方案：封装成类的mock方式
const { forEach } = require('../utils/index')

class WxPage {
  // WxPage 类目前只有一个构造函数和 setData 方法，构造函数中把 options 中的 data 和其他属性都挂在 this 上。setData 方法则模拟了小程序的 setData 方法，因为小程序的 setData 是一个异步的过程，所以我这里用了 setTimeout。
  constructor (options) {
    this.data = options.data || {}
    forEach(options, (value, key) => {
      if (key !== 'data') {
        this[key] = value
      }
    })
  }

  setData (newData, cb) {
    setTimeout(() => {
      Object.assign(this.data, newData)
      cb && cb()
    })
  }
}


// 在创建了一个叫 Page 的函数，并且把它挂在 global 对象上，
// 这样就可以在全局环境中访问到这个函数了，

// 因为微信小程序的页面其实就是由一个 Page 函数接收一个对象来创建的，
// 后面运行到小程序代码的时候页面实例实际上会由我提供的这个 Page 函数来创建。
function Page (options) {
  global._wx.page = new WxPage(options)
}

global._wx = {
  app: null,
  page: null
}

// 将小程序的Page函数，替换成自定义的Page函数
global.Page = Page
global.getApp = () => global._wx.app
*/

// 第二种moke方案：直接mock方式
export const noop = () => {};
export const isFn = fn => typeof fn === 'function';

let wId = 0;
global.Page = ({ data, ...rest }) => {
  const page = {
    data,
    setData: jest.fn(function (newData, cb) {
      this.data = {
        ...this.data,
        ...newData,
      };

      cb && cb();
    }),
    onLoad: noop,
    onReady: noop,
    onUnLoad: noop,
    __wxWebviewId__: wId++,
    ...rest,
  };
  global.wxPageInstance = page;
  return page;
};

global.TestConfig = {
    fakeResponse_normal: true,
    baseUrl: 'https://m.maizuo.com/v4/api',
};

// mock当前时间
global.Date.now = jest.fn(() => 1536708613825);

// mock微信api
global.wx = {
  showToast: jest.fn(),
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
  showModal: jest.fn(),
  request: jest.fn(),
  getStorageSync: jest.fn(),
  showShareMenu: jest.fn(),
};
