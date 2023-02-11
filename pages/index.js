import { useEffect, useState } from 'react';
import Layout from '../components/Layout'

export default function Home() {

  //console.log('env:' + JSON.stringify(process.env))

  // Select Source / Destination Environment Parameters
  const [source, setSource] = useState("1");
  const [destination, setDestination] = useState("1");
  
  // cloudantDB Setup - if destination == "cloudant"
  const [cloudantHost, setCloudantHost] = useState(process.env.NEXT_PUBLIC_CLOUDANT_HOST_URL || "<olaf>");
  const [cloudantUserName, setCloudantUserName] = useState(process.env.NEXT_PUBLIC_CLOUDANT_USER || "<cloudant user>");
  const [cloudantPassword, setCloudantPassword] = useState(process.env.NEXT_PUBLIC_CLOUDANT_PASSWORD || "<cloudant password>");
  const [cloudantUrl, setCloudantUrl] = useState("");

  // IoT Setup - if destination == "IoT"
  const [iotServer, setIotServer] = useState(process.env.NEXT_PUBLIC_IOT_SERVER || "<iot server url>");
  const [iotTopic, setIotTopic] = useState(process.env.NEXT_PUBLIC_IOT_TOPIC || "<iot topic name>");
  const [iotUser, setIotUser] = useState(process.env.NEXT_PUBLIC_IOT_USER || "<iot user>");
  const [iotPassword, setIotPassword] = useState(process.env.NEXT_PUBLIC_IOT_PASSWORD || "<iot password>");

  // NodeRed Url as REST-API Interface - if source == "NodeRed"
  const [nodeRedUrl, setNodeRedUrl] = useState("https://node-red-fhbgld-2021-05-14.eu-de.mybluemix.net/score_motion");
 
  // WML Setup - if source == "WML"
  const [cloudApiKey, setCloudApiKey] = useState(process.env.NEXT_PUBLIC_CLOUD_API_KEY || '<your api key>');
  const [cloudRegion, setCloudRegion] = useState(process.env.NEXT_PUBLIC_CLOUD_REGION || '<your cloud region>');
  const [deploymentId, setDeploymentId] = useState(process.env.NEXT_PUBLIC_WML_DEPLOYMENT_ID || '<your deployment id>');

  // defaults 
  const [deviceName, setDeviceName] = useState(process.env.NEXT_PUBLIC_DEVICE_NAME || "phone");
  const [sendOrientation, setSendOrientation] = useState(process.env.NEXT_PUBLIC_ORIENTATION || false);


  useEffect(() => {

    let appStateJson = null;

    const getAppState = async () => {
      appStateJson = await fetchStateFromEnv();

      if (appStateJson) {            
        let stateObj = JSON.parse(appStateJson);
        console.log(stateObj);

        // Config Selector
        if (stateObj.destination) {
          setDestination(stateObj.destination);
        }
        if (stateObj.source) {
          setSource(stateObj.source);
        }

        // Cloudant
        if (stateObj.cloudantHost) {
          setCloudantHost(stateObj.cloudantHost);
        }
        if (stateObj.cloudantUserName) {
          setCloudantUserName(stateObj.cloudantUserName);
        }
        if (stateObj.cloudantPassword) {
          setCloudantPassword(stateObj.cloudantPassword);
        }
        if (stateObj.cloudantUrl) {
          setCloudantUrl(stateObj.cloudantUrl);
        }

        // IoT
        if (stateObj.iotServer) {
          setIotServer(stateObj.iotServer);
        }
        if (stateObj.iotUser) {
          setIotUser(stateObj.iotUser);
        }
        if (stateObj.iotPassword) {
          setIotPassword(stateObj.iotPassword);
        }
        if (stateObj.iotTopic) {
          setIotTopic(stateObj.iotTopic);
        }
        
        // WML Model
        if (stateObj.cloudApiKey) {
          setCloudApiKey(stateObj.cloudApiKey);
        }
        if (stateObj.cloudRegion) {
          setCloudRegion(stateObj.cloudRegion);
        }
        if (stateObj.deploymentId) {
          setDeploymentId(stateObj.deploymentId);
        }

        // Node-Red 
        if(stateObj.nodeRedUrl) {
          setNodeRedUrl(stateObj.nodeRedUrl);
        }

        // Device Name for the Events
        if(stateObj.deviceName) {
          setDeviceName(stateObj.deviceName);
        }
        
        // Orientation instead of Accelerator (only for test)
        if(stateObj.sendOrientation) {
          setSendOrientation(stateObj.sendOrientation);
        }  
      }
    };
  
    getAppState(); // run it, run it

    console.log("Load State done!")
    console.log("ApSt:" + JSON.stringify(appStateJson));
    
  //eslint-disable-next-line
}, []);

  useEffect(() => {

    let cloudantUrl =  "https://" + cloudantUserName + ":" + cloudantPassword + "@" + cloudantHost;
    setCloudantUrl(cloudantUrl);
    
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

    localStorage.setItem("SensorApp.State", JSON.stringify(appState));

  //eslint-disable-next-line
  }, [destination, source, iotServer, iotUser, iotPassword, iotTopic, cloudantHost, cloudantUserName, cloudantPassword, cloudApiKey, cloudRegion, deploymentId, nodeRedUrl, deviceName, sendOrientation])


  const fetchStateFromEnv = async () => {
    let appStateJson = {};
    await fetch('/api/LoadState', {
        method: 'GET',
    }).then(response => response.text()).then(dat => appStateJson = dat);

    console.log(appStateJson);
    return appStateJson;
  }

  const onDestinationChange = (value) => {
      console.log('OnDestinationChange:' + value)
      setDestination(value)
  }

  const onSourceChange = (value) => {
    console.log('OnSourceChange:' + value)
    setSource(value)
  }
  return (
      <Layout>
        <div className="mb-16 w-full">
        <div className="flex mt-2">
            <div className="w-2/6"></div>
            <div className="font-bold text-lg mt-4">Source / Destination Environment</div>
          </div>
          <div className="flex mt-2 items-center">
            <div className="w-2/6 text-right pr-5 text-gray-600">Destination:</div> 
            <div className="mb-3 xl:w-96">
              <select onChange={(e) => onDestinationChange(e.target.value)} className="form-select appearance-none
                block
                w-full
                px-3
                py-1.5
                text-base
                font-normal
                text-gray-700
                bg-white bg-clip-padding bg-no-repeat
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                  <option value="1">cloudantDB</option>
                  <option value="2">IoT Foundation</option>
              </select>
            </div>
          </div>
          <div className="flex mt-2 items-center">    
            <div className="w-2/6 text-right pr-5 text-gray-600">Source Environment:</div>      
            <div className="mb-3 xl:w-96">
              <select onChange={(e) => onSourceChange(e.target.value)} className="form-select appearance-none
                block
                w-full
                px-3
                py-1.5
                text-base
                font-normal
                text-gray-700
                bg-white bg-clip-padding bg-no-repeat
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                  <option value="1">WML</option>
                  <option value="2">NodeRed-RestAPI</option>
              </select>
            </div>
          </div>

          { destination == "1" && (
          <><div className="flex mt-2">
            <div className="w-2/6"></div>
            <div className="font-bold text-lg mt-4">Train settings - cloudantDB</div>
          </div>
          <div className="flex mt-2 items-center">
              <div className="w-2/6 text-right pr-5 text-gray-600">Host:</div>
              <input
                className="w-4/6 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                type="search"
                name="cloudantHost"
                value={cloudantHost}
                onChange={(e) => setCloudantHost(e.target.value)} />
          </div>
          <div className="flex mt-2 items-center">
              <div className="w-2/6 text-right pr-5 text-gray-600">Username:</div>
              <input
                className="w-4/6 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                type="search"
                name="cloudantUserName"
                value={cloudantUserName}
                onChange={(e) => setCloudantUserName(e.target.value)} />
          </div>
          <div className="flex mt-2 items-center">
              <div className="w-2/6 text-right pr-5 text-gray-600">Password:</div>
              <input
                className="w-4/6 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                type="password"
                name="cloudantPassword"
                value={cloudantPassword}
                onChange={(e) => setCloudantPassword(e.target.value)} />
            </div>
            <div className="flex mt-2 items-center">
              <div className="w-2/6 text-right pr-5 text-gray-600">Cloudant URL:</div>
              <div className="w-4/6  text-sm mx-px hover:mx-0 py-2.5 px-2 pr-8 overflow-x-auto">
                {cloudantUrl}
              </div>
            </div></>
          )}

          { destination == "2" && (
          <><div className="flex mt-2">
            <div className="w-2/6"></div>
            <div className="font-bold text-lg mt-4">Train settings - IOT </div>
          </div>
          <div className="flex mt-2 items-center">
              <div className="w-2/6 text-right pr-5 text-gray-600">IoT Server URL:</div>
              <input
                className="w-4/6 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                type="search"
                name="iotServer"
                value={iotServer}
                onChange={(e) => setIotServer(e.target.value)} />
            </div>
            <div className="flex mt-2 items-center">
              <div className="w-2/6 text-right pr-5 text-gray-600">IoT User:</div>
              <input
                className="w-4/6 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                type="search"
                name="iotUser"
                value={iotUser}
                onChange={(e) => setIotUser(e.target.value)} />
            </div>
            <div className="flex mt-2 items-center">
              <div className="w-2/6 text-right pr-5 text-gray-600">IoT Password:</div>
              <input
                className="w-4/6 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                type="password"
                name="iotPassword"
                value={iotPassword}
                onChange={(e) => setIotPassword(e.target.value)} />
            </div>
            <div className="flex mt-2 items-center">
              <div className="w-2/6 text-right pr-5 text-gray-600">IoT Topic:</div>
              <input
                className="w-4/6 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                type="search"
                name="iotTopic"
                value={iotTopic}
                onChange={(e) => setIotTopic(e.target.value)} />
            </div></>
          )}
          
          {source == "1" && (
              <><div className="flex mt-2">
              <div className="w-2/6"></div>
              <div className="font-bold text-lg mt-4">Scoring settings - Machine Learning</div>
              </div>
              <div className="flex mt-2 items-center">
                <div className="w-2/6 text-right pr-5 text-gray-600">Cloud API Key:</div>
                <input
                  className="w-4/6 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                  type="password"
                  name="cloudApiKey"
                  value={cloudApiKey}
                  onChange={(e) => setCloudApiKey(e.target.value)} />
              </div>
              <div className="flex mt-2 items-center">
                <div className="w-2/6 text-right pr-5 text-gray-600">Cloud Region:</div>
                <input
                  className="w-4/6 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                  type="search"
                  name="cloudRegion"
                  value={cloudRegion}
                  onChange={(e) => setCloudRegion(e.target.value)} />
              </div>
              <div className="flex mt-2 items-center">
                <div className="w-2/6 text-right pr-5 text-gray-600">Deployment ID:</div>
                <input
                  className="w-4/6 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                  type="search"
                  name="deploymentId"
                  value={deploymentId}
                  onChange={(e) => setDeploymentId(e.target.value)} />
              </div></>
            )}
            {source == "2" && (
              <><div className="flex mt-2">
              <div className="w-2/6"></div>
              <div className="font-bold text-lg mt-4">Scoring settings - NodeRed URL</div>
              </div>
              <div className="flex mt-2 items-center">
                <div className="w-2/6 text-right pr-5 text-gray-600">NodeRed Url:</div>
                <input
                  className="w-4/6 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                  type="search"
                  name="nodeRedUrl"
                  value={nodeRedUrl}
                  onChange={(e) => setNodeRedUrl(e.target.value)} />
              </div></>
            )}

 
          <div className="flex mt-2">
            <div className="w-2/6"></div>
            <div className="font-bold text-lg mt-4">General settings</div>
          </div>
          <div className="flex mt-2 items-center">
            <div className="w-2/6 text-right pr-5 text-gray-600">device name:</div>
              <input
                  className="w-4/6 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                  type="search"
                  name="deviceName"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)} />
              </div>
          <div className="flex mt-2 items-center">
              <div className="w-2/6 text-right pr-5 text-gray-600">orientation data:</div>
                <input 
                  type="checkbox" 
                  className="w-6 h-6"
                  name="sendOrientation" 
                  checked={sendOrientation}
                  onChange={(e) => setSendOrientation(e.target.checked)}
              />
          </div>

        </div>
    </Layout >
  )
}
