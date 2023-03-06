import React, { useEffect, useState } from "react";
import { axiosInstance } from "../axiosinstance";
import CreateSubject from "./createsubject";
import EditSubject from "./editsubject";

function Subjects(){
    const [subjects,setSubjects] = useState([])
    const [createButtonDisabled,setCreateButtonDisabled] = useState(false)
    const [editButtonDisabled,setEditButtonDisabled] = useState(false)

    const [componentCreateEdit,setComponentCreateEdit] = useState([])

    const [tableclassName,settableClassName] = useState("min-w-full min-w-full divide-y divide-gray-200 table-auto dark:divide-gray-700 ")

    const thclassName = "py-2 px-4 text-sm font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-200";
    const tdclassName = "py-1 px-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white";
    const theadclassName = "bg-gray-100 dark:bg-stone-900"
    const tbodyclassName = "bg-grey-100 divide-y divide-gray-200 dark:bg-stone-800 dark:divide-gray-700"
    const tdtrclassName = "hover:bg-gray-100 dark:hover:bg-gray-700";

    const createSubject = () => {
        setCreateButtonDisabled(true);
        setEditButtonDisabled(true);
        setComponentCreateEdit(
            <CreateSubject ondone={effectsAfterCreateEditComponentDisabled} /> 
        )
    }

    const editSubject = (subject_data) => {
        setCreateButtonDisabled(true);
        setEditButtonDisabled(true);
        setComponentCreateEdit(
            <EditSubject data={subject_data} ondone={effectsAfterCreateEditComponentDisabled}/>
        )
    
    }

    const effectsAfterCreateEditComponentDisabled = () => {
        setCreateButtonDisabled(false);
        setEditButtonDisabled(false);
        setComponentCreateEdit([])

    }

    const getAllSubjects = () => {
        axiosInstance
        .get('classsubjects/retrieve/')
        .then(res=>{
            let data = res.data;
            let k=1;
            for(let i=0;i<data.length;i++)
            {
                data[i].sl_no = k++;
                console.log(data[i].sl_no)
            }
            setSubjects(data)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    useEffect(()=>{
        getAllSubjects();
    },[createButtonDisabled])

    return(
        <div>
        <br/>
        <button className='bg-teal-600 hover:bg-teal-800 text-white font-bold py-1 px-3 rounded m-1' disabled={createButtonDisabled} onClick={createSubject}>Create</button> 
            <div className="m-2 flex flex-col">
                <div className="overflow-x-auto shadow-md sm:rounded-lg">
                    <div className=" min-w-fit align-middle">
                    {componentCreateEdit}
                        <div className="overflow-hidden "></div>
                <table className={tableclassName}> 
                    <thead className={theadclassName}>
                    <tr>
                        <th className={thclassName} scope='col'>SL_NO</th>
                        <th className={thclassName} scope='col'>Subject Name</th>
                        <th className={thclassName} scope='col'>Class</th>
                        <th className={thclassName} scope='col'>Lab</th>
                        <th className={thclassName} scope='col'>Options</th>
                    </tr>
                    </thead>
                    <tbody className={tbodyclassName}>
                        {/* here teacher is the id of the teacher */}
                        {subjects.map( ( {id,sl_no,name,stud_class_name,is_lab,lab_name}) => {
                            return <tr key={id} className={tdtrclassName}>
                                    <td key={sl_no} className={tdclassName}>{sl_no}</td>
                                    <td key={name} className={tdclassName}>{name}</td>
                                    {/* <td key={teacher} className={tdclassName}>{teacher}</td> */}
                                    <td key={stud_class_name} className={tdclassName}>{stud_class_name}</td>
                                    <td key={lab_name} className={tdclassName}>{lab_name}</td>
                                    <td key={"options"} className={tdclassName}>
                                        <button className="bg-teal-600 hover:bg-teal-800 text-white font-bold py-1 px-3 rounded mr-1.5" disabled={editButtonDisabled} type="button"
                                            onClick={()=>{
                                                editSubject({'id':id,'name':name,'stud_class_name':stud_class_name,'lab_name':lab_name,'is_lab':is_lab})
                                            }}
                                        >
                                            Edit
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

export default Subjects