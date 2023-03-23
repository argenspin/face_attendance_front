import axios from "axios";
import {React,useEffect,useLayoutEffect,useState} from "react";
import { axiosInstance } from "../axiosinstance";

function EditTimeTable(props){

    const [subjects,setSubjects] = useState([])
    const [studClassName,setStudClassName] = useState(props.stud_class_name)
    const [saveButtonComponent,setSaveButtonComponent] = useState([])
    const [editButtonDisabled,setEditButtonDisabled] = useState(false)

    const [currentTimeTable,setCurrentTimeTable] = useState(props.timetable)
    const [timeTableWithSubjectNames,setTimeTableWithSubjectNames] = useState(props.time_table_with_subject_names);

    const [editTableComponent,setEditTableComponent] = useState([])
    const [viewTableComponent,setViewTableComponent] = useState([])

    const [tableComponent,setTableComponent] = useState([])

    const previousTimeTable = props.timetable

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


    // const saveTimeTable = async(time_table_with_subject_names) => {
    //     console.log(time_table_with_subject_names)
    //     let form_data = new FormData();
    //     console.log(currentTimeTable)
    //     form_data.append('timetable',JSON.stringify(currentTimeTable));
    //     await axiosInstance
    //     .post('timetable/retrieve/subjectnames/',form_data)
    //     .then(res=>{
    //         setTimeTableWithSubjectNames(res.data);
    //         console.log(res.data)
    //         setEditButtonDisabled(false);
    //         setEditTableComponent([])
    //         setSaveButtonComponent([])
    //         props.on_set_new_time_table(currentTimeTable);
    //         // getViewTableComponent(res.data);
    //     })
    //     .catch(err=>{
    //         console.log(err)
    //     })


    // }

    useLayoutEffect(()=>{
        getStudClassSubjects();
    },[])

    return(
        <div className="text-white"  style={{ minWidth: '250px', maxWidth: '250px', marginRight: '550px' }}>
            <table className="table text-white table-fixed border-separate border-spacing-2 border border-neutral-50" style={{'width':'750px'}}>
                
            <thead>
                <tr className="text-red-400 text-lg">
                        <th className="text-green-500">
                            Day
                        </th>
                        <th>
                            Period I
                        </th>
                        <th>
                        Period II
                        </th>
                        <th>
                        Period III
                        </th>
                        <th>
                        Period IV
                        </th>
                        <th>
                        Period V                
                        </th>
                    </tr>
                </thead>
           
            <tbody>
            {Object.keys(currentTimeTable).map((day)=>{
                    return(
                        <tr className="text-xs">
                            <td className="font-bold text-lg capitalize dark:text-yellow-300">{day}</td>
                            {Object.keys(currentTimeTable[day]).map((id,index)=>{
                                return(
                                <td>
                                    <select className="border rounded leading-tight font-bold bg-white text-black w-28 h-5 px-0 py-0" id="edit_table" defaultValue={timeTableWithSubjectNames[day][index]}
                                        onChange={(e)=>{
                                            setCurrentTimeTable(prevState=>({
                                            ...prevState, [day]:{...prevState[day], [index]:parseInt(e.target.value)
                                            }
                                        }
                                        )
                                        );
                                        // update subjectnames when new subject is selected
                                        let selected_sub_id = e.target.value;
                                        let selected_sub_obj = [...subjects].find(item => item.id === parseInt(selected_sub_id))
                                        let temp_array = [...timeTableWithSubjectNames[day]];
                                        temp_array[id] = selected_sub_obj.name
                                        setTimeTableWithSubjectNames(prevState=>({
                                            ...prevState, [day]: temp_array
                                        }));
                                    }
                                    }
                                    >
                                    <option value={id} key={id}>{timeTableWithSubjectNames[day][index]}</option>
                                    {subjects.map(({id,name } )=>{
                                        if(timeTableWithSubjectNames[day][index] != name)
                                        {
                                            return(
                                                <option value={id} key={id}>{name}</option>
                                            )
                                        }
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
                </tbody>
            </table>
            <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded' type="button" onClick={(e)=>{props.on_save(currentTimeTable,timeTableWithSubjectNames)}}>Save</button>

        </div>
    )

}

export default EditTimeTable;