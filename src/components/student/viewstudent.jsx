import {React,useState} from "react";
import FaceCapture from "./facecapture";

function ViewStudent(props){
    const [data,setData] = useState({'id':props.data['id'], 'name':props.data['name'],'stud_class_name':props.data['stud_class_name'],'face_photo_b64':props.data['face_photo_b64'],});
    
    return(
        <div>
            <div className='fixed z-40 max-w-full w-3/4 max-h-full h-2/3 m-2 bg-stone-900 rounded'>
                <h2 className='rounded text-teal-500 text-3xl font-bold m-2'>View Student</h2>
                <br/>
                <br/>
                <div>
                    <label className="text-white text-md font-bold mb-2 m-2">Name:</label>
                    <label className=" shadow appearance-none rounded py-1 px-1 text-white whitespace-nowrap ">{data['name']}</label>
                </div>
                <div>
                    <label className="text-white text-md font-bold mb-2 m-2">Class:</label>
                    <label className=" shadow appearance-none rounded py-1 px-1 text-white ">{data['stud_class_name']}</label>
                </div>
                <div>
                    <FaceCapture /*func={hideFaceCaptureComponent} key={viewMode} viewmode={viewMode} usertype={userType}*/ imageSrc={data['face_photo_b64']} viewmode='view'/>
                </div>
                <div className="m-5">
                    <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded' type="button" onClick={() => props.ondone()}>Ok</button>
                    <button className='bg-red-800 text-white py-1 px-3 shadow appearance-none border rounded'type="button" onClick={() => props.ondone()}>Cancel</button> 
                </div>
            </div>
        </div>
    )
}

export default ViewStudent;