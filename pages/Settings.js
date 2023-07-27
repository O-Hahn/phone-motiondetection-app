import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Image from "next/image";

const Settings = () => {

  //console.log('env:' + JSON.stringify(process.env))

  // Select Application Modus ("HarryPotter" / "Digit Detection") Parameters
  const [appMode, setAppMode] = useState("Harry Potter");

  // Select Model Environment CLASSIC or IBM-Q to utilize model 
  const [modelEnv, setModelEnv] = useState("CLASSIC");

  // Select Training Environment CLOUDANT or IOT to store data 
  const [trainEnv, setTrainEnv] = useState("CLOUDANT");

  // cloudantDB Setup - if destination == "cloudant"
  const [cloudantHost, setCloudantHost] = useState("<cloudant host>");
  const [cloudantUserName, setCloudantUserName] = useState("<cloudant user>");
  const [cloudantPassword, setCloudantPassword] = useState("<cloudant password>");
  const [cloudantDB, setCloudantDB] = useState("<cloudant DB>");
  const [cloudantUrl, setCloudantUrl] = useState("<cloudant url>");

  // IoT Setup - if destination == "IoT"
  const [iotServer, setIotServer] = useState("<iot server url>");
  const [iotTopic, setIotTopic] = useState("<iot topic name>");
  const [iotUser, setIotUser] = useState("<iot user>");
  const [iotPassword, setIotPassword] = useState("<iot password>");

  // Select Scoring Environment WML or REST 
  const [scoringEnv, setScoringEnv] = useState("WML");

  // NodeRed Url as REST-API Interface - if source == "NodeRed"
  const [restUrl, setRestUrl] = useState("<REST Url>");
 
  // WML Setup - if source == "WML"
  const [cloudApiKey, setCloudApiKey] = useState('<IBM cloud api key>');
  const [cloudRegion, setCloudRegion] = useState('<IBM cloud region>');
  const [spaceId, setSpaceId] = useState('<IBM cloud WML space id>');
  const [qDeploymentId, setQDeploymentId] = useState('<IBM cloud WML deployment id for Q Env>');
  const [qDeploymentIdHP, setQDeploymentIdHP] = useState('<IBM cloud WML deployment id for Q Env Harry Potter>');
  const [deploymentId, setDeploymentId] = useState('<IBM cloud WML deployment id>');
  const [deploymentIdHP, setDeploymentIdHP] = useState('<IBM cloud WML deployment id Harry Potter>');
  
  // defaults 
  const [deviceName, setDeviceName] = useState("phone");
  const [sendOrientation, setSendOrientation] = useState(false);

  useEffect(() => {
    let appStateJson = localStorage.getItem("SensorApp.State");
    if (!appStateJson) {
      fetchStateFromEnv();
      console.log("fetch state sent");
      // fetch('/api/LoadState', {
      //     method: 'GET',
      // }).then(response => response.text()).then(dat => appStateJson = dat);
      //   console.log("state loaded");
      
    } else {    
        let stateObj = JSON.parse(appStateJson);
        console.log(stateObj);

        setStateFromStateObj(stateObj);
        console.log("react state set");   
    }

  //eslint-disable-next-line
  }, [])

  useEffect(() => {

    // let cloudantUrl =  "https://" + cloudantUserName + ":" + cloudantPassword + "@" + cloudantHost + "/" + cloudantDB;
    let cloudantUrl =  "https://" + cloudantUserName + ":" + cloudantPassword + "@" + cloudantHost;
    setCloudantUrl(cloudantUrl);
    
    let appState = {
      appMode: appMode,
      modelEnv: modelEnv,
      trainEnv: trainEnv,
      iotServer: iotServer,
      iotUser: iotUser,
      iotPassword: iotPassword,
      iotTopic: iotTopic,
      cloudantHost: cloudantHost, 
      cloudantUserName: cloudantUserName, 
      cloudantPassword: cloudantPassword,
      cloudantDB: cloudantDB,
      cloudantUrl: cloudantUrl,
      scoringEnv: scoringEnv, 
      cloudApiKey: cloudApiKey,
      cloudRegion: cloudRegion,
      spaceId: spaceId,
      deploymentId: deploymentId,
      deploymentIdHP: deploymentIdHP,
      qDeploymentId: qDeploymentId,
      qDeploymentIdHP: qDeploymentIdHP,
      restUrl: restUrl,
      deviceName: deviceName,
      sendOrientation: sendOrientation
    }

    localStorage.setItem("SensorApp.State", JSON.stringify(appState));
    console.log("app state written");

  //eslint-disable-next-line
  }, [appMode, modelEnv, trainEnv, iotServer, iotUser, iotPassword, iotTopic, cloudantHost, cloudantUserName, cloudantPassword, cloudantUrl, cloudantDB, 
    scoringEnv, cloudApiKey, cloudRegion, spaceId, deploymentId, deploymentIdHP, qDeploymentId, qDeploymentIdHP, restUrl, deviceName, sendOrientation])


  const setStateFromStateObj = (newState) => {
      console.log("set state from newState");
      console.log(newState);
      // Mode Selector
        setAppMode(newState.appMode);
        setModelEnv(newState.modelEnv);

      // Config Selector
        setScoringEnv(newState.scoringEnv);
        setTrainEnv(newState.trainEnv);

      // Cloudant
        setCloudantHost(newState.cloudantHost);
        console.log("set cloudant host to " + newState.cloudantHost);
        setCloudantUserName(newState.cloudantUserName);
        setCloudantPassword(newState.cloudantPassword);
        setCloudantDB(newState.cloudantDB);

        // let newCloudantUrl =  "https://" + newState.cloudantUserName + ":" + newState.cloudantPassword + "@" + newState.cloudantHost + "/" + newState.cloudantDB;
        let newCloudantUrl =  "https://" + newState.cloudantUserName + ":" + newState.cloudantPassword + "@" + newState.cloudantHost;
        setCloudantUrl(newCloudantUrl);
        console.log("set cloudant url to " + newCloudantUrl);

      // IoT
        setIotServer(newState.iotServer);
        setIotUser(newState.iotUser);
        setIotPassword(newState.iotPassword);
        setIotTopic(newState.iotTopic);
      
      // WML Model
        setCloudApiKey(newState.cloudApiKey);
        setCloudRegion(newState.cloudRegion);
        setSpaceId(newState.spaceId);
        setQDeploymentId(newState.qDeploymentId);
        setQDeploymentIdHP(newState.qDeploymentIdHP);
        setDeploymentId(newState.deploymentId);
        setDeploymentIdHP(newState.deploymentIdHP);

      // Rest 
        setRestUrl(newState.restUrl);

      // Device Name for the Events
        setDeviceName(newState.deviceName);
      
      // Orientation instead of Accelerator (only for test)
        setSendOrientation(newState.sendOrientation === 'true');
  }

  const fetchStateFromEnv = async () => {
    let rsp = null;
    await fetch('/api/LoadState', {
        method: 'GET',
    }).then(response => response.text()).then(dat => rsp = dat);
    console.log("App State fetched");
    console.log(rsp);
    setStateFromStateObj(JSON.parse(rsp));
  }

  const onAppModeChange = (value) => {
      console.log('OnAppModeChange:' + value);
      setAppMode(value);
  }
 
  const onModelEnvChange = (value) => {
    console.log('OnModelEnvChange:' + value);
    setModelEnv(value);
  }

  const onTrainEnvChange = (value) => {
      console.log('OnDestinationChange:' + value);
      setTrainEnv(value);
  }

  const onScoringEnvChange = (value) => {
    console.log('OnSourceChange:' + value);
    setScoringEnv(value);
  }
  
  return (
      <Layout>
        <div className="mb-16 w-full">
          <div className="flex mt-2">
            <div className="w-2/6"></div>
            <div className="font-bold text-lg mt-4">Global Application Setting</div>
          </div>

          <div className="flex mt-2 items-center">
            <div className="w-2/6 text-right pr-5 text-gray-600">Application Mode:</div> 
            <div className="mb-3 xl:w-96">
              <select value={appMode} onChange={(e) => onAppModeChange(e.target.value)} className="form-select appearance-none
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
                  <option value="Harry Potter">Harry Potter</option>
                  <option value="Digit Detection">Digit Detection</option>
              </select>
            </div>
          </div>
         
          <div className="flex mt-2">
            <div className="w-2/6"></div>
            <div className="font-bold text-lg mt-4">Training Environment</div>
          </div>
          <div className="flex mt-2 items-center">
            <div className="w-2/6 text-right pr-5 text-gray-600">Destination:</div> 
            <div className="mb-3 xl:w-96">
              <select value={trainEnv} onChange={(e) => onTrainEnvChange(e.target.value)} className="form-select appearance-none
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
                  <option value="CLOUDANT">cloudantDB</option>
                  <option value="IOT">IoT Foundation</option>
              </select>
            </div>
          </div>

          { trainEnv == "CLOUDANT" && (
          <>
          <div className="flex mt-2">
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
              <div className="w-2/6 text-right pr-5 text-gray-600">Database:</div>
              <input
                className="w-4/6 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                type="search"
                name="cloudantDB"
                value={cloudantDB}
                onChange={(e) => setCloudantDB(e.target.value)} />
            </div>
            <div className="flex mt-2 items-center">
              <div className="w-2/6 text-right pr-5 text-gray-600">Cloudant URL:</div>
              <div className="w-4/6  text-sm mx-px hover:mx-0 py-2.5 px-2 pr-8 overflow-x-auto">
                {cloudantUrl}
              </div>
            </div>
          </>)}

          {trainEnv == "IOT" && (
          <>
          <div className="flex mt-2">
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
            </div>
          </>)}

          <div className="flex mt-2">
            <div className="w-2/6"></div>
            <div className="font-bold text-lg mt-4">Scoring Environment</div>
          </div>

          <div className="flex mt-2 items-center">    
            <div className="w-2/6 text-right pr-5 text-gray-600">Scoring Model Environment:</div>      
            <div className="mb-3 xl:w-96">
              <select value={scoringEnv} onChange={(e) => onScoringEnvChange(e.target.value)} className="form-select appearance-none
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
                  <option value="WML">WML</option>
                  <option value="REST">Rest-API</option>
              </select>
            </div>
          </div>

          {scoringEnv == "WML" && (
            <>
              <div className="flex mt-2 items-center">
                <div className="w-2/6 text-right pr-5 text-gray-600">Model Environment:</div> 
                <div className="mb-3 xl:w-96">
                  <select value={modelEnv} onChange={(e) => onModelEnvChange(e.target.value)} className="form-select appearance-none
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
                      <option value="CLASSIC">Classic WML Deployment</option>
                      <option value="IBM-Q">IBM Quantum Deployment</option>
                  </select>
                </div>
              </div>

              <div className="flex mt-2">
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
                <div className="w-2/6 text-right pr-5 text-gray-600">Space ID:</div>
                <input
                  className="w-4/6 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                  type="search"
                  name="deploymentId"
                  value={deploymentId}
                  onChange={(e) => setSpaceId(e.target.value)} />
              </div>
              {modelEnv == "IBM-Q" && (
              <>
                <div className="flex mt-2 items-center">
                  <div className="w-2/6 text-right pr-5 text-gray-600">Q-Deployment ID:</div>
                  <input
                    className="w-4/6 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                    type="search"
                    name="qDeploymentId"
                    value={qDeploymentId}
                    onChange={(e) => setQDeploymentId(e.target.value)} />
                </div>
                <div className="flex mt-2 items-center">
                  <div className="w-2/6 text-right pr-5 text-gray-600">Q-Deployment ID Harry Potter</div>
                  <input
                    className="w-4/6 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                    type="search"
                    name="qDeploymentIdHP"
                    value={qDeploymentIdHP}
                    onChange={(e) => setQDeploymentIdHP(e.target.value)} />
                </div>
              </>)}

              {modelEnv == "CLASSIC" && (
              <>

                <div className="flex mt-2 items-center">
                  <div className="w-2/6 text-right pr-5 text-gray-600">Deployment ID:</div>
                  <input
                    className="w-4/6 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                    type="search"
                    name="deploymentId"
                    value={deploymentId}
                    onChange={(e) => setDeploymentId(e.target.value)} />
                </div>
                <div className="flex mt-2 items-center">
                  <div className="w-2/6 text-right pr-5 text-gray-600">Deployment ID Harry Potter</div>
                  <input
                    className="w-4/6 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                    type="search"
                    name="deploymentIdHP"
                    value={deploymentIdHP}
                    onChange={(e) => setDeploymentIdHP(e.target.value)} />
                </div>
              </>)}
            </>)}
            
            {scoringEnv == "REST" && (
            <>
              <div className="flex mt-2">
              <div className="w-2/6"></div>
              <div className="font-bold text-lg mt-4">Scoring settings - REST URL</div>
              </div>
              <div className="flex mt-2 items-center">
                <div className="w-2/6 text-right pr-5 text-gray-600">REST Url:</div>
                <input
                  className="w-4/6 rounded border border-gray-100 border-inherit border-2 hover:border-blue-100 mx-px hover:mx-0 hover:border-2 py-2.5 px-2 focus:mx-0 focus:border-2 focus:border-blue-100 focus:outline-0 pr-8"
                  type="search"
                  name="restUrl"
                  value={restUrl}
                  onChange={(e) => setRestUrl(e.target.value)} />
              </div>
            </>)}

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

          <div className="flex mt-2 items-center">
              <div className="w-2/6 text-right pr-5 text-gray-600">refresh from env:</div>

                        <button 
                            className="bg-indigo-500 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded inline-flex items-center w-64"
                            onClick={fetchStateFromEnv}
                        >
                            <Image className="filter-white" src="/static/Refresh.svg" width="30" height="30" alt="Start" />
                            <span className="ml-6">REFRESH</span>
                        </button>
          </div>
        </div>
    </Layout>
  )
}

export default Settings;