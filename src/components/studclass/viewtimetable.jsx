import axios from "axios";
import {React,useEffect,useLayoutEffect,useState} from "react";

function ViewTimeTable(props){

    const [timeTableWithSubjectNames,setTimeTableWithSubjectNames] = useState(props.time_table_with_subject_names)
    return(
        <div className="text-white"  style={{ minWidth: '250px', maxWidth: '250px', marginRight: '550px' }}>
            <table className="table text-white table-fixed border-separate border-spacing-2 border border-neutral-50" style={{'width':'750px'}}>
                
                <thead>
                <tr className="text-red-400 text-lg">
                        <th className="text-green-500">
                            Day
                        </th>
                        <th>
                            Period I
                        </th>
                        <th>
                        Period II
                        </th>
                        <th>
                        Period III
                        </th>
                        <th>
                        Period IV
                        </th>
                        <th>
                        Period V                
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(timeTableWithSubjectNames).map((day,i)=>{
                            return(
                                <tr key={day+" "+i} className="">
                                    <td className="font-bold text-lg capitalize dark:text-yellow-300">{day}</td>
                                    {timeTableWithSubjectNames[day].map((subject_name)=>{
                                        return(
                                        <td key={day+i+subject_name+Math.random()*1000} className="font-normal text-sm text-gray-900 dark:text-violet-300">{subject_name}</td>
                                        )
                                    }
                                    
                                    )
                                    
                                    }
                                </tr>

                                )
                    })
                    }
                </tbody>
            </table>
        </div>  
    )

}

export default ViewTimeTable;