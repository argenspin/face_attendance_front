import {React,useLayoutEffect,useState,useEffect} from "react";
import axios from 'axios'

import { axiosInstance } from "../axiosinstance";
import CreateTeacher from "./createteacher";
import EditTeacher from "./editteacher";
function Teachers(){

    const [accessValid,setAccessValid] = useState(true);
    const [teachers,setTeachers] = useState([])
    
    const [studClassName,setStudClassName] = useState('')
    const [studClassTeacher,setStudClassTeacher] = useState('')

    const [editComponent,setEditComponent] = useState([])
    const [editButtonDisabled,setEditButtonDisabled] = useState(false)

    const [createComponent,setCreateComponent] = useState([])
    const [createButtonDisabled,setCreateButtonDisabled] = useState(false);


    const resetTableOpacity = () => {
        settableClassName(tableclassName.replace('opacity-80',''))
    }
    
    const getTeachers = async() => {
        setTeachers([])
        //let showTeachersTemp = !showTeachers;
        //setShowTeachers(showTeachersTemp);
        console.log(teachers.length)
        //if(teachers.length===0)
        //{
            await axiosInstance
            .get('teacher/retrieve/')
            .then(res=> {
                let data = res.data;
                let k=1;
                for(let i=0;i<data.length;i++)
                {
                    data[i].sl_no = k++;
                    console.log(data[i].sl_no)
                }
                setTeachers((data))
            })
            .catch(error => {
                console.log(error);
            })
    }

    const effectsAfterCreateComponentDisabled = (save_or_cancel) => {
        if(save_or_cancel==='save')
        {
            getTeachers();
        }
        resetTableOpacity();
        setCreateComponent([]);
        setCreateButtonDisabled(false);
    }

    const effectsAfterEditComponentDisabled = (save_or_cancel) => {
        if(save_or_cancel==='save')
        {
            getTeachers();
        }
        resetTableOpacity();
        setEditComponent([]);
        setEditButtonDisabled(false);
        setCreateButtonDisabled(false);
    }


    const createTeacher = (e) => {
        e.preventDefault();
        setCreateButtonDisabled(true);
        settableClassName(tableclassName+"opacity-80");

        setCreateComponent(
            <CreateTeacher func={effectsAfterCreateComponentDisabled}/>
        )
    }

    //const [teacherEditData,setteacherEditData] = useState({});


    const editTeacher = (e,teacher_data) => {
        e.preventDefault();
        console.log(teacher_data)
        setCreateButtonDisabled(true);
        setEditButtonDisabled(true);
        settableClassName(tableclassName+"opacity-80");
        setEditComponent(
            <EditTeacher func={effectsAfterEditComponentDisabled} data={teacher_data} />
            )
    }

    const deleteTeacher = (e,delete_data) => {
        e.preventDefault();
        axiosInstance
        .delete('teacher/delete/',{headers:{
            id: delete_data['id']
        }
        })
        .then(res=>{
            console.log("deleted successfully");
            getTeachers();
        })
        .catch(err => {
            if(err.response.status==403)
            {
                alert("An admin cannot be deleted by another admin")
            }
        })

    }





    const [tableclassName,settableClassName] = useState("min-w-full min-w-full divide-y divide-gray-200 table-auto dark:divide-gray-700 ")


    const thclassName = "py-2 px-4 text-sm font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400";
    const tdclassName = "py-1 px-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white";
    const theadclassName = "bg-gray-100 dark:bg-gray-700"
    const tbodyclassName = "bg-grey-100 divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
    const tdtrclassName = "hover:bg-gray-100 dark:hover:bg-gray-700";

    useEffect(()=>{
        getTeachers();
    },[])


    return(
    <div>
        <br/>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded m-1' disabled={createButtonDisabled} onClick={createTeacher}>Create</button>
            <div className="m-2 flex flex-col">
                <div className="overflow-x-auto shadow-md sm:rounded-lg">
                    <div className=" min-w-fit align-middle">
                    {createComponent}{editComponent}
                        <div className="overflow-hidden "></div>
                <table className={tableclassName}> 
                    <thead className={theadclassName}>
                    <tr>
                        <th className={thclassName} scope='col'>SL_NO</th>
                        <th className={thclassName} scope='col'>Name</th>
                        <th className={thclassName} scope='col'>Subject</th>
                        <th className={thclassName} scope='col'>Username</th>
                        <th className={thclassName} scope='col'>Options</th>

                    </tr>
                    </thead>
                    <tbody className={tbodyclassName}>
                    {teachers.map( ( {id,sl_no,name,subject,username}) => {
                return <tr key={id} className={tdtrclassName}>
                            <td key={sl_no} className={tdclassName}>{sl_no}</td>
                            <td key={name} className={tdclassName}>{name}</td>
                            <td key={subject} className={tdclassName}>{subject}</td>
                            <td key={username} className={tdclassName}>{username}</td>
                            <td key={"options"} className={tdclassName}>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded" disabled={editButtonDisabled} onClick={(e)=>editTeacher(e,{'username':username,'name':name,'subject':subject})} type="button">
                                    Edit
                                </button>
                                &nbsp;&nbsp;
                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded" onClick={(e)=>deleteTeacher(e,{'id':id})} type="button">
                                    Delete
                                </button>
                            </td>
                        </tr>
                }
                )
                }
                </tbody>
                </table>
                </div>
                    </div>
                </div>

        </div>
    )
}

export default Teachers;