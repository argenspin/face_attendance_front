import React, { useState } from "react";
import axios from "axios";

function ForgotPassword(props){

    const [forgotEmail,setForgotEmail] = useState('')
    const [forgotPasswordSendButtonDisabled,setForgotPasswordSendButtonDisabled] = useState(false)

    const sendForgotPasswordLink = () => {
        if((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(forgotEmail)))
        {
            setForgotPasswordSendButtonDisabled(true)
          axios
          .post('api/password_reset/',{'email':forgotEmail})
          .then(res=>{
            alert("Link to reset password has been sent to the registered email address!")
            props.ondone();
          })
          .catch(err=>{
            setForgotPasswordSendButtonDisabled(false)
            console.log(err)
          })
        }
        else
        {
          alert("Invalid Email address!!")
        }
      }

    return (
        <div className='fixed z-40 max-w-full w-5/12 max-h-full m-2 bg-stone-900 bg-opacity-95 rounded' style={{'min-height':'38%','minWidth':'48%'}}>
        <div className="float-left">
      <h2 className='rounded text-gray-300 float-left text-3xl font-bold m-2'>Forgot Password</h2>
      <br/>    
      <div className="mt-5 float-left">
      <label className="text-white text-lg font-bold mb-2 m-2 whitespace-nowrap">Registered Email:</label>
            <input  type="email" id='email' className=" shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight ml-12" onChange={
                    (e)=>{setForgotEmail(e.target.value)}} />
           <br/>
           <div className="float-left mt-5 ml-3">
                <button className='bg-blue-600 text-white py-1 px-3 m-2 shadow appearance-none border rounded'type="button" disabled={forgotPasswordSendButtonDisabled} onClick={(e)=>{sendForgotPasswordLink();}} >Send Reset Link</button> 
                <button className='bg-red-800 text-white py-1 px-3 shadow appearance-none border rounded'type="button" onClick={()=>{props.ondone()}} >Cancel</button> 
            </div>
     
      </div>
      </div>
      </div>
    )
}

export default ForgotPassword;