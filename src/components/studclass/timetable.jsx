import axios from "axios";
import {React,useEffect,useLayoutEffect,useState} from "react";
import { axiosInstance } from "../axiosinstance";

function TimeTable(props){

    const [subjects,setSubjects] = useState([])
    const [studClassName,setStudClassName] = useState(props.stud_class_name)
    const [saveButtonComponent,setSaveButtonComponent] = useState([])
    const [editButtonDisabled,setEditButtonDisabled] = useState(false)

    const [currentTimeTable,setCurrentTimeTable] = useState(props.timetable)
    const [timeTableWithSubjectNames,setTimeTableWithSubjectNames] = useState(props.timetable_with_subs);

    const [editTableComponent,setEditTableComponent] = useState([])
    const [viewTableComponent,setViewTableComponent] = useState([])

    const [tableComponent,setTableComponent] = useState([])

    // const getTimeTableComponent = () => {
    //     setTableComponent(
    //         <>
    //         {Object.keys(currentTimeTable).map((day,i)=>{
    //                 return(
    //                     <tr>
    //                         <td className="font-bold">{day}</td>
    //                         {Object.keys(currentTimeTable[day]).map((id,i)=>{
    //                             return(
    //                             <td>{currentTimeTable[day][id]}</td>
    //                             )
    //                         }
    //                         )
    //                     }
    //                     </tr>
    //             )
    //                 }
    //         )
    //             }

    //         </>
    //     )
    // }

    const getViewTableComponent = (timetable) => {
        setViewTableComponent(
            <>
            {Object.keys(timetable).map((day,i)=>{
                    return(
                        <tr className="w-32">
                            <td className="font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-200">{day}</td>
                            {timetable[day].map((subject_name)=>{
                                return(
                                <td className="font-normal text-xs text-gray-900 whitespace-nowrap dark:text-white">{subject_name}</td>
                                )
                            }
                            
                            )
                            
                            }
                        </tr>

                        )
            })
            }


            </>
        )
    }


    const getStudClassSubjects = async() => {
        let form_data = new FormData()
        form_data.append("stud_class_name",studClassName);
        await axiosInstance
        .post('classsubjects/retrieve/',form_data)
        .then(res=>{
            setSubjects(res.data);
        })
        .catch(err=>{
            console.log(err)
        })
    }

    // const getCurrentTimeTable = async() => {
    //     let form_data = new FormData()
    //     form_data.append("stud_class_name",studClassName);
    //     await axiosInstance
    //     .post('timetable/retrieve/',form_data)
    //     .then(res=>{
    //         setCurrentTimeTable(res.data[0]);
    //         setTimeTableWithSubjectNames(res.data[1]);
    //     })
    //     .catch(err=>{
    //         console.log(err)
    //     })

    // }

    const getEditTableComponent = () => {
        console.log(currentTimeTable)
        setViewTableComponent([])
        setEditButtonDisabled(true);
        setEditTableComponent(
            <div>
            {Object.keys(currentTimeTable).map((day,i)=>{
                    return(
                        <tr className="text-xs">
                            <td className="font-bold text-sm">{day}</td>
                            {Object.keys(currentTimeTable[day]).map((id,i)=>{
                                return(
                                <td>
                                    <select className="border rounded leading-tight font-bold text-black w-20 px-0 py-0" id="edit_table" defaultValue={currentTimeTable[day][id]} 
                                        onChange={(e)=>{
                                            setCurrentTimeTable(prevState=>({
                                            ...prevState, [day]:{...prevState[day], [i]:parseInt(e.target.value)
                                            }
                                        }
                                        )
                                        )
                                    }
                                    }
                                    >
                                    <option value={id} key={id}>{currentTimeTable[day][id]}</option>
                                    {subjects.map(({id,name } )=>{
                                        return(
                                            <option value={id} key={id}>{name}</option>
                                        )
                                    })}
                                    
                                    </select>
                                </td>
                                )
                            }
                            )
                        }
                        </tr>
                )
                    }
            )
                }
            </div>
    
        )
        setSaveButtonComponent(
        <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded' type="button" onClick={(e)=>{saveTimeTable()}}>Save</button>
        )

    }

    const saveTimeTable = async() => {
        let form_data = new FormData();
        console.log(currentTimeTable)
        form_data.append('timetable',JSON.stringify(currentTimeTable));
        await axiosInstance
        .post('timetable/retrieve/subjectnames/',form_data)
        .then(res=>{
            setTimeTableWithSubjectNames(res.data);
            console.log(res.data)
            setEditButtonDisabled(false);
            setEditTableComponent([])
            setSaveButtonComponent([])
            props.on_set_new_time_table(currentTimeTable);
            // getViewTableComponent(res.data);
        })
        .catch(err=>{
            console.log(err)
        })


    }

    // useLayoutEffect(()=>{
    //     getCurrentTimeTable();
    // },[])


    useEffect(()=>{
        getStudClassSubjects();
        getViewTableComponent(timeTableWithSubjectNames);
        // getTimeTableComponent();
    },[])

    useEffect(()=>{
        getViewTableComponent(timeTableWithSubjectNames);
    },[timeTableWithSubjectNames])


    // useEffect(()=>{
    //     props.on_set_new_time_table(currentTimeTable);
    // },[currentTimeTable])

    return(
        <div className="text-white float-right"  style={{ minWidth: '250px', maxWidth: '250px', marginRight: '480px' }}>
            <button className='bg-blue-600 text-white py-1 px-3 shadow appearance-none border rounded mb-2' type="button" onClick={getEditTableComponent} disabled={editButtonDisabled}>Edit</button> 
            <table className="table text-white table-auto border-separate border-spacing-2 border border-neutral-50">
                {/* <tr className="">
                    <th>
                        Day
                    </th>
                    <th>
                        I
                    </th>
                    <th>
                        II
                    </th>
                    <th>
                        III
                    </th>
                    <th>
                        IV
                    </th>
                    <th>
                        V                
                    </th>
                </tr> */}
                {editTableComponent}{viewTableComponent}
            </table>
            {saveButtonComponent}
        </div>
    )
}

export default TimeTable;