import {React,useEffect,useLayoutEffect,useState} from "react";
import { axiosInstance } from "../axiosinstance";
import FaceCapture from "./facecapture";

function CreateStudent(props){

    axiosInstance.defaults.timeout = 30000

    const [newData,setNewData] = useState({'name':'','stud_class_name':'','face_photo_b64':'', 'multiple_images':[],'register_no':'','dob':'','batch':''});
    const [studClasses,setStudClasses] = useState([])
    const [batches,setBatches] = useState([])
    const [faceCaptureComponent,setFaceCaptureComponent] = useState([])
    const [viewMode,setViewMode] = useState('')
    const [saveButtonDisabled,setSaveButtonDisabled] = useState(false)


    const getAllStudClasses = async() => {
        let data = [];
        await axiosInstance
        .get('studclass/retrieve/')
        .then(res => {
            data = res.data;
            setStudClasses(data)
        })
        .catch(err => {
            console.log(err);
        })
    }

    const getAllBatches = async() => {
        await axiosInstance
        .get('academicbatch/retrieve/')
        .then(res=>{
            setBatches(res.data)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const createStudentSave = (e) => {
        e.preventDefault();
        console.log(newData)
        let form_data = new FormData();
        form_data.append('name',newData['name']);
        form_data.append('stud_class_name',newData['stud_class_name']);
        form_data.append('batch',newData['batch'])
        form_data.append('register_no',newData['register_no']);
        form_data.append('dob',newData['dob']);
        form_data.append('face_photo_b64',newData['face_photo_b64'])
        form_data.append('multiple_images',JSON.stringify(newData['multiple_images']))
        props.start_loading_animation();
        axiosInstance
        .post('student/create/',form_data)
        .then(res=>{
            props.ondone('save');

        })
        .catch(err => {
            props.stop_loading_animation();
            if(err.response.status==406)
            {
                alert("A Face cannot be detected from the submitted image!!")
            }
            else{
                alert(err);
            }
            
        })

    }

    const onAllImagesCaptured = (first_captured_photo,multiple_face_photo) => {
        console.log("hello")
        console.log(multiple_face_photo)
        setNewData(prevState => ({
            ...prevState, ['face_photo_b64']:first_captured_photo, ['multiple_images']: multiple_face_photo
            
        })
        )
        setSaveButtonDisabled(false)

    }

    const showFaceCaptureComponent = () => {
        console.log(viewMode)
        setSaveButtonDisabled(true)
        setViewMode('capture')
    }

    const getFaceCaptureComponent = () => {
        if(viewMode==='view')
        {
            setFaceCaptureComponent(
                <FaceCapture ondone={hideFaceCaptureComponent} key={viewMode} viewmode={viewMode} imageSrc={newData['face_photo_b64']}/>
                )
        }
        else if(viewMode==='capture')
        {
            setFaceCaptureComponent(
                <FaceCapture ondone={hideFaceCaptureComponent} key={viewMode}  viewmode={viewMode} imageSrc={newData['face_photo_b64']} on_all_images_captured={onAllImagesCaptured}
                />
            )
        }
        else
        {
            setFaceCaptureComponent(
                null
            )
        }
    }


    //Executed inside child component (FaceCapture)
    const hideFaceCaptureComponent = () => {
        setSaveButtonDisabled(false)
        if(newData['face_photo_b64']==='')
        {
            setViewMode('')
        }
        else
        {
            setViewMode('view')
        }
    }

    const createStudentCancel = (e) => {
        e.preventDefault();
        props.ondone('cancel');
    }

    useLayoutEffect(() => {
        getAllStudClasses();
        getAllBatches();
    },[])

    useEffect(()=> {
        getFaceCaptureComponent();
    },[viewMode])

        return(
            <div className='fixed z-40 max-w-full w-3/4 max-h-full h-4/5 m-2 bg-stone-900 rounded'>
            <h2 className='rounded text-teal-500 text-3xl font-bold m-2'>Create Student</h2>
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
            <label className="text-white text-sm font-bold mb-3 m-2">Register No:</label>
            <input  type="text" id='student_reg_no' className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight " onChange={
                (e)=>{setNewData(prevState => ({
                    ...prevState, ['register_no']:e.target.value
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
            <label className="text-white text-sm font-bold mb-2 m-2">Batch:</label>
            <select id='student_class' className="border rounded py-1 px-1 text-gray-700 leading-tight " defaultValue={''} onChange={(e)=>{setNewData(prevState => ({
                    ...prevState, ['batch']:e.target.value
            })
            )
            }} >
                <option value={''} key={''}></option>
                {
                    batches.map( ({id,batch_name}) => {
                        return (
                            <option value={id} key={id}>{batch_name}</option>
                        )
                    }
                )
                }
            </select>
            <br/>
            <label className="text-white text-sm font-bold mb-3 m-2">Date of Birth:</label>
            <input  type="date" id='student_dob' className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight " onChange={
                (e)=>{setNewData(prevState => ({
                    ...prevState, ['dob']:e.target.value
            })
            )
            }} 
            />
            <br/>
            <br/>
            <label className="text-white text-sm font-bold mb-2 m-2">Face:</label>
            <button className='bg-blue-600 text-white py-1 px-3 shadow appearance-none border rounded' type="button" onClick={(e) => { showFaceCaptureComponent(e) } }>Take Photos</button> 

            <div>
                {faceCaptureComponent}
            </div>
            <br/>
            <br/>
            <div className="m-3">
            <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded' disabled={saveButtonDisabled} type="button" onClick={(e)=> {createStudentSave(e)} }>Save</button>
            <button className='bg-red-800 text-white py-1 px-3 shadow appearance-none border rounded'type="button" onClick={(e)=> {createStudentCancel(e)}}>Cancel</button> 
            </div>
        </div>
        )

}

export default CreateStudent;
