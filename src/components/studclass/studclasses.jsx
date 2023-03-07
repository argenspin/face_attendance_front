import { useLayoutEffect } from "react";
import {React,useState,useEffect} from "react";
import { axiosInstance } from "../axiosinstance";
import CreateClass from "./createstudclass";
import ManageClass from "./managestudclass";
import TimeTable from "./timetable";

function StudClass(){

    const [studClasses,setStudClasses] = useState([{id:'',sl_no:'',name:'',stud_class_name:'',subject:'',username:'',teacher:'',teacher_name:'',is_lab:false}])
    const [createButtonDisabled,setCreateButtonDisabled] = useState(false)
    const [manageButtonDisabled,setManageButtonDisabled] = useState(false)
    const [componentCreateManage,setComponentCreateManage] = useState([])


    const [tableclassName,settableClassName] = useState("min-w-full min-w-full divide-y divide-gray-200 table-auto dark:divide-gray-700 ")

    const thclassName = "py-2 px-4 text-sm font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-200";
    const tdclassName = "py-1 px-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white";
    const theadclassName = "bg-gray-100 dark:bg-stone-900"
    const tbodyclassName = "bg-grey-100 divide-y divide-gray-200 dark:bg-stone-800 dark:divide-gray-700"
    const tdtrclassName = "hover:bg-gray-100 dark:hover:bg-gray-700";

    const getAllStudClasses = () => {
        axiosInstance
        .get('studclass/retrieve/')
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


    const manageStudClass = (e,stud_class_data) => {

        setComponentCreateManage(
            <ManageClass data={stud_class_data} ondone={effectsAfterCreateManageComponentDisabled}/>
        )

    }

    useEffect(()=>{
        getAllStudClasses();
    },[])

    const createStudClass = () => {
        setComponentCreateManage(
           <CreateClass ondone = {effectsAfterCreateManageComponentDisabled}/> 
        )
        console.log("hello")
    }

    
    const resetTableOpacity = () => {
        settableClassName(tableclassName.replace('opacity-80',''))
    }

    const effectsAfterCreateManageComponentDisabled = (save_or_cancel) => {
        if(save_or_cancel==='save')
        {
            getAllStudClasses();
        }
        resetTableOpacity();
        setComponentCreateManage([]);
        setManageButtonDisabled(false);
        setCreateButtonDisabled(false);
    }

    return(
        <div>
        <br/>
        <button className='bg-teal-600 hover:bg-teal-800 text-white font-bold py-1 px-3 rounded m-1' disabled={createButtonDisabled} onClick={createStudClass}>Create</button> 
            <div className="m-2 flex flex-col">
                <div className="overflow-x-auto shadow-md sm:rounded-lg">
                    <div className=" min-w-fit align-middle">
                    {componentCreateManage}
                        <div className="overflow-hidden "></div>
                <table className={tableclassName}> 
                    <thead className={theadclassName}>
                    <tr>
                        <th className={thclassName} scope='col'>SL_NO</th>
                        <th className={thclassName} scope='col'>Class</th>
                        <th className={thclassName} scope='col'>Lab</th>
                        <th className={thclassName} scope='col'>Teacher</th>
                        <th className={thclassName} scope='col'>Options</th>

                    </tr>
                    </thead>
                    <tbody className={tbodyclassName}>
                        {/* here teacher is the id of the teacher */}
                        {studClasses.map( ( {id,sl_no,stud_class_name,teacher,teacher_name,is_lab}) => {
                            return <tr key={id} className={tdtrclassName}>
                                    <td key={sl_no} className={tdclassName}>{sl_no}</td>
                                    <td key={stud_class_name} className={tdclassName}>{stud_class_name}</td>
                                    <td key={is_lab} className={tdclassName}>{is_lab?'Yes':'No'}</td>
                                    {/* <td key={teacher} className={tdclassName}>{teacher}</td> */}
                                    <td key={teacher_name} className={tdclassName}>{teacher_name}</td>
                                    <td key={"options"} className={tdclassName}>
                                        <button className="bg-teal-600 hover:bg-teal-800 text-white font-bold py-1 px-3 rounded mr-1.5" disabled={manageButtonDisabled} onClick={(e)=>manageStudClass(e,{'stud_class_name':stud_class_name,'teacher':teacher,'teacher_name':teacher_name,'is_lab':is_lab})} type="button">
                                            Manage
                                        </button>

                                    </td>
                                </tr>
                    }
                    )
                    }
                    </tbody>
                </table>
                </div>
                    </div>
                </div>

        </div>
    )
}

export default StudClass;