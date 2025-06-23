import  axios from "axios";

import { refreshUserToken } from "../features/authSlice";
// Create Axios Instance with Credentials
const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  });
  
  // Add request interceptor for debugging
  api.interceptors.request.use(
    (config) => {
      console.log('Request:', config.method?.toUpperCase(), config.url);
      return config;
    },
    (error) => {
      console.error('Request Error:', error);
      return Promise.reject(error);
  });
  
  
  
  // Interceptors for token Refresh
  api.interceptors.response.use(
    (response) => response,
      async (error) =>{
        const originalRequest = error.config;
        if(error.message.status === 401){
          originalRequest._retry = true;
          try {
            await refreshUserToken();
            return api(originalRequest);
          } catch (refreshError) {
              return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      });
  
    
export default api;