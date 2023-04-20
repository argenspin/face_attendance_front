import { useLayoutEffect } from "react";
import {React,useState,useEffect} from "react";
import { axiosInstance } from "../axiosinstance";
import CreateStudent from "./createstudent";
import EditStudent from "./editstudent";
import ViewStudent from "./viewstudent";
import { FadeLoader } from 'react-spinners';
import MultipleChangeClass from "./multiplechangeclass";
import FilterStudents from "./filterstudents";

function Students()
{
    
    axiosInstance.defaults.timeout = 30000
    const [students,setStudents] = useState([])
    const [userType,setUserType] = useState('')

    const [selectedStudentIds,setSelectedStudentIds] = useState([])
    const [componentCreateEditView,setComponentCreateEditView] = useState([])
    const [filterComponent,setFilterComponent] = useState([])
    const [filterOptions,setFilterOptions] = useState({'student_name':'','stud_class_name':'','batch_name':'','register_no':''})

    const [createButtonDisabled,setCreateButtonDisabled] = useState(false);
    const [editButtonDisabled,setEditButtonDisabled] = useState(false);
    const [deleteButtonDisabled,setDeleteButonDisabled] = useState(false)
    const [viewButtonDisabled,setViewButtonDisabled] = useState(false)

    const [transferStudentsButton,setTransferStudentsButton] = useState([])

    const [loadingState, setLoadingState] = useState(false)

    const [tBodyComponent,setTBodyComponent] = useState([])
    const [topButtons,setTopButtons] = useState([])


    const disableAllButtons = () => {
        setEditButtonDisabled(true);
        setCreateButtonDisabled(true);
        setDeleteButonDisabled(true)
    }

    const enableAllButtons = () => {
        setEditButtonDisabled(false);
        setCreateButtonDisabled(false);
        setDeleteButonDisabled(false)

    }

    const effectsAfterCreateEditViewComponentDisabled = (save_or_cancel) => {
        if(save_or_cancel==='save')
        {
            setLoadingState(false)
            getStudents();
        }

        enableAllButtons();
        setComponentCreateEditView([]);
        resetTableOpacity();
    }

    const startLoadingAnimation = () => {
        setLoadingState(true);
    }

    const stopLoadingAnimation = () => {
        setLoadingState(false);
    }

    const getUserTypeAndStudClassName = async() => {
        await axiosInstance
        .get('usertypestudclass/retrieve/')
        .then(res => {
            setUserType(res.data['user_type']);
        })
        .catch(err => {
            console.log(err);
        })
    }

    //identifying which stud_class students to be retrieved are done in backend using access token
    const getStudents = () => {
        console.log(userType)
        axiosInstance
        .get('student/retrieve/')
        .then(res=> {
            let data = res.data;
            data = [...data].sort((a,b)=>a.register_no < b.register_no? -1: a.register_no>b.register_no? 1 : 0);
            let k=1;
            for(let i=0;i<data.length;i++)
            {
                data[i].sl_no = k++;
                console.log(data[i].sl_no)
            }
            setStudents(data)
        })
        .catch(err => {
            console.log(err)
        })
    }

    const resetTableOpacity = () => {
        settableClassName(tableclassName.replace('opacity-80',''))
    }

    const createStudent = (e) => {
        e.preventDefault();
        disableAllButtons();
        settableClassName(tableclassName+"opacity-80");
        setComponentCreateEditView(
            <CreateStudent show={true} ondone={effectsAfterCreateEditViewComponentDisabled} usertype = {userType} start_loading_animation={startLoadingAnimation} stop_loading_animation={stopLoadingAnimation}/>
        )
    }

    const editStudent = async(e,student_data) => {
        e.preventDefault();
        let form_data = new FormData();
        form_data.append('id',student_data['id'])
        await axiosInstance
        .post('student/retrieve/',form_data)
        .then(res=>{
            student_data['face_photo_b64'] = res.data['face_photo_b64'];
        })
        .catch(err=>{
            student_data['face_photo_b64'] = ''
            console.log(err);
        })
        disableAllButtons();
        settableClassName(tableclassName+"opacity-80");
        setComponentCreateEditView(
            <EditStudent ondone={effectsAfterCreateEditViewComponentDisabled} data={student_data} usertype = {userType} start_loading_animation={startLoadingAnimation} stop_loading_animation={stopLoadingAnimation}/>
        )
    }



    const viewStudent = async(e,student_data) => {
        e.preventDefault();
        let face_photo_b64 = '';
        let form_data = new FormData();
        form_data.append('id',student_data['id'])
        await axiosInstance
        .post('student/retrieve/',form_data)
        .then(res=>{
            face_photo_b64 = res.data['face_photo_b64']
            student_data['face_photo_b64'] = face_photo_b64
        })
        .catch(err=>{
            console.log(err);
        })
        setEditButtonDisabled(true);
        setCreateButtonDisabled(true);
        settableClassName(tableclassName+"opacity-80");
        setComponentCreateEditView(
            <ViewStudent data={student_data} ondone = {effectsAfterCreateEditViewComponentDisabled}/>
        )

    }

    const deleteStudent = async(e,student_id) => {
        e.preventDefault();
        await axiosInstance
        .delete('student/delete/',{headers:{
            id: student_id
        }
        })
        .then(res=>{
            console.log("deleted successfully");
            getStudents();
        })
        .catch(err => {
            alert("Cannot delete student")
        })

    }

    const getTBodyComponent = () => {
        let selected_student_ids = [];
        if(userType==='admin')
        {
            setTBodyComponent(
                students.map(( {id,sl_no,name,stud_class_name,register_no,dob,batch,batch_name})=>{
                    return <tr key={id} className={tdtrclassName}>
                        <td key={sl_no} className={tdclassName}>
                             <input type="checkbox" className=" border rounded py-1 px-1 mr-2 text-red-700 leading-tight bg-red-600 " name="selection"
                                onChange={(e)=>{
                                    if (e.target.checked === true)
                                    {
                                        selected_student_ids.push(id)
                                        getTransferButton(selected_student_ids);

                                        setSelectedStudentIds([...selectedStudentIds,selected_student_ids])
                                        console.log(selectedStudentIds)
                                    }
                                    else
                                    {
                                        selected_student_ids = selected_student_ids.filter(student_id=> student_id!=id)
                                        console.log(selected_student_ids)   
                                        getTransferButton(selected_student_ids);
                                        setSelectedStudentIds(selected_student_ids.filter(student_id => student_id !== id))
                                    }
                                }}
                             />
                            
                        {sl_no}</td>
                        <td key={name} className={tdclassName}>{name}</td>
                        <td key={register_no} className={tdclassName}>{register_no}</td>
                        <td key={dob} className={tdclassName}>{dob}</td>
                        <td key={stud_class_name} className={tdclassName}>{stud_class_name}</td>
                        <td key={`batch $(id)`} className={tdclassName}>{batch_name}</td>
                        <td key={"options"} className={tdclassName}>
                            <button className="bg-teal-600 hover:bg-teal-800 text-white font-bold py-1 px-3 rounded mr-1.5" type="button" disabled={viewButtonDisabled} onClick={(e) => {viewStudent(e,{'id':id,'name':name,'stud_class_name':stud_class_name,'register_no':register_no,'dob':dob,'batch':batch,'batch_name':batch_name})}}>
                                View
                            </button>
                
                            <button className="bg-teal-600 hover:bg-teal-800 text-white font-bold py-1 px-3 rounded mr-1.5" type="button" disabled={editButtonDisabled} onClick={(e) => {editStudent(e,{'id':id,'name':name,'stud_class_name':stud_class_name,'register_no':register_no,'dob':dob,'batch':batch,'batch_name':batch_name})}}>
                                Edit
                            </button>
                            <button className="bg-red-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-1.5" type="button" disabled={deleteButtonDisabled} onClick={(e) => {deleteStudent(e,id)} }>
                                Delete
                            </button>
                        </td>
                    </tr>
            }
            )

            )
        }
        else
        {
            setTBodyComponent(
                students.map(( {id,sl_no,name,stud_class_name,register_no,dob,batch,batch_name})=>{
                    console.log(students.length)
                    return <tr key={id} className={tdtrclassName}>
                        <td key={sl_no} className={tdclassName}>{sl_no}</td>
                        <td key={name} className={tdclassName}>{name}</td>
                        <td key={register_no} className={tdclassName}>{register_no}</td>
                        <td key={dob} className={tdclassName}>{dob}</td>
                        <td key={stud_class_name} className={tdclassName}>{stud_class_name}</td>
                        <td key={`batch $(id)`} className={tdclassName}>{batch_name}</td>
                        <td key={"options"} className={tdclassName}>
                            <button className="bg-teal-600 hover:bg-teal-800 text-white font-bold py-1 px-3 rounded" type="button" disabled={viewButtonDisabled} onClick={(e) => {viewStudent(e,{'id':id,'name':name,'stud_class_name':stud_class_name,'dob':dob,'register_no':register_no,'batch':batch,'batch_name':batch_name})}}>
                                View
                            </button>

                        </td>
                    </tr>
                }
            )
            )
        }

    }

    const getTopButtons = () => {
        if(userType==='admin')
        {
            setTopButtons(
                <>
                    <button className="bg-teal-600 hover:bg-teal-800 text-white font-bold py-1 px-3 rounded m-1" onClick={getStudents}>Refresh</button>
                    <button className='bg-teal-600 hover:bg-teal-800 text-white font-bold py-1 px-3 rounded' disabled={createButtonDisabled} onClick={createStudent}>Create</button>
                </>
            )
        }
        else
        {
            setTopButtons(
                <button className="bg-teal-600 hover:bg-teal-800 text-white font-bold py-1 px-3 rounded m-1" onClick={getStudents}>Refresh</button>
            )
        }
    }

    const getTransferButton = (selectedIds) => {
        if(selectedIds.length > 0)
        {
            setTransferStudentsButton(
                <button className="bg-yellow-600 hover:bg-yellow-300-800 text-white font-bold py-1 px-3 rounded ml-52" onClick={(e)=>{setComponentCreateEditView(
                    <MultipleChangeClass ondone={effectsAfterCreateEditViewComponentDisabled} selected_ids={selectedIds} start_loading_animation={startLoadingAnimation} stop_loading_animation={stopLoadingAnimation}/>
                )}}>Change Class</button>
            )
        }
        else
        {
            setTransferStudentsButton([])
        }
    }

    const sortStudents = (option) => {
        let sortedObj = []
        if(option==='student_name_asc')
        {
            sortedObj = [...students].sort((a,b)=>a.name < b.name? -1: a.name>b.name? 1 : 0);
        }
        else if(option==='student_name_desc')
        {
            sortedObj = [...students].sort((a,b)=>a.name < b.name? 1: a.name>b.name? -1 : 0);
        }
        else if(option==='register_no_asc')
        {
            sortedObj = [...students].sort((a,b)=>a.register_no < b.register_no? -1: a.register_no>b.register_no? 1 : 0);
        }
        else if(option==='register_no_desc')
        {
            sortedObj = [...students].sort((a,b)=>a.register_no < b.register_no? 1: a.register_no>b.register_no? -1 : 0);
        }
        else if(option==='class_name_asc')
        {
            sortedObj = [...students].sort((a,b)=>a.stud_class_name < b.stud_class_name? -1: a.stud_class_name > b.stud_class_name? 1 : 0);
        }
        else if(option==='class_name_desc')
        {
            sortedObj = [...students].sort((a,b)=>a.stud_class_name < b.stud_class_name? 1: a.stud_class_name > b.stud_class_name? -1 : 0);
        }
        else if(option==='batch_name_asc')
        {
            sortedObj = [...students].sort((a,b)=>a.batch_name < b.batch_name? -1: a.batch_name > b.batch_name? 1 : 0);
        }
        else if(option==='batch_name_desc')
        {
            sortedObj = [...students].sort((a,b)=>a.batch_name < b.batch_name? 1: a.batch_name > b.batch_name? -1 : 0);
        }
        let data = [...sortedObj]
        let k=1;
        for(let i=0;i<data.length;i++)
        {
            data[i].sl_no = k++;
            console.log(data[i].sl_no)
        }
        setStudents(data)

    }

    const getFilterOptionsAndFilter = (filter_options) => {
        // getAllAttendances();
        console.log(filter_options)
        setFilterOptions(filter_options);
        setFilterComponent([])
        const filterObj = [...students].filter(student=>{

                    return (
                        (filter_options.student_name!==''? student.name.toUpperCase().includes(filter_options.student_name.toUpperCase()) : true)
                            &&
                        (filter_options.register_no!==''? student.register_no.toUpperCase().includes(filter_options.register_no.toUpperCase()) : true)
                            &&
                        (filter_options.stud_class_name!==''? student.stud_class_name.toUpperCase().includes(filter_options.stud_class_name.toUpperCase()) : true)
                            &&
                        (filter_options.batch_name!==''? student.batch_name.toUpperCase().includes(filter_options.batch_name.toUpperCase()) : true)
                        )
                }
                );
        console.log(filterObj)
        setStudents(filterObj)
    }

    const getFilterComponent = () => {
        setFilterComponent(
            <FilterStudents current_filter_options={filterOptions} onfilter={getFilterOptionsAndFilter} oncancel={cancelFilterComponent}/>
        )
    }

    const cancelFilterComponent = () => {
        setFilterOptions({'student_name':'','stud_class_name':'','batch_name':'','register_no':''});
        setFilterComponent([])
    }

    const clearFilters = () => {
        setFilterOptions({'student_name':'','stud_class_name':'','batch_name':'','register_no':''});
        getStudents();
    }

    const [tableclassName,settableClassName] = useState("min-w-full min-w-full divide-y divide-gray-200 table-auto dark:divide-gray-700 ")

    const thclassName = "py-2 px-4 text-sm font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-200";
    const tdclassName = "py-1 px-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white";
    const theadclassName = "bg-gray-100 dark:bg-stone-900"
    const tbodyclassName = "bg-grey-100 divide-y divide-gray-200 dark:bg-stone-800 dark:divide-gray-700"
    const tdtrclassName = "hover:bg-gray-100 dark:hover:bg-gray-700";

    useLayoutEffect(()=>{
        getUserTypeAndStudClassName();
        getStudents();


    },[])

    useEffect(()=>{
        getTopButtons();

    },[userType])

    useEffect(()=>{
        if(loadingState === true)
        {
            disableAllButtons();
        }
        else
        {
            enableAllButtons();
        }

    },[loadingState])

    useEffect(()=>{
        getTBodyComponent();
        getTopButtons();
    }
    ,[createButtonDisabled,students])



    return(

    <div>
        <br/>
        <div className="fixed z-50  m-44 ml-96 bg-transparent">
            <FadeLoader className="" loading={loadingState} size={20} color={'teal'}/>
        </div>
        {topButtons}{transferStudentsButton}
        <select name="sort_options" onChange={(e)=>{sortStudents(e.target.value)}} className="border rounded py-1 px-1 text-white leading-tight float-right mr-52 bg-inherit mt-1" >
            <option className="text-black" value={'register_no_asc'} key={'register_no_asc'}>{'Register No - Ascending'}</option>
            <option className="text-black" value={'register_no_desc'} key={'register_no_desc'}>{'Register No - Ascending'}</option>
            <option className="text-black" value={'student_name_asc'} key={'student_name_asc'}>{'Name - Ascending'}</option>
            <option className="text-black" value={'student_name_desc'} key={'student_name_desc'}>{'Name - Descending'}</option>
            <option className="text-black" value={'class_name_asc'} key={'class_name_asc'}>{'Class - Ascending'}</option>
            <option className="text-black" value={'class_name_desc'} key={'class_name_desc'}>{'Class - Descending'}</option>
            <option className="text-black" value={'batch_name_asc'} key={'batch_name_asc'}>{'Batch - Ascending'}</option>
            <option className="text-black" value={'batch_name_desc'} key={'batch_name_desc'}>{'Batch - Descending'}</option>
        </select>
        <label htmlFor="sort_options" className="text-white text-sm font-bold float-right mt-2">Sort By:</label>
        <button className='bg-red-600 hover:bg-red-400 text-white font-bold py-1 px-3 rounded m-1 float-right' onClick={clearFilters}>Clear Filters</button> 
        <button className='bg-blue-600 hover:bg-teal-800 text-white font-bold py-1 px-3 rounded m-1 float-right' onClick={getFilterComponent}>Filter</button> 
        <div className="m-2 flex flex-col">
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <div className="min-w-fit align-middle">


            {componentCreateEditView}{filterComponent}
            
                <div className="overflow-hidden "></div>
        <table className={tableclassName}> 
            <thead className={theadclassName}>
            <tr>
                <th className={thclassName} scope='col'>
                    <input type="checkbox" className=" border rounded py-1 px-1 mr-2 text-red-700 leading-tight bg-red-600 " name="selection"/>
                SL_NO</th>
                <th className={thclassName} scope='col'>Name</th>
                <th className={thclassName} scope='col'>Register No</th>
                <th className={thclassName} scope='col'>Date of Birth</th>
                <th className={thclassName} scope='col'>Class</th>
                <th className={thclassName} scope='col'>Batch</th>
                <th className={thclassName} scope='col'>Options</th>
            </tr>
            </thead>
            <tbody className={tbodyclassName}>
                {tBodyComponent}
            </tbody>
        </table>
        </div>
            </div>
        </div>

    </div>

        )

}


export default Students;