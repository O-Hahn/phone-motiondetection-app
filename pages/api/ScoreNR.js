export default async function handler(req, res) {
    console.log("ScoreNR.handler");
    console.log(req);
    switch (req.method) {
        case 'POST': {
            await sendScoreNR(req, res);
            return;
        }

        default: {
            res.status(405).json({ eror: 'method not supported ' + req.method })
        }

    }

}

async function sendScoreNR(req, res) {
    try {
        console.log("ScoreNR.sendScoreNR()");
        let data = JSON.parse(req.body);
        let bdy = {
            input_data: [
                {
                    values: [...data.dataObj.dataArray],
                }
            ],
        };
        const util = require('util');
        console.log(util.inspect(bdy, false, null, true /* enable colors */))
        
        let url = data.url;
        console.log("score NR req url = " + url);

        let rest = null;
        await fetch(url, {
            method: 'POST',
            body: bdy,
        }).then(response => response.text()).then(dat => rest = JSON.parse(dat));
        //console.log(rest);
        let pred = null;
        if (rest && rest.data && rest.data.predictions) {
            pred = rest.data.predictions[0].values[0];
        }



        let result = {
            success: true,
            pred: pred,
        }
        console.log(result);
        return res.json(result);    
        
    } catch (error) {
        console.log("ScoreNR.sendScoreNR() error: " + error);
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}

