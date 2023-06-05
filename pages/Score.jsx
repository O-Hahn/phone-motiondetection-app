import Image from "next/image";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";

const Score = () => {

    const [recording, setRecording] = useState(false);
    const [motionset, setMotionset] = useState("");
    const [delay, setDelay] = useState(100);
    const [dataObj, setDataObj] = useState({dataArray: []});
    const [sendOrientation, setSendOrientation] = useState(false);
    const [appState, setAppState] = useState({});
    const [pred, setPred] = useState("");
    const [magicSpell, setMagicSpell] = useState("");
    const [magicSpellImg, setMagicSpellImg] = useState("/harrypotter/Blank.png");
    const [digitImg, setdigitImg] = useState("/digits/blank.png");
    const [mlUrl, setMlUrl] = useState("");

    let mode = appState.appMode == "Harry Potter";
    let magicSpellImage = [
        {id: "1", name: "Aguamenti", image: "/harrypotter/Aguamenti.png"},
        {id: "2", name: "Alohomora", image: "/harrypotter/Alohomora.png"},
        {id: "3", name: "Aparecium", image: "/harrypotter/Aparecium.png"},
        {id: "4", name: "Arresto Momentum", image: "/harrypotter/Arresto Momentum.png"},
        {id: "5", name: "Ascendio", image: "/harrypotter/Ascendio.png"},
        {id: "6", name: "Descendo", image: "/harrypotter/Descendo.png"},
        {id: "7", name: "Finite Incantatem", image: "/harrypotter/Finite Incantatem.png"},
        {id: "8", name: "Herbivicus", image: "/harrypotter/Herbivicus.png"},
        {id: "9", name: "Incendio", image: "/harrypotter/Incendio.png"},
        {id: "10", name: "Locomotor", image: "/harrypotter/Locomotor.png"},
        {id: "11", name: "Meteolohex Recanto", image: "/harrypotter/Meteolohex Recanto.png"},
        {id: "12", name: "Nox Lumos", image: "/harrypotter/Nox Lumos.png"},
        {id: "13", name: "Oppungno", image: "/harrypotter/Oppungno.png"},
        {id: "14", name: "Reparo", image: "/harrypotter/Reparo.png"},
        {id: "15", name: "Revelio", image: "/harrypotter/Revelio.png"},
        {id: "16", name: "Silencio", image: "/harrypotter/Silencio.png"},
        {id: "17", name: "Specialis Revelio", image: "/harrypotter/Specialis Revelio.png"},
        {id: "18", name: "Stupor", image: "/harrypotter/Stupor.png"},
        {id: "19", name: "Tarantallegra", image: "/harrypotter/Tarantallegra.png"},
        {id: "20", name: "Wingardium Leviosa", image: "/harrypotter/Wingardium Leviosa.png"}
   ]

   let digitImage = [
    {id: "0", name: "zero", image: "/digits/zero.png"},
    {id: "1", name: "one", image: "/digits/one.png"},
    {id: "2", name: "two", image: "/digits/two.png"},
    {id: "3", name: "three", image: "/digits/three.png"},
    {id: "4", name: "four", image: "/digits/four.png"},
    {id: "5", name: "five", image: "/digits/five.png"},
    {id: "6", name: "six", image: "/digits/six.png"},
    {id: "7", name: "seven", image: "/digits/seven.png"},
    {id: "8", name: "eight", image: "/digits/eight.png"},
    {id: "9", name: "nine", image: "/digits/nine.png"}
   ]

    const handleAcceleration = (event) => {
        console.log("Handle acceleration")
//        console.log(event);
        let now = new Date();
        if(recording) {
            var data = {
                device: appState.deviceName,
                figure: "",
                motionset: motionset,
                date: now.toISOString(),
                timestamp: now.getTime(),
                acceleration: {
                    x: event.acceleration.x,
                    y: event.acceleration.y,
                    z: event.acceleration.z
                },
            };
            console.log("length: " + dataObj.dataArray.length);
            let len = dataObj.dataArray.length;
            if (len > 0) {
                console.log("last " + dataObj.dataArray[len - 1].timestamp);
                let timeDiff = now - dataObj.dataArray[len - 1].timestamp;
                if (timeDiff > delay) {
                    setDataObj({ dataArray: [...dataObj.dataArray, data]});
                }
            } else {
                setDataObj({ dataArray: [...dataObj.dataArray, data]});
            }
        }
    }

    const handleOrientation = (event) => {
        console.log("handle orientation");
        //console.log(event);
        //console.log(recording);
        let now = new Date();
        if(recording) {
            var data = {
                device: appState.deviceName,
                figure: "",
                motionset: motionset,
                date: now.toISOString(),
                timestamp: now.getTime(),
                orientation: {
                    alpha: event.alpha,
                    beta: event.beta,
                    gamma: event.gamma
                },
            };
            console.log("length: " + dataObj.dataArray.length);
            let len = dataObj.dataArray.length;
            if (len > 0) {
                console.log("last " + dataObj.dataArray[len - 1].timestamp);
                let timeDiff = now - dataObj.dataArray[len - 1].timestamp;
                if (timeDiff > delay) {
                    setDataObj({ dataArray: [...dataObj.dataArray, data]});
                }
            } else {
                setDataObj({ dataArray: [...dataObj.dataArray, data]});
            }
        }
    }

    const handleStart = () => {
        console.log("Start");
        setPred(null);

        //for iPhones permisson must not be placed in on load useEffect code
        if ( typeof( DeviceMotionEvent ) !== "undefined" && typeof( DeviceMotionEvent.requestPermission ) === "function" ) {
            DeviceMotionEvent.requestPermission().then(response => {
                if (response === 'granted') {
                    console.log("accelerometer permission granted");
                    // Do stuff here
                }
            });  
        }
        
        let now = new Date();
        setMotionset(now.toISOString());
        setRecording(true);
        setDataObj({dataArray: []});
    };

    const handleStop = () => {
        console.log("Stop");
        setRecording(false);
    };

    const handleNumber = (k) => {
        console.log(k);
        setKey(k);
    };


    const handleSend = async () => {
        if (appState.source == "1") {
            handleSendWML();
        } else {
            handleSendREST();
        }
    };

    const handleSendREST = async () => {
        console.log("Send via REST");
        
        let req = {
            url: appState.restUrl,
            dataObj: dataObj,
        }
        await fetch('/api/ScoreREST', {
            method: 'POST',
            body: JSON.stringify(req),
        }).then(response => response.text()).then(dat => handleOutput(dat));
    };

    const handleOutput = async (dat) => {
        let rsp = JSON.parse(dat);

        let pred = rsp ? rsp.pred : "Not found";

        console.log("Response:" + pred);

        if (mode) {
            setMagicSpell(pred);

            const msi = magicSpellImage.find((e) => e.name == pred);
            if (msi) {
                setMagicSpellImg(msi.image);
                console.log("Image: " + msi.image);
            } else {
                setMagicSpellImg("/harrypotter/Blank.png");
            }

        } else {
            setPred(pred);

            const dimg = digitImage.find((e) => e.id == pred);
            if (dimg) {
                console.log("Image: " + dimg.image);
                setdigitImg(dimg.image);    
            } else {
                setdigitImg("/digits/blank.png");
            }
        }
    }


    const handleSendWML = async () => {
        console.log("Send");
        let req = {
            appMode: appState.appMode,
            cloudApiKey: appState.cloudApiKey,
            cloudRegion: appState.cloudRegion,
            deploymentId: appState.deploymentId,
            deploymentIdHP: appState.deploymentIdHP,
            dataObj: dataObj,
        }
        let rsp = {};
        await fetch('/api/ScoreML', {
            method: 'POST',
            body: JSON.stringify(req),
        }).then(response => response.text()).then(dat => handleOutput(dat));
        
    };

    useEffect(() => {
        const appStateJson = localStorage.getItem("SensorApp.State");
    
        if (appStateJson) {            
            let stateObj = JSON.parse(appStateJson);
            console.log(appState);
            setAppState(stateObj);
            setSendOrientation(stateObj.sendOrientation);
            let url = "";
            if (stateObj.source == "1") {
                if (stateObj.appMode == "Harry Potter") {
                    url = 'https://' + stateObj.cloudRegion + '.ml.cloud.ibm.com/ml/v4/deployments/' + stateObj.deploymentIdHP + '/predictions?version=2021-01-02';
                } else {
                    url = 'https://' + stateObj.cloudRegion + '.ml.cloud.ibm.com/ml/v4/deployments/' + stateObj.deploymentId + '/predictions?version=2021-01-02';
                }    
            } else {
                url = stateObj.restUrl;
            }
            console.log("Model Url: "+ url);

            setMlUrl(url);
        }
   
      //eslint-disable-next-line
      }, [])

    useEffect(() => {
        console.log("Use effect");
        if ( typeof( DeviceMotionEvent ) !== "undefined" && typeof( DeviceMotionEvent.requestPermission ) === "function" ) {
            DeviceMotionEvent.requestPermission().then(response => {
                if (response === 'granted') {
                    console.log("accelerometer permission granted");
                    // Do stuff here
                }
            });  
        }
        window.addEventListener('devicemotion', handleAcceleration);
        if (sendOrientation) {
            window.addEventListener('deviceorientation', handleOrientation);
        }
        return () => {
            window.removeEventListener('devicemotion', handleAcceleration);
            if (sendOrientation) {
                window.removeEventListener('deviceorientation', handleOrientation);
            }
        };
        // eslint-disable-next-line
    }, [recording, dataObj, sendOrientation]);


    return (
        <Layout  >
            <h1 className="text-lg font-bold mt-4 ml-2 border-b-2">Scoring</h1>
            <div className="mt-4 w-full">
                <div className="flex">
                    <div className="w-2/6 text-right pr-5 text-gray-600">Model URL:</div>
                    <div className="w-4/6 text-sm  overflow-x-auto">{mlUrl}</div>
                </div>

                <div className="flex mt-2 items-center">
                    <div className="w-2/6 text-right pr-5 text-gray-600">Delay:</div>
                    <input 
                        className="w-64 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px 
                        hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                        type="text"
                        name="delay" 
                        placeholder="delay in ms"
                        value={delay}
                        onChange={e => {setDelay(e.target.value)}}
                    />

                </div>

                {recording ? (
                    <div className="flex mt-2">
                        <div className="w-2/6"></div>
                        <button 
                            className="bg-red-500 hover:bg-red-800 text-white font-bold py-2 px-4 rounded inline-flex items-center w-64"
                            onClick={handleStop}
                        >
                            <Image className="filter-white" src="/static/Stop.svg" width="60" height="40" alt="Start" />
                            <span className="ml-4">STOP</span>
                        </button>
                    </div>           
                ) : (
                    <div className="flex mt-2">
                        <div className="w-2/6"></div>
                        <button 
                            className="bg-indigo-500 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded inline-flex items-center w-64"
                            onClick={handleStart}
                        >
                            <Image className="filter-white" src="/static/Play.svg" width="30" height="30" alt="Start" />
                            <span className="ml-6">START</span>
                        </button>
                    </div>           
                )}

                {dataObj.dataArray.length > 0 ? (
                    <div className="flex mt-2">
                        <div className="w-2/6"></div>
                        <button 
                            className="bg-indigo-500 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded inline-flex items-center w-64"
                            onClick={handleSend}
                        >
                            <Image className="filter-white" src="/static/Send.svg" width="30" height="30" alt="Start" />
                            <span className="ml-4">SEND</span>
                        </button>
                        </div>
                ) : (
                    <div className="flex mt-2">
                        <div className="w-2/6"></div>
                        <button disabled
                            className="disabled:bg-red-500 disabled:shadow-none disabled:text-slate-500 disabled:border-slate-200 
                            bg-indigo-500 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded inline-flex items-center w-64"
                            onClick={handleSend}
                        >
                            <Image className="filter-white" src="/static/Send.svg" width="30" height="30" alt="Start" />
                            <span className="ml-4">SEND</span>
                        </button>
                    </div>           
                ) }

                {mode ? (
                    <div>
                        <div className="flex mt-2">
                            <div className="w-2/6 text-2xl text-right pr-5 text-purple-600">Magic Spell Result:</div>
                            <div className="w-64 text-2xl text-purple-600 text-lg rounded border border-gray-100 
                                border-inherit border-2 bg-orange-300 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 
                                py-2 px-4 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8">{magicSpell}</div>
                        </div>
                        <div className="flex mt-2">
                            <div className="w-2/6 text-2xl text-right pr-5 text-purple-600">Image:</div>
                            <div className="w-64 text-2xl text-purple-600 text-lg rounded border border-gray-100 
                            border-inherit border-2 bg-black hover:border-blue-100 mx-px hover:mx-0 hover:border-2 
                            py-2 px-4 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8">
                                <Image src={magicSpellImg} alt={magicSpellImg} width={290} height={224} />
                            </div>
                         </div>
                    </div>
                ) : (
                    <div>
                        <div className="flex mt-2">
                            <div className="w-2/6 text-2xl text-right pr-5 text-purple-600">Figure Result:</div>
                            <div className="w-64 text-2xl text-purple-600 text-lg rounded border border-gray-100 border-inherit border-2 
                            bg-orange-300 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2 px-4 focus:mx-0 focus:border-2 
                            focus:border-blue-100 focus:outline-0 pr-8">{pred}</div>
                        </div>
                        <div className="flex mt-2">
                            <div className="w-2/6 text-2xl text-right pr-5 text-purple-600">Image:</div>
                            <div className="w-64 text-2xl text-purple-600 text-lg rounded border border-gray-100 
                            border-inherit border-2 bg-black hover:border-blue-100 mx-px hover:mx-0 hover:border-2 
                            py-2 px-4 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8">
                                <Image src={digitImg} alt={digitImg} width={290} height={224} />
                           </div>
                        </div> 
                    </div>               
                )}

                {dataObj && (
                    <div>
                        <div className="flex mt-2">
                            <div className="w-2/6 text-right pr-5 text-gray-600">Nr. of events:</div>
                            <div className="w-4/6 font-medium">{dataObj.dataArray.length}</div>
                        </div>
                        <div className="flex mt-2">
                            <div className="w-2/6 text-right pr-5 text-gray-600">Data:</div>
                            <pre className="w-4/6 border m-2 p-2 h-96 overflow-scroll text-xs">
                                {JSON.stringify(dataObj, null, 2) }
                            </pre>
                        </div>
                    </div>
                )}

            </div>
        </Layout >
    );
};

export default Score;