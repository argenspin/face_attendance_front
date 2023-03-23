import { useLayoutEffect } from "react";
import {React,useState,useEffect} from "react";
import { axiosInstance } from "../axiosinstance";
import EditTimeTable from "./edittimetable";
import TimeTable from "./timetable";
import ViewTimeTable from "./viewtimetable";


function ManageClass(props){

    const [newData,setNewData] = useState(props.data)
    const [studClassName,setStudClassName] = useState(props.data['stud_class_name'])
    const [teachers,setTeachers] = useState([])
    const [saveButtonDisabled,setSaveButtonDisabled] = useState(false)
    const [currentTimeTable,setCurrentTimeTable] = useState({'Monday':{0:'',1:'',2:'',3:'',4:''},'Tuesday':{0:'',1:'',2:'',3:'',4:''},'Wednesday':{0:'',1:'',2:'',3:'',4:''},'Thursday':{0:'',1:'',2:'',3:'',4:''},'Friday':{0:'',1:'',2:'',3:'',4:''}} )
    const [timeTableWithSubjectNames,setTimeTableWithSubjectNames] = useState({'Monday':[],'Tuesday':[],'Wednesday':[],'Thursday':[],'Friday':[]})
    const [timetable,setTimeTable] = useState({});
    const [timeTableComponent,setTimeTableComponent] = useState([]);
    const [currentStudClassName,setCurrentStudClassName] = useState(props.data['stud_class_name'])

    const [batches,setBatches] = useState([]);

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
        // form_data.append('current_stud_class_name',currentStudClassName)
        form_data.append('current_batch',newData['current_batch'])
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

            setTimeTable(res.data[0])
            setCurrentTimeTable(res.data[0]);
            setTimeTableWithSubjectNames(res.data[1]);
            getViewTimeTableComponent(res.data[1]);
        })
        .catch(err=>{
            console.log(err)
        })

    }

    const saveTimeTable = (new_time_table,time_table_with_subject_names) => {
        console.log(time_table_with_subject_names)
        let form_data = new FormData();
        console.log(currentTimeTable)
        setTimeTable(new_time_table)
        getViewTimeTableComponent(time_table_with_subject_names)
        setTimeTableWithSubjectNames(time_table_with_subject_names);

    }

    const getViewTimeTableComponent = (time_table_with_subject_names) => {
        setTimeTableComponent(
            <ViewTimeTable time_table_with_subject_names={time_table_with_subject_names} />
        )
    }

    const getEditTimeTableComponent = () => {
        setTimeTableComponent(
        <EditTimeTable stud_class_name={studClassName} on_save={saveTimeTable} timetable={timetable} time_table_with_subject_names={timeTableWithSubjectNames} />
        )
    }

    useLayoutEffect(()=>{
        getCurrentTimeTable();
        getAllBatches();
    },[])


    useEffect(()=>{
        getAllTeachersWithoutClass();
        // getViewTimeTableComponent(timeTableWithSubjectNames);
        console.log(newData)
    },[])
    return(
        <div className='fixed z-40 max-w-full w-3/4 max-h-full h-4/5 m-2 bg-stone-900 rounded'>
            
            <h2 className='rounded text-teal-500 text-3xl font-bold m-3 bg-opacity-95'>Manage Class</h2>
            <div className="float-right">
                <button className='bg-blue-600 text-white py-1 px-3 shadow appearance-none border rounded mb-2' type="button" onClick={getEditTimeTableComponent}>Edit</button> 
                {timeTableComponent}
            </div>
            {/* <TimeTable stud_class_name={studClassName} on_set_new_time_table={getNewTimeTableFromChild} timetable={currentTimeTable} timetable_with_subs={timeTableWithSubjectNames} /> */}
            <br/>
            <label className="text-white text-sm font-bold mb-4 m-2">Name:</label>
            <label className=" shadow appearance-none rounded py-1 px-1 text-white ">{studClassName}</label>
            {/* <input  type="text" defaultValue={newData['stud_class_name']} className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight " onChange={
                        (e)=>{setNewData(prevState => ({
                            ...prevState, ['stud_class_name']:e.target.value
                    })
                    )
                    }} 
                /> */}
            <br/>
            <label className="text-white text-sm font-bold mb-4 m-2">Current Batch:</label>
            <select id='student_class' className="border rounded py-1 px-1 text-gray-700 leading-tight " defaultValue={newData['current_batch']} onChange={(e)=>{setNewData(prevState => ({
                    ...prevState, ['current_batch']:e.target.value
            })
            )
            }} >
                <option value={newData['current_batch']} key={newData['current_batch']}>{newData['batch_name']}</option>
                {
                    batches.map( ({id,batch_name}) => {
                        if(id!==newData['current_batch'])
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
            <label className="text-white text-sm font-bold mb-4 m-2">Teacher:</label>
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
        <br/>
        <label className="text-white text-sm font-bold mb-4 m-2">Is Lab:</label>
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
            <div class="mt-16">
            <button className='bg-blue-600 text-white py-1 px-3 ml-10 shadow appearance-none border rounded' disabled={saveButtonDisabled} type="button" onClick={(e)=> {manageClassSave(e)} }>Save</button>

            <button className='bg-red-800 text-white py-1 px-3 ml-2 shadow appearance-none border rounded'type="button" onClick={(e)=> {manageClassCancel(e)}}>Cancel</button>  
            </div>
        </div>
    )
}

export default ManageClass;