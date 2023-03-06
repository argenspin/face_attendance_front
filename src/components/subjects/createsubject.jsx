import {React,useEffect,useLayoutEffect,useState} from "react";
import { axiosInstance } from "../axiosinstance";

function CreateSubject(props){

    const [newData,setNewData] = useState({'name':'', 'stud_class_name':'','lab_name':'','is_lab':''});
    const [studClasses,setStudClasses] = useState([{id:'',sl_no:'',name:'',stud_class_name:'',subject:'',username:'',teacher:'',teacher_name:''}])
    const [labStudClasses,setLabStudClasses] = useState([{id:'',sl_no:'',name:'',stud_class_name:'',subject:'',username:'',teacher:'',teacher_name:''}])
    const [showLabSelection,setShowLabSelection] = useState(false)
    const [labSelectionComponent,setLabSelectionComponent] = useState([])

    const getAllStudClasses = () => {
        axiosInstance
        .get('studclassforclasses/retrieve/')
        .then(res=>{
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

    const getClassesThatAreLab = () => {
        axiosInstance
        .get('studclass/lab/retrieve/')
        .then(res=>{
            let data = res.data;
            let k=1;
            for(let i=0;i<data.length;i++)
            {
                data[i].sl_no = k++;
                console.log(data[i].sl_no)
            }
            setLabStudClasses(data)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const getLabSelectionComponent = () => {
        console.log(labStudClasses[0].stud_class_name)
        if(showLabSelection===true)
        {
            setNewData(prevState => ({
                ...prevState, ['lab_name']:labStudClasses[0].stud_class_name
        })
        )
            setLabSelectionComponent(
                <select id='lab_class' className="border rounded py-1 px-1 text-gray-700 leading-tight " defaultValue={newData['lab_name']}  onChange={(e)=>{setNewData(prevState => ({
                    ...prevState, ['lab_name']:e.target.value
            })
            )
            }} >
            <option value={labStudClasses[0].stud_class_name} key={labStudClasses[0].stud_class_name}>{labStudClasses[0].stud_class_name}</option>
                {
                    labStudClasses.map( ({stud_class_name}) => {
                        if(stud_class_name!=labStudClasses[0].stud_class_name)
                        {
                            return (
                                <option value={stud_class_name} key={stud_class_name}>{stud_class_name}</option>
                            )
                        }
                    }
                )
                }
            </select>
            )
        }
        else
        {
            setNewData(prevState => ({
                ...prevState, ['lab_name']:'', ['is_lab']: false
        })
        )
            setLabSelectionComponent([])
        }
    }

    const createSubjectSave = async(e) => {

        e.preventDefault();
        console.log(newData)
        let form_data = new FormData();
        form_data.append('name',newData['name']);
        form_data.append('stud_class_name',newData['stud_class_name']);
        form_data.append('lab_name',newData['lab_name'])
        form_data.append('is_lab',newData['is_lab'])
        await axiosInstance
        .post('classsubject/create/',form_data)
        .then(res=>{
            props.ondone('save');
            console.log(res.data)
        })
        .catch(err => {
            alert("Couldn't create the subject!")

            console.log(err);
        })
         //hide the create component by calling parent function effectsAfterComponentDisabled


    }

    const createSubjectCancel = () => {
        props.ondone();
    }

    useEffect(()=>{
        getLabSelectionComponent();
    },[showLabSelection]);
    
    useEffect(()=>{
        getClassesThatAreLab();
        getAllStudClasses();
    },[])



    return(

        <div className='fixed z-40 max-w-full w-2/4 max-h-full h-2/5 m-2 bg-stone-900 rounded'>
            <h2 className='rounded text-teal-500 text-3xl font-bold m-2'>Create Subject</h2>
            <br/>
            <label className="text-white text-sm font-bold mb-2 m-2">Subject Name:</label>
            <input  type="text" id='subjectname' className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight " onChange={
                    (e)=>{setNewData(prevState => ({
                        ...prevState, ['name']:e.target.value
                })
                )
                }} />
            <br/>
            <label className="text-white text-sm font-bold mb-2 m-2">Class:</label>
            <select id='student_class' className="border rounded py-1 px-1 text-gray-700 leading-tight " defaultValue={''} onChange={(e)=>{setNewData(prevState => ({
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
            <label className="text-white text-sm font-bold mb-2 m-2">Is Lab:</label>
            <input type={'checkbox'} id='is_lab' className="border rounded py-1 px-1 text-gray-700 leading-tight " checked={showLabSelection} onChange={(e)=>{
                setNewData(prevState => ({
                    ...prevState, ['is_lab']:e.target.checked
            })
            ); 
                setShowLabSelection(!showLabSelection);
            }} />

            <label className="text-white text-sm font-bold mb-2 m-2">Lab:</label>
            {labSelectionComponent}
            <br/>
            <br/>
            <br/>
            <div className="m-2">
                <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded'type="button" onClick={(e)=> {createSubjectSave(e)} }>Save</button> 
                <button className='bg-red-800 text-white py-1 px-3 shadow appearance-none border rounded'type="button" onClick={(e)=> {createSubjectCancel(e)}}>Cancel</button> 
            </div>
        </div>
    )
}

export default CreateSubject;