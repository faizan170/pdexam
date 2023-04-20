import axios from "axios";
import { API_URL } from "../../configs/endpoint";
const getToken = () => {
    return localStorage.getItem("accessToken")?.replace('"', "")?.replace('"', "")
}

const instance = axios.create({
  baseURL: API_URL,
});

instance.interceptors.request.use(
    (config) => {
        // ** Get token from localStorage
        const accessToken = getToken()
        

        // ** If token is present add it to request's Authorization Header
        if (accessToken) {
            // ** eslint-disable-next-line no-param-reassign
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    // Add any response interceptors here
    return response;
  },
  (error) => {
    // Handle any response errors here
    return Promise.reject(error);
  }
);

export default instance;