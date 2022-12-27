import {React,useEffect,useLayoutEffect,useState} from "react";
import '../css/sidebar.css';
import { Link,NavLink } from "react-router-dom";
import { Nav,Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' 
import { faHome,faUser,faSchool, faBook } from "@fortawesome/free-solid-svg-icons";
import {logOutUser} from './home'
import { axiosInstance } from "./axiosinstance";

function Sidebar(){

    const [studClassName, setStudClassName] = useState('');
    const [userType,setUserType] = useState('')
    const [teacherLink,setTeacherLink] = useState([])

    const ClassNameForLink = ({ isActive }) => (isActive ? (LinkClassName+' bg-slate-700') : LinkClassName)

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

    const getTeacherLink = () => {
        if(userType==='admin')
        {
            setTeacherLink(
                <div>
                <NavLink className={ClassNameForLink} to='teachers'>
                <FontAwesomeIcon className={faClassName} icon={faUser}  size='xl' />
                <span className={SpanClassName}>Teachers</span>
                </NavLink>
                <br/>
                </div>
            )
        }
        else{
            setTeacherLink(
                null
            )
        }
    }

    useLayoutEffect(()=> {
        getUserTypeAndStudClassName();
    },[])

    useEffect(()=>{
        getTeacherLink();
    },[userType])

    const LinkClassName = 'hover:bg-slate-700 rounded d-flex align-items-center justify-content-center';
    const SpanClassName = "m-2 sidebar-option text-3xl text-teal-600 font-bold"
    const faClassName = "text-teal-500"

    return(
        <div className="sidebar bg-gray-800 rounded-r">
            <Nav className="flex-column pt-2 px-1">
                <Link className="d-flex align-items-center justify-content-center " to='/home'>
                <FontAwesomeIcon className="text-teal-500 hover:text-slate-700" icon={faHome}  size='3x' />
                </Link>
                <br/>
                <br/>

                <NavLink to='dashboard' className={ClassNameForLink}>
                <FontAwesomeIcon className={faClassName} icon={faSchool}  size='xl' />
                <span className={SpanClassName}>Dashboard</span>
                </NavLink>
                <br/>
                <NavLink className={ClassNameForLink} to='students'>
                <FontAwesomeIcon className={faClassName} icon={faUser}  size='xl' />
                <span className={SpanClassName}>Students</span>
                </NavLink>
                <br/>
                {teacherLink}
                <NavLink  className={ClassNameForLink} to='attendance'>
                <FontAwesomeIcon className={faClassName} icon={faBook}  size='xl' />
                <span className={SpanClassName}>Attendance</span>
                </NavLink>

            </Nav>
            

        </div>
        
    )

}

export default Sidebar;