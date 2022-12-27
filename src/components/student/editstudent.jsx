import {React,useEffect,useLayoutEffect,useState} from "react";
import { axiosInstance } from "../axiosinstance";
import FaceCapture from "./facecapture";

function EditStudent(props){


    const [newData,setNewData] = useState({'id':props.data['id'], 'name':props.data['name'],'stud_class_name':props.data['stud_class_name'],'face_photo_b64':props.data['face_photo_b64']});
    const [studClasses,setStudClasses] = useState([])
    const [faceCaptureShow,setfaceCaptureShow] = useState(true)
    const [faceCaptureComponent,setFaceCaptureComponent] = useState(null)
    const [userType,setUserType] = useState(props.usertype)
    const [nameComponent,setNameComponent] = useState([])
    const [studClassComponent,setStudClassComponent] = useState([]);


    const getVIewOrEditMode = () => {
        if(userType ==='admin')
        {
            setNameComponent( <input  type="text" id='student_name' className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight " defaultValue={newData['name']} onChange={
                (e)=>{setNewData(prevState => ({
                    ...prevState, ['name']:e.target.value
            })
            )
            }} 
            />)

            setStudClassComponent(<select id='student_class' className="border rounded py-1 px-1 text-gray-700 leading-tight " onChange={(e)=>{setNewData(prevState => ({
                ...prevState, ['stud_class_name']:e.target.value
        })
        )
        }} >
            <option value={newData['stud_class_name']} selected>{newData['stud_class_name']}</option>
            {
                studClasses.map( ({stud_class_name}) => {
                    //This is done to prevent duplication studclassnames
                    if(stud_class_name!==newData['stud_class_name'])
                    {
                    return (
                        <option value={stud_class_name}>{stud_class_name}</option>
                    )
                    }
                }
            )
            }
        </select>)
        }
        else{
            setNameComponent(
                <label className=" shadow appearance-none rounded py-1 px-1 text-white ">{newData['name']}</label>
            )
            setStudClassComponent(
                <label className=" shadow appearance-none rounded py-1 px-1 text-white ">{newData['stud_class_name']}</label>
            )
        }
    }



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

    const editStudentSave = (e) => {
        e.preventDefault();
        console.log(newData)
        let form_data = new FormData();
        form_data.append('id',newData['id']);
        form_data.append('name',newData['name']);
        form_data.append('stud_class_name',newData['stud_class_name']);
        form_data.append('face_photo_b64',newData['face_photo_b64'])
        axiosInstance
        .post('student/edit/',form_data)
        .then(res=>{
            console.log(res.data)
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

    const showOrHideFaceCaptureComponent = () => {
        console.log(faceCaptureComponent)
        if(faceCaptureComponent===null)
        {
            setFaceCaptureComponent(
                <FaceCapture func={hideFaceCaptureComponent} viewmode={"preview"} usertype={userType} imageSrc={newData['face_photo_b64']} oncapture={onCapture}/>)
        }
        else{
            hideFaceCaptureComponent();
        }

    }

    //Executed inside child component (FaceCapture)
    const hideFaceCaptureComponent = () => {
        setFaceCaptureComponent(null);
    }

    const editStudentCancel = (e) => {
        e.preventDefault();
        props.func('cancel');
    }

    useLayoutEffect(() => {
        getAllStudClasses();
        showOrHideFaceCaptureComponent();
    },[])

    useEffect(()=>{
        getVIewOrEditMode();
    },[studClasses])


        return(
            <div className='create_form m-2 bg-gray-800 rounded'>
            <h2 className='rounded text-teal-500 text-3xl font-bold'>Edit Student</h2>
            <br/>
            <label className="text-white text-sm font-bold mb-2 m-2">Name:</label>
            {nameComponent}
            <br/>
            <label className="text-white text-sm font-bold mb-2 m-2">Class:</label>

            {studClassComponent}
                    


            <br/>
            <label className="text-white text-sm font-bold mb-2 m-2">Face:</label>
            <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded' type="button" onClick={(e) => { showOrHideFaceCaptureComponent() } }>Show/Hide</button> 

            <div>
                {faceCaptureComponent}
            </div>
            <br/>
            <br/>
            <div className="m-5">
            <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded' type="button" onClick={(e)=> {editStudentSave(e)} }>Save</button>

            <button className='bg-red-800 text-white py-1 px-3 shadow appearance-none border rounded'type="button" onClick={(e)=> {editStudentCancel(e)}}>Cancel</button> 
            </div>
        </div>
        )

}

export default EditStudent;