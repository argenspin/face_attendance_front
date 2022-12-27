import {React,useLayoutEffect,useState} from "react";
import { axiosInstance } from "../axiosinstance";
import FaceCapture from "./facecapture";

function CreateStudent(props){


    const [newData,setNewData] = useState({'name':'','stud_class_name':'','face_photo_b64':''});
    const [studClasses,setStudClasses] = useState([])
    const [faceCaptureShow,setfaceCaptureShow] = useState(true)
    const [faceCaptureComponent,setFaceCaptureComponent] = useState([])
    const [userType,setUserType] = useState(props.usertype)


    const getAllStudClasses = async() => {
        let data = [];
        await axiosInstance
        .get('studclass/retrieve/')
        .then(res => {
            data = res.data;
            setStudClasses(data)

            //console.log(data)
        })
        .catch(err => {
            console.log(err);
        })
    }

    const createStudentSave = (e) => {
        e.preventDefault();
        console.log(newData)
        let form_data = new FormData();
        form_data.append('name',newData['name']);
        form_data.append('stud_class_name',newData['stud_class_name']);
        form_data.append('face_photo_b64',newData['face_photo_b64'])
        axiosInstance
        .post('student/create/',form_data)
        .then(res=>{
            props.func('save');

        })
        .catch(err => {
            if(err.response.status==406)
            {
                alert("A Face cannot be detected from the submitted image!!")
            }
            console.log(err);
        })

    }

    const onCapture = (imageSrc) => {
        console.log("hello")
        console.log(imageSrc)
        setNewData(prevState => ({
            ...prevState, ['face_photo_b64']:imageSrc
    })
    )
    }

    const showFaceCaptureComponent = (e) => {
        setFaceCaptureComponent(<FaceCapture func={hideFaceCaptureComponent} viewmode={"capture"} oncapture={onCapture} usertype={userType}/>)
    }

    //Executed inside child component (FaceCapture)
    const hideFaceCaptureComponent = () => {
        setFaceCaptureComponent([]);
    }

    const createStudentCancel = (e) => {
        e.preventDefault();
        props.func('cancel');
    }

    useLayoutEffect(() => {
        getAllStudClasses();
    },[])


        return(
            <div className='create_form m-2 bg-gray-800 rounded'>
            <h2 className='rounded text-teal-500 text-3xl font-bold'>Create Student</h2>
            <br/>
            <label className="text-white text-sm font-bold mb-2 m-2">Name:</label>
            <input  type="text" id='student_name' className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight " onChange={
                (e)=>{setNewData(prevState => ({
                    ...prevState, ['name']:e.target.value
            })
            )
            }} 
            />
            <br/>
            <label className="text-white text-sm font-bold mb-2 m-2">Class:</label>
            <select id='student_class' className="border rounded py-1 px-1 text-gray-700 leading-tight " defaultValue={''} onChange={(e)=>{setNewData(prevState => ({
                    ...prevState, ['stud_class_name']:e.target.value
            })
            )
            }} >
                <option value={''} key={''}></option>
                {
                    studClasses.map( ({stud_class_name}) => {
                        return (
                            <option value={stud_class_name} key={stud_class_name}>{stud_class_name}</option>
                        )
                    }
                )
                }
            </select>

            <br/>
            <label className="text-white text-sm font-bold mb-2 m-2">Face:</label>
            <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded' type="button" onClick={(e) => { showFaceCaptureComponent(e) } }>Take Photo</button> 

            <div>
                {faceCaptureComponent}
            </div>
            <br/>
            <br/>
            <div className="m-5">
            <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded' type="button" onClick={(e)=> {createStudentSave(e)} }>Save</button>

            <button className='bg-red-800 text-white py-1 px-3 shadow appearance-none border rounded'type="button" onClick={(e)=> {createStudentCancel(e)}}>Cancel</button> 
            </div>
        </div>
        )

}

export default CreateStudent;