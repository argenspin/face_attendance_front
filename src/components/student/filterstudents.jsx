import React, { useEffect, useState } from "react";
import { axiosInstance } from "../axiosinstance";

function FilterStudents(props){
    const [studClasses,setStudClasses] = useState([])
    const [batches,setBatches] = useState([])
    const [filterOptions,setFilterOptions] = useState(props.current_filter_options)

    const getAllStudClasses = () => {
        axiosInstance
        .get('studclassforclasses/retrieve/')
        .then(res=>{
            console.log(res.data)
            let data = res.data;
            let k=1;
            for(let i=0;i<data.length;i++)
            {
                data[i].sl_no = k++;
                console.log(data[i].sl_no)
            }
            setStudClasses(data)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const getAllBatches = async() => {
        await axiosInstance
        .get('academicbatch/retrieve/')
        .then(res=>{
            setBatches(res.data)
        })
        .catch(err=>{
            console.log(err)
        })
    }


    useEffect(()=>{
        getAllStudClasses();
        getAllBatches();
        console.log(filterOptions)
    },[])

    return (
        <div className='fixed z-40 max-w-full w-2/4 max-h-full h-2/4 m-2 rounded bg-stone-900'>
        <h2 className='rounded text-teal-500 text-3xl font-bold m-3 bg-opacity-95'>Filter Students</h2>
        <br/>
        <label className="text-white text-sm font-bold mb-2 m-2">Student Name:</label>
        <input type="text" className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight " defaultValue={''} onChange={
                    (e)=>{setFilterOptions(prevState => ({
                        ...prevState, ['student_name']:e.target.value
                })
                )
                }} 
            />
        <br/>
        <label className="text-white text-sm font-bold mb-2 m-2">Register No:</label>
        <input type="text" className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight " defaultValue={''} onChange={
                    (e)=>{setFilterOptions(prevState => ({
                        ...prevState, ['register_no']:e.target.value
                })
                )
                }} 
            />
        <br/>
        <label className="text-white text-sm font-bold mb-2 m-2">Class:</label>
            <select id='student_class' className="border rounded py-1 px-1 text-gray-700 leading-tight " defaultValue={''} onChange={(e)=>{setFilterOptions(prevState => ({
                    ...prevState, ['stud_class_name']:e.target.value
            })
            )
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
        <label className="text-white text-sm font-bold mb-2 m-2">Batch Name:</label>
            <select id='student_batch' className="border rounded py-1 px-1 text-gray-700 leading-tight " defaultValue={''} onChange={(e)=>{setFilterOptions(prevState => ({
                    ...prevState, batch_name:e.target.value
            })
            )
            }} >
                <option value={''} key={''}></option>
                {
                    batches.map( ({batch,batch_name}) => {
                        return (
                            <option value={batch_name} key={batch}>{batch_name}</option>
                        )
                    }
                )
                }
            </select>
            <br/>
            <button className='bg-blue-600 text-white py-1 px-3 ml-10 shadow appearance-none border rounded mt-10' type="button" onClick={()=>{console.log(filterOptions); props.onfilter(filterOptions)}}>Filter</button>
            <button className='bg-red-600 text-white py-1 px-3 ml-2 shadow appearance-none border rounded mt-10' type="button" onClick={()=>{console.log(filterOptions); props.oncancel()}}>Cancel</button>
        </div>
    )
}

export default FilterStudents;