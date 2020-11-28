#!/usr/bin/env groovy
pipeline {
    agent {
				label 'master'
			}

    stages {
        stage('Source') {
            steps {
                script {
                    echo 'Source..'
                    echo "BRANCH_NAME=${BRANCH_NAME}"

                    def commit_message = getCommitMessage()
                    echo "commit_message=${commit_message}"

                    def commitIdAndAuthor = getCommitIdAndAuthor()
                    echo "commitIdAndAuthor=${commitIdAndAuthor}"
                    currentBuild.displayName = "${commitIdAndAuthor}"
                }
            }
        }
        
        stage('Compile') {
            steps {
                script { 
                    echo 'Compile..'
                    def newCommitDir = JOB_NAME.replace("/", "-") + '/' + currentBuild.displayName.substring(0, 7)
                    fileOperations([
                        folderCreateOperation("../commitBuildPool/${newCommitDir}"), 
                        folderCopyOperation(destinationFolderPath: "../commitBuildPool/${newCommitDir}", sourceFolderPath: '.')
                    ])
                    dir("../commitBuildPool/${newCommitDir}/ci") {
                      sh 'pwd'
                      sh 'node miniprogram_upload.js'
                    }
                }
            }
        }
        
        stage('Unit Test') {
            steps {
                script {
                    echo 'Unit Test'
                    def newCommitDir = JOB_NAME.replace("/", "-") + '/' + currentBuild.displayName.substring(0, 7)
                    dir("../commitBuildPool/${newCommitDir}") {
                        sh 'pwd'
                        // 这里需要截获jest命令的返回值，否则只要有测试例运行错误，来不及运行junit，就会导致构建失败。
                        def res = sh returnStatus: true, script: 'jest'
                        sh 'ls coverage -al'
                        junit 'report.xml'

                        // 在这里检测jest结果，如果有测试例运行失败则构建失败
                        if (res != 0) error 'unit test failed'
                    }
                }
            }
        }

        stage('Analysis') {
            steps {
                script {
                    echo 'Analysis..'
                    def newCommitDir = JOB_NAME.replace("/", "-") + '/' + currentBuild.displayName.substring(0, 7)
                    dir("../commitBuildPool/${newCommitDir}") {
                        def scannerLoc = tool 'sq-scanner'
                        withSonarQubeEnv('Local_SonarQube') {
                            sh "${scannerLoc}/bin/sonar-scanner"
                        }
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    echo 'Quality Gate..'
                    timeout(time:1, unit:'MINUTES') {
                        //这里设置超时时间5分钟，如果Sonar Webhook失败，不会出现一直卡在检查状态
                        //利用Sonar webhook功能通知pipeline代码检测结果，未通过质量阈，pipeline将会fail
                        //注意：这里waitForQualityGate()中的参数也要与之前SonarQube servers中Name的配置相同
                        def qg = waitForQualityGate('Local_SonarQube')
                        
                        if (qg.status != 'OK') {
                            error "未通过Sonarqube的代码质量阈检查，请及时修改！failure: ${qg.status}"
                        }
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Deploying..'
            }
        }
    }
}

def getCommitMessage() {
	def text = ""
	for (changeSetList in currentBuild.changeSets) {
		for (changeSet in changeSetList) {
			if (!"${changeSet.msg}".contains("groovy")) {
				text += "${changeSet.author.fullName} ${changeSet.msg}\n"
			}
		}
	}
	return text
}

def getCommitIdAndAuthor() {
	def text = ""
	for (changeSetList in currentBuild.changeSets) {
		for (changeSet in changeSetList) {
				text += "${changeSet.commitId.substring(0, 7)}_${changeSet.author}\n"
		}
	}
	return text
}