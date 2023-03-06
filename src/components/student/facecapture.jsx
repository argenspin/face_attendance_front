import Webcam from 'react-webcam';
import {React,useRef,useEffect, useState, useCallback, useLayoutEffect} from 'react';
import { axiosInstance } from '../axiosinstance';

const FaceCapture = (props) => {

    axiosInstance.defaults.timeout = 10000

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "environment"
      };
    
    const [viewMode,setViewMode] = useState(props.viewmode)
    const [imageSrc,setImageSrc] = useState(props.imageSrc)
    const [multipleFacePhotoB64,setMulitpleFacePhotoB64] = useState([])
    const [userType,setUserType] = useState(props.usertype)
    const [bottomButtons,setBottomButtons] = useState([])
    const [noOfCapturedImages,setNoOfCapturedImages] = useState(0);
    //const [allCaptured,setAllCaptured] = useState(false);
    const [imagesConfirmButton,setImagesConfirmButton] = useState([])
    const [facePreviewComponent,setFacePreviewComponent] = useState([])
    const [captureButtonDisabled,setCaptureButtonDisabled] = useState(false)

    // const getBottomButtons = () => {
    //     if(userType==='admin')
    //     {
    //         setBottomButtons(
    //             <div>
    //             <button className='bg-green-600 text-white py-0 px-3 shadow appearance-none border rounded m-1' onClick={reTakePhoto}>Retake</button>
    //             <button className='bg-red-600 text-white py-0 px-3 shadow appearance-none border rounded' onClick={faceCaptureCancel}>Cancel</button>
    //             </div>
    //         )
    //     }
    //     else{
    //         setBottomButtons(
    //             null
    //         )
    //     }
    // }

    const webcamRef = useRef(null);

    //here state multiplefacephotob64 is passed as argument 
    const imagesConfirm = (multipleFacePhotoB64) => {
        setImagesConfirmButton(
            []
        )
        setFacePreviewComponent(
            <div>
                <h1 className='font-bold text-white'>All images have been processed. Now click save to add to the database</h1>
            </div>
        )
        console.log("all images captured... now executin on_all_images_captured")
        console.log(multipleFacePhotoB64)
        props.on_all_images_captured(imageSrc,multipleFacePhotoB64);
    }

    const capture = () => {
        //setViewMode('preview')
        //setImageSrc((webcamRef.current.getScreenshot()).toString());
        //There is a delay in updating the state of imageSrc, that's why it is called 2 times
        //console.log("all captured ref: "+allCaptured)
        setCaptureButtonDisabled(true)
        let image = (webcamRef.current.getScreenshot())
        checkIfPhotoIsValid(image);

        //checkIfPhotoIsValid(image);
        console.log(noOfCapturedImages)
        //console.log(image)
        //props.oncapture((webcamRef.current.getScreenshot()).toString(), JSON.stringify(image));
        //console.log(imageSrc);
    }


    const checkIfPhotoIsValid = async(face_photo_b64) => {
        let form_data = new FormData();
        form_data.append('face_photo_b64',face_photo_b64)
        await axiosInstance
        .post('face_photo/check_valid/',form_data)
        .then(res=> {
            //displayNoOfCapturedImages();
            setCaptureButtonDisabled(false)
            setNoOfCapturedImages(prevState => prevState+1);
            //getIfAllImagesAreCaptured();
            //console.log('photo valid')
            setMulitpleFacePhotoB64(prevState => [...prevState,face_photo_b64]);
            
            setViewMode('capture')
        })
        .catch(err=>{
            setCaptureButtonDisabled(false)
            alert("image is not valid")
            console.log(err);
            setViewMode('capture')
        })


    }

    const faceCaptureCancel = () => {
        // if(imageSrc)
        // {
        //     setViewMode('edit')
        // }
        // else
        // {
        //     props.func();
        // }
        props.ondone();
    }

    // const reTakePhoto = () => {
    //     setViewMode('capture');
    // }

    //debug function
    // const displayNoOfCapturedImages = () => {
    //     console.log(multipleFacePhotoB64)
    //     console.log(noOfCapturedImages)
    //     //console.log("all images captured: "+allCaptured)
    // }

    const checkIfAllImagesAreCaptured = () => {
        console.log(multipleFacePhotoB64)
        if(noOfCapturedImages===1)
        {
            setImageSrc(multipleFacePhotoB64[0])
        }
        if(noOfCapturedImages==8)
        {
            setFacePreviewComponent(
                <>
                {multipleFacePhotoB64.map(photo=>{
                    return <img className='relative h-20 rounded-xl m-2' src = {photo}></img>
                })}
                </>
            )

            setImagesConfirmButton(
                <div>
                <button className='bg-green-600 text-white py-1 px-3 shadow appearance-none border rounded m-10 mr-60' onClick={() => imagesConfirm(multipleFacePhotoB64)}>Confirm</button>
                </div>
            )
            setViewMode('preview')
        }
    }


    useEffect(()=>{
        checkIfAllImagesAreCaptured()
        //getIfAllImagesAreCaptured();
        //displayNoOfCapturedImages();
        //getBottomButtons();
    },[noOfCapturedImages])

        if(viewMode==='capture')
        {
            return(
                <div className='absolute m-5 left-96 top-1 max-h-fit'>
                <div className=' flex flex-wrap justify-center'>
                <div className="m-1 px-5">
                    <label className="h6 text-white inline">Captured Images:</label>
                    <label className="h6 text-blue-500 inline ">{noOfCapturedImages+'/8'}</label>
                </div>
                <Webcam
                forceScreenshotSourceSize
                videoConstraints={videoConstraints}
                Style='width:70%;width:400px'
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className='rounded-xl'
                />
                <br/>
                </div>
                <div className='m-2 float-right px-40'>
                {imagesConfirmButton}
                <button className='bg-yellow-600 text-white py-1 px-3 shadow appearance-none border rounded m-1' disabled={captureButtonDisabled} onClick={capture}>Capture</button>
                <button className='bg-red-600 text-white py-1 px-3 shadow appearance-none border rounded' onClick={faceCaptureCancel}>Cancel</button>
                </div>
                </div>

            )
        }
        else if(viewMode==='preview')
        {
            return(
                <div className='absolute m-5 left-96 top-1 flex flex-wrap justify-center'>
                    {facePreviewComponent}

                    {imagesConfirmButton}
                        {bottomButtons}
                </div>
            )
        }
        else if(viewMode==='view')
        {
            return(
                <div className='absolute m-5 left-96 top-1 flex flex-wrap justify-center'>
                    <label className="text-white text-md font-bold mb-2 m-2">Face:</label>
                    <img className='relative h-72 rounded-xl' src = {imageSrc}></img>
                    <br/>
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
