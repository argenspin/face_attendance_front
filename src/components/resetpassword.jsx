import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import NavBar from "./NavBar";
import userlogo from '../img/userlogo.png';
import axios from "axios";


function ResetPassword(){

    const routeParams = useParams();

    const [password,setPassword] = useState('');
    const [confirmpass,setConfirmPass] = useState('')
    const token = routeParams['token'];
    const navigate = useNavigate();

    const submitForm = (e)=>{
        e.preventDefault();
        if(validateForm())
        axios
        .post('/api/password_reset/confirm/',{'token':token,'password':password})
        .then(res=>{
            alert('New password has been successfully set! Click ok to continue to the login page')
            navigate('/login')
            
        })
        .catch(err=>{
            console.log(err)
            alert("Failed to set new password!!")
        })
    }

    const validateForm = () => {

        if(password==='' || confirmpass=='')
        {
            alert("Fields cannot be empty")
            return false;
        }
        if(password!==confirmpass)
        {
            alert("Passwords do not match");
            return false
        }
        return true;
        }
    return(
        <div>
        <NavBar/>
        <div className="container-fluid">
        <div className="row main-content bg-success text-center">
          <div className="col-md-4 text-center company__info">
            <img src={userlogo}/>
          </div>
          <div className="col-md-8 col-xs-12 col-sm-12 login_form ">
            <div className="container-fluid">
              <div className="row">
                <h2 className="text-lg">Reset Password</h2>
              </div>
              <div className="row">
                <form control="" className="form-group">
                  <div className="row">
                    <input type="email" name="email" id="email" value={routeParams['username']} className="form__input" placeholder="Email"/>
                  </div>

                    <div className="row">
                    <input type="password" name="password" id="password" className="form__input" placeholder="New Password" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="row">
                    <input type="password" name="password_confirm" id="password_confirm" className="form__input" placeholder="Confirm Password" onChange={(e) => setConfirmPass(e.target.value)} />
                    </div>
                    <div className="row">
                        <input type="submit" value="Submit" className="btn_login" onClick={(e)=>{submitForm(e);}}/>
                        <input type="reset" value="Clear" className="btn_login"/>
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

export default ResetPassword;