import { useLayoutEffect } from "react";
import {React,useState,useEffect} from "react";
import axios from "axios";
//import 'bootstrap/dist/css/bootstrap.css'
import '../css/students.css'
import Teachers from "./teachers";
import { axiosInstance } from "./axiosinstance";

function Students(props){

    const [students,setStudents] = useState([])
    const [studClasses,setStudClasses] = useState([])
    const [studClassName, setStudClassName] = useState('');
    const [userType,setUserType] = useState('')

    const [editComponent,setEditComponent] = useState([])
    const [createComponent,setCreateComponent] = useState([])
    const [createButtonDisabled,setCreateButtonDisabled] = useState(false);

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
    const getAllStudClasses = async() => {
        let data = [];
        await axiosInstance
        .get('studclass/retrieve/')
        .then(res => {
            data = res.data;
            setStudClasses(data)

            //console.log(data)
        })
        .catch(err => {
            console.log(err);
        })
    }

    const resetTableOpacity = () => {
        settableClassName(tableclassName.replace('opacity-80',''))
    }

    const createStudentSave = (e,new_data) => {
        e.preventDefault();
        setCreateButtonDisabled(false);
        resetTableOpacity();
        console.log(new_data)
        let form_data = new FormData();
        form_data.append('name',new_data['name']);
        form_data.append('stud_class_name',new_data['stud_class_name']);
        axiosInstance
        .post('student/create/',form_data)
        .then(res=>{
            getStudents();
            console.log(res.data)
        })
        .catch(err => {
            console.log(err);
        })
        setCreateComponent([]);
    }

    const createStudent = (e) => {
        e.preventDefault();
        setCreateButtonDisabled(true);
        settableClassName(tableclassName+"opacity-80");
        getAllStudClasses();
        let new_data = {'name':'','stud_class_name':''};

        setCreateComponent(
            <div className='create_form m-2 bg-gray-700 rounded'>
                <h2 className='rounded text-green-600 text-3xl font-bold'>Create Student</h2>
                <br/>
                <label className="text-white text-sm font-bold mb-2 m-2">Name:</label>
                <input  type="text" id='student_name' className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight " onChange={(e)=>{new_data['name']=e.target.value}} />
                <br/>
                <label className="text-white text-sm font-bold mb-2 m-2">Class:</label>
                <select id='student_class' className="border rounded py-1 px-1 text-gray-700 leading-tight " onChange={(e)=>{new_data['stud_class_name']=e.target.value;}}>
                    <option value={''}></option>
                    {
                        studClasses.map( ({stud_class_name}) => {
                            return (
                                <option value={stud_class_name}>{stud_class_name}</option>
                            )
                        }
                    )
                    }
                </select>
                <br/>
                <label className="text-white text-sm font-bold mb-2 m-2">Subject:</label>
                <input  type="text" id='teachername' className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight " onChange={(e)=>{new_data['subject']= e.target.value}} />
                <br/>
                <br/>
                <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded'type="button" onClick={(e)=> {createStudentSave(e,new_data)} }>Save</button> 
                <button className='bg-red-800 text-white py-1 px-3 shadow appearance-none border rounded'type="button" onClick={()=> {resetTableOpacity(); setCreateComponent([]); setCreateButtonDisabled(false);
}}>Cancel</button> 

            </div>
        )
    }

    const [tableclassName,settableClassName] = useState("min-w-full divide-y divide-gray-200 table-auto dark:divide-gray-700 ")


    const thclassName = "py-2 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400";
    const tdclassName = "py-2 px-3 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white";
    const theadclassName = "bg-gray-100 dark:bg-gray-700"
    const tbodyclassName = "bg-grey-100 divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
    const tdtrclassName = "hover:bg-gray-100 dark:hover:bg-gray-700";

    {/*<div className="tb-width">
    <table className='table table-layout:auto table-hover table-striped'>*/}

    useLayoutEffect(()=>{
        getUserTypeAndStudClassName();
        //getStudClass();
    },[])

    useEffect(()=>{
        getStudents();
        getAllStudClasses();
    }
    ,[createButtonDisabled])

    if(userType==='admin')
    {
        return(



        <div className="m-5 flex flex-col">
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded" onClick={getStudents}>Refresh</button>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded' disabled={createButtonDisabled} onClick={createStudent}>Create</button>

            <div className="min-w-fit align-middle">
            {createComponent}{/*editComponent*/}
                <div className="overflow-hidden "></div>
        <table className={tableclassName}> 
            <thead className={theadclassName}>
            <tr>
                <th className={thclassName} scope='col'>SL_NO</th>
                <th className={thclassName} scope='col'>Name</th>
                <th className={thclassName} scope='col'>DOB</th>
                <th className={thclassName} scope='col'>Options</th>
            </tr>
            </thead>
            <tbody className={tbodyclassName}>
            {students.map(function ( {id,sl_no,name,dob}){
                console.log(students.length)
                return <tr key={id} className={tdtrclassName}>
                    <td key={sl_no} className={tdclassName}>{sl_no}</td>
                    <td key={name} className={tdclassName}>{name}</td>
                    <td key={dob} className={tdclassName}>{dob}</td>
                    <td key={"options"} className={tdclassName}><button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded" type="button">Edit</button></td>
                </tr>
        }
        )
        }
        </tbody>
        </table>
        </div>
            </div>
        </div>



        )
    }
    else
    {
        
        return(
            <div className="m-5 flex flex-col">
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded" onClick={getStudents}>Refresh</button>
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden "></div>
            <table className={tableclassName}> 
                <thead className={theadclassName}>
                <tr>
                    <th className={thclassName} scope='col'>SL_NO</th>
                    <th className={thclassName} scope='col'>Name</th>
                    <th className={thclassName} scope='col'>DOB</th>
                    <th className={thclassName} scope='col'>Options</th>
                </tr>
                </thead>
                <tbody className={tbodyclassName}>
                {students.map(function ( {id,sl_no,name,dob}){
                console.log(students.length)
                return <tr key={id} className={tdtrclassName}>
                    <td key={sl_no} className={tdclassName}>{sl_no}</td>
                    <td key={name} className={tdclassName}>{name}</td>
                    <td key={dob} className={tdclassName}>{dob}</td>
                        <td className={tdclassName}><button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded" type="button">View</button></td>
                    </tr>
            }
            )
            }
            </tbody>
            </table>
            </div>
                </div>
            </div>
        )
    }
}


export default Students;