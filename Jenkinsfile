pipeline {
    agent {
				label 'master'
			}

    environment {
        COMMITID_LENGTH = 7
    }

    stages {
        stage('getCommitMessage') {
            steps {
                script {
                  def commit_message = getCommitMessage()
                  echo "commit_message=${commit_message}"

                  def commitIdAndAuthor = getCommitIdAndAuthor()
                  echo "commitIdAndAuthor=${commitIdAndAuthor}"
                  currentBuild.displayName = "${commitIdAndAuthor}"
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
      	def length = changeSet.commitId.length() - COMMITID_LENGTH
				text += "${changeSet.commitId.substring(length)}_${changeSet.author}\n"
		}
	}
	return text
}