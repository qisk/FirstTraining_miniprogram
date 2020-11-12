#!/usr/bin/env groovy

pipeline {
    agent {
				label 'master'
			}

    stages {
        stage('getCommitMessage') {
            steps {
                script {
                    echo "BRANCH_NAME=${BRANCH_NAME}"

                    def commit_message = getCommitMessage()
                    echo "commit_message=${commit_message}"

                    def commitIdAndAuthor = getCommitIdAndAuthor()
                    echo "commitIdAndAuthor=${commitIdAndAuthor}"
                    currentBuild.displayName = "${commitIdAndAuthor}"
                }
            }
        }
        stage('Build') {
            steps {
                script { 
                    echo 'Building..'
                    def newCommitDir = currentBuild.displayName..substring(0, 7)
                    fileOperations([
                        folderCreateOperation("./commitBuildPool/${newCommitDir}"), 
                        folderCopyOperation(destinationFolderPath: "./commitBuildPool/${newCommitDir}", sourceFolderPath: '.')
                    ])
                    dir("./commitBuildPool/${newCommitDir}/ci") {
                      sh 'pwd'
                      sh 'node miniprogram_upload.js'
                    }
                }
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
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