import {React,useLayoutEffect,useState} from "react";
import { axiosInstance } from "../axiosinstance";

function CreateTeacher(props){

    const [newData,setNewData] = useState({'name':'', 'email':'', 'subject':''});


    const createTeacherSave = async(e) => {

        e.preventDefault();
        console.log(newData)
        let form_data = new FormData();
        form_data.append('name',newData['name']);
        form_data.append('email',newData['email']);
        form_data.append('username',newData['email']) //Set email as the username
        form_data.append('subject',newData['subject']);
        await axiosInstance
        .post('teacher/create/',form_data)
        .then(res=>{
            //alert("New Teacher created succesfully. Login details have been sent to the teacher's mail address")
            props.func();
            console.log(res.data)
        })
        .catch(err => {
            alert("Couldn't create the teacher. Maybe a teacher with same email already exists?")

            console.log(err);
        })
         //hide the create component by calling parent function effectsAfterComponentDisabled


    }

    const createTeacherCancel = (e) => {
        e.preventDefault();
        props.func();
    }

    return(

        <div className='create_form m-2 bg-gray-800 rounded'>
            <h2 className='rounded text-teal-500 text-3xl font-bold'>Create Teacher</h2>
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
            <label className="text-white text-sm font-bold mb-2 m-2">Subject:</label>
            <input  type="text" id='teachername' className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight " onChange={
                    (e)=>{setNewData(prevState => ({
                        ...prevState, ['subject']:e.target.value
                })
                )
                }} />
            <br/>
            <br/>
            <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded'type="button" onClick={(e)=> {createTeacherSave(e)} }>Save</button> 
            <button className='bg-red-800 text-white py-1 px-3 shadow appearance-none border rounded'type="button" onClick={(e)=> {createTeacherCancel(e)}}>Cancel</button> 

        </div>
    )
}

export default CreateTeacher;