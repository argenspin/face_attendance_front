import { useLayoutEffect } from "react";
import {React,useState,useEffect} from "react";
import { axiosInstance } from "../axiosinstance";


function CreateClass(props){

    const [newData,setNewData] = useState({'stud_class_name':'','teacher':'','is_lab':false})

    const createClassSave = () => {
        let form_data = new FormData()
        form_data.append('stud_class_name',newData['stud_class_name'])
        form_data.append('teacher','') //By default when creating a studclass do not assign any teachers. This line is to make sure the serializer is valid
        form_data.append('is_lab',newData['is_lab'])
        axiosInstance
        .post('studclass/create/',form_data)
        .then(res=>{
            props.ondone('save')
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const createClassCancel = () => {
        props.ondone('cancel')
    }

    return(
        <div className='fixed z-40 max-w-full w-2/4 max-h-full h-2/5 m-2 rounded bg-stone-900 '>
            <h2 className='rounded text-teal-500 text-3xl font-bold m-3 bg-opacity-95'>Create Class</h2>
            <br/>
            <label className="text-white text-sm font-bold mb-2 m-2">Class Name:</label>
            <input  type="text" defaultValue={newData['name']} className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight " onChange={
                        (e)=>{setNewData(prevState => ({
                            ...prevState, ['stud_class_name']:e.target.value
                    })
                    )
                    }} 
                />
            {/* <br/>
            <label className="text-white text-sm font-bold mb-2 m-2">Subject:</label>
            <input  type="text" defaultValue={newData['subject']} className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight " onChange={
                        (e)=>{setNewData(prevState => ({
                            ...prevState, ['subject']:e.target.value
                    })
                    )
                    }} 
                /> */}
            <br/>
            <label className="text-white text-sm font-bold mb-2 m-2">Is Lab</label>
            <input  type="checkbox" checked={newData['is_lab']} className=" border rounded py-1 px-1 text-gray-700 leading-tight " onChange={
                        (e)=>{setNewData(prevState => ({
                            ...prevState, ['is_lab']:e.target.checked
                    })
                    )
                    }} 
                />
            <br/>
            <br/>
            <div className="m-2">
                <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded'type="button" onClick={(e)=> {createClassSave(e)} }>Save</button> 
                <button className='bg-red-800 text-white py-1 px-3 shadow appearance-none border rounded'type="button" onClick={createClassCancel}>Cancel</button> 
            </div>
        </div>
    )
}

export default CreateClass;