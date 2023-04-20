import {React,useLayoutEffect,useState} from "react";
import { axiosInstance } from "../axiosinstance";

function EditTeacher(props){

    const [newData,setNewData] = useState({'username':props.data['username'],'name':props.data['name']});


    const editTeacherSave = async(e) => {

        e.preventDefault();
        console.log(newData)
        let form_data = new FormData();
        form_data.append('username',newData['username'])
        form_data.append('name',newData['name']);
        await axiosInstance
        .post('teacher/edit/',form_data)
        .then(res=>{
            props.ondone('save');
            console.log(res.data)
        })
        .catch(err => {
            console.log(err);
        })

    }

    const editTeacherCancel = (e) => {
        e.preventDefault();
        props.ondone('cancel');
    }
    return(
        <div className='fixed z-40 max-w-full w-2/4 max-h-full h-2/5 m-2 rounded bg-stone-900 '>
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
            <br/>
            <br/>
            <div className="m-2">
                <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded'type="button" onClick={(e)=> {editTeacherSave(e)} }>Save</button> 
                <button className='bg-red-800 text-white py-1 px-3 shadow appearance-none border rounded'type="button" onClick={editTeacherCancel}>Cancel</button> 
            </div>
        </div>
    )
}

export default EditTeacher;

