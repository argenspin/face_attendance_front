import { useLayoutEffect } from "react";
import {React,useState,useEffect} from "react";
import axios from "axios";
//import 'bootstrap/dist/css/bootstrap.css'
import { axiosInstance } from "../axiosinstance";
import FaceCapture from "./facecapture";
import CreateStudent from "./createstudent";
import EditStudent from "./editstudent";

function Students(props)
{
    const [students,setStudents] = useState([])
    const [studClasses,setStudClasses] = useState([])
    const [studClassName, setStudClassName] = useState('');
    const [userType,setUserType] = useState('')

    const [editComponent,setEditComponent] = useState([])
    const [createComponent,setCreateComponent] = useState([])
    const [createButtonDisabled,setCreateButtonDisabled] = useState(false);
    const [editButtonDisabled,setEditButtonDisabled] = useState(false);

    const [tBodyComponent,setTBodyComponent] = useState([])
    const [topButtons,setTopButtons] = useState([])

    const effectsAfterCreateComponentDisabled = (save_or_cancel) => {
        if(save_or_cancel==='save')
        {
            getStudents();
        }
        setEditButtonDisabled(false);
        setCreateButtonDisabled(false);
        setCreateComponent([]);
        resetTableOpacity();
    }

    const effectsAfterEditComponentDisabled = (save_or_cancel) => {
        if(save_or_cancel==='save')
        {
            getStudents();
        }
        setEditButtonDisabled(false);
        setCreateButtonDisabled(false);
        setEditComponent([]);
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


    const getStudents = () => {
        setStudents([])
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

    const createStudent = (e) => {
        e.preventDefault();
        setEditButtonDisabled(true);
        setCreateButtonDisabled(true);
        settableClassName(tableclassName+"opacity-80");
        setCreateComponent(
            <CreateStudent show={true} func={effectsAfterCreateComponentDisabled} usertype = {userType}/>
        )
    }

    const editStudent = (e,student_data) => {
        e.preventDefault();
        setEditButtonDisabled(true);
        setCreateButtonDisabled(true);
        settableClassName(tableclassName+"opacity-80");
        setEditComponent(
            <EditStudent func={effectsAfterEditComponentDisabled} data={student_data} usertype = {userType}/>
        )

    }

    const viewStudent = (e,student_data) => {
        e.preventDefault();
        setEditButtonDisabled(true);
        setCreateButtonDisabled(true);
        settableClassName(tableclassName+"opacity-80");
        setEditComponent(
            <EditStudent func={effectsAfterEditComponentDisabled} data={student_data} usertype = {userType}/>
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
                students.map(function ( {id,sl_no,name,stud_class_name,dob,face_photo_b64}){
                    console.log(students.length)
                    return <tr key={id} className={tdtrclassName}>
                        <td key={sl_no} className={tdclassName}>{sl_no}</td>
                        <td key={name} className={tdclassName}>{name}</td>
                        <td key={stud_class_name} className={tdclassName}>{stud_class_name}</td>
                        <td key={dob} className={tdclassName}>{dob}</td>
                        <td key={"options"} className={tdclassName}>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded" type="button" disabled={editButtonDisabled} onClick={(e) => {editStudent(e,{'id':id,'name':name,'stud_class_name':stud_class_name,'dob':dob,'face_photo_b64':face_photo_b64})}}>
                    Edit
                </button>
                &nbsp;&nbsp;
                <button className="bg-red-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded" type="button" disabled={editButtonDisabled} onClick={(e) => {deleteStudent(e,id)} }>
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
                students.map(function ( {id,sl_no,name,stud_class_name,dob,face_photo_b64}){
                    console.log(students.length)
                    return <tr key={id} className={tdtrclassName}>
                        <td key={sl_no} className={tdclassName}>{sl_no}</td>
                        <td key={name} className={tdclassName}>{name}</td>
                        <td key={stud_class_name} className={tdclassName}>{stud_class_name}</td>
                        <td key={dob} className={tdclassName}>{dob}</td>
                        <td key={"options"} className={tdclassName}>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded" type="button" disabled={editButtonDisabled} onClick={(e) => {viewStudent(e,{'id':id,'name':name,'stud_class_name':stud_class_name,'dob':dob,'face_photo_b64':face_photo_b64})}}>
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
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded m-1" onClick={getStudents}>Refresh</button>
                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded' disabled={createButtonDisabled} onClick={createStudent}>Create</button>
                </div>
            )
        }
        else
        {
            setTopButtons(
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded m-1" onClick={getStudents}>Refresh</button>
            )
        }
    }

    const [tableclassName,settableClassName] = useState("min-w-full min-w-full divide-y divide-gray-200 table-auto dark:divide-gray-700 ")

    const thclassName = "py-2 px-4 text-sm font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400";
    const tdclassName = "py-1 px-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white";
    const theadclassName = "bg-gray-100 dark:bg-gray-700"
    const tbodyclassName = "bg-grey-100 divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
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
        getTBodyComponent();

        //getAllStudClasses();
    }
    ,[createButtonDisabled,createComponent,students])





    return(

    <div>
        <br/>
        {topButtons}

        <div className="m-2 flex flex-col">
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <div className="min-w-fit align-middle">
            {createComponent}{editComponent}
                <div className="overflow-hidden "></div>
        <table className={tableclassName}> 
            <thead className={theadclassName}>
            <tr>
                <th className={thclassName} scope='col'>SL_NO</th>
                <th className={thclassName} scope='col'>Name</th>
                <th className={thclassName} scope='col'>Class</th>
                <th className={thclassName} scope='col'>DOB</th>
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