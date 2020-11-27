const { default: wxp } = require("../lib/wxp")
const util = require("../utils/util.js")

const sum = async function (a, b) {
  console.log(util.getIpAddress())
  console.log(util.ipAddress)
  
  let result = await wxp.request_with_login({
    url: util.getIpAddress() + '/user/my/address',
    method: 'get',
  })
  
  console.log(JSON.stringify(result))

  return a + b
}

export default sum;