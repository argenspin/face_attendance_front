import {React,useLayoutEffect,useState,useEffect} from "react";
import axios from 'axios'

import { axiosInstance } from "./axiosinstance";
function Teachers(){

    const [accessValid,setAccessValid] = useState(true);
    const [teachers,setTeachers] = useState([])
    const [name,setName] = useState('');
    const [subject,setSubject] = useState('');   
    
    const [studClassName,setStudClassName] = useState('')
    const [studClassTeacher,setStudClassTeacher] = useState('')

    const [editComponent,setEditComponent] = useState([])

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
            let access_token = localStorage.getItem('access')
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

    const createTeacherSave = (e,new_data) => {
        e.preventDefault();
        setCreateButtonDisabled(false);
        resetTableOpacity();
        console.log(new_data)
        let form_data = new FormData();
        form_data.append('name',new_data['name']);
        form_data.append('email',new_data['email']);
        form_data.append('username',new_data['email']) //Set email as the username
        form_data.append('subject',new_data['subject']);
        axiosInstance
        .post('teacher/create/',form_data)
        .then(res => {
            getTeachers();
            console.log(res)
        })
        .catch(error => {
            console.log(error)
        })
        //setCreateComponent([])

    }

    const createTeacher = (e) => {
        e.preventDefault();
        setCreateButtonDisabled(true);
        settableClassName(tableclassName+"opacity-80");
        let new_data = {'name':'','subject':''}

        setCreateComponent(
            <div className='create_form m-2 bg-gray-700 rounded bg-opacity-90'>
                <h2 className='rounded text-green-600 text-3xl font-bold'>Create Teacher</h2>
                <br/>
                <label className="text-white text-sm font-bold mb-2 m-2">Name:</label>
                <input  type="text" id='teachername' className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight " onChange={(e)=>{new_data['name']=e.target.value}} />
                <br/>
                <label className="text-white text-sm font-bold mb-2 m-2">Email:</label>
                <input  type="email" id='teacherfirstname' className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight " onChange={(e)=>{new_data['email']=e.target.value;}} />
                <br/>
                <label className="text-white text-sm font-bold mb-2 m-2">Subject:</label>
                <input  type="text" id='teachername' className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight " onChange={(e)=>{new_data['subject']= e.target.value}} />
                <br/>
                <br/>
                <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded'type="button" onClick={(e)=> {createTeacherSave(e,new_data)} }>Save</button> 
                <button className='bg-red-800 text-white py-1 px-3 shadow appearance-none border rounded'type="button" onClick={()=> {resetTableOpacity(); setCreateComponent([]); setCreateButtonDisabled(false);
}}>Cancel</button> 

            </div>
        )
    }

    //const [teacherEditData,setteacherEditData] = useState({});

    const editTeacherSave = async(e,edited_data) => {
        e.preventDefault();
        console.log(edited_data);
        let form_data = new FormData();
        form_data.append('id',edited_data['id']);
        form_data.append('name',edited_data['name']);
        form_data.append('subject',edited_data['subject'])
        await axiosInstance
        .post('teacher/edit/',form_data)
        .then(res=> {
            getTeachers();
        })
        .catch(err=>{
            console.log(err);
        })

        resetTableOpacity();
        setEditComponent([]);
    }

    const editTeacher = (e,data) => {
        e.preventDefault();
        //console.log(data['name']+" : "+data['subject'])
        settableClassName(tableclassName+"opacity-80");
        let edited_data = data;
        edited_data['id'] = parseInt(edited_data['id']);
        console.log(edited_data);
        setEditComponent(
            <div className='edit_form m-2 bg-gray-700 rounded '>
                <h2 className='rounded text-green-600 text-3xl font-bold m-3 bg-opacity-95'>Edit Teacher</h2>
                <br/>
                <label for='teachername' className="text-white text-sm font-bold mb-2 m-2">Name:</label>
                <input  type="text" defaultValue={data['name']} id='teachername' className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight " onChange={(e)=>{edited_data['name']=e.target.value}} />
                <br/>
                <label for='teachername' className="text-white text-sm font-bold mb-2 m-2">Subject:</label>
                <input  type="text" defaultValue={data['subject']} id='teachername' className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight " onChange={(e)=>{edited_data['subject']= e.target.value}} />
                <br/>
                <br/>
                <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded'type="button" onClick={(e)=> {editTeacherSave(e,edited_data)} }>Save</button> 
                <button className='bg-red-800 text-white py-1 px-3 shadow appearance-none border rounded'type="button" onClick={()=> {resetTableOpacity(); setEditComponent([])}}>Cancel</button> 

            </div>
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





    const [tableclassName,settableClassName] = useState("min-w-full divide-y divide-gray-200 table-auto dark:divide-gray-700 ")


    const thclassName = "py-2 px-6 text-sm font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400";
    const tdclassName = "py-1 px-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white";
    const theadclassName = "bg-gray-100 dark:bg-gray-700"
    const tbodyclassName = "bg-grey-100 divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
    const tdtrclassName = "hover:bg-gray-100 dark:hover:bg-gray-700";

    useEffect(()=>{
        getTeachers();
    },[])


    return(
    <div>
       {/* 
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded' onClick={getTeachers}>Show teachers</button>
        <br/>
        */}
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
                        <th className={thclassName} scope='col'>Options</th>

                    </tr>
                    </thead>
                    <tbody className={tbodyclassName}>
                    {teachers.map( ( {id,sl_no,name,username}) => {
                return <tr key={id} className={tdtrclassName}>
                            <td key={sl_no} className={tdclassName}>{sl_no}</td>
                            <td key={name} className={tdclassName}>{name}</td>
                            <td key={username} className={tdclassName}>{username}</td>
                            <td key={"options"} className={tdclassName}>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded" onClick={(e)=>editTeacher(e,{'id':id,'name':name,'subject':subject})} type="button">
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