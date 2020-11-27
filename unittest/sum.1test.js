import sum from './sum';

// moke整个util模块
const util = require("../utils/util.js")
jest.mock('../utils/util.js');
const getIpAddress = require("../utils/util.js").getIpAddress;
getIpAddress.mockImplementation(() => {
  return "this is a mock ip address"
})

jest.mock('../lib/wxp.js')
const wxp = require("../lib/wxp.js")

test('mock util和wxp 模块', async () => {
  expect(await sum(1, 2)).toBe(3);
  expect(util.getIpAddress).toHaveBeenCalled();
  expect(util.getIpAddress).toHaveBeenCalledTimes(2);
});

// moke 整个fetch.js模块
import events from './events';
import fetch from './fetch';
jest.mock('./fetch.js');

test('mock 整个 fetch.js模块', async () => {
  //console.log(fetch)
  expect.assertions(2);
  await events.getPostList();
  expect(fetch.fetchPostsList).toHaveBeenCalled();
  expect(fetch.fetchPostsList).toHaveBeenCalledTimes(1);
});

// mockwx.fn测试 ++
test('测试jest.fn()调用', () => {
  let mockFn = jest.fn();
  let result = mockFn(1, 2, 3);

  // 断言mockFn的执行后返回undefined
  expect(result).toBeUndefined();
  // 断言mockFn被调用
  expect(mockFn).toBeCalled();
  // 断言mockFn被调用了一次
  expect(mockFn).toBeCalledTimes(1);
  // 断言mockFn传入的参数为1, 2, 3
  expect(mockFn).toHaveBeenCalledWith(1, 2, 3);
})

test('测试jest.fn()返回固定值', () => {
  let mockFn = jest.fn().mockReturnValue('default');
  // 断言mockFn执行后返回值为default
  expect(mockFn()).toBe('default');
})

test('测试jest.fn()内部实现', () => {
  let mockFn = jest.fn((num1, num2) => {
    return num1 * num2;
  })
  // 断言mockFn执行后返回100
  expect(mockFn(10, 10)).toBe(100);
})

test('测试jest.fn()返回Promise', async () => {
  // 使用jest.fn().mockResolvedValue进行moke的函数，
  // 直接调用返回Promise对象
  // 通过await方法调用返回'default'
  let mockFn = jest.fn().mockResolvedValue('default');
  let result = await mockFn();
  // 断言mockFn通过await关键字执行后返回值为default
  expect(result).toBe('default');
  // 断言mockFn调用后返回的是Promise对象
  let resultObject = Object.prototype.toString.call(mockFn())
  console.log(resultObject)
  expect(resultObject).toBe("[object Promise]");
})