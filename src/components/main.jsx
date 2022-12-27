import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useLocation,
  } from "react-router-dom";
import NavBar from './NavBar';
import Login from './login';
import Registration from "./registration";
import Monitoring from "./monitoring";
import About from "./about";
import Home from "./home";
import { useLayoutEffect } from "react";
import { useEffect } from "react";
function Main(){

    const [loggedUser, setLoggedUser] = useState('')

    //Function to return value from parent to child
    /*
    const getTextFromChild = (recievedLoggedUser) =>{
        setLoggedUser(recievedLoggedUser);
        console.log(recievedLoggedUser);
    }
    */
    



        return (
            <div>
                {/*<NavBar/>*/}
            
                <Routes>
                    <Route exact path='/' element={<Monitoring/>} />
                    <Route path='login' element={<Login /*func={getTextFromChild} */  />} />
                    <Route path='home/*' element={<Home />} />
                    <Route path='register/:refresh/:username' element={<Registration/>}/>
                    <Route path='about' element={<About/>}/>

                </Routes>
            </div>
        )
}

export default Main;