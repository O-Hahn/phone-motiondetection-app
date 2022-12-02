export default async function handler(req, res) {
    console.log("ScoreML.handler");
    console.log(req);
    switch (req.method) {
        case 'POST': {
            await sendScoreML(req, res);
            return;
        }

        default: {
            res.status(405).json({ eror: 'method not supported ' + req.method })
        }

    }

}

async function sendScoreML(req, res) {
    try {
        console.log("ScoreML.sendScoreML()");
        const util = require('util');
        let data = JSON.parse(req.body);
        console.log(util.inspect(data, false, null, true /* enable colors */))

        // let iamTokenUrl = "https://iam." + data.cloudRegion + ".bluemix.net/identity/token";
        let iamTokenUrl = "https://iam.cloud.ibm.com/identity/token";
        console.log("score ML iam url = " + iamTokenUrl);
        let iamResp = null;
        await fetch(iamTokenUrl, {
            method: 'POST',
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "apikey=" + data.cloudApiKey + "&grant_type=urn:ibm:params:oauth:grant-type:apikey",
        }).then(response => response.text()).then(dat => iamResp = JSON.parse(dat));

        console.log(util.inspect(iamResp, false, null, true /* enable colors */))

        let bdy = {
            input_data: [
                {
                    values: {
                        payload: {
                            dataArray: [...data.dataObj.dataArray],
                        } 
                    }
                }
            ],
        };
        console.log(util.inspect(bdy, false, null, true /* enable colors */))
        
        let url = 'https://' + data.cloudRegion + '.ml.cloud.ibm.com/ml/v4/deployments/' + data.deploymentId + '/predictions?version=2021-01-02';
        console.log("score ML req url = " + url);

        let rest = null;
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ` + iamResp.access_token,
            },
            body: JSON.stringify(bdy),
        }).then(response => response.text()).then(dat => rest = JSON.parse(dat));
        console.log(util.inspect(rest, false, null, true /* enable colors */))
        let pred = null;
        if (rest && rest.predictions && rest.predictions[0]) {
            pred = "" + rest.predictions[0].values[0];
        } else if (rest && rest.errors){ 
            pred = rest.status_code + ": " + rest.errors[0].code + ", " + rest.errors[0].message;
        } else {
            pred = "-1";
        }

        let result = {
            success: true,
            pred: pred,
        }
        console.log(result);
        return res.json(result);    
        
    } catch (error) {
        console.log("ScoreML.sendScoreML() error: " + error);
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}

