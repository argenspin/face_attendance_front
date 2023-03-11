import NavBar from "../NavBar";

import React, { useState,useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
//import '../css/monitoring.css'
import { Navigate } from "react-router-dom";
import { axiosInstance } from "../axiosinstance";
import TeacherLogin from "./teacher_login";
import SelectStudClass from "./select_stud_class";

const Monitoring =() => {

  axiosInstance.defaults.timeout = 10000
  axiosInstance.interceptors.response.use(
    response => {
        return response
    },
    error => {
        return Promise.reject(error);
    }
)

axiosInstance.interceptors.request.use(
    request => {
        return request;
    },
    error => {
        return Promise.reject(error);
    }
)

    const [verifyMode,setVerifyMode] = useState(false);
    const webcamRef = useRef(null);
    //const [imgSrcs, setImgSrcs] = useState([]);
    const [foundIds,setFoundIds] = useState({}) //Object of all matching names and their counts as key value pair
    const [matchComplete,setMatchComplete] = useState(false) //Show status of matching
    const [frequentlyMatchedId,setFrequentlyMatchedId] = useState('') //To store the name with is repeated most in foundnames
    const [camType,setCamType] = useState('environment')

    const [status,setStatus] = useState('Idle')
    const [matchedName,setMatchedName] = useState('NULL')
    const [studClassName,setStudClassName] = useState(localStorage.getItem('stud_class_name')? window.atob(localStorage.getItem('stud_class_name')): 'Nil')
    const [monitoringState,setMonitoringState] = useState('On')
    const [faceCaptureComponent,setFaceCaptureComponent] = useState(undefined)
    const [teacherLoginComponent, setTeacherLoginComponent] = useState([])
    const [adminChangeClassComponent,setAdminChangeClassComponent] = useState([])
    const [verifyButtonDisabled,setVerifyButtonDisabled] = useState(false);
    const [currentsubject,setCurrentSubject] = useState({'id':null,'subject_name':'Nothing','timetable_subject_index':null})
    //Function to capture images and send to server
    const capture = async() => {
      setStatus('Verifying')
        let i=0;
        let temp_found_ids = {}; //Store each foundname and its count after each post request to server
        let captured_images = [];
        let form_data = new FormData() //FormData object to send to server
        let images_to_detect = []
        form_data.append('stud_class_name',studClassName)
        while(i<8) //Take n photos
         {
          //let imageSrc = webcamRef.current.getScreenshot(); //Take a picture from webcam
          images_to_detect.push(webcamRef.current.getScreenshot())
          i++;
         }
         form_data.append('images_to_detect',JSON.stringify(images_to_detect))
         form_data.append('timetable_subject_index',currentsubject.timetable_subject_index);
         form_data.append('subject_id',currentsubject.id);
        //form_data.append('face_photo_b64',webcamRef.current.getScreenshot())

         //form_data.append('captured_images',JSON.stringify(captured_images))
        //console.log((webcamRef.current.getScreenshot()).toString());
        //console.log(imageSrc)
 //Store imagesrc in FormData object
        //Post request to send the Base64 string of image to server
        await axiosInstance
        .post('attendance/marking/', form_data )
        .then(res=> {
            setMatchedName(res.data['matched_name'])
            setStatus(res.data['verification_status'])
            cancelVerify();
        })
        .catch(err=>{
          cancelVerify();

          setStatus("Verfication Failed")
          setMatchedName("None")
          console.log(err)
        })

      }


      const verifyOn = () => {
        setVerifyMode(true)
      }

      const cancelVerify = () => {
        setVerifyMode(false)
      }

      const switchVerify = () => {
        if(camType==='user')
        {
          setCamType('environment');
        }
        else
        {
          setCamType('user');
        }
      }

      const getFaceCaptureComponent = () => {
        if(verifyMode)
        {
          setFaceCaptureComponent(
            
            <div className="absolute right-0 mr-80">
            <button className='bg-green-700 hover:bg-green-800 rounded font-bold px-3 py-2' onClick={cancelVerify}>Cancel</button>
            <button className='bg-green-700 hover:bg-green-800 rounded font-bold px-3 py-2' onClick={switchVerify}>Switch</button>
            <button className='bg-green-700 hover:bg-green-800 rounded font-bold px-3 py-2' onClick={capture}>Recognise Face</button>

            <div className="">
            <Webcam
              className="rounded-xl min-h-fit min-w-fit border-x-8 border-y-8 border-gray-700"
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{facingMode: camType, width: 1280, height: 720,}}
            />
            </div>

            </div>
          )
          setTimeout(()=>{
            capture();
          },1500)
        }
        else
        {
          setFaceCaptureComponent(null)
        }
      }

      const getStatus = () => {
        if(matchedName==='None')
        {
          setStatus("Verfication Failed!")
        }
        else if(matchedName==='NULL')
        {
          setStatus("Idle");
        }
      }

      const getCurrentSubject = () => {
        let form_data = new FormData();
        form_data.append('stud_class_name',studClassName);
        axiosInstance
        .post('attendance/currentsubject/',form_data)
        .then(res=>{
          setCurrentSubject(res.data);
        })
        .catch(err=>{
          console.log(err)
        })
      }

      const changeStudClass = () => {
        setVerifyButtonDisabled(true);
        setTeacherLoginComponent(<TeacherLogin onadminlogin={adminChangeClass} onlogin={getStudClass} oncancel={effectsAfterloginComponentDisabled}/>);
      }

      const resetStudClass = () => {
        localStorage.removeItem('stud_class_name');
        setStudClassName('Nil');
      }

      const adminChangeClass = (access_token,refresh_token) => {
        effectsAfterloginComponentDisabled();
        setVerifyButtonDisabled(true);
        setAdminChangeClassComponent(<SelectStudClass access={access_token} onselect={getStudClass} oncancel={effectsAfterloginComponentDisabled}/>)
      }

      // const setNewStudClass = (stud_class_name,access_token,refresh_token) => {
      //   localStorage.setItem('stud_class_name',window.btoa(stud_class_name)); //string to b64
      //   setStudClassName(window.atob(localStorage.getItem('stud_class_name'))); //b64 to string

      // }

      const getStudClass = (stud_class_name) => {
        localStorage.setItem('stud_class_name',window.btoa(stud_class_name)); //string to b64
        setStudClassName(window.atob(localStorage.getItem('stud_class_name'))); //b64 to string
        effectsAfterloginComponentDisabled();
      }


      const effectsAfterloginComponentDisabled = () => {
        setAdminChangeClassComponent([]);
        setTeacherLoginComponent([]);
        setVerifyButtonDisabled(false);
      }

      useEffect(()=>{
        getFaceCaptureComponent();
        //getStatus();
      },[verifyMode,camType])


      // refresh and find the current subject periodically
      const [count, setCount] = useState(0);

      useEffect(() => {
       const timeout = setTimeout(() => {
          setCount(count+1);
          if(studClassName!='Nil')
          {
            getCurrentSubject();
          }
        }, 1000);
    
       return () => clearTimeout(timeout);
      },[count]);


    if(!localStorage.getItem('access'))
    {
      return(

        <div className="">
          <NavBar/>
          <br/>
          {faceCaptureComponent}
          <div className="m-3 border-x-8 border-y-8 border-slate-700 min-h-fit min-w-fit max-w-sm rounded">
          <div className="py-3">
            <div className="m-1">
              {teacherLoginComponent}{adminChangeClassComponent}
              <label className="h5 text-white inline"> CLASS: </label>
              <label className="h5 text-yellow-500 ">{studClassName}</label>
              <button className="bg-teal-700 hover:bg-cyan-800 rounded font-bold px-2 py-2 m-2" onClick={changeStudClass}>Change</button>
              <button className="bg-red-700 hover:bg-red-800 rounded font-bold px-2 py-2" onClick={resetStudClass}>Reset</button>

            </div>
              <br/>
            <div className="m-1">
              <label className="h5 text-white inline">SUBJECT:</label>
              <label className="h5 text-green-500 ">{currentsubject.subject_name}</label>
            </div>
            <br/>
            <div className="m-1">
              <label className="h5 text-white inline">STATUS:</label>
              <label className="h5 text-red-400 inline ">{status}</label>
            </div>
            <br/>
            <div className="m-1">
              <label className="h5 text-white inline">IDENTIFIED:</label>
              <label className="h5 text-blue-500 inline ">{matchedName}</label>
            </div>
          </div>
          </div>
          <br/>
          <button className="bg-red-700 hover:bg-red-500 rounded font-bold px-4 py-3 m-10" type="button" id="verify_toggle" disabled={verifyButtonDisabled} onClick={verifyOn}>Verify</button>
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
