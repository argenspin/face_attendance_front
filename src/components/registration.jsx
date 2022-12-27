import axios from "axios";
import {React,useEffect,useLayoutEffect,useState} from "react";
import NavBar from "./NavBar";
import {useNavigate,Navigate, useParams} from 'react-router-dom'
import '../css/test_login.css';
import userlogo from '../img/userlogo.png';
import { Link } from "react-router-dom";

function Registration(){

    const routeParams = useParams();
    const navigate = useNavigate();
    const [teachername,setTeacherName] = useState('')
    const [username,setUsername] = useState('')
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [accessToken,setAccessToken] = useState('')
    const [mainComponent,setMainComponent] = useState('')
    const [alreadyRegistered,setAlreadyRegistered] = useState(false)

    const axiosInstance = axios.create({
      baseURL: '/api/',
      headers: {'Content-Type':'multipart/form-data'},
      timeout: 1000
  })

    axiosInstance.interceptors.response.use(
      response => {
          console.log("Interceptor working")
          return response
      },
      error => {
          console.log("Error catched by interceptor");
          if(error.response.status == 401)
          {
              return Promise.reject(error);
          }
      }
    ) 

  axiosInstance.interceptors.request.use(
      request => {
              request.headers['Authorization'] = `JWT ${accessToken}`;
          return request;
      },
      error => {
          return Promise.reject(error);
      }
  )


  const getAccessToken = async() => {
    await axiosInstance
    .post('token/refresh/', {'refresh':routeParams['refresh']})
    .then(res => {
      console.log(res.data)
      setAccessToken(res.data['access'])
      
    })
    .catch(err=> {
      setAlreadyRegistered(true);
      console.log("culprit")
      console.log(err);
    })


  }
    const validateForm = () => {
        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)))
        {
          //valid=false
          alert("Invalid Email address")
          return false;
        }
        if(password==='' || username==='')
        {
          //valid=false;
          alert("Fields cannot be empty")
          return false;
        }
        return true;
      }

    const submitForm = (e) => {
      e.preventDefault();
        if(1)
        {
            let form_data = new FormData();
            form_data.append('name',teachername)
            form_data.append('username',username)
            form_data.append('password',password)
            axiosInstance
            .post('teacher/completeregister/', form_data)
            .then(res => {
              axiosInstance
              .post('token/blacklist/', {'refresh':routeParams['refresh']})
              .then(res => {
                  console.log("blacklisted successfully");
              })
              .catch(err => {
                  console.log(err);
              })
                alert('Registration completed successfully. Now login using the registered credentials');
                navigate('/login');
            })
            .catch(err => {
                alert(err);
            })
        }
    }

    useEffect(()=> {
      setUsername(routeParams['username']);
      getAccessToken();
    },[])

    if(!localStorage.getItem('access') && !alreadyRegistered)
    {
      console.log(routeParams)
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
              <h2>Complete Teacher Registration</h2>
            </div>
            <div className="row">
              <form control="" className="form-group">
                <div className="row">
                  <input type="text" name="name" id="name" className="form__input" placeholder="Name" onChange={(e) => setTeacherName(e.target.value)}/>
                </div>
                <div className="row">
                  <input type="email" name="email" id="email" value={routeParams['username']} className="form__input" placeholder="Email"/>
                </div>

                <div className="row">
                  {/*<span className="fa fa-lock"></span>*/}
                  <input type="password" name="password" id="password" className="form__input" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="row">
                  {/*<span className="fa fa-lock"></span>*/}
                  <input type="password" name="password_confirm" id="password_confirm" className="form__input" placeholder="Confirm Password" onChange={(e) => setPassword(e.target.value)} />
                </div>
  
                <div className="row">
                  <input type="submit" value="Submit" className="btn_login" onClick={(e)=>submitForm(e)} />
                  <input type="reset" value="Reset" className="btn_login" />
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
        <div>
        <h1>This user has already completed the registration. click <a href='/login'>here</a> to login</h1>
        </div>
      
      )
    }

}

export default Registration;