export default async function handler(req, res) {
    console.log("LoadState.handler");
    //console.log(req);
    switch (req.method) {
        case 'GET': {
            // Application Mode - "Harry Potter" or "Digit Detection"
            const appMode = process.env.APP_MODE || "Harry Potter";

            //console.log(process.env);
            
            // Training Environment 
            const trainEnv= process.env.APP_TRAIN_ENV || "env var APP_TRAIN_ENV not set";

            // cloudantDB Setup - if destination == "cloudant"
            const cloudantHost = process.env.CLOUDANT_HOST_URL || "env var CLOUDANT_HOST_URL not set";
            const cloudantUserName = process.env.CLOUDANT_USER || "env var CLOUDANT_USER not set";
            const cloudantPassword = process.env.CLOUDANT_PASSWORD || "env var CLOUDANT_PASSWORD not set";
            const cloudantDB= process.env.CLOUDANT_DB || "env var CLOUDANT_DB not set";
            const cloudantUrl = "";
          
            // IoT Setup - if destination == "IoT"
            const iotServer = process.env.IOT_SERVER || "env var IOT_SERVER not set";
            const iotTopic = process.env.IOT_TOPIC || "env var IOT_TOPIC not set";
            const iotUser = process.env.IOT_USER || "env var IOT_USER not set";
            const iotPassword = process.env.IOT_PASSWORD || "env var IOT_PASSWORD not set";

            // Model Enviroment to be used CLASSIC or IBM-Q
            const modelEnv= process.env.APP_MODEL_ENV || "env var APP_MODEL_ENV not set";

            // Scoring Environmnent is WML or REST
            const scoringEnv = process.env.APP_SCORING_ENV || "env var APP_SCORING_ENV not set";

            // REST Url as REST-API Interface - if source == "Rest-API"
            const restUrl = process.env.REST_URL || 'env var REST_URL not set';
           
            // WML Setup - if source == "WML"
            const cloudApiKey = process.env.CLOUD_API_KEY || 'env var CLOUD_API_KEY not set';
            const cloudRegion = process.env.CLOUD_REGION || 'env var CLOUD_REGION not set';
            const qDeploymentId = process.env.WML_Q_DEPLOYMENT_ID || 'env var WML_Q_DEPLOYMENT_ID not set';
            const qDeploymentIdHP = process.env.WML_Q_DEPLOYMENT_ID_HP || 'env var WML_Q_DEPLOYMENT_ID_HP not set';
            const deploymentId = process.env.WML_DEPLOYMENT_ID || 'env var WML_DEPLOYMENT_ID not set';
            const deploymentIdHP = process.env.WML_DEPLOYMENT_ID_HP || 'env var WML_DEPLOYMENT_ID_HP not set';

            // defaults 
            const deviceName = process.env.DEVICE_NAME || "phone";
            const sendOrientation = process.env.ORIENTATION || false;
          
            let appState = {
                appMode: appMode,
                trainEnv: trainEnv,
                iotServer: iotServer,
                iotUser: iotUser,
                iotPassword: iotPassword,
                iotTopic: iotTopic,
                cloudantHost: cloudantHost, 
                cloudantUserName: cloudantUserName, 
                cloudantPassword: cloudantPassword, 
                cloudantDB: cloudantDB,
                cloudantUrl: cloudantUrl,
                scoringEnv: scoringEnv,
                modelEnv: modelEnv, 
                cloudApiKey: cloudApiKey,
                cloudRegion: cloudRegion,
                qDeploymentId: qDeploymentId,
                qDeploymentIdHP: qDeploymentIdHP,
                deploymentId: deploymentId,
                deploymentIdHP: deploymentIdHP,
                restUrl: restUrl,
                deviceName: deviceName,
                sendOrientation: sendOrientation
              }
             res.status(200).json(appState);
            console.log(appState);
            return;
        }

        default: {
            res.status(405).json({ eror: 'method not supported ' + req.method })
        }
    }
}
