import axios from "axios";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../axiosinstance";

function SelectStudClass(props){
    const [studClassName,setStudClassName] = useState('');
    const [studClasses,setStudClasses] = useState([]);

    const getAllStudClasses = async() => {
        let data = [];
        await axios
        .get('api/studclass/retrieve/',{headers:{'Authorization': `JWT ${props.access}`}})
        .then(res => {
            data = res.data;
            setStudClasses(data)

            //console.log(data)
        })
        .catch(err => {
            console.log(err);
        })
    }

    const selectClass = (e)=> {
        e.preventDefault()
        props.onselect(studClassName);
    }

    useEffect(()=>{
        getAllStudClasses();
    },[])

    return (
        <div className='fixed z-40 max-w-md w-2/4 max-h-full h-2/5 m-2 rounded bg-stone-900 '>
            <h2 className='rounded text-teal-500 text-3xl font-bold m-3 bg-opacity-95'>Select Class</h2>
            <br/>
            <form>
            <label className="text-white text-sm font-bold mb-2 m-2">Class: </label>
            <select id='student_class' className="border rounded py-1 px-1 text-gray-700 leading-tight " defaultValue={''} onChange={(e)=>{setStudClassName(e.target.value)
            }} >
                <option value={''} key={''}></option>
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
                <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded'type="submit" onClick={(e)=>{selectClass(e)}}>Select</button> 
                <button className='bg-red-800 text-white py-1 px-3 shadow appearance-none border rounded'type="button" onClick={()=>{props.oncancel()}}>Cancel</button> 
            </div>
            </form>
        </div>
    )
}

export default SelectStudClass;