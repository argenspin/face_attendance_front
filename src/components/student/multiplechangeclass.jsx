import React, { useEffect, useLayoutEffect, useState } from "react";
import { axiosInstance } from "../axiosinstance";

function MultipleChangeClass(props){
    const [studClassName,setStudClassName] = useState('');
    const [studClasses,setStudClasses] = useState([]);
    const selected_ids = props.selected_ids;

    axiosInstance.defaults.timeout = 30000

    const getAllStudClasses = async() => {
        let data = [];
        await axiosInstance
        .get('studclass/retrieve/')
        .then(res => {
            data = res.data;
            setStudClasses(data)
        })
        .catch(err => {
            console.log(err);
        })
    }

    const transferMultipleStudentsToAnotherClass = (e) => {
        e.preventDefault();
        props.start_loading_animation()
        let form_data = new FormData()
        form_data.append('stud_class_name',studClassName)
        form_data.append('student_ids',JSON.stringify(selected_ids))
        axiosInstance
        .post('students/update/studclasses/',form_data)
        .then(res=>{
            props.stop_loading_animation()
            console.log(res)
            props.ondone();
        })
        .catch(err=>{
            props.stop_loading_animation()
            console.log(err)
        })
    }

    useLayoutEffect(()=>{
        getAllStudClasses();
    },[])

    return (
        <div className='fixed z-40 max-w-md w-2/4 max-h-full h-2/5 m-2 rounded bg-stone-900 '>
            <h2 className='rounded text-teal-500 text-3xl font-bold m-3 bg-opacity-95'>Select Class</h2>
            <br/>
            <form>
            <label className="text-white text-sm font-bold mb-2 m-2">Class: </label>
            <select id='student_class' className="border rounded py-1 px-1 text-gray-700 leading-tight " defaultValue={studClasses.length>0 ? studClasses[0].stud_class_name : ''} onChange={(e)=>{setStudClassName(e.target.value)
            }} >
                {
                    studClasses.map( ({stud_class_name}) => {
                        return (
                            <option value={stud_class_name} key={stud_class_name}>{stud_class_name}</option>
                        )
                    }
                )
                }
            </select>
            <br/>
            <br/>
            <div className="m-2">
                <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded'type="submit" onClick={(e)=>{transferMultipleStudentsToAnotherClass(e)}}>Select</button> 
                <button className='bg-red-800 text-white py-1 px-3 shadow appearance-none border rounded'type="button" onClick={()=>{props.ondone()}}>Cancel</button> 
            </div>
            </form>
        </div>
    )
}

export default MultipleChangeClass;