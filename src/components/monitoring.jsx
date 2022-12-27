import NavBar from "./NavBar";

import React, { useState,useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import '../css/monitoring.css'
import { Navigate } from "react-router-dom";

const Monitoring =() => {

    const [verifyMode,setVerifyMode] = useState(false);
    const webcamRef = useRef(null);
    //const [imgSrcs, setImgSrcs] = useState([]);
    const [foundNames,setFoundNames] = useState({}) //Object of all matching names and their counts as key value pair
    const [matchComplete,setMatchComplete] = useState('False') //Show status of matching
    const [frequentMatch,setFrequentMatch] = useState('Nothing') //To store the name with is repeated most in foundnames
    const [camType,setCamType] = useState('user')
    //Function to capture images and send to server
    const capture = async() => {
        let i=0;
        let tempobj = {}; //Store each foundname and its count after each post request to server
        let data
        while(i<20) //Take n photos
         {
        let imageSrc = (webcamRef.current.getScreenshot()).toString(); //Take a picture from webcam
        //console.log((webcamRef.current.getScreenshot()).toString());
        //console.log(imageSrc)
        let form_data = new FormData() //FormData object to send to server
        form_data.append('bstring',imageSrc) //Store imagesrc in FormData object
        
        //Post request to send the Base64 string of image to server
        await axios.post('api/b64images/', form_data,{
          headers: {'content-type': 'multipart/form-data' }
        } )
        //If the post request if successful, add the name returned by the server to tempobj (also increment its count or initialise key as required) 
        .then(res=> {
          let currentName = JSON.parse(res.data).foundname.toString();
          //console.log("FOund name = "+currentName)
          if(tempobj[currentName]!== undefined)
          {

            tempobj[currentName] += 1;
          }
          else
          {
            tempobj[currentName]=0;
          }
          return tempobj
          
        }
          )
        .catch(err => console.log(err))
        i++;
         }
         console.log(data);
         setMatchComplete('True')
         //setFrequentMatch()
         setFoundNames(tempobj)
         //console.log(foundNames)
      };

      const toggleCamType = () => {
        if (camType === 'user')
          setCamType('environment');
        else setCamType('user');
      }
     //Function to show the frequently matching name from foundNames
      const showFoundName = () => {
        let values = Object.values(foundNames) //Store all values from foundNames
        let maxValue = Math.max(...values) //Find the maximum value from values
        let maxName = 'Not Working'; //Debug variable
        let keys = Object.keys(foundNames); //Store all keys from foundNames
        
        //Loop through all keys and find key with matching value of maxValue 
        for (let i=0; i<keys.length; i++)
        {
          if(foundNames[ keys[i] ]==maxValue)
          {
            maxName = keys[i];
            setFrequentMatch(maxName)
            break;
          }
        }
      }

      //Function to reset values
      const resetMatches = () => {
        setMatchComplete('False');
        setFrequentMatch('Nothing')
      }

      const toggleVerify =() => {
        setVerifyMode(!verifyMode);
      }

    if(verifyMode && !localStorage.getItem('access'))
    {
      return ( 
        <div>
          <NavBar/>
          <br/>
          <br/>
          <div>
          <Webcam
            className="cam"
            Style='width:100%'
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{facingMode: camType}}
          />
          </div>
          <button className="btn btn-danger" onClick={toggleVerify}>Cancel</button>
          <br/>
          <br/>
          <button className='m-2' onClick={capture}>Recognise Face</button>
          <button className='m-2' onClick = {showFoundName}>Show Name</button>
          <button className='m-2' onClick={resetMatches}>Reset</button>
          <button className='m-2' onClick={toggleCamType}>Switch Camera</button>
          <h1>Match Complete: {matchComplete}</h1>
          <h1>Matched Face: {frequentMatch}</h1>

        </div>


      );
    }
    else if(!localStorage.getItem('access'))
    {
      return(

        <div>
          <NavBar/>
          <br/>
          <br/>
          <button className="bg-red-700 hover:bg-red-500 rounded font-bold px-4 py-3 m-10" type="button" id="verify_toggle" onClick={toggleVerify}>Verify</button>
        </div>
      )
    }
    else
    {
      return(
        <div>
          <Navigate to={'/home'}/>
        </div>
      )
    }
}

export default Monitoring;
