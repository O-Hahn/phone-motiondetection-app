export default async function handler(req, res) {
    console.log("ScoreRest.handler");
    console.log(req);
    switch (req.method) {
        case 'POST': {
            await sendScoreRest(req, res);
            return;
        }

        default: {
            res.status(405).json({ eror: 'method not supported ' + req.method })
        }

    }

}

async function sendScoreRest(req, res) {
    try {
        console.log("ScoreRest.sendScoreRest()");
        let data = JSON.parse(req.body);
        let bdy = {
            input_data: [
                {
                    values: {
                        dataArray: [...data.dataObj.dataArray],
                    }
                }
            ],
        };

        const util = require('util');
        console.log(util.inspect(bdy, false, null, true /* enable colors */))
        
        let url = data.url;
        console.log("score Rest req url = " + url);

        let rest = null;
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
            },

            body: JSON.stringify(bdy),
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
        console.log("ScoreRest.sendScoreRest() error: " + error);
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}

