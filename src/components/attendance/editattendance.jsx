import React, { useState } from "react";
import { axiosInstance } from "../axiosinstance";

function EditAttendance(props){

    const [newData,setNewData] = useState(props.data);

    const editAttendanceSave = () => {
        let form_data = new FormData();
        form_data.append('id',newData['id'])
        form_data.append('subject1_att',newData['subject1_att'])
        form_data.append('subject2_att',newData['subject2_att'])
        form_data.append('subject3_att',newData['subject3_att'])
        form_data.append('subject4_att',newData['subject4_att'])
        form_data.append('subject5_att',newData['subject5_att'])

        axiosInstance
        .post('attendance/edit/',form_data)
        .then(res=>{
            props.ondone('save')
        })
        .catch(err=>{
            console.log(err)
        })

    }

    const editAttendanceCancel = () => {
        props.ondone('cancel')
    }
    return(
        <div>
            <div className='fixed z-40 max-w-full w-3/4 max-h-full h-4/5 m-2 bg-stone-900 rounded'>
                <h2 className='rounded text-teal-500 text-3xl font-bold m-2'>View Attendance</h2>
                <br/>
                <br/>
                <div className="inline">
                    <label className="text-white text-md font-bold mb-2 m-2 ">Name:</label>
                    <label className=" shadow appearance-none rounded py-1 pr-2 text-white whitespace-nowrap">{newData['student_name']}</label>
                </div>
                <div className='ml-52 inline-block'> 
                    <label className="text-white text-sm font-bold mb-2 m-2">Subject 1:</label>
                <input  type="checkbox" className=" border rounded py-1 px-1 text-gray-700 leading-tight " defaultChecked={newData['subject1_att']} onChange={
                                (e)=>{setNewData(prevState => ({
                                    ...prevState, ['subject1_att']:e.target.checked
                            })
                            )
                            }} 
                        /><label className={newData['subject1_att']?'text-green-700': 'text-red-700'}>{newData['subject1_att']? 'Present':'Absent'} </label>
                    
                    <label className="text-white text-sm font-bold m-2 mb-2">Subject 2:</label>
                <input  type="checkbox" className=" border rounded py-1 px-1 text-gray-700 leading-tight " defaultChecked={newData['subject2_att']} onChange={
                                (e)=>{setNewData(prevState => ({
                                    ...prevState, ['subject2_att']:e.target.checked
                            })
                            )
                            }} 
                        /><label className={newData['subject2_att']?'text-green-700': 'text-red-700'}>{newData['subject2_att']? 'Present':'Absent'} </label>
                    
                    
                    <label className="text-white text-sm font-bold m-2 mb-2">Subject 3:</label>
                <input  type="checkbox" className=" border rounded py-1 px-1 text-gray-700 leading-tight " defaultChecked={newData['subject3_att']} onChange={
                                (e)=>{setNewData(prevState => ({
                                    ...prevState, ['subject3_att']:e.target.checked
                            })
                            )
                            }} 
                        /><label className={newData['subject3_att']?'text-green-700': 'text-red-700'}>{newData['subject3_att']? 'Present':'Absent'} </label>
                    
                    <br/>
                    <label className="text-white text-sm font-bold m-2 mb-2">Subject 4:</label>
                <input  type="checkbox" className=" border rounded py-1 px-1 text-gray-700 leading-tight " defaultChecked={newData['subject4_att']} onChange={
                                (e)=>{setNewData(prevState => ({
                                    ...prevState, ['subject4_att']:e.target.checked
                            })
                            )
                            }} 
                        /><label className={newData['subject4_att']?'text-green-700': 'text-red-700'}>{newData['subject4_att']? 'Present':'Absent'} </label>

                    <label className="text-white text-sm font-bold m-2 mb-2">Subject 5:</label>
                <input  type="checkbox" className=" border rounded py-1 px-1 text-gray-700 leading-tight " defaultChecked={newData['subject5_att']} onChange={
                                (e)=>{setNewData(prevState => ({
                                    ...prevState, ['subject5_att']:e.target.checked
                            })
                            )
                            }} 
                        /><label className={newData['subject5_att']?'text-green-700': 'text-red-700'}>{newData['subject5_att']? 'Present':'Absent'} </label>
                    
                    
                </div>
                <div>
                    <label className="text-white text-md font-bold mb-2 m-2 whitespace-nowrap">Date:</label>
                    <label className=" shadow appearance-none rounded py-1 pr-2 text-white whitespace-nowrap ">{newData['date']}</label>
                </div>
                <div>
                    <label className="text-white text-md font-bold mb-2 m-2 whitespace-nowrap">Register No:</label>
                    <label className=" shadow appearance-none rounded py-1 pr-2 text-white whitespace-nowrap ">{newData['register_no']}</label>
                </div>
                <div>
                    <label className="text-white text-md font-bold mb-2 m-2">Class:</label>
                    <label className=" shadow appearance-none rounded py-1 pr-2 text-white ">{newData['stud_class_name']}</label>
                </div>
                <div>
                    <label className="text-white text-md font-bold mb-2 m-2">Batch:</label>
                    <label className=" shadow appearance-none rounded py-1 pr-2 text-white whitespace-nowrap">{newData['batch_name']}</label>
                </div>

            <br/>
                <div className="m-2">
                    <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded'type="button" onClick={(e)=> {editAttendanceSave(e)} }>Save</button> 
                    <button className='bg-red-800 text-white py-1 px-3 shadow appearance-none border rounded'type="button" onClick={editAttendanceCancel}>Cancel</button> 
                </div>
            </div>
        </div>
        )
}

export default EditAttendance;