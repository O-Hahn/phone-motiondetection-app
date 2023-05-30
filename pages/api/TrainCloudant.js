export default async function handler(req, res) {
    console.log("TrainCloudant.handler");
    console.log(req);
    switch (req.method) {
        case 'POST': {
            await sendTrainCloudant(req, res);
            return;
        }

        default: {
            res.status(405).json({ error: 'method not supported ' + req.method })
        }

    }

}

async function sendTrainCloudant(req, res) {
    try {
        console.log("TrainCloudant.sendTrainCloudant()");
        let data = JSON.parse(req.body);
        let user = data.user;
        let password = data.password;
        let host = data.host;
        let db = data.db;

        let url = "https://" + host + "/" + db;
        // let url = data.url;
        console.log("train CloudantDB req url = " + url);
        console.log(data);
        console.log(JSON.stringify(data.dataObj));

        let resp = null;
        await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data.dataObj),
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Basic " + btoa(user + ":" + password)
                // "Authorization": 'Basic ' + Buffer.from("use-token-auth:" + data.token).toString('Base64'),
            },
        }).then(response => resp = response);
        console.log(resp);


        let result = {
            success: true,
        }
        console.log(result);
        return res.json(result);    
        
    } catch (error) {
        console.log("TrainCloudant.sendTrainCloudant() error: " + error);
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}