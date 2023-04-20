import {React,useLayoutEffect,useState} from "react";
import { axiosInstance } from "../axiosinstance";

function CreateTeacher(props){

    const [newData,setNewData] = useState({'name':'', 'email':''});


    const createTeacherSave = async(e) => {

        e.preventDefault();
        if(validateForm())
        {
            console.log(newData)
            let form_data = new FormData();
            form_data.append('name',newData['name']);
            form_data.append('email',newData['email']);
            form_data.append('username',newData['email']) //Set email as the username
            await axiosInstance
            .post('teacher/create/',form_data)
            .then(res=>{
                props.ondone('save');
                console.log(res.data)
            })
            .catch(err => {
                alert("Couldn't create the teacher. Maybe a teacher with same email already exists?")

                console.log(err);
            })
        }

    }

    const validateForm = () => {
        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newData['email'])))
        {
            alert("Invalid Email address!")
            return false;
        }
        else if(newData['name']==='' || newData['email']==='')
        {
            alert('fields cannot be empty')
            return false;
        }
        return true
    }

    const createTeacherCancel = (e) => {
        e.preventDefault();
        props.ondone('cancel');
    }

    return(

        <div className='fixed z-40 max-w-full w-2/4 max-h-full h-2/5 m-2 bg-stone-900 rounded'>
            <h2 className='rounded text-teal-500 text-3xl font-bold m-2'>Create Teacher</h2>
            <br/>
            <label className="text-white text-sm font-bold mb-2 m-2">Name:</label>
            <input  type="text" id='teachername' className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight " onChange={
                    (e)=>{setNewData(prevState => ({
                        ...prevState, ['name']:e.target.value
                })
                )
                }} />
            <br/>
            <label className="text-white text-sm font-bold mb-2 m-2">Email:</label>
            <input  type="email" id='teacherfirstname' className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight " onChange={
                    (e)=>{setNewData(prevState => ({
                        ...prevState, ['email']:e.target.value
                })
                )
                }} />
            <br/>
            <br/>
            <br/>
            <div className="m-2">
                <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded'type="button" onClick={(e)=> {createTeacherSave(e)} }>Save</button> 
                <button className='bg-red-800 text-white py-1 px-3 shadow appearance-none border rounded'type="button" onClick={(e)=> {createTeacherCancel(e)}}>Cancel</button> 
            </div>
        </div>
    )
}

export default CreateTeacher;