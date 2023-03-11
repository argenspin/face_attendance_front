import { useLayoutEffect } from "react";
import {React,useState,useEffect} from "react";
import axios from "axios";
//import 'bootstrap/dist/css/bootstrap.css'
import { axiosInstance } from "../axiosinstance";
import FaceCapture from "./facecapture";
import CreateStudent from "./createstudent";
import EditStudent from "./editstudent";
import ViewStudent from "./viewstudent";
import { FadeLoader } from 'react-spinners';

function Students()
{
    const [students,setStudents] = useState([])
    const [studClasses,setStudClasses] = useState([])
    const [studClassName, setStudClassName] = useState('');
    const [userType,setUserType] = useState('')

    const [facePhotoB64,setFacePhotoB64] = useState('')

    const [componentCreateEditView,setComponentCreateEditView] = useState([])

    const [editComponent,setEditComponent] = useState([])
    const [createComponent,setCreateComponent] = useState([])
    const [createButtonDisabled,setCreateButtonDisabled] = useState(false);
    const [editButtonDisabled,setEditButtonDisabled] = useState(false);
    const [deleteButtonDisabled,setDeleteButonDisabled] = useState(false)
    const [viewButtonDisabled,setViewButtonDisabled] = useState(false)

    const [loadingState, setLoadingState] = useState(false)

    const [tBodyComponent,setTBodyComponent] = useState([])
    const [topButtons,setTopButtons] = useState([])

    // const effectsAfterCreateComponentDisabled = (save_or_cancel) => {
    //     if(save_or_cancel==='save')
    //     {
    //         getStudents();
    //     }
    //     setEditButtonDisabled(false);
    //     setCreateButtonDisabled(false);
    //     setCreateComponent([]);
    //     resetTableOpacity();
    // }

    // const effectsAfterEditComponentDisabled = (save_or_cancel) => {
    //     if(save_or_cancel==='save')
    //     {
    //         getStudents();
    //     }
    //     setEditButtonDisabled(false);
    //     setCreateButtonDisabled(false);
    //     setEditComponent([]);
    //     resetTableOpacity();
    // }

    const disableAllButtons = () => {
        setEditButtonDisabled(true);
        setCreateButtonDisabled(true);
        setDeleteButonDisabled(true)
    }

    const enableAllButtons = () => {
        setEditButtonDisabled(false);
        setCreateButtonDisabled(false);
        setDeleteButonDisabled(false)

    }

    const effectsAfterCreateEditViewComponentDisabled = (save_or_cancel) => {
        if(save_or_cancel==='save')
        {
            setLoadingState(true)
            getStudents();
            setTimeout(()=>{
                setLoadingState(false)
            },1500)
        }

        enableAllButtons();
        setComponentCreateEditView([]);
        resetTableOpacity();
    }

    const getUserTypeAndStudClassName = async() => {
        await axiosInstance
        .get('usertypestudclass/retrieve/')
        .then(res => {
            setUserType(res.data['user_type']);
            setStudClassName(res.data['stud_class_name']);
        })
        .catch(err => {
            console.log(err);
        })
    }

    //identifying which stud_class students to be retrieved are done in backend using access token
    const getStudents = () => {
        //setStudents([])
        console.log(userType)
        axiosInstance
        .get('student/retrieve/')
        .then(res=> {
            let data = res.data;
            let k=1;
            for(let i=0;i<data.length;i++)
            {
                data[i].sl_no = k++;
                console.log(data[i].sl_no)
            }
            setStudents((data))
        })
        .catch(err => {
            console.log(err)
        })
    }

    const resetTableOpacity = () => {
        settableClassName(tableclassName.replace('opacity-80',''))
    }

    // const getStudentPhoto = async(id) => {
    //     let face_photo_b64 = '';
    //     let form_data = new FormData();
    //     form_data.append('id',id)
    //     await axiosInstance
    //     .post('student/retrieve/',form_data)
    //     .then(res=>{
    //         face_photo_b64 = res.data['face_photo_b64']
    //         setFacePhotoB64(face_photo_b64)
    //     })
    //     .catch(err=>{
    //         console.log(err);
    //     })
    // }

    const createStudent = (e) => {
        e.preventDefault();
        disableAllButtons();
        settableClassName(tableclassName+"opacity-80");
        setComponentCreateEditView(
            <CreateStudent show={true} ondone={effectsAfterCreateEditViewComponentDisabled} usertype = {userType}/>
        )
    }

    const editStudent = async(e,student_data) => {
        e.preventDefault();
        let form_data = new FormData();
        form_data.append('id',student_data['id'])
        await axiosInstance
        .post('student/retrieve/',form_data)
        .then(res=>{
            student_data['face_photo_b64'] = res.data['face_photo_b64'];
            //setFacePhotoB64(face_photo_b64)
        })
        .catch(err=>{
            student_data['face_photo_b64'] = ''
            console.log(err);
        })
        disableAllButtons();
        settableClassName(tableclassName+"opacity-80");
        setComponentCreateEditView(
            <EditStudent ondone={effectsAfterCreateEditViewComponentDisabled} data={student_data} usertype = {userType}/>
        )
    }



    const viewStudent = async(e,student_data) => {
        e.preventDefault();
        let face_photo_b64 = '';
        let form_data = new FormData();
        form_data.append('id',student_data['id'])
        await axiosInstance
        .post('student/retrieve/',form_data)
        .then(res=>{
            face_photo_b64 = res.data['face_photo_b64']
            student_data['face_photo_b64'] = face_photo_b64
            setFacePhotoB64(face_photo_b64)
        })
        .catch(err=>{
            console.log(err);
        })
        setEditButtonDisabled(true);
        setCreateButtonDisabled(true);
        settableClassName(tableclassName+"opacity-80");
        setComponentCreateEditView(
            /*<EditStudent func={effectsAfterEditComponentDisabled} data={student_data} usertype = {userType}/>*/
            <ViewStudent data={student_data} ondone = {effectsAfterCreateEditViewComponentDisabled}/>
        )

    }

    const deleteStudent = async(e,student_id) => {
        e.preventDefault();
        await axiosInstance
        .delete('student/delete/',{headers:{
            id: student_id
        }
        })
        .then(res=>{
            console.log("deleted successfully");
            getStudents();
        })
        .catch(err => {
            alert("Cannot delete student")
        })

    }

    const getTBodyComponent = () => {
        if(userType==='admin')
        {
            setTBodyComponent(
                students.map(function ( {id,sl_no,name,stud_class_name,register_no,dob}){
                    console.log(students.length)
                    return <tr key={id} className={tdtrclassName}>
                        <td key={sl_no} className={tdclassName}>{sl_no}</td>
                        <td key={name} className={tdclassName}>{name}</td>
                        <td key={register_no} className={tdclassName}>{register_no}</td>
                        <td key={dob} className={tdclassName}>{dob}</td>
                        <td key={stud_class_name} className={tdclassName}>{stud_class_name}</td>
                        <td key={"options"} className={tdclassName}>
                            <button className="bg-teal-600 hover:bg-teal-800 text-white font-bold py-1 px-3 rounded mr-1.5" type="button" disabled={viewButtonDisabled} onClick={(e) => {viewStudent(e,{'id':id,'name':name,'stud_class_name':stud_class_name,'register_no':register_no,'dob':dob})}}>
                                View
                            </button>
                
                            <button className="bg-teal-600 hover:bg-teal-800 text-white font-bold py-1 px-3 rounded mr-1.5" type="button" disabled={editButtonDisabled} onClick={(e) => {editStudent(e,{'id':id,'name':name,'stud_class_name':stud_class_name,'register_no':register_no,'dob':dob})}}>
                                Edit
                            </button>
                            <button className="bg-red-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-1.5" type="button" disabled={deleteButtonDisabled} onClick={(e) => {deleteStudent(e,id)} }>
                                Delete
                            </button>
                        </td>
                    </tr>
            }
            )

            )
        }
        else
        {
            setTBodyComponent(
                students.map(function ( {id,sl_no,name,stud_class_name,register_no,dob}){
                    console.log(students.length)
                    return <tr key={id} className={tdtrclassName}>
                        <td key={sl_no} className={tdclassName}>{sl_no}</td>
                        <td key={name} className={tdclassName}>{name}</td>
                        <td key={register_no} className={tdclassName}>{register_no}</td>
                        <td key={dob} className={tdclassName}>{dob}</td>
                        <td key={stud_class_name} className={tdclassName}>{stud_class_name}</td>
                        <td key={"options"} className={tdclassName}>
                            <button className="bg-teal-600 hover:bg-teal-800 text-white font-bold py-1 px-3 rounded" type="button" disabled={viewButtonDisabled} onClick={(e) => {viewStudent(e,{'id':id,'name':name,'stud_class_name':stud_class_name,'dob':dob,'register_no':register_no})}}>
                                View
                            </button>

                        </td>
                    </tr>
                }
            )
            )
        }

    }

    const getTopButtons = () => {
        if(userType==='admin')
        {
            setTopButtons(
                <div>
                    <button className="bg-teal-600 hover:bg-teal-800 text-white font-bold py-1 px-3 rounded m-1" onClick={getStudents}>Refresh</button>
                    <button className='bg-teal-600 hover:bg-teal-800 text-white font-bold py-1 px-3 rounded' disabled={createButtonDisabled} onClick={createStudent}>Create</button>
                </div>
            )
        }
        else
        {
            setTopButtons(
                <button className="bg-teal-600 hover:bg-teal-800 text-white font-bold py-1 px-3 rounded m-1" onClick={getStudents}>Refresh</button>
            )
        }
    }

    const [tableclassName,settableClassName] = useState("min-w-full min-w-full divide-y divide-gray-200 table-auto dark:divide-gray-700 ")

    const thclassName = "py-2 px-4 text-sm font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-200";
    const tdclassName = "py-1 px-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white";
    const theadclassName = "bg-gray-100 dark:bg-stone-900"
    const tbodyclassName = "bg-grey-100 divide-y divide-gray-200 dark:bg-stone-800 dark:divide-gray-700"
    const tdtrclassName = "hover:bg-gray-100 dark:hover:bg-gray-700";

    {/*<div className="tb-width">
    <table className='table table-layout:auto table-hover table-striped'>*/}

    useLayoutEffect(()=>{
        getUserTypeAndStudClassName();
        getStudents();


        //getStudClass();
    },[])

    useEffect(()=>{
        getTopButtons();

    },[userType])

    useEffect(()=>{
        if(loadingState === true)
        {
            disableAllButtons();
        }
        else
        {
            enableAllButtons();
        }

    },[loadingState])

    useEffect(()=>{
        getTBodyComponent();
        getTopButtons();
        //getAllStudClasses();
    }
    ,[createButtonDisabled,createComponent,students])





    return(

    <div>
        <br/>
        <div className="fixed z-50  m-44 ml-96 bg-transparent">
            <FadeLoader className="" loading={loadingState} size={20} color={'teal'}/>
        </div>
        {topButtons}

        <div className="m-2 flex flex-col">
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <div className="min-w-fit align-middle">


            {componentCreateEditView}
            
                <div className="overflow-hidden "></div>
        <table className={tableclassName}> 
            <thead className={theadclassName}>
            <tr>
                <th className={thclassName} scope='col'>SL_NO</th>
                <th className={thclassName} scope='col'>Name</th>
                <th className={thclassName} scope='col'>Register No</th>
                <th className={thclassName} scope='col'>Date of Birth</th>
                <th className={thclassName} scope='col'>Class</th>
                <th className={thclassName} scope='col'>Options</th>
            </tr>
            </thead>
            <tbody className={tbodyclassName}>
                {tBodyComponent}
            </tbody>
        </table>
        </div>
            </div>
        </div>

    </div>

        )

}


export default Students;