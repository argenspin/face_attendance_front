import axios from "axios";
import React, { useState } from "react";
import { axiosInstance } from "../axiosinstance";

function TeacherLogin(props){

    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');

    const validateForm = () => {
        let valid = true; 
        /*if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)))
        {
          valid=false
          alert("Invalid Email address")
        }*/
        if(password==='' || username==='')
        {
          valid=false;
          alert("Fields cannot be empty")
        }
        return valid;
      }

    const submitLogin = async(e) => {
        e.preventDefault();
        if(validateForm())
        {
          await axiosInstance
          .post('token/obtain/', {'username':username,'password':password},{headers: {'Content-Type':'application/json'}})
          .then(res =>{
            localStorage.setItem('refresh',res.data['refresh']);
            localStorage.setItem('access',res.data['access']);  
            getStudClassName();          
          } )
          .catch(err => {
            alert(err);
          })
        }
    }

    const createAttendanceObjectsOnLogin = async(stud_class_name,access_token) => {
      let form_data = new FormData()
      form_data.append('stud_class_name',stud_class_name);
      await axios
      .post('api/attendance/onteacherlogin/create/',form_data,{headers:{'Authorization': `JWT ${access_token}`,"Content-Type": "multipart/form-data"}})
      .then(res=>{
      console.log(res.data)
    })
    .catch(err=>{
      console.log(err)
    })
  }

    const getStudClassName = async() => {
        axiosInstance
            .get('usertypestudclass/retrieve/')
            .then(res=>{
                console.log(res.data);
                if(res.data['user_type']==='admin')
                {
                  let access_token = localStorage.getItem('access')
                  let refresh_token = localStorage.getItem('refresh')
                  localStorage.removeItem('refresh');
                  localStorage.removeItem('access');
                  console.log(access_token)
                  console.log("ADmin login part here")
                  props.onadminlogin(access_token,refresh_token);
                }
                else if(res.data['user_type']==='teacher')
                {
                  let access_token = localStorage.getItem('access')
                  createAttendanceObjectsOnLogin(res.data['stud_class_name'],access_token)
                  props.onlogin(res.data['stud_class_name']);
                  localStorage.removeItem('refresh');
                  localStorage.removeItem('access');
                }

                
            }
            )
            .catch(err=>{
                alert(err);
                localStorage.removeItem('refresh');
                localStorage.removeItem('access');
            })
    }

    return (
        <div className='fixed z-40 max-w-md w-2/4 max-h-full h-2/5 m-2 rounded bg-stone-900 '>
            <h2 className='rounded text-teal-500 text-3xl font-bold m-3 bg-opacity-95'>Login</h2>
            <br/>
            <form>
            <label className="text-white text-sm font-bold mb-2 m-2">Username: </label>
            <input  type="text" id="username" className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight "
              onChange={(e)=>{setUsername(e.target.value)}}  />
            <label className="text-white text-sm font-bold mb-2 m-2">Password: </label>
            <input  type="password" className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight "
              onChange={(e)=>{setPassword(e.target.value)}} />
            <br/>
            <br/>
            <div className="m-2">
                <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded'type="submit" onClick={(e)=>{submitLogin(e)}}>Login</button> 
                <button className='bg-red-800 text-white py-1 px-3 shadow appearance-none border rounded'type="button" onClick={()=>{props.oncancel()}}>Cancel</button> 
            </div>
            </form>
        </div>
    )
}

export default TeacherLogin;