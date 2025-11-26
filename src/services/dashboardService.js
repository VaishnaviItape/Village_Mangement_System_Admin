import axiosInstance from "./axiosInstance";

export const getDashboardData = () => axiosInstance.get("/api/dashboard");
