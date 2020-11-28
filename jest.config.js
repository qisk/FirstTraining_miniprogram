module.exports = {
  // 启动文件
  setupFiles: [
    "./unittest/wx.js"
  ],

  // 是否收集测试覆盖率
  collectCoverage: true,
  
  verbose: true,

  coveragePathIgnorePatterns: [
    "./unittest/wx.js"
  ],
  testPathIgnorePatterns: [
    "./unittest/wx.js"
  ],
  testEnvironment: 'node',

  // 使用jest-sonar-reporter生成sonarQube可识别的测试结果
  //testResultsProcessor: "jest-sonar-reporter",
  testResultsProcessor: "@digitalroute/jest-jenkins-reporter",
  
  //automock: true,

  //transformIgnorePatterns: ["./node_modules/(?!(lodash-es|other-es-lib))"]
}