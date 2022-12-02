import { useEffect, useState } from 'react';
import Layout from '../components/Layout'

export default function Home() {

  // Select Source / Destination Environment Parameters
  const [destination, setDestination] = useState("1");
  const [source, setSource] = useState("1");

  // cloudantDB Setup - if destination == "cloudant"
  const [host, setHost] = useState("300c5094-e63a-44c5-9df1-faf9c80bad9c-bluemix.cloudantnosqldb.appdomain.cloud");
  const [userName, setUserName] = useState("apikey-v2-ihd5hebqdeyt15h5u4nfyeb1unajlsbkj2jvhvinxs6");
  const [password, setPassword] = useState("a731325dbb0c1e2200bd3e8121cc035d");
  const [cloudantUrl, setCloudantUrl] = useState("");

  // IoT Setup - if destination == "IoT"
  const [orgId, setOrgId] = useState("wb3i1b");
  const [devType, setDevType] = useState("phone");
  const [devId, setDevId] = useState("phone-web-app");
  const [eventType, setEventType] = useState("motion");
  const [token, setToken] = useState("tjbotibm");
  const [iotUrl, setIotUrl] = useState("");

  // NodeRed Url as REST-API Interface - if source == "NodeRed"
  const [nodeRedUrl, setNodeRedUrl] = useState("https://node-red-fhbgld-2021-05-14.eu-de.mybluemix.net/score_motion");
  
  // WML Setup - if source == "WML"
  const [cloudApiKey, setCloudApiKey] = useState('D5-GtcmW3Hm4Z3kp6QZXmqqnk-mbQiGVNGC9S2rLvDBy');
  const [cloudRegion, setCloudRegion] = useState('us-south');
  const [deploymentId, setDeploymentId] = useState("fdf099a7-b31a-411f-a8a0-c2c1fdbff408");

  // defaults 
  const [sendOrientation, setSendOrientation] = useState(false);


  useEffect(() => {
    const appStateJson = localStorage.getItem("SensorApp.State");
    
    if (appStateJson) {            
        let stateObj = JSON.parse(appStateJson);
        console.log(stateObj);

        if (stateObj.destination) {
          setDestination(stateObj.destination);
        }
        if (stateObj.source) {
          setSource(stateObj.source);
        }

        if (stateObj.host) {
          setHost(stateObj.host);
        }
        if (stateObj.userName) {
          setUserName(stateObj.userName);
        }
        if (stateObj.password) {
          setPassword(stateObj.password);
        }
        if (stateObj.cloudantUrl) {
          setCloudantUrl(stateObj.cloudantUrl);
        }

        if (stateObj.orgId) {
          setOrgId(stateObj.orgId);
        }
        if (stateObj.devType) {
          setDevType(stateObj.devType);
        }
        if (stateObj.devId) {
          setDevId(stateObj.devId);
        }
        if (stateObj.eventType) {
          setEventType(stateObj.eventType);
        }
        
        if(stateObj.nodeRedUrl) {
          setNodeRedUrl(stateObj.nodeRedUrl);
        }
        if(stateObj.sendOrientation) {
          setSendOrientation(stateObj.sendOrientation);
        }
        
        if (stateObj.cloudApiKey) {
          setCloudApiKey(stateObj.cloudApiKey);
        }
        if (stateObj.cloudRegion) {
          setCloudRegion(stateObj.cloudRegion);
        }
        if (stateObj.deploymentId) {
          setDeploymentId(stateObj.deploymentId);
        }
    }

  //eslint-disable-next-line
  }, [])

  useEffect(() => {

    let iotUrl =  "https://" + orgId + ".messaging.internetofthings.ibmcloud.com/api/v0002/device/types/" + devType + "/devices/" + devId + "/events/" + eventType;
    setIotUrl(iotUrl);
    
    let cloudantUrl =  "https://" + userName + ":" + password + "@" + host;
    setCloudantUrl(cloudantUrl);
    
    let appState = {
      destination: destination,
      source: source, 
      orgId: orgId,
      devType: devType,
      devId: devId,
      eventType: eventType,
      iotUrl: iotUrl,
      iotToken: token,
      host: host, 
      userName: userName, 
      password: password, 
      cloudantUrl: cloudantUrl,
      nodeRedUrl: nodeRedUrl,
      sendOrientation: sendOrientation,
      cloudApiKey: cloudApiKey,
      cloudRegion: cloudRegion,
      deploymentId: deploymentId
    }

    localStorage.setItem("SensorApp.State", JSON.stringify(appState));

  //eslint-disable-next-line
  }, [destination, source, orgId, devType, devId, eventType, token, host, userName, password, nodeRedUrl, sendOrientation, cloudApiKey, cloudRegion, deploymentId])

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
                name="host"
                value={host}
                onChange={(e) => setHost(e.target.value)} />
          </div>
          <div className="flex mt-2 items-center">
              <div className="w-2/6 text-right pr-5 text-gray-600">Username:</div>
              <input
                className="w-4/6 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                type="search"
                name="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)} />
          </div>
          <div className="flex mt-2 items-center">
              <div className="w-2/6 text-right pr-5 text-gray-600">Password:</div>
              <input
                className="w-4/6 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} />
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
            <div className="font-bold text-lg mt-4">Train settings - Watson IOT Foundation</div>
          </div>
          <div className="flex mt-2 items-center">
              <div className="w-2/6 text-right pr-5 text-gray-600">Organization ID:</div>
              <input
                className="w-4/6 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                type="search"
                name="orgid"
                value={orgId}
                onChange={(e) => setOrgId(e.target.value)} />
            </div>
            <div className="flex mt-2 items-center">
              <div className="w-2/6 text-right pr-5 text-gray-600">Device type:</div>
              <input
                className="w-4/6 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                type="search"
                name="devType"
                value={devType}
                onChange={(e) => setDevType(e.target.value)} />
            </div>
            <div className="flex mt-2 items-center">
              <div className="w-2/6 text-right pr-5 text-gray-600">Device ID:</div>
              <input
                className="w-4/6 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                type="search"
                name="devId"
                value={devId}
                onChange={(e) => setDevId(e.target.value)} />
            </div>
            <div className="flex mt-2 items-center">
              <div className="w-2/6 text-right pr-5 text-gray-600">Event Type:</div>
              <input
                className="w-4/6 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                type="search"
                name="eventType"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)} />
            </div>
            <div className="flex mt-2 items-center">
              <div className="w-2/6 text-right pr-5 text-gray-600">Device Token:</div>
              <input
                className="w-4/6 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                type="password"
                name="token"
                value={token}
                onChange={(e) => setToken(e.target.value)} />
            </div>
            <div className="flex mt-2 items-center">
              <div className="w-2/6 text-right pr-5 text-gray-600">IOT URL:</div>
              <div className="w-4/6  text-sm mx-px hover:mx-0 py-2.5 px-2 pr-8 overflow-x-auto">
                {iotUrl}
              </div>
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
 
          <div className="flex mt-2">
            <div className="w-2/6"></div>
            <div className="font-bold text-lg mt-4">General settings</div>
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
