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

// https://apikey-v2-ihd5hebqdeyt15h5u4nfyeb1unajlsbkj2jvhvinxs6:a731325dbb0c1e2200bd3e8121cc035d@300c5094-e63a-44c5-9df1-faf9c80bad9c-bluemix.cloudantnosqldb.appdomain.cloud/
// https://apikey-v2-21stpso9b22c2x51efm5hck79945towgbfhe5738l0al:4a450f3d44d60350ffd999041bef9f4e@312c7150-eb85-42ac-83f5-225a79aeb266-bluemix.cloudantnosqldb.appdomain.cloud/new_train

async function sendTrainCloudant(req, res) {
    try {
        console.log("TrainCloudant.sendTrainCloudant()");
        let data = JSON.parse(req.body);
        // let url = data.url + "/new_train";
        let url = data.url;
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