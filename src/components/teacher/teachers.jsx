import {React,useLayoutEffect,useState,useEffect} from "react";
import { axiosInstance } from "../axiosinstance";
import CreateTeacher from "./createteacher";
import EditTeacher from "./editteacher";
function Teachers(){

    const [teachers,setTeachers] = useState([])
    const [editButtonDisabled,setEditButtonDisabled] = useState(false)
    const [deleteButtonDisabled,setDeleteButonDisabled] = useState(false)
    const [componentCreateEdit,setComponentCreateEdit] = useState([])
    const [createButtonDisabled,setCreateButtonDisabled] = useState(false);


    const resetTableOpacity = () => {
        settableClassName(tableclassName.replace('opacity-80',''))
    }
    
    const getTeachers = async() => {
        setTeachers([])
        console.log(teachers.length)
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

    const effectsAfterCreateEditComponentDisabled = (save_or_cancel) => {
        if(save_or_cancel==='save')
        {
            getTeachers();
        }
        resetTableOpacity();
        setComponentCreateEdit([]);
        setEditButtonDisabled(false);
        setCreateButtonDisabled(false);
        setDeleteButonDisabled(false)
    }

    const createTeacher = (e) => {
        e.preventDefault();
        setCreateButtonDisabled(true);
        settableClassName(tableclassName+"opacity-80");
        setEditButtonDisabled(true);
        setDeleteButonDisabled(true)
        setComponentCreateEdit(
            <CreateTeacher ondone={effectsAfterCreateEditComponentDisabled}/>
        )
    }

    const editTeacher = (e,teacher_data) => {
        e.preventDefault();
        console.log(teacher_data)
        setCreateButtonDisabled(true);
        setEditButtonDisabled(true);
        setDeleteButonDisabled(true)
        settableClassName(tableclassName+"opacity-80");
        setComponentCreateEdit(
            <EditTeacher ondone={effectsAfterCreateEditComponentDisabled} data={teacher_data} />
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
    const thclassName = "py-2 px-4 text-sm font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-200";
    const tdclassName = "py-1 px-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white";
    const theadclassName = "bg-gray-100 dark:bg-stone-900"
    const tbodyclassName = "bg-grey-100 divide-y divide-gray-200 dark:bg-stone-800 dark:divide-gray-700"
    const tdtrclassName = "hover:bg-gray-100 dark:hover:bg-gray-700";

    useEffect(()=>{
        getTeachers();
    },[])


    return(
    <div>
        <br/>
        <button className='bg-teal-600 hover:bg-teal-800 text-white font-bold py-1 px-3 rounded m-1' disabled={createButtonDisabled} onClick={createTeacher}>Create</button>
            <div className="m-2 flex flex-col">
                <div className="overflow-x-auto shadow-md sm:rounded-lg">
                    <div className=" min-w-fit align-middle">
                    {componentCreateEdit}
                        <div className="overflow-hidden "></div>
                <table className={tableclassName}> 
                    <thead className={theadclassName}>
                    <tr>
                        <th className={thclassName} scope='col'>SL_NO</th>
                        <th className={thclassName} scope='col'>Name</th>
                        <th className={thclassName} scope='col'>Class</th>
                        <th className={thclassName} scope='col'>Username</th>
                        <th className={thclassName} scope='col'>Options</th>

                    </tr>
                    </thead>
                    <tbody className={tbodyclassName}>
                    {teachers.map( ( {id,sl_no,name,stud_class_name,username}) => {
                return <tr key={id} className={tdtrclassName}>
                            <td key={sl_no} className={tdclassName}>{sl_no}</td>
                            <td key={name} className={tdclassName}>{name}</td>
                            <td key={stud_class_name} className={tdclassName}>{stud_class_name}</td>
                            <td key={username} className={tdclassName}>{username}</td>
                            <td key={"options"} className={tdclassName}>
                                <button className="bg-teal-600 hover:bg-teal-800 text-white font-bold py-1 px-3 rounded mr-1.5" disabled={editButtonDisabled} onClick={(e)=>editTeacher(e,{'username':username,'name':name})} type="button">
                                    Edit
                                </button>

                                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded" disabled={deleteButtonDisabled} onClick={(e)=>deleteTeacher(e,{'id':id})} type="button">
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