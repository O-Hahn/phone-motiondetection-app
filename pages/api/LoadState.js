export default async function handler(req, res) {
    console.log("LoadState.handler");
    //console.log(req);
    switch (req.method) {
        case 'GET': {
            //console.log(process.env);
            const source = "1";
            const destination= "1";
            
            // cloudantDB Setup - if destination == "cloudant"
            const cloudantHost = process.env.NEXT_PUBLIC_CLOUDANT_HOST_URL || "<cloudant url>";
            const cloudantUserName = process.env.NEXT_PUBLIC_CLOUDANT_USER || "<cloudant user>";
            const cloudantPassword = process.env.NEXT_PUBLIC_CLOUDANT_PASSWORD || "<cloudant password>";
            const cloudantUrl = "";
          
            // IoT Setup - if destination == "IoT"
            const iotServer = process.env.NEXT_PUBLIC_IOT_SERVER || "<iot server url>";
            const iotTopic = process.env.NEXT_PUBLIC_IOT_TOPIC || "<iot topic name>";
            const iotUser = process.env.NEXT_PUBLIC_IOT_USER || "<iot user>";
            const iotPassword = process.env.NEXT_PUBLIC_IOT_PASSWORD || "<iot password>";
          
            // NodeRed Url as REST-API Interface - if source == "NodeRed"
            const nodeRedUrl = "https://node-red-fhbgld-2021-05-14.eu-de.mybluemix.net/score_motion";
           
            // WML Setup - if source == "WML"
            const cloudApiKey = process.env.NEXT_PUBLIC_CLOUD_API_KEY || '<your api key>';
            const cloudRegion = process.env.NEXT_PUBLIC_CLOUD_REGION || '<your cloud region>';
            const deploymentId = process.env.NEXT_PUBLIC_WML_DEPLOYMENT_ID || '<your deployment id>';
          
            // defaults 
            const deviceName = process.env.NEXT_PUBLIC_DEVICE_NAME || "phone";
            const sendOrientation = process.env.NEXT_PUBLIC_ORIENTATION || false;
          
            let appState = {
                destination: destination,
                source: source, 
                iotServer: iotServer,
                iotUser: iotUser,
                iotPassword: iotPassword,
                iotTopic: iotTopic,
                cloudantHost: cloudantHost, 
                cloudantUserName: cloudantUserName, 
                cloudantPassword: cloudantPassword, 
                cloudantUrl: cloudantUrl,
                cloudApiKey: cloudApiKey,
                cloudRegion: cloudRegion,
                deploymentId: deploymentId,
                nodeRedUrl: nodeRedUrl,
                deviceName: deviceName,
                sendOrientation: sendOrientation
              }
             res.status(200).json(JSON.stringify(appState));
            console.log(appState);
            return;
        }

        default: {
            res.status(405).json({ eror: 'method not supported ' + req.method })
        }

    }

}
