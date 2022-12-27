import React, { useState } from "react";
import NavBar from "./NavBar";

function About(){

    const [name,setName] = useState('fassdaf')

    const showName = () => {
        setName('Hello');
    }

    return(
        <div>
            <NavBar/>
            <h1 className="h1">Work in progress</h1>
            <h1>{name}</h1>
            <button type="button" onClick={showName}>Show</button>`
        </div>
    )
}
 
export default About;