import React, { useEffect, useLayoutEffect, useState } from "react";
import { axiosInstance } from "../axiosinstance";
import EditAttendance from "./editattendance";
import FilterAttendance from "./filterattendance";

function Attendance(){

    const [attendances,setAttendances] = useState([])
    const [attendanceTableComponent,setAttendanceTableComponent] = useState([])
    const [filterComponent,setFilterComponent] = useState([])
    const [filterOptions,setFilterOptions] = useState({'student_name':'','stud_class_name':'','date':false,'year':-1,'month':-1,'day':-1,'batch_name':'','register_no':''})
    const [editComponent,setEditComponent] = useState([])
    const [userType,setUserType] = useState('')
    const [studClassName,setStudClassName] = useState('')

    const getUserTypeAndStudClassName = async() => {
        await axiosInstance
        .get('usertypestudclass/retrieve/')
        .then(res => {
            console.log(res.data)
            setUserType(res.data['user_type']);
            setStudClassName(res.data['stud_class_name']);
        if(res.data['user_type']==='admin')
        {
            getAllAttendances();
        }
        else if(res.data['user_type']==='teacher')
        {
            getStudClassAttendances(res.data['stud_class_name']);
        }

        })
        .catch(err => {
            console.log(err);
        })
    }

    const getAllAttendances = async() => {
        await axiosInstance
        .get('attendance/retrieve/')
        .then(res=>{
            let data = res.data;
            data.sort((a,b)=>a.student_name < b.student_name? -1: a.student_name>b.student_name? 1 : 0);
            let k=1;
            for(let i=0;i<data.length;i++)
            {
                data[i].sl_no = k++;
                console.log(data[i].sl_no)
            }
            getAttendanceTableComponent(data);
            setAttendances(data);
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const getStudClassAttendances = async(stud_class_name) => {
        let form_data=new FormData();
        form_data.append('stud_class_name',stud_class_name);
        await axiosInstance
        .post('attendance/retrieve/',form_data)
        .then(res=>{
            let data = res.data;
            data.sort((a,b)=>a.student_name < b.student_name? -1: a.student_name>b.student_name? 1 : 0);
            let k=1;
            for(let i=0;i<data.length;i++)
            {
                data[i].sl_no = k++;
                console.log(data[i].sl_no)
            }
            getAttendanceTableComponent(data);
            setAttendances(data);
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const getEditComponent = (current_data) =>{
        setEditComponent(
            <EditAttendance data={current_data} ondone={effectsAfterEditComponentDisabled}/>
        )
    }

    const effectsAfterEditComponentDisabled = (save_or_cancel) => {
        if(save_or_cancel=='save')
        {
            getAllAttendances();
        }
        setEditComponent([])
    }

    const getAttendanceTableComponent = (attendace_data) => {
        setAttendanceTableComponent(
            <>
        {attendace_data.map( ( {id,sl_no,stud_class_name,student,student_name,register_no, date,subject1_att,subject2_att,subject3_att,subject4_att,subject5_att,batch,batch_name}) => {
            return <tr key={id} className={tdtrclassName}>
                    <td key={`$(sl_no) $(id)`} className={tdclassName}>{sl_no}</td>
                    <td key={`$(date) $(id)`} className={tdclassName}>{date}</td>
                    <td key={student_name} className={tdclassName}>{student_name}</td>
                    <td key={stud_class_name} className={tdclassName}>{stud_class_name}</td>
                    <td key={batch} className={tdclassName}>{batch_name}</td>
                    <td key={id+' sub1'} className={tdclassName} style={{'color': (subject1_att? '#22c55e':'red')}}>{subject1_att ?'Present':'Absent' }</td>
                    <td key={id+' sub2'} className={tdclassName} style={{'color': (subject2_att? '#22c55e':'red')}}>{subject2_att ?'Present':'Absent'}</td>
                    <td key={id+' sub3'} className={tdclassName} style={{'color': (subject3_att? '#22c55e':'red')}}>{subject3_att ?'Present':'Absent'}</td>
                    <td key={id+' sub4'} className={tdclassName} style={{'color': (subject4_att? '#22c55e':'red')}}>{subject4_att ?'Present':'Absent'}</td>
                    <td key={id+' sub5'} className={tdclassName} style={{'color': (subject5_att? '#22c55e':'red')}}>{subject5_att ?'Present':'Absent'}</td>

                    <td key={"options"} className={tdclassName}>
                        <button className="bg-teal-600 hover:bg-teal-800 text-white font-bold py-1 px-3 rounded mr-1.5" type="button"
                        onClick={()=>{getEditComponent({'id':id,'date':date,'stud_class_name':stud_class_name,'student_name':student_name,'register_no':register_no,'batch_name':batch_name,'batch':batch,'subject1_att':subject1_att,'subject2_att':subject2_att,'subject3_att':subject3_att,'subject4_att':subject4_att,'subject5_att':subject5_att})}} >
                            Edit
                        </button>

                    </td>
                </tr>
    }
    )
    }
    </>
        );
    }

    const getFilterComponent = () => {
        setFilterComponent(
            <FilterAttendance current_filter_options={filterOptions} onfilter={getFilterOptionsAndFilter} oncancel={cancelFilterComponent}/>
        )
    }

    const getFilterOptionsAndFilter = (filter_options) => {
        // getAllAttendances();
        console.log(filter_options)
        setFilterOptions(filter_options);
        setFilterComponent([])
        const filterObj = [...attendances].filter(attendance=>{
                let splitted_date = attendance.date.split('-');
                console.log(splitted_date)
                let day = parseInt(splitted_date[2]);
                let month = parseInt(splitted_date[1]);
                let year = parseInt(splitted_date[0]);
                    return (
                        (filter_options.student_name!==''? attendance.student_name.toUpperCase().includes(filter_options.student_name.toUpperCase()) : true)
                            &&
                        (filter_options.register_no!==''? attendance.register_no.toUpperCase().includes(filter_options.register_no.toUpperCase()) : true)
                            &&
                        (filter_options.stud_class_name!==''? attendance.stud_class_name.toUpperCase().includes(filter_options.stud_class_name.toUpperCase()) : true)
                            &&
                        (filter_options.batch_name!==''? attendance.batch_name.toUpperCase().includes(filter_options.batch_name.toUpperCase()) : true)
                            &&
                        // (filter_options.date!==''? attendance.date===filter_options.date : true)
                        (filter_options.day!==-1 ? day===filter_options.day : true)
                            &&
                        (filter_options.month!==-1 ? month===filter_options.month : true)
                            &&
                        (filter_options.year!==-1 ? year===filter_options.year : true)

                        )
                }
                );
        console.log(filterObj)
        setAttendances(filterObj)
    }

    const cancelFilterComponent = () => {
        setFilterOptions({'student_name':'','stud_class_name':'','date':false,'year':-1,'month':-1,'day':-1,'batch_name':'','register_no':''});
        setFilterComponent([])
    }

    const clearFilters = () => {
        setFilterOptions({'student_name':'','stud_class_name':'','date':false,'year':-1,'month':-1,'day':-1,'batch_name':'','register_no':''});
        // getAllAttendances();
        getUserTypeAndStudClassName();
    }

    const countAttendancesOfCurrentObject = (currentObject) => {
        let count = 0;
        if (currentObject.subject1_att){count+=1;}
        if (currentObject.subject2_att){count+=1;}
        if (currentObject.subject3_att){count+=1;}
        if (currentObject.subject4_att){count+=1;}
        if (currentObject.subject5_att){count+=1;}
        return count;
    }

    const sortAttendance = (option) => {
        let sortedObj = [];
        if(option==='student_name_asc')
        {
            sortedObj = [...attendances].sort((a,b)=>a.student_name < b.student_name? -1: a.student_name>b.student_name? 1 : 0);
            // setAttendances(sortedObj)
        }
        else if(option==='student_name_desc')
        {
            sortedObj = [...attendances].sort((a,b)=>a.student_name < b.student_name? 1: a.student_name>b.student_name? -1 : 0);
            // setAttendances(sortedObj)
        }
        else if(option==='class_name_asc')
        {
            sortedObj = [...attendances].sort((a,b)=>a.stud_class_name < b.stud_class_name? -1: a.stud_class_name>b.stud_class_name? 1 : 0);
            // setAttendances(sortedObj)
        }
        else if(option==='class_name_desc')
        {
            sortedObj = [...attendances].sort((a,b)=>a.stud_class_name < b.stud_class_name? 1: a.stud_class_name>b.stud_class_name? -1 : 0);
            // setAttendances(sortedObj)
        }
        else if(option==='register_no_asc')
        {
            sortedObj = [...attendances].sort((a,b)=>a.register_no < b.register_no? -1: a.register_no>b.register_no? 1 : 0);
            // setAttendances(sortedObj)
        }
        else if(option==='register_no_desc')
        {
            sortedObj = [...attendances].sort((a,b)=>a.register_no < b.register_no? 1: a.register_no>b.register_no? -1 : 0);
            // setAttendances(sortedObj)
        }
        else if(option==='attendances_asc')
        {
            sortedObj = [...attendances].sort((a,b)=>countAttendancesOfCurrentObject(a) < countAttendancesOfCurrentObject(b)? -1: countAttendancesOfCurrentObject(a)>countAttendancesOfCurrentObject(b)? 1 : 0);
            // setAttendances(sortedObj)
        }
        else if(option==='attendances_desc')
        {
            sortedObj = [...attendances].sort((a,b)=>countAttendancesOfCurrentObject(a) < countAttendancesOfCurrentObject(b)? 1: countAttendancesOfCurrentObject(a)>countAttendancesOfCurrentObject(b)? -1 : 0);
            // setAttendances(sortedObj)
        }
        else if(option==='date_asc')
        {
            sortedObj = [...attendances].sort((a,b)=> parseInt(a.date.replaceAll('-','')) < parseInt(b.date.replaceAll('-','')) ? -1 : parseInt(a.date.replaceAll('-','')) > parseInt(b.date.replaceAll('-','')) ? 1 : 0)
            // setAttendances(sortedObj);
        }
        else if(option==='date_desc')
        {
            sortedObj = [...attendances].sort((a,b)=> parseInt(a.date.replaceAll('-','')) < parseInt(b.date.replaceAll('-','')) ? 1 : parseInt(a.date.replaceAll('-','')) > parseInt(b.date.replaceAll('-','')) ? -1 : 0)
            // setAttendances(sortedObj);
        }
        let data = sortedObj;
        let k=1;
        for(let i=0;i<data.length;i++)
        {
            data[i].sl_no = k++;
        }
        setAttendances(sortedObj)

    }


    const printAttendances = () => {
        let form_data = new FormData();
        let attendances_to_sent = [...attendances];
        let k=1;
        for(let i=0;i<attendances_to_sent.length;i++)
        {
            attendances_to_sent[i].sl_no = k++;
            console.log(attendances_to_sent[i].sl_no)
        }
        form_data.append('attendances_to_print',JSON.stringify(attendances_to_sent));
        axiosInstance
        .post('attendance/print/',form_data)
        .then(res=>{
            const linkSource = ("data:application/pdf;base64,"+res.data).replace(/['"]+/g, '');
            const downloadLink = document.createElement("a");
            const fileName = "attendance.pdf";
        
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
        })
        .catch(err=>{
            console.log(err)
        })
    }


    const [tableclassName,settableClassName] = useState("min-w-full min-w-full divide-y divide-gray-200 table-auto dark:divide-gray-700 ")

    const thclassName = "py-2 px-4 text-sm font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-200";
    const tdclassName = "py-1 px-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white ";
    const theadclassName = "bg-gray-100 dark:bg-stone-900"
    const tbodyclassName = "bg-grey-100 divide-y divide-gray-200 dark:bg-stone-800 dark:divide-gray-700"
    const tdtrclassName = "hover:bg-gray-100 dark:hover:bg-gray-700";

    useLayoutEffect(()=>{
        getUserTypeAndStudClassName();
    },[])

    useEffect(()=>{
        getAttendanceTableComponent(attendances);
    },[attendances])



    return(
        <div>
        <br/>
        {editComponent} 
        <select name="sort_options" onChange={(e)=>{sortAttendance(e.target.value)}} className="border rounded py-1 px-1 text-white leading-tight float-right mr-52 bg-inherit mt-1" >
            <option className="text-black" value={'student_name_asc'} key={'student_name_asc'}>{'Name - Ascending'}</option>
            <option className="text-black" value={'student_name_desc'} key={'student_name_desc'}>{'Name - Descending'}</option>
            <option className="text-black" value={'register_no_asc'} key={'register_no_asc'}>{'Register No - Ascending'}</option>
            <option className="text-black" value={'register_no_desc'} key={'register_no_desc'}>{'Register No - Descending'}</option>
            <option className="text-black" value={'class_name_asc'} key={'class_name_asc'}>{'Class - Ascending'}</option>
            <option className="text-black" value={'class_name_desc'} key={'class_name_desc'}>{'Class - Descending'}</option>
            <option className="text-black" value={'attendances_asc'} key={'attendances_asc'}>{'Attendance - Ascending'}</option>
            <option className="text-black" value={'attendances_desc'} key={'attendances_desc'}>{'Attendance - Descending'}</option>
            <option className="text-black" value={'date_asc'} key={'date_asc'}>{'Date - Ascending'}</option>
            <option className="text-black" value={'date_desc'} key={'date_desc'}>{'Date - Descending'}</option>


        </select>
        <button className='bg-blue-600 hover:bg-teal-800 text-white font-bold py-1 px-3 rounded m-1' onClick={printAttendances}>Print</button> 
        <label htmlFor="sort_options" className="text-white text-sm font-bold float-right mt-2">Sort By:</label>
        <button className='bg-red-600 hover:bg-red-400 text-white font-bold py-1 px-3 rounded m-1 float-right' onClick={clearFilters}>Clear Filters</button> 
        <button className='bg-blue-600 hover:bg-teal-800 text-white font-bold py-1 px-3 rounded m-1 float-right' onClick={getFilterComponent}>Filter</button> 



            <div className="m-2 flex flex-col">
                <div className="overflow-x-auto shadow-md sm:rounded-lg">
                    <div className=" min-w-fit align-middle">
                        {filterComponent}
                        <div className="overflow-hidden "></div>
                <table className={tableclassName}> 
                    <thead className={theadclassName}>
                    <tr>
                        <th className={thclassName} scope='col'>No.</th>
                        <th className={thclassName} scope='col'>Date</th>
                        <th className={thclassName} scope='col'>Student</th>
                        <th className={thclassName} scope='col'>Class</th>
                        <th className={thclassName} scope='col'>Batch</th>
                        <th className={thclassName} scope='col'>Sub 1</th>
                        <th className={thclassName} scope='col'>Sub 2</th>
                        <th className={thclassName} scope='col'>Sub 3</th>
                        <th className={thclassName} scope='col'>Sub 4</th>
                        <th className={thclassName} scope='col'>Sub 5</th>
                        <th className={thclassName} scope='col'>Options</th>
                    </tr>
                    </thead>
                    <tbody className={tbodyclassName}>
                    {attendanceTableComponent}
                    </tbody>
                </table>
                </div>
                    </div>
                </div>

        </div>
    )
}

export default Attendance;