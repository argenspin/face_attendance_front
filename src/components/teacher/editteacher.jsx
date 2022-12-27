import {React,useLayoutEffect,useState} from "react";
import { axiosInstance } from "../axiosinstance";

function EditTeacher(props){

    const [newData,setNewData] = useState({'username':props.data['username'],'name':props.data['name'], 'subject':props.data['subject']});


    const editTeacherSave = async(e) => {

        e.preventDefault();
        console.log(newData)
        let form_data = new FormData();
        form_data.append('username',newData['username'])
        form_data.append('name',newData['name']);
        form_data.append('subject',newData['subject']);
        await axiosInstance
        .post('teacher/edit/',form_data)
        .then(res=>{
            //alert("New Teacher created succesfully. Login details have been sent to the teacher's mail address")
            props.func('save');
            console.log(res.data)
        })
        .catch(err => {
            console.log(err);
        })
         //hide the create component by calling parent function effectsAfterComponentDisabled


    }

    const editTeacherCancel = (e) => {
        e.preventDefault();
        props.func('cancel');
    }
    return(
        <div className='edit_form m-2 bg-gray-800 rounded '>
            <h2 className='rounded text-teal-500 text-3xl font-bold m-3 bg-opacity-95'>Edit Teacher</h2>
            <br/>
            <label className="text-white text-sm font-bold mb-2 m-2">Name:</label>
            <input  type="text" defaultValue={newData['name']} className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight " onChange={
                        (e)=>{setNewData(prevState => ({
                            ...prevState, ['name']:e.target.value
                    })
                    )
                    }} 
                />
            <br/>
            <label className="text-white text-sm font-bold mb-2 m-2">Subject:</label>
            <input  type="text" defaultValue={newData['subject']} className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight " onChange={
                        (e)=>{setNewData(prevState => ({
                            ...prevState, ['subject']:e.target.value
                    })
                    )
                    }} 
                />
            <br/>
            <br/>
            <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded'type="button" onClick={(e)=> {editTeacherSave(e)} }>Save</button> 
            <button className='bg-red-800 text-white py-1 px-3 shadow appearance-none border rounded'type="button" onClick={editTeacherCancel}>Cancel</button> 
        </div>
    )
}

export default EditTeacher;

