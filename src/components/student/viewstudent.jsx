import {React,useState} from "react";
import { axiosInstance } from "../axiosinstance";
import FaceCapture from "./facecapture";

function ViewStudent(props){
    const [data,setData] = useState({'id':props.data['id'], 'name':props.data['name'],'stud_class_name':props.data['stud_class_name'],'face_photo_b64':props.data['face_photo_b64'],'register_no':props.data['register_no'],'dob':props.data['dob'],'batch_name':props.data['batch_name']});
    const [month,setMonth] = useState(0)
    const [attendancePercentage,setAttendancePercentage] = useState('Nil')
    const months = {'January':1,'February':2,'March':3,'April':4,'May':5,'June':6,
    'July':7,'August':8,'September':9,'October':10,'Novemeber':11,'December':12
            }   

    const getAttendancePercentageForMonth = () => {
        let form_data = new FormData();
        form_data.append('id',data['id'])
        form_data.append('stud_class_name',data['stud_class_name'])
        form_data.append('month',month)
        axiosInstance
        .post('attendance/retrieve/percentage/',form_data)
        .then(res=>{
            setAttendancePercentage(res.data);
        })
        .catch(err=>{
            console.log(err)
        })
    }

    return(
        <div>
            <div className='fixed z-40 max-w-full w-3/4 max-h-full h-4/5 m-2 bg-stone-900 rounded'>
                <h2 className='rounded text-teal-500 text-3xl font-bold m-2'>View Student</h2>
                <br/>
                <br/>
                <div>
                    <label className="text-white text-md font-bold mb-2 m-2 ">Name:</label>
                    <label className=" shadow appearance-none rounded py-1 pr-2 text-white whitespace-nowrap">{data['name']}</label>
                </div>
                <div>
                    <label className="text-white text-md font-bold mb-2 m-2 whitespace-nowrap">Register No:</label>
                    <label className=" shadow appearance-none rounded py-1 pr-2 text-white whitespace-nowrap ">{data['register_no']}</label>
                </div>
                <div>
                    <label className="text-white text-md font-bold mb-2 m-2 whitespace-nowrap">Date of Birth:</label>
                    <label className=" shadow appearance-none rounded py-1 pr-2 text-white whitespace-nowrap ">{data['dob']}</label>
                </div>
                <div>
                    <label className="text-white text-md font-bold mb-2 m-2">Class:</label>
                    <label className=" shadow appearance-none rounded py-1 pr-2 text-white ">{data['stud_class_name']}</label>
                </div>
                <div>
                    <label className="text-white text-md font-bold mb-2 m-2">Batch:</label>
                    <label className=" shadow appearance-none rounded py-1 pr-2 text-white whitespace-nowrap">{data['batch_name']}</label>
                </div>
                <div>
                <label className="text-white text-md font-bold mb-2 m-2">Attendance Percentage:</label>
                <select id='att_month' className="border rounded py-1 px-1 text-gray-700 leading-tight ml-5" defaultValue={1} onChange={(e)=>{setMonth(parseInt(e.target.value));}} >
                    {
                        Object.keys(months).map( (monthKey) => {
                            return (
                                <option value={months[monthKey]} key={months[monthKey]}>{monthKey}</option>
                            )
                        }
                    )
                    }
                </select>  
                <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded' type="button" onClick={getAttendancePercentageForMonth}>Find</button>
                <label className=" shadow appearance-none rounded py-1 pr-2 text-white ">{attendancePercentage!=='Nil'? attendancePercentage+'%' : attendancePercentage}</label>
              
                </div>
                <div>
                    <FaceCapture /*func={hideFaceCaptureComponent} key={viewMode} viewmode={viewMode} usertype={userType}*/ imageSrc={data['face_photo_b64']} viewmode='view'/>
                </div>
                <div className="m-5">
                    <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded' type="button" onClick={() => props.ondone()}>Ok</button>
                    <button className='bg-red-800 text-white py-1 px-3 shadow appearance-none border rounded'type="button" onClick={() => props.ondone()}>Cancel</button> 
                </div>
            </div>
        </div>
    )
}

export default ViewStudent;