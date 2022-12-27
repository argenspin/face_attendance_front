import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-bootstrap';
import ihrdlogo from '../img/ihrdlogo.png';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
  } from "react-router-dom";
import { useState } from 'react';
import { useEffect } from 'react';
import { useLayoutEffect } from 'react';

function NavBar() {

  const [show,setShow] = useState(false);

  useEffect(()=> {
    if(!localStorage.getItem('loggedUser'))
    {
      setShow(true);
    }
    else
    {
      setShow(false);
    }
  },[])

  useLayoutEffect(()=> {
    if(!localStorage.getItem('access'))
    {
      setShow(true);
    }
    else
    {
      setShow(false);
    }
  })

  if(show)
  {
  return (
    
    <div className='max-w-full bg-green-500'>

<Navbar className='p-1' bg="dark" variant="dark">
        <Container>
          <Navbar.Brand className='p-2' href="/"><img src={ihrdlogo}/></Navbar.Brand>
          <Nav className="me-auto">
            <Link className='text-2xl m-2 text-gray-400	' to="/">Monitoring</Link>
            <Link className='text-2xl m-2 text-gray-400' to="/login">Login</Link>
            <Link className='text-2xl m-2 text-gray-400' to="/about">About</Link>
          </Nav>
        </Container>
      </Navbar>
    </div>
  )
  }
  else{
    console.log("Navbar hidden")
  }
}

export default NavBar;
