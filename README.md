# phone-motiondetection-app
This next.js App builds an Web-Application for detecting digit motions with your smartphone. 
I uses the accelarator sensor from your phone to get the digit motions drawn in the air. To run properly, the web-app must be deployed with an https - because of the security rules of smartphones only to publish accelartor data based on trusted websides. Also on the WebApp if called - the user (eg.g iPhone has to accept the access to the sensor data). 

## IBM Cloud Setup
If you dont have an existing environment - the following steps are needed to create an runtime and deployment environment based on IBM Cloud.

- logon into your [IBM Cloud Account](cloud.ibm.com)
- get insights how to [create and use apps in IBM Cloud](https://cloud.ibm.com/developer/appservice/create-app?navMode=starterkits)
- create a [registry insance](https://cloud.ibm.com/registry/start) and a namespace called `phone-md` if using IKS
- create a [cloudant DB instance](https://cloud.ibm.com/catalog/services/cloudant)
- create a instance of the [Watson Machine Learning](https://cloud.ibm.com/catalog/services/watson-machine-learning) 
- create a instance [Watson Studio Service](https://cloud.ibm.com/catalog/services/watson-studio)
- create a project called `PhoneApp`
- create a payed instance of [IKS](https://cloud.ibm.com/kubernetes/catalog/create) or [OpenShift](https://cloud.ibm.com/kubernetes/catalog/create?platformType=openshift) for the runtime-deployment
- create a virtual server (RedHat Linux or Ubuntu) including additional storage and build a NFS Server
- deploy the app from this repo (follow the steps below)
- Call the deployed phone-app with your handy, provide your credentials to the cloudant and train your data
- import the Jupyter Notebook and run the Notebook - apply your credentials  
- copy the endpoint from the deployed model function into the settings of the phone-app 
- check if the detection works in the phone app :-) 

The runtime (IKS or OpenShift) must be a payed version because the need of secured HTTPS endpoints. These are needed because of the security aspects to get access to the sensor data of the phone-web-app. 

## Running Locally

First, clone the repo locally. 

Then you can run the development server:

```bash
npm run dev
```

## Build the Image - Docker or Podman 

### Using Docker

1. [Install Docker](https://docs.docker.com/get-docker/) on your machine.
2. Build your container: `docker build -t phone-md-app .`.
3. Run your container: `docker run -p 3000:3000 phone-md-app`.

You can view your images created with `docker images`.

### Creating Docker image

Build image:
```bash
docker build . -t phone-md-app
```

Run image:
```bash
docker run -p 3000:3000 --name phone-md-app phone-md-app`
```
Remove image if needed:
```bash
docker rm phone-md-app
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

The local version could not be used for the app deployment because it is not a HTTPS endpoint - and this is needed for the securtiy reasons on the phone to get access to the sensor data. 

## Edit / Create .env.local file
Create / Edit the .env.local file with the necessary Cloud/API/Keys/URLs to the deployed environment of your setup. This helps to use the WebApp without editing the settings because they are injected as default. 
Possible settings for the .env.local file: 
```bash
NEXT_PUBLIC_SEND_ORIENTATION=false
NEXT_PUBLIC_DEVICE_NAME=iPhone
NEXT_PUBLIC_CLOUD_API_KEY=xx
NEXT_PUBLIC_CLOUD_REGION=us-south
NEXT_PUBLIC_WML_DEPLOYMENT_ID=xx
NEXT_PUBLIC_CLOUDANT_HOST_URL=xxx
NEXT_PUBLIC_CLOUDANT_USER=xx
NEXT_PUBLIC_CLOUDANT_PASSWORD=xx
NEXT_PUBLIC_NODE_RED_URL=xx
NEXT_PUBLIC_IOT_SERVER=wss://wss-mqtt.xxxxx.eu-de.containers.appdomain.cloud
NEXT_PUBLIC_IOT_TOPIC=phone-motion
NEXT_PUBLIC_IOT_USER=xxx
NEXT_PUBLIC_IOT_PASSWORD=xxx
```

## Deploy build into registry
If your image is ready - you could store it into the public registry - by tagging and pushing the image. The registry here is based on IBM Cloud - de.icr.io is the endpoint for the public registry located in germany. A repo (phone-md) must be created in the cloud. A use of dockerhub is also possible. 

```bash
docker tag sensor-app:latest de.icr.io/phone-md/phone-md-app:latest
docker push de.icr.io/phone-md/phone-md-app:latest
```

## Kubernets deployment

### Manuel Kubernets deployment (not ready yet)
```bash
kubectl apply -f kubernetes/1.1-namespace.yaml
kubectl apply -f kubernetes/1.3-deployment.yaml
kubectl apply -f kubernetes/1.4-service.yaml
```

# OpenShift deployment

## Deploy the App from the Image
The OpenShift deployment is based on the GIT itself - therefore the image is build and published interally on OpenShift. The Deployment is based on an image-stream from the GIT Repo and is enhanced with a service and route definition. 

Run doit.sh for deploying Application into OpenShift Environment automatically 
```bash
./doit.sh
```

### Manuel OpenShift deployment

Alternatively run commands below for manual deployment
```bash
oc new-project phone-md
oc create configmap phone-md-app-config --from-file=.env.local 
oc apply -f openshift/1.1-image-stream.yaml
oc apply -f openshift/1.2-build-config.yaml
oc apply -f openshift/1.3-deployment-config.yaml
oc apply -f openshift/1.4-service.yaml
oc apply -f openshift/1.5-route.yaml
oc set env --from=configmap/phone-md-config deploymentconfig/phone-md-app 
oc start-build phone-md-app
```

## Additional informations of the development 
This is a next.js standalone app build as a Docker image for deployment on Kubernetes.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

### Installation of the base package 

This package is created with: 
```bash
npx create-next-app --example with-docker phone-motiondetection-app

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

npm install @headlessui/react @heroicons/react

```
### Adopt .dockerignore file
Recommended to have .dockerignore file with the following content

Dockerfile
.dockerignore
node_modules
npm-debug.log
README.md
.next
.git

### In existing projects

To add support for Docker to an existing project, just copy the `Dockerfile` into the root of the project and add the following to the `next.config.js` file:

```js
// next.config.js
module.exports = {
  // ... rest of the configuration.
  output: 'standalone',
}
```