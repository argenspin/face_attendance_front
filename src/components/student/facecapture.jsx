import Webcam from 'react-webcam';
import {React,useRef,useEffect, useState, useCallback, useLayoutEffect} from 'react';

const FaceCapture = (props) => {

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
      };
    
    const [viewMode,setViewMode] = useState(props.viewmode)
    const [captured,setCaptured] = useState(false);
    const [imageSrc,setImageSrc] = useState(props.imageSrc)
    const [userType,setUserType] = useState(props.usertype)
    const [bottomButtons,setBottomButtons] = useState([])

    const getBottomButtons = () => {
        if(userType==='admin')
        {
            setBottomButtons(
                <div>
                <button className='bg-green-600 text-white py-0 px-3 shadow appearance-none border rounded m-1' onClick={reTakePhoto}>Retake</button>
                <button className='bg-red-600 text-white py-0 px-3 shadow appearance-none border rounded' onClick={faceCaptureCancel}>Cancel</button>
                </div>
            )
        }
        else{
            setBottomButtons(
                null
            )
        }
    }

    const webcamRef = useRef(null);
    const capture = useCallback(() => {
        setViewMode('preview')
        setImageSrc((webcamRef.current.getScreenshot()).toString());
        //There is a delay in updating the state of imageSrc, that's why it is called 2 times
        props.oncapture((webcamRef.current.getScreenshot()).toString());
        console.log(imageSrc);
    },[webcamRef])

    const faceCaptureCancel = () => {
        if(imageSrc)
        {
            setViewMode('preview')
        }
        else
        {
            props.func();
        }
    }

    const reTakePhoto = () => {
        setViewMode('capture');
    }

    useEffect(()=>{
        getBottomButtons();
    },[imageSrc])

        if(viewMode==='capture')
        {
            return(
                <div className='absolute m-10 left-96 top-1'>
                <div className=' flex flex-wrap justify-center'>
                <Webcam
                forceScreenshotSourceSize
                videoConstraints={videoConstraints}
                Style='width:70%'
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className='rounded-xl'
                />
                <br/>
                </div>
                <div className='m-2 float-right px-40'>
                <button className='bg-yellow-600 text-white py-0 px-3 shadow appearance-none border rounded m-1' onClick={capture}>Capture</button>
                <button className='bg-red-600 text-white py-0 px-3 shadow appearance-none border rounded' onClick={faceCaptureCancel}>Cancel</button>
                </div>
                </div>

            )
        }
        else if(viewMode==='preview')
        {
            return(
                <div className='absolute m-5 left-96 top-1 flex flex-wrap justify-center'>
                    <img className='relative h-72 rounded-xl' src = {imageSrc}></img>
                    <br/>
                        {bottomButtons}
                </div>
            )
        }
        else
        {
            return(
                null
            )
        }
}

export default FaceCapture;