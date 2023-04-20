import {React,useEffect,useLayoutEffect,useState} from "react";
import '../css/sidebar.css';
import { Link,NavLink } from "react-router-dom";
import { Nav,Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' 
import { faHome,faUser,faSchool, faBook, faBookBible, faBookAtlas, faPerson, faPersonChalkboard, faRestroom, faHomeUser, faBookReader } from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "./axiosinstance";

function Sidebar(){

    const [studClassName, setStudClassName] = useState('');
    const [userType,setUserType] = useState('')
    const [teacherLink,setTeacherLink] = useState([])
    const [classesLink,setClassesLink] = useState([])
    const [subjectsLink,setSubjectsLink] = useState([])


    const LinkClassName = 'hover:bg-slate-700 rounded d-flex align-items-center px-3 ml-1 mb-4';
    const SpanClassName = "m-2 sidebar-option text-3xl text-teal-600 font-bold "
    const faClassName = "text-teal-500"

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

                <NavLink className={ClassNameForLink} to='teachers'>
                <FontAwesomeIcon className={faClassName} icon={faPersonChalkboard}  size='xl' />
                <span className={SpanClassName}>Teachers</span>
                </NavLink>
            )
        }
        else{
            setTeacherLink(
                null
            )
        }
    }

    const getClassesLink = () => {
        if(userType==='admin')
        {
            setClassesLink(

                <NavLink className={ClassNameForLink} to='classes'>
                <FontAwesomeIcon className={faClassName} icon={faHomeUser}  size='xl' />
                <span className={SpanClassName}>Classes</span>
                </NavLink>
            )
        }
        else{
            setClassesLink(
                null
            )
        }
    }

    const getSubjectsLink = () => {
        if(userType==='admin')
        {
            setSubjectsLink(

                <NavLink className={ClassNameForLink} to='subjects'>
                <FontAwesomeIcon className={faClassName} icon={faBook}  size='xl' />
                <span className={SpanClassName}>Subjects</span>
                </NavLink>
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
        getClassesLink();
        getSubjectsLink();
    },[userType])

    return(
        <div className="sidebar bg-stone-900 rounded-r-3xl">
            <Nav className="flex-column pt-2 px-1">
                <NavLink className="d-flex align-items-center justify-content-center mb-10 " to='/home'>
                <FontAwesomeIcon className="text-teal-500 hover:text-slate-700" icon={faHome}  size='3x' />
                </NavLink>

                <NavLink to='dashboard' className={ClassNameForLink}>
                <FontAwesomeIcon className={faClassName} icon={faBookAtlas}  size='xl' />
                <span className={SpanClassName}>Dashboard</span>
                </NavLink>

                <NavLink className={ClassNameForLink} to='students'>
                <FontAwesomeIcon className={faClassName} icon={faUser}  size='xl' />
                <span className={SpanClassName}>Students</span>
                </NavLink>

                {teacherLink}
                {classesLink}
                {subjectsLink}

                <NavLink  className={ClassNameForLink} to='attendance'>
                <FontAwesomeIcon className={faClassName} icon={faBookReader}  size='xl' />
                <span className={SpanClassName}>Attendance</span>
                </NavLink>
            </Nav>
            

        </div>
        
    )

}

export default Sidebar;