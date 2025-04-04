pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = "lingashashank"
        BACKEND_IMAGE = "${DOCKER_HUB_USER}/backend:latest"
    }

    stages {
        stage('Clone Code') {
            steps {
                git 'https://github.com/LingaShashank/student-register-backend.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $BACKEND_IMAGE .'
            }
        }
        stage('Push to Docker Hub') {
            steps {
                withDockerRegistry([credentialsId: 'docker-hub-credentials', url: 'https://index.docker.io/v1/']) {
                    sh 'docker push $BACKEND_IMAGE'
                }
            }
        }
    }
}
