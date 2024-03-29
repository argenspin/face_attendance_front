import {React,useEffect,useLayoutEffect,useState} from "react";
import { axiosInstance } from "../axiosinstance";
import FaceCapture from "./facecapture";

function EditStudent(props){

    axiosInstance.defaults.timeout = 15000

    const [newData,setNewData] = useState({'id':props.data['id'], 'name':props.data['name'],'stud_class_name':props.data['stud_class_name'],'face_photo_b64':props.data['face_photo_b64'], 'multiple_images':[],'register_no':props.data['register_no'],'dob':props.data['dob'],'batch':props.data['batch'],'batch_name':props.data['batch_name']});
    const [studClasses,setStudClasses] = useState([])
    const [batches,setBatches] = useState([])
    const [faceCaptureComponent,setFaceCaptureComponent] = useState(null)
    const [viewMode,setViewMode] = useState('view')
    const [saveButtonDisabled,setSaveButtonDisabled] = useState(false);

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

    const editStudentSave = (e) => {
        e.preventDefault();
        console.log(newData)
        let form_data = new FormData();
        form_data.append('id',newData['id']);
        form_data.append('name',newData['name']);
        form_data.append('stud_class_name',newData['stud_class_name']);
        form_data.append('face_photo_b64',newData['face_photo_b64'])
        form_data.append('register_no',newData['register_no'])
        form_data.append('dob',newData['dob'])
        form_data.append('batch',newData['batch'])
        form_data.append('multiple_images',JSON.stringify(newData['multiple_images']))
        props.start_loading_animation();
        setSaveButtonDisabled(true)
        axiosInstance
        .post('student/edit/',form_data)
        .then(res=>{
            console.log(res.data)
            props.ondone('save');

        })
        .catch(err => {
            props.stop_loading_animation();
            setSaveButtonDisabled(false)
            if(err.response.status==406)
            {
                alert("A Face cannot be detected from the submitted image!!")
            }
            console.log(err);
        })

    }

    const showUpdateFaceCaptureComponent = () => {
        console.log(viewMode)
        setSaveButtonDisabled(true)
        setViewMode('capture')

    }
    //Executed inside child component (FaceCapture)
    const hideFaceCaptureComponent = () => {
        setSaveButtonDisabled(false)
        setViewMode('view');
    }

    const editStudentCancel = (e) => {
        e.preventDefault();
        props.ondone('cancel');
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
    }

    useLayoutEffect(() => {
        getAllStudClasses();
        getAllBatches();
    },[])

    useEffect(()=>{
        getFaceCaptureComponent();
    },[studClasses,viewMode])


        return(
            <div className='fixed z-40 max-w-full w-3/4 max-h-full h-4/5 m-2 bg-stone-900 rounded'>
            <h2 className='rounded text-teal-500 text-3xl font-bold m-2'>Edit Student</h2>
            <br/>
            <label className="text-white text-sm font-bold mb-2 m-2">Name:</label>
            <input  type="text" id='student_name' className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight ml-3" defaultValue={newData['name']} onChange={
                (e)=>{setNewData(prevState => ({
                    ...prevState, ['name']:e.target.value
            })
            )
            }} 
            />
            <br/>
            <label className="text-white text-sm font-bold mb-3 m-2 whitespace-nowrap">Register No:</label>
            <input  type="text" id='student_reg_no' defaultValue={newData['register_no']} className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight ml-3" onChange={
                (e)=>{setNewData(prevState => ({
                    ...prevState, ['register_no']:e.target.value
            })
            )
            }} 
            />
            <br/>
            <label className="text-white text-sm font-bold mb-2 m-2">Class:</label>

            <select id='student_class' className="border rounded py-1 px-1 text-gray-700 leading-tight ml-3 " defaultValue={newData['stud_class_name']} onChange={(e)=>{setNewData(prevState => ({
                ...prevState, ['stud_class_name']:e.target.value
        })
        )
        }} >
            <option value={newData['stud_class_name']} key={newData['stud_class_name']}>{newData['stud_class_name']}</option>
            {
                studClasses.map( ({stud_class_name}) => {
                    //This is done to prevent duplication studclassnames
                    if(stud_class_name!==newData['stud_class_name'])
                    {
                    return (
                        <option value={stud_class_name} key={stud_class_name}>{stud_class_name}</option>
                    )
                    }
                }
            )
            }
        </select>
        <br/>
        <label className="text-white text-sm font-bold mb-3 m-2 whitespace-nowrap">Batch:</label>
            <select id='student_class' className="border rounded py-1 px-1 text-gray-700 leading-tight ml-3" defaultValue={newData['batch']} onChange={(e)=>{setNewData(prevState => ({
                    ...prevState, ['batch']:e.target.value
            })
            )
            }} >
                <option value={newData['batch']} key={newData['batch']}>{newData['batch_name']}</option>
                {
                    batches.map( ({id,batch_name}) => {
                        if(id!==newData['batch'])
                        {
                            return (
                                <option value={id} key={id}>{batch_name}</option>
                            )
                        }
                    }
                )
                }
            </select>
            <br/>
        <label className="text-white text-sm font-bold mb-3 m-2 whitespace-nowrap">Date of Birth:</label>
            <input  type="date" id='student_dob' defaultValue={newData['dob']} className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight ml-3" onChange={
                (e)=>{setNewData(prevState => ({
                    ...prevState, ['dob']:e.target.value
            })
            )
            }} 
            />

            <br/>
            <label className="text-white text-sm font-bold mb-2 m-2">Face:</label>
            <button className='bg-blue-600 text-white py-1 px-3 shadow appearance-none border rounded ml-3' type="button" onClick={(e) => { showUpdateFaceCaptureComponent() } }>Update Face</button> 
            <div>
                {faceCaptureComponent}
            </div>
            <br/>
            <br/>
            <div className="m-5">
            <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded' disabled={saveButtonDisabled} type="button" onClick={(e)=> {editStudentSave(e)} }>Save</button>

            <button className='bg-red-800 text-white py-1 px-3 shadow appearance-none border rounded'type="button" onClick={(e)=> {editStudentCancel(e)}}>Cancel</button> 
            </div>
        </div>
        )

}

export default EditStudent;