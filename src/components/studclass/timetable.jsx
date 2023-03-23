// import axios from "axios";
// import {React,useEffect,useLayoutEffect,useState} from "react";
// import { axiosInstance } from "../axiosinstance";

// function TimeTable(props){

//     const [subjects,setSubjects] = useState([])
//     const [studClassName,setStudClassName] = useState(props.stud_class_name)
//     const [saveButtonComponent,setSaveButtonComponent] = useState([])
//     const [editButtonDisabled,setEditButtonDisabled] = useState(false)

//     const [currentTimeTable,setCurrentTimeTable] = useState(props.timetable)
//     const [timeTableWithSubjectNames,setTimeTableWithSubjectNames] = useState(props.timetable_with_subnames);

//     const [editTableComponent,setEditTableComponent] = useState([])
//     const [viewTableComponent,setViewTableComponent] = useState([])

//     const [tableComponent,setTableComponent] = useState([])

//     // const getViewTableComponent = (timetable_with_sub_names) => {
//     //     setViewTableComponent(
//     //         <>
//     //         {Object.keys(timetable_with_sub_names).map((day,i)=>{
//     //                 return(
//     //                     <tr className="">
//     //                         <td className="font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-200">{day}</td>
//     //                         {timetable_with_sub_names[day].map((subject_name)=>{
//     //                             return(
//     //                             <td className="font-normal text-sm text-gray-900 dark:text-white">{subject_name}</td>
//     //                             )
//     //                         }
                            
//     //                         )
                            
//     //                         }
//     //                     </tr>

//     //                     )
//     //         })
//     //         }


//     //         </>
//     //     )
//     // }


//     const getStudClassSubjects = async() => {
//         let form_data = new FormData()
//         form_data.append("stud_class_name",studClassName);
//         await axiosInstance
//         .post('classsubjects/retrieve/',form_data)
//         .then(res=>{
//             setSubjects(res.data);
//         })
//         .catch(err=>{
//             console.log(err)
//         })
//     }

//     const getEditTableComponent = () => {
//         // console.log(timeTableWithSubjectNames['Monday'][0])
//         setViewTableComponent([])
//         let time_table_with_subject_names = {...timeTableWithSubjectNames};
//         setEditButtonDisabled(true);
//         setEditTableComponent(
//             <div>
//             {Object.keys(currentTimeTable).map((day)=>{
//                     return(
//                         <tr className="text-xs">
//                             <td className="font-bold text-sm">{day}</td>
//                             {Object.keys(currentTimeTable[day]).map((id,index)=>{
//                                 return(
//                                 <td>
//                                     <select className="border rounded leading-tight font-bold text-black w-20 px-0 py-0" id="edit_table" defaultValue={timeTableWithSubjectNames[day][index]}
//                                         onChange={(e)=>{
//                                             setCurrentTimeTable(prevState=>({
//                                             ...prevState, [day]:{...prevState[day], [index]:parseInt(e.target.value)
//                                             }
//                                         }
//                                         )
//                                         );
//                                         let selected_sub_id = e.target.value;
//                                         let selected_sub_obj = [...subjects].find(item => item.id === parseInt(selected_sub_id))
//                                         let temp_array = [...time_table_with_subject_names[day]];
//                                         temp_array[id] = selected_sub_obj.name
//                                         time_table_with_subject_names[day] = temp_array
//                                         console.log(time_table_with_subject_names[day])
//                                         // console.log(temp_array)
//                                         // console.log(timeTableWithSubjectNames[day])
//                                         // setTimeTableWithSubjectNames(prevState=>({
//                                         //     ...prevState, [day]: [temp_array]
//                                         // }));
//                                     }
//                                     }
//                                     >
//                                     <option value={id} key={id}>{timeTableWithSubjectNames[day][index]}</option>
//                                     {subjects.map(({id,name } )=>{
//                                         if(timeTableWithSubjectNames[day][index] != name)
//                                         {
//                                             return(
//                                                 <option value={id} key={id}>{name}</option>
//                                             )
//                                         }
//                                     })}
                                    
//                                     </select>
//                                 </td>
//                                 )
//                             }
//                             )
//                         }
//                         </tr>
//                 )
//                     }
//             )
//                 }
//             </div>
    
//         )
//         setSaveButtonComponent(
//         <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded' type="button" onClick={(e)=>{saveTimeTable(time_table_with_subject_names)}}>Save</button>
//         )

//     }

//     const saveTimeTable = async(time_table_with_subject_names) => {
//         console.log(time_table_with_subject_names)
//         let form_data = new FormData();
//         console.log(currentTimeTable)
//         form_data.append('timetable',JSON.stringify(currentTimeTable));
//         await axiosInstance
//         .post('timetable/retrieve/subjectnames/',form_data)
//         .then(res=>{
//             setTimeTableWithSubjectNames(res.data);
//             console.log(res.data)
//             setEditButtonDisabled(false);
//             setEditTableComponent([])
//             setSaveButtonComponent([])
//             props.on_set_new_time_table(currentTimeTable);
//             // getViewTableComponent(res.data);
//         })
//         .catch(err=>{
//             console.log(err)
//         })


//     }


//     useEffect(()=>{
//         getStudClassSubjects();
//         // getViewTableComponent(timeTableWithSubjectNames);
//         // getTimeTableComponent();
//     },[])


//     return(
//         <div className="text-white float-right"  style={{ minWidth: '250px', maxWidth: '250px', marginRight: '480px' }}>
//             <button className='bg-blue-600 text-white py-1 px-3 shadow appearance-none border rounded mb-2' type="button" onClick={getEditTableComponent} disabled={editButtonDisabled}>Edit</button> 
//             <table className="table text-white table-fixed border-separate border-spacing-2 border border-neutral-50" style={{'width':'700px'}}>
//                 {/* <tr className="">
//                     <th>
//                         Day
//                     </th>
//                     <th>
//                         I
//                     </th>
//                     <th>
//                         II
//                     </th>
//                     <th>
//                         III
//                     </th>
//                     <th>
//                         IV
//                     </th>
//                     <th>
//                         V                
//                     </th>
//                 </tr> */}
//                 {editTableComponent}{viewTableComponent}
//             </table>
//             {saveButtonComponent}
//         </div>
//     )
// }

// export default TimeTable;