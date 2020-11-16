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
        /*
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
        */
        stage('Analysis') {
            steps {
                script {
                    echo 'Analysis..'
                    def scannerLoc = tool 'sq-scanner'
                    withSonarQubeEnv('Local_SonarQube') {
                        sh "${scannerLoc}/bin/sonar-scanner"
                    }
                }
            }
        }
        stage('Quality Gate') {
            steps {
                echo 'Quality Gate..'
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