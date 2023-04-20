import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
  } from "react-router-dom";
import Login from './login';
import Registration from "./registration";
import Monitoring from "./monitoring/monitoring";
import About from "./about";
import Home from "./home";
import ResetPassword from "./resetpassword";
function Main(){

        return (
            <div className="min-h-screen bg-[#1b2121]">            
                <Routes>
                    <Route exact path='/' element={<Monitoring/>} />
                    <Route path='login' element={<Login /*func={getTextFromChild} */  />} />
                    <Route path='home/*' element={<Home />} />
                    <Route path='register/:refresh/:username' element={<Registration/>}/>
                    <Route path='about' element={<About/>}/>
                    <Route path='passwordreset/:token/:username' element={<ResetPassword/>} />

                </Routes>
            </div>
        )
}

export default Main;