
import React, { useState } from "react";
import {
    Navigate,
    useNavigate,
  } from "react-router-dom";
import '../css/form_style.css'
import NavBar from "./NavBar";
import '../css/test_login.css'
import userlogo from '../img/userlogo.png';
import { axiosInstance } from "./axiosinstance";
import ForgotPassword from "./forgotpassword";

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

  const [forgotEmail,setForgotEmail] = useState('')
  const [forgotPasswordComponent,setForgotPasswordComponent] = useState([])
  const validateForm = () => {
    let valid = true; 
    if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(username)))
    {
      valid=false
      alert("Invalid Email address")
    }
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
        navigate('/home/dashboard')

      } )
      .catch(err => {
        alert(err);
      })
    }
    
  }

  const effectsAfterForgotComponentDisabled = () => {
    setForgotPasswordComponent([]);

  }

  const getForgotPasswordComponent = () => {
    setForgotPasswordComponent(
      <ForgotPassword ondone={effectsAfterForgotComponentDisabled}/>
    )
  }

  if(!localStorage.getItem('access'))
  {

  return(
    <div>

    <NavBar/>
  <div className="flex flex-row max-h-fit justify-center items-center m-4">
    <h2 className="text-gray-400 font-bold h2" >Login</h2>
    </div>
    <div className="container-fluid">

		<div className="flex flex-wrap  main-content bg-gray-500 text-center">
    {forgotPasswordComponent}
			<div className="md:w-1/3 pr-4 pl-4 text-center company__info">
				<img src={userlogo}/>
			</div>
			<div className="md:w-2/3 sm:w-full pr-4 pl-4 login_form ">
				<div className="container max-w-full mx-auto sm:px-4">
					<div className="flex flex-wrap ">
						
					</div>
					<div className="flex flex-wrap ">
						<form control="" className="mb-4">
							<div className="flex flex-wrap ">
								<input type="text" name="username" id="username" className="form__input" placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
							</div>
							<div className="flex flex-wrap ">
								<input type="password" name="password" id="password" className="form__input" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
							</div>

							<div className="flex flex-wrap ">
								<input type="submit" value="Submit" className="btn_login" onClick={(e)=>submitForm(e)}/>
                <input type="button" value="Forgot Password" className="btn_login" onClick={getForgotPasswordComponent} />
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
    return(
      <Navigate to='/home/dashboard'/>
    
    )
  }
}

export default Login;
