import axios from "axios";

export const axiosInstance = axios.create({
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
            refreshTheToken();
        }
        return Promise.reject(error);
    }
)

axiosInstance.interceptors.request.use(
    request => {
            request.headers['Authorization'] = `JWT ${localStorage.getItem('access')}`;
        return request;
    },
    error => {
        return Promise.reject(error);
    }
)

const refreshTheToken = async() => {
    console.log("TOken refreshing")
    let refreshToken = localStorage.getItem('refresh');
    if(refreshToken)
    {
        await axiosInstance
            .post('/token/refresh/',{'refresh': refreshToken})
            .then(res => {
                let accessToken = res.data['access'];
                localStorage.setItem('access',accessToken);
            })
            .catch(err => {
                console.log("cannot refresh token");
            })
    }
}
