#!/bin/bash
# Automatically deploy motion-detection-web-app Instances on OpenShift!

helpFunction()
{
   echo ""
   echo "Usage: $0 -i motiondetection-name -p project"
   echo -e "\t-i Motion Detection Web App Instance Name"
   echo -e "\t-p Project Namespace to be used"
   echo ""
   echo "The .env.local file must exist"
   exit 1 # Exit script after printing help
}

while getopts "i:p:" opt
do
   case "$opt" in
      i ) MD_NAME="$OPTARG" ;;
      p ) PROJECT="$OPTARG" ;;
      ? ) helpFunction ;; # Print helpFunction in case parameter is non-existent
   esac
done

# Print helpFunction in case parameters are empty
if [ -z "$MD_NAME" ] || [ -z "$PROJECT" ] 
then
   echo "Some or all of the parameters are empty";
   helpFunction
fi

# Check if .env.local exists
if [ ! -e "../.env.local"]; 
then
   echo ""
   echo -e "the .env.local file must exist with necessary parameters!"
   exit 1 
fi

# Begin script in case all parameters are correct
echo "Create Motion Detection Web App Instance: ${MD_NAME} in Project: ${PROJECT}"

CHANGE_NAME="APP_NAME"
CHANGE_PROJECT="APP_PROJECT"

# Create temp directory for the deployment
if [ ! -d "tmp-deploy" ]; then
    echo "Create temp dir for deployment"
    mkdir -p "tmp-deploy"
fi

# create OpenShift Project
CREATE_PROJECT= `oc new-project ${PROJECT}`
echo "  Create the Project... ${PROJECT} $CREATE_PROJECT"

# create config map 
CREATE_CONFIG_MAP=`oc create configmap ${MD_NAME}-config --from-file=../.env.local` 
echo "  Create the Config Map from File... ${PROJECT} $CREATE_CONFIG_MAP"

# Change the instance name of node-red in tmp-deploy
for s in image-stream.yaml build-config.yaml deployment-config.yaml service.yaml route.yaml 
do
   # adopt yaml for deployment
   CHANGE_INSTANCE=`sed -e "s#${CHANGE_NAME}#${MD_NAME}#g" -e "s#${CHANGE_PROJECT}#${PROJECT}#g" template\/${s} > tmp-deploy\/${s}`
   echo "  Creating adopted yaml: ${s} $CHANGE_INSTANCE" 

   # apply the yaml on OpenShift Instance
   CREATE_YAML=`oc create -f tmp-deploy\/${s}`
   echo "  Applying in OpenShift.. $CREATE_YAML"

done

# create config map 
CREATE_SET_ENV=`oc set env --from=configmap/${MD_NAME}-config deploymentconfig/${MD_NAME}` 
echo "  Set the environment from config map... ${PROJECT} $CREATE_SET_ENV"

# create config map 
CREATE_BUILD=`oc start-build ${MD_NAME}` 
echo "  Start the build of the application... ${PROJECT} $CREATE_BUILD"

echo "--> DONE"