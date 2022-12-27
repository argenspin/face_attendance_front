import React, { useState } from 'react';
//import 'bootstrap/dist/css/bootstrap.css'
import {
    useNavigate,Navigate, 
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
  } from "react-router-dom";
import axios from 'axios';
import { useEffect } from 'react';
import { useLayoutEffect } from 'react';
import Sidebar from './sidebar';
import { Container } from 'react-bootstrap';
import '../css/home_page.css'
import Students from './student/students';
import '../css/index.css'
import Teacher from './teacher/teachers';
import Dashboard from './dashboard';
import { axiosInstance } from './axiosinstance';

function Home(props) {



    //axiosInstance.defaults.headers.get['Authorization']  = `JWT ${localStorage.getItem('access')}`;



    const navigate = useNavigate(); //Navigation object to navigate to different address
    //const [refreshToken, setRefreshToken] = useState('')
    const [accessValid,setAccessValid] = useState(true);

    axiosInstance.defaults.headers.post['Content-Type'] = 'application/json'

    axiosInstance.interceptors.request.use(
        request => {
                //request.headers['Authorization'] = `JWT ${localStorage.getItem('access')}`;
            return request;
        },
        error => {
            return Promise.reject(error);
        }
    )


    const checkAccessValid = async() => {
        console.log("TOken refreshing")
        let refreshToken = localStorage.getItem('refresh');
        if(refreshToken)
        {
            await axiosInstance
                .post('/token/refresh/',{'refresh': refreshToken})
                .then(res => {
                    let accessToken = res.data['access'];
                    localStorage.setItem('access',accessToken);
                    setAccessValid(true);
                })
                .catch(err => {
                    setAccessValid(false)
                    console.log("cannot refresh token");
                })
        }
    }


    const checkIfLoggedUserPresent = () => {
        if (!loggedUser)
        {
            axiosInstance
            .get('teacher/retrieve/username/')
            .then(res => {
                console.log(res.data['loggedUser'])
                setLoggedUser(res.data['loggedUser'])
            })
        }
    }

    const [studClassName, setStudClassName] = useState('');
    const [userType,setUserType] = useState('')
    const [loggedUser,setLoggedUser] = useState(props.loggedUser);

    const getUserTypeAndStudClassName = async() => {
        await axiosInstance
        .get('usertypestudclass/retrieve/')
        .then(res => {
            setUserType(res.data['user_type']);
            setStudClassName(res.data['stud_class_name']);
        })
        .catch(err => {
            console.log(err);
        })
    }

    const logOutUser = () => {
        if(localStorage.getItem('access'))
        {
            setAccessValid(false);
            axiosInstance
            .post('token/blacklist/' ,{'refresh':localStorage.getItem('refresh')})
            .then(res => {
                console.log("blacklisted successfully");
            })
            .catch(err => {
                console.log(err);
            })
            localStorage.clear();
            console.log("logout function called");
            //navigate('/login'); //Go to login page after logging out
        }
    }

    //Refresh the access token every 1 minute
    const [count, setCount] = useState(0);

    useEffect(() => {
     const timeout = setTimeout(() => {
        setCount(count+1);
        checkAccessValid();
      }, 60000);
  
     return () => clearTimeout(timeout);
    },[count]);
    

    useLayoutEffect(()=> {
                getUserTypeAndStudClassName();
                checkIfLoggedUserPresent();
                console.log("useEFect working")

                //requestWithToken();
                checkAccessValid();
                console.log(accessValid);
            },[]
            )
    useEffect(()=>{
        navigate('dashboard')
    },[])

    if(accessValid && localStorage.getItem('access')) //Check if user is logged in
    {
        if(studClassName==='Not Assigned')
        {
            return(
                <div>
                    <h1>This teacher has not been assigned a class yet</h1>
                    <button className='inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-red-600 text-white hover:bg-red-700 logout_button' type='button' onClick={logOutUser}>Logout</button>

                </div>
            )
        }
        else
        {
        //requestWithToken();
            return(
                <div className='home bg-slate-600'>
                        <Sidebar/>
                        <Container className="relative ml-64 ">
                        <Routes>
                            <Route path='/dashboard' element={<Dashboard/>} />
                            <Route path='/students' element={<Students />} />
                            <Route path='/teachers' element={<Teacher/>} />
                        </Routes>
                    
                    <h6 className='logged_user font-bold'>{userType}: {loggedUser}</h6>
                    <button className='inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-red-600 text-white hover:bg-red-700 logout_button' type='button' onClick={logOutUser}>Logout</button>

                    </Container>
                </div>
            )
        }
    }
    else if(!accessValid && localStorage.getItem('access'))
    {
        logOutUser();
        return(
            <Navigate to='/login' />
        )
    }
    else
    {
        return(
            <Navigate to='/login' />
        )
    }
}

export default Home;
