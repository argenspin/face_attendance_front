import React, { useEffect, useState } from "react";
import { axiosInstance } from "../axiosinstance";

function FilterAttendance(props){

    const daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31]
    const years = [2015,2016,2017,2018,2019,2020,2021,2022,2023]
    const months = {'January':1,'February':2,'March':3,'April':4,'May':5,'June':6,
                'July':7,'August':8,'September':9,'October':10,'Novemeber':11,'December':12
        }

    const [studClasses,setStudClasses] = useState([])
    const [filterOptions,setFilterOptions] = useState(props.current_filter_options)
    const [days,setDays] = useState([])
    const [dateSelectionComponent,setDateSelectionComponent] = useState([])
    const [daySelectionComponent,setDaySelectionComponent] = useState([])
    const [monthYearSelectionComponent,setMonthYearSelectionComponent] = useState([])

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

    const getDaySelectionComponent = (days_list) => {
            setDaySelectionComponent(
                <>
                    <select id='att_day' className="border rounded py-1 px-1 text-gray-700 leading-tight ml-5" defaultValue={-1} onChange={(e)=>{setFilterOptions(prevState => ({
                            ...prevState, ['day']:parseInt(e.target.value)
                    })
                    )
                    }} >
                        <option value={-1} key={-1}>Day</option>
                        {
                            days_list.map( (day) => {
                                return (
                                    <option value={day} key={day}>{day}</option>
                                )
                            }
                        )
                        }
                    </select>
    
                </>
            )
        }



    const getMonthYearSelectionComponent = () => {
        setMonthYearSelectionComponent(
            <>
                <select id='att_month' className="border rounded py-1 px-1 text-gray-700 leading-tight ml-5" defaultValue={-1} onChange={(e)=>{
                    let days_list = [];
                    for(let i=1; i<=daysInMonth[(e.target.value)-1];i++)
                    {
                        days_list.push(i);
                    }
                    console.log(days_list);
                    console.log(e.target.value);
                    setDays(days_list);
                    getDaySelectionComponent(days_list);
                    setFilterOptions(prevState => ({
                        ...prevState, ['month']:parseInt(e.target.value)
                })
                );
                }} >
                    <option value={-1} key={-1}>Month</option>
                    {
                        Object.keys(months).map( (monthKey) => {
                            return (
                                <option value={months[monthKey]} key={months[monthKey]}>{monthKey}</option>
                            )
                        }
                    )
                    }
                </select>
                <select id='att_year' className="border rounded py-1 px-1 text-gray-700 leading-tight ml-5" defaultValue={-1} onChange={(e)=>{

                    setFilterOptions(prevState => ({
                        ...prevState, ['year']:parseInt(e.target.value)
                })
                );
                }} >
                    <option value={-1} key={-1}>Year</option>
                    {
                        years.map( (year) => {
                            return (
                                <option value={year} key={year}>{year}</option>
                            )
                        }
                    )
                    }
                </select>
            </>
        )
    }

    useEffect(()=>{
        getAllStudClasses();
    },[])


    return(
        <div className='fixed z-40 max-w-full w-2/4 max-h-full h-2/4 m-2 rounded bg-stone-900'>
            <h2 className='rounded text-teal-500 text-3xl font-bold m-3 bg-opacity-95'>Filter Attendance</h2>
            <br/>
            <label className="text-white text-sm font-bold mb-2 m-2">Student Name:</label>
            <input  type="text" className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight " onChange={
                        (e)=>{setFilterOptions(prevState => ({
                            ...prevState, ['student_name']:e.target.value
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
            <label className="text-white text-sm font-bold mb-2 m-2">Date:</label>
            <input type="checkbox" name="day_checkbox" className="border rounded py-1 px-1 text-gray-700 leading-tight" onChange={(e)=>{
                if (e.target.checked===true)
                {
                    getMonthYearSelectionComponent();
                    // getDaySelectionComponent();
                }
                else
                {
                    setFilterOptions(prevState => ({
                        ...prevState, ['day']:-1, ['month']:-1,['year']:-1
                })
                );
                    setMonthYearSelectionComponent([])
                    setDaySelectionComponent([]);
                }
                setFilterOptions(prevState => ({
                    ...prevState, ['date']:e.target.checked
            })
            )
            }} />
            {daySelectionComponent}{monthYearSelectionComponent}
            {/* <label className="text-white text-sm font-bold mb-2 m-2">Date:</label>
            <input type='date' className="border rounded py-1 px-1 text-gray-700 leading-tight" onChange={(e)=>{setFilterOptions(prevState => ({
                    ...prevState, ['date']:e.target.value
            })
            )
            }}/> */}
            <br/>
            <button className='bg-blue-600 text-white py-1 px-3 ml-10 shadow appearance-none border rounded mt-10' type="button" onClick={()=>{props.onfilter(filterOptions)}}>Filter</button>
            <button className='bg-red-600 text-white py-1 px-3 ml-2 shadow appearance-none border rounded mt-10' type="button" onClick={()=>{console.log(filterOptions); props.oncancel()}}>Cancel</button>

        </div>

    )
}

export default FilterAttendance;