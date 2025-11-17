import axios from "axios";
import { API_BASE_URL } from "@/config/apiConfig";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// 🔹 Automatically attach Bearer token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🔹 Central error handler
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    if (error.response?.status === 401) {
      toast.error("Session expired — please login again!");
      localStorage.removeItem("authToken");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;