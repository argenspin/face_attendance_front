
import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
    useNavigate,
  } from "react-router-dom";
//import 'bootstrap/dist/css/bootstrap.css'
import Form from 'react-bootstrap/Form';
import '../css/form_style.css'
import axios from "axios"
import NavBar from "./NavBar";
import Dashboard from "./home";
import '../css/test_login.css'
import ihrdlogo from '../img/ihrdlogo.png';
import userlogo from '../img/userlogo.png';
import { axiosInstance } from "./axiosinstance";

function Login(props){

  axiosInstance.defaults.headers.post['Content-Type'] = 'application/json'
  axiosInstance.interceptors.response.use(
    response => {
        console.log("Interceptor working")
        return response
    },
    error => {
        console.log("Error catched by interceptor");
        return Promise.reject(error);
    }
)

axiosInstance.interceptors.request.use(
    request => {
        return request;
    },
    error => {
        return Promise.reject(error);
    }
)
  const navigate = useNavigate();
  const [password,setPassword] = useState('')
  const [username, setUsername] = useState('')

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

  const submitForm = async(e) => {
    e.preventDefault();
    if(validateForm())
    {
      await axiosInstance
      .post('token/obtain/', {'username':username,'password':password},{headers: {'Content-Type':'application/json'}})
      .then(res =>{
        localStorage.setItem('refresh',res.data['refresh']);
        localStorage.setItem('access',res.data['access']);
        console.log("asdasd");
        navigate('/home')

      } )
      .catch(err => {
        alert(err);
      })
    }
    
  }

  const gotoRegistration = () => {
    navigate('/register');
  }
  if(!localStorage.getItem('access'))
  {

  return(
    <div>
    <NavBar/>
    <div className="container-fluid">
		<div className="flex flex-wrap  main-content bg-green-500 text-center">
			<div className="md:w-1/3 pr-4 pl-4 text-center company__info">
				<img src={userlogo}/>
			</div>
			<div className="md:w-2/3 sm:w-full pr-4 pl-4 login_form ">
				<div className="container max-w-full mx-auto sm:px-4">
					<div className="flex flex-wrap ">
						<h2>Log In</h2>
					</div>
					<div className="flex flex-wrap ">
						<form control="" className="mb-4">
							<div className="flex flex-wrap ">
								<input type="text" name="username" id="username" className="form__input" placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
							</div>
							<div className="flex flex-wrap ">
								{/*<span className="fa fa-lock"></span>*/}
								<input type="password" name="password" id="password" className="form__input" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
							</div>

							<div className="flex flex-wrap ">
								<input type="submit" value="Submit" className="btn_login" onClick={(e)=>submitForm(e)}/>
                <input type="button" value="Forgot Password" className="btn_login" />
              </div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
  </div>
  )
  }
  else
  {
    //props.func(username) //Calling the 'func' props to return value to parent component
    return(
      <Navigate to='/home'/>
    
    )
  }
}

export default Login;
