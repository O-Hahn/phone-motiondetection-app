import Image from "next/image";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";

const Train = () => {

    const [recording, setRecording] = useState(false);
    const [motionset, setMotionset] = useState("");
    const [key, setKey] = useState("0");   
    const [delay, setDelay] = useState(100);
    const [dataObj, setDataObj] = useState({dataArray: []});
    const [sendOrientation, setSendOrientation] = useState(false);
    const [appState, setAppState] = useState({});

    const handleAcceleration = (event) => {
        console.log("Handle acceleration")
//        console.log(event);
        let now = new Date();
        if(recording) {
            var data = {
                device: "phone_1",
                figure: key,
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
                device: "phone_1",
                figure: key,
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
        console.log("Send");
        
        if(appState.destination == "1") {
            let req = {
                url: appState.cloudantUrl,
                dataObj: dataObj
            }
            let response = await fetch('/api/TrainCloudant', {
                method: 'POST',
                body: JSON.stringify(req),
            });
        }
        else if (appState.destination == "2") {
            let req = {
                url: appState.iotUrl,
                dataObj: dataObj,
                token: appState.iotToken,
            }
            let response = await fetch('/api/TrainIOT', {
                method: 'POST',
                body: JSON.stringify(req),
            });
    
        }

        // let req = {
        //     url: nodeRedUrl,
        //     dataObj: dataObj,
        // }
        // let response = await fetch('/api/TrainNR', {
        //     method: 'POST',
        //     body: JSON.stringify(req),
        // });

    };

    useEffect(() => {
        const appStateJson = localStorage.getItem("SensorApp.State");
    
        if (appStateJson) {            
            let stateObj = JSON.parse(appStateJson);
            console.log(stateObj);
            setAppState(stateObj);
            setSendOrientation(stateObj.sendOrientation);
        }
   
      //eslint-disable-next-line
      }, [])

    useEffect(() => {
        console.log("Use effect, sendorientation=" + sendOrientation);
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
    }, [recording, dataObj,sendOrientation]);

    const onFigureChange = (value) => {
        console.log('OnFigureChange:' + value)
        setKey(value)
      }

    return (
        <Layout  >
        <h1 className="text-lg font-bold mt-4 ml-2 border-b-2">Training</h1>
        <div className="mt-4 w-full">
            { (appState.destination=="1" && <>
                <div className="flex">
                    <div className="w-2/6 text-right pr-5 text-gray-600">CloudantDB URL:</div>
                    <div className="w-4/6 text-sm overflow-x-auto">{appState.cloudantUrl}</div>
                </div></>
                )}
            {
                (appState.destination=="2" &&<>
                <div className="flex">
                    <div className="w-2/6 text-right pr-5 text-gray-600">IoT URL:</div>
                    <div className="w-4/6 text-sm overflow-x-auto">{appState.iotUrl}</div>
                </div></>
                )
                
            }

            <div className="flex mt-2 items-center">
                <div className="w-2/6 text-right pr-5 text-gray-600">Delay:</div>
                <input 
                    className="w-64 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                    type="text"
                    name="delay" 
                    placeholder="delay in ms"
                    value={delay}
                    onChange={e => {setDelay(e.target.value)}}
                />

            </div>
            <div className="flex mt-2 items-center">
                <div className="w-2/6 text-right pr-5 text-gray-600">Figure:</div> 
                <div className="mb-3 xl:w-96">
                <select onChange={(e) => onFigureChange(e.target.value)} className="form-select appearance-none
                    block w-full px-3 py-1.5 text-base font-normal w-64
                    text-gray-700 bg-white bg-clip-padding bg-no-repeat
                    border border-solid border-gray-300 rounded transition ease-in-out 
                    m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Figure to train">
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                </select>
                </div>
            </div>

            {recording ? (
                <div className="flex mt-2">
                    <div className="w-2/6"></div>
                    <button 
                        className="bg-red-500 hover:bg-red-800 text-white font-bold py-2 px-4 rounded inline-flex items-center w-64"
                        onClick={handleStop}
                    >
                        <Image className="filter-white" src="/static/Stop.svg" width="30" height="30" alt="Start" />
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
                        <span className="ml-4">START</span>
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
                    className="disabled:bg-red-500 disabled:shadow-none disabled:text-slate-500 disabled:border-slate-200 bg-indigo-500 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded inline-flex items-center w-64"
                    onClick={handleSend}
                >
                    <Image className="filter-white" src="/static/Send.svg" width="30" height="30" alt="Start" />
                    <span className="ml-4">SEND</span>
                </button>
            </div>           
            ) }

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
}

export default Train;