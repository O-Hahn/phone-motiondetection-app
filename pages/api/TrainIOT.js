const mqtt = require('mqtt')

export default async function handler(req, res) {
    console.log("TrainIOT.handler");
    console.log(req);
    switch (req.method) {
        case 'POST': {
            await sendTrainIOT(req, res);
            return;
        }

        default: {
            res.status(405).json({ eror: 'method not supported ' + req.method })
        }

    }

}

async function sendTrainIOT(req, res) {
    try {
        console.log("TrainIOT.sendTrainIOT()");
        let data = JSON.parse(req.body);
        let iotServer = data.iotServer;
        let iotUser = data.iotUser;
        let iotPassword = data.iotPassword;
        let iotTopic = data.iotTopic;
        let deviceName = data.deviceName;

        console.log("train IOT req url = " + iotServer + " User: " + iotUser + " Topic:" + iotTopic);
        console.log(data);

        let resp = null;
        //await fetch(url, {
        //    method: 'POST',
        //    body: JSON.stringify(data.dataObj),
        //    headers: { 
        //        "Content-Type": "application/json",
        //        "Accept": "application/json",
        //        "Authorization": 'Basic ' + Buffer.from("use-token-auth:" + data.token).toString('Base64'),
        //    },
        //}).then(response => resp = response);

        const client  = mqtt.connect(iotServer)
        client.publish(iotTopic, JSON.stringify(data));
  
        console.log(resp);


        let result = {
            success: true,
        }
        console.log(result);
        return res.json(result);    
        
    } catch (error) {
        console.log("TrainIOT.sendTrainIOT() error: " + error);
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}

