import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "https://dummyjson.com",
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
(response) => response, 
(error) => {
    if(error.response) {
        console.error("API Error:", error.response.status, error.response.data);
    } else {
        console.error("Network Error:", error.message);
    }
    return Promise.reject(error);
}
);

export default axiosInstance;