pipeline {
  agent any
  stages {
    stage('Pull Git') {
      steps {
        echo 'Syncing with GitHub'
        git(url: 'https://github.com/HeyCrab3/MossFrpWebGui-B.git', branch: 'master', changelog: true)
      }
    }

    stage('Install Dependencies') {
      steps {
        echo 'Installing Dependencies...'
        bat(script: 'yarn install', returnStatus: true, returnStdout: true, encoding: 'UTF-8')
      }
    }

    stage('Build') {
      steps {
        echo 'Building Production File...'
        bat(script: 'yarn run build', returnStatus: true, returnStdout: true)
      }
    }

  }
}