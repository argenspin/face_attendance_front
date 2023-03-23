import { useLayoutEffect } from "react";
import {React,useState,useEffect} from "react";
import { axiosInstance } from "../axiosinstance";


function CreateBatch(props){

    const [newData,setNewData] = useState({'batch_name':'','is_lab':false,'id':''})


    const createBatchSave = () => {
        let form_data = new FormData()
        form_data.append('batch_name',newData['batch_name'])
        axiosInstance
        .post('academicbatch/create/',form_data)
        .then(res=>{
            props.ondone('save')
        })
        .catch(err=>{
            alert(err)
        })
    }

    const createBatchCancel = () => {
        props.ondone('cancel')
    }


    return(
        <div className='fixed z-40 max-w-full w-2/4 max-h-full h-2/5 m-2 rounded bg-stone-900 '>
            <h2 className='rounded text-teal-500 text-3xl font-bold m-3 bg-opacity-95'>Create Batch</h2>
            <br/>
            <label className="text-white text-sm font-bold mb-2 m-2">Batch Name:</label>
            <input  type="text" className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight " onChange={
                        (e)=>{setNewData(prevState => ({
                            ...prevState, ['batch_name']:e.target.value
                    })
                    )
                    }} 
                />

            <br/>
            <br/>
            <div className="m-2">
                <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded'type="button" onClick={(e)=> {createBatchSave(e)} }>Save</button> 
                <button className='bg-red-800 text-white py-1 px-3 shadow appearance-none border rounded'type="button" onClick={createBatchCancel}>Cancel</button> 
            </div>
        </div>
    )
}

export default CreateBatch;