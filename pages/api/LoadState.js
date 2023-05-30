export default async function handler(req, res) {
    console.log("LoadState.handler");
    //console.log(req);
    switch (req.method) {
        case 'GET': {
            // Application Mode - "Harry Potter" or "Digit Detection"
            const appMode = process.env.APP_MODE || "Harry Potter";

            //console.log(process.env);
            const source = "1";
            const destination= "1";
            
            // cloudantDB Setup - if destination == "cloudant"
            const cloudantHost = process.env.CLOUDANT_HOST_URL || "env var CLOUDANT_HOST_URL not set";
            const cloudantUserName = process.env.CLOUDANT_USER || "env var CLOUDANT_USER not set";
            const cloudantPassword = process.env.CLOUDANT_PASSWORD || "env var CLOUDANT_PASSWORD not set";
            const cloudantDB = process.env.CLOUDANT_DB || "env var CLOUDANT_DB not set";
            const cloudantUrl = "";
          
            // IoT Setup - if destination == "IoT"
            const iotServer = process.env.IOT_SERVER || "env var IOT_SERVER not set";
            const iotTopic = process.env.IOT_TOPIC || "env var IOT_TOPIC not set";
            const iotUser = process.env.IOT_USER || "env var IOT_USER not set";
            const iotPassword = process.env.IOT_PASSWORD || "env var IOT_PASSWORD not set";
          
            // NodeRed Url as REST-API Interface - if source == "NodeRed"
            const nodeRedUrl = process.env.NODE_RED_URL || 'env var NODE_RED_URL not set';
           
            // WML Setup - if source == "WML"
            const cloudApiKey = process.env.CLOUD_API_KEY || 'env var CLOUD_API_KEY not set';
            const cloudRegion = process.env.CLOUD_REGION || 'env var CLOUD_REGION not set';
            const deploymentId = process.env.WML_DEPLOYMENT_ID || 'env var WML_DEPLOYMENT_ID not set';
          
            // defaults 
            const deviceName = process.env.DEVICE_NAME || "phone";
            const sendOrientation = process.env.ORIENTATION || false;
          
            let appState = {
                appMode: appMode,
                destination: destination,
                source: source, 
                iotServer: iotServer,
                iotUser: iotUser,
                iotPassword: iotPassword,
                iotTopic: iotTopic,
                cloudantHost: cloudantHost, 
                cloudantUserName: cloudantUserName, 
                cloudantPassword: cloudantPassword, 
                cloudantDB: cloudantDB, 
                cloudantUrl: cloudantUrl,
                cloudApiKey: cloudApiKey,
                cloudRegion: cloudRegion,
                deploymentId: deploymentId,
                nodeRedUrl: nodeRedUrl,
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
