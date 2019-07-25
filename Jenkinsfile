def CONTAINER_NAME="shraga-proxy"
def CONTAINER_TAG="latest"
def DOCKER_HUB_USER="XYZ"
def PORT="8080"

node('jenkins-build-slave') {

    stage('Initialize'){
        sh "echo Initialize stage"
        
        // def dockerHome = tool 'myDocker'
        // def mavenHome  = tool 'myMaven'
        // env.PATH = "${dockerHome}/bin:${env.PATH}"
    }

    stage('Checkout') {
        checkout scm
    }

    // stage('Build'){
    //     sh "mvn clean install"
    // }

    // stage('Sonar'){
    //     try {
    //         sh "mvn sonar:sonar"
    //     } catch(error){
    //         echo "The sonar server could not be reached ${error}"
    //     }
    //  }

    // stage("Image Prune"){
    //     imagePrune(CONTAINER_NAME)
    // }

    stage('Image Build'){
        container('jenkins-build-slave'){
        imageBuild(CONTAINER_NAME, CONTAINER_TAG)
        }
    }

    stage('Push to Docker Registry'){
        container('jenkins-build-slave'){
        // def DOCKER = credentials('1c28ea49-d7da-4180-8598-645b549709d3')
        withCredentials([usernamePassword(credentialsId: 'f2e06b67-5b5e-47b1-a0ec-7a73ec7b0eea', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
            pushToImage(CONTAINER_NAME, CONTAINER_TAG, USERNAME, PASSWORD)
        }
        }
    }

    // stage('Run App'){
    //     runApp(PORT)
    // }

}

// def imagePrune(containerName){
//     try {
//         sh "docker image prune -f"
//         sh "docker stop $containerName"
//     } catch(error){}
// }

def imageBuild(containerName, tag){
    // sh "ls"
    sh "docker build -t $containerName:$tag  -t $containerName --pull --no-cache ."
    echo "Image build complete"
}

def pushToImage(containerName, tag, dockerUser, dockerPassword){
    sh "docker login -u $dockerUser -p $dockerPassword"
    sh "docker tag $containerName:$tag $dockerUser/$containerName:$tag"
    sh "docker push $dockerUser/$containerName:$tag"
    echo "Image push complete"
}

def runApp(httpPort){
    sh "docker pull nginx"
    sh "docker run -d --rm -p $httpPort:80 --name nginx nginx"
    echo "Application started on port: ${httpPort} (http)"
}
