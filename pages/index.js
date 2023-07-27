import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Image from "next/image";


export default function Home() {

  const [appState, setAppState] = useState({});

  useEffect(() => {

    let appStateJson = localStorage.getItem("SensorApp.State");
    if (!appStateJson) {
        console.log("fetch state sent");     
        fetchStateFromEnv();
    } else {    
        let stateObj = JSON.parse(appStateJson);
        console.log(stateObj);
        console.log("react state set");   
    }

  //eslint-disable-next-line
  }, [])

  const fetchStateFromEnv = async () => {
    let rsp = null;
    await fetch('/api/LoadState', {
        method: 'GET',
    }).then(response => response.text()).then(dat => rsp = dat);
    console.log("App State fetched");
    console.log(rsp);

    let newState = JSON.parse(rsp);

    // let cloudantUrl =  "https://" + cloudantUserName + ":" + cloudantPassword + "@" + cloudantHost + "/" + cloudantDB;
    let cloudantUrl =  "https://" + newState.cloudantUserName + ":" + newState.cloudantPassword + "@" + newState.cloudantHost;
    
    let appState = {
      appMode: newState.appMode,
      modelEnv: newState.modelEnv,
      trainEnv: newState.trainEnv,
      iotServer: newState.iotServer,
      iotUser: newState.iotUser,
      iotPassword: newState.iotPassword,
      iotTopic: newState.iotTopic,
      cloudantHost: newState.cloudantHost, 
      cloudantUserName: newState.cloudantUserName, 
      cloudantPassword: newState.cloudantPassword,
      cloudantDB: newState.cloudantDB,
      cloudantUrl: newState.cloudantUrl,
      scoringEnv: newState.scoringEnv, 
      cloudApiKey: newState.cloudApiKey,
      cloudRegion: newState.cloudRegion,
      spaceId: newState.spaceId,
      deploymentId: newState.deploymentId,
      deploymentIdHP: newState.deploymentIdHP,
      qDeploymentId: newState.qDeploymentId,
      qDeploymentIdHP: newState.qDeploymentIdHP,
      restUrl: newState.restUrl,
      deviceName: newState.deviceName,
      sendOrientation: newState.sendOrientation
    }

    localStorage.setItem("SensorApp.State", JSON.stringify(appState));
    console.log("app state written");
  }

  const onAppModeChange = (value) => {
      console.log('OnAppModeChange:' + value);
      setAppMode(value);
  }
 
  
  return (
      <Layout>
        <h1 className="text-lg font-bold mt-4 ml-2 border-b-2">Motion Detection Application</h1>
        <div className="mt-4 w-full">

          <div className="flex mt-2 items-center">
            <div className="w-2/6 text-right pr-5 text-gray-600">Description:</div> 
            <div className="w-2/6 text-left pr-5 text-gray-600">Demonstration of a motion detection for digits, harry potter spells with your handy.</div> 
          </div>
         
       </div>
    </Layout>
  )
}