import { useLayoutEffect } from "react";
import {React,useState,useEffect} from "react";
import { axiosInstance } from "../axiosinstance";
import TimeTable from "./timetable";


function ManageClass(props){

    const [newData,setNewData] = useState(props.data)
    const [studClassName,setStudClassName] = useState(props.data['stud_class_name'])
    const [teachers,setTeachers] = useState([])
    const [saveButtonDisabled,setSaveButtonDisabled] = useState(false)
    const [currentTimeTable,setCurrentTimeTable] = useState({'Monday':{0:'',1:'',2:'',3:'',4:''},'Tuesday':{0:'',1:'',2:'',3:'',4:''},'Wednesday':{0:'',1:'',2:'',3:'',4:''},'Thursday':{0:'',1:'',2:'',3:'',4:''},'Friday':{0:'',1:'',2:'',3:'',4:''}} )
    const [timeTableWithSubjectNames,setTimeTableWithSubjectNames] = useState({'Monday':[],'Tuesday':[],'Wednesday':[],'Thursday':[],'Friday':[]})
    const [timetable,setTimeTable] = useState({});
    const [timeTableComponent,setTimeTableComponent] = useState([]);

    const getAllTeachersWithoutClass = async() => {
        await axiosInstance
        .get('studclass/manage/teacher/retrieve')
        .then(res=>{
            console.log(res.data)
            setTeachers(res.data)
        })
    }

    const manageClassCancel = () => {
        props.ondone('cancel');
    } 

    const manageClassSave = () => {

        let form_data = new FormData();
        console.log(timetable)
        form_data.append('new_timetable',JSON.stringify(timetable));
        form_data.append("stud_class_name",studClassName);
        form_data.append('is_lab',newData['is_lab'])
        form_data.append('teacher_id',newData['teacher'])
        axiosInstance
        .post('studclass/manage/',form_data)
        .then(res=>{
            props.ondone('save');
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const getCurrentTimeTable = async() => {
        let form_data = new FormData()
        form_data.append("stud_class_name",studClassName);
        await axiosInstance
        .post('timetable/retrieve/',form_data)
        .then(res=>{
            setTimeTableComponent(
                <TimeTable stud_class_name={studClassName} on_set_new_time_table={getNewTimeTableFromChild} timetable={res.data[0]} timetable_with_subs={res.data[1]} />
            )
            setTimeTable(res.data[0])
            setCurrentTimeTable(res.data[0]);
            setTimeTableWithSubjectNames(res.data[1]);
        })
        .catch(err=>{
            console.log(err)
        })

    }


    const getNewTimeTableFromChild = (new_timetable) => {
        setTimeTable(new_timetable);

    }

    useLayoutEffect(()=>{
        getCurrentTimeTable();
    },[])

    useEffect(()=>{
        getAllTeachersWithoutClass();
        console.log(newData)
    },[])
    return(
        <div className='fixed z-40 max-w-full w-3/4 max-h-full h-2/3 m-2 bg-stone-900 rounded'>
            
            <h2 className='rounded text-teal-500 text-3xl font-bold m-3 bg-opacity-95'>Manage Class</h2>
            {timeTableComponent}
            {/* <TimeTable stud_class_name={studClassName} on_set_new_time_table={getNewTimeTableFromChild} timetable={currentTimeTable} timetable_with_subs={timeTableWithSubjectNames} /> */}
            <br/>
            <label className="text-white text-sm font-bold mb-2 m-2">Name:</label>
            <input  type="text" defaultValue={newData['stud_class_name']} className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight " onChange={
                        (e)=>{setNewData(prevState => ({
                            ...prevState, ['stud_class_name']:e.target.value
                    })
                    )
                    }} 
                />
            <br/>
            <label className="text-white text-sm font-bold mb-2 m-2">Teacher:</label>
            <select id='teachers' className="border rounded py-1 px-1 text-gray-700 leading-tight " defaultValue={newData['teacher']} onChange={(e)=>{setNewData(prevState => ({
                ...prevState, ['teacher']:e.target.value
        })
        )
        }} >
            <option value={newData['teacher']} key={newData['teacher']}>{newData['teacher_name']}</option>
            <option value={''} key={''}></option>
            {
                teachers.map( ({teacher,teacher_name}) => {
                    //This is done to prevent duplicate teachers
                    if(teacher!==newData['teacher'])
                    {
                    return (
                        <option value={teacher} key={teacher}>{teacher_name}</option>
                    )
                    }
                }
            )
            }
        </select>
        <label className="text-white text-sm font-bold mb-2 m-2">Is Lab:</label>
        <input  type="checkbox" checked={newData['is_lab']} className=" border rounded py-1 px-1 text-gray-700 leading-tight " onChange={
                        (e)=>{setNewData(prevState => ({
                            ...prevState, ['is_lab']:e.target.checked
                    })
                    )
                    }} 
                />
            <br/>
            <br/>
            <br/>
            <button className='bg-blue-600 text-white py-1 px-3 ml-10 shadow appearance-none border rounded' disabled={saveButtonDisabled} type="button" onClick={(e)=> {manageClassSave(e)} }>Save</button>

            <button className='bg-red-800 text-white py-1 px-3 ml-2 shadow appearance-none border rounded'type="button" onClick={(e)=> {manageClassCancel(e)}}>Cancel</button>  
            {/* <div className="m-2">
                <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded'type="button" onClick={(e)=> {editTeacherSave(e)} }>Save</button> 
                <button className='bg-red-800 text-white py-1 px-3 shadow appearance-none border rounded'type="button" onClick={editTeacherCancel}>Cancel</button> 
            </div> */}
        </div>
    )
}

export default ManageClass;