import axiosInstance from "./axiosInstance";

export const getDashboardData = () => axiosInstance.get("/Tenants/dashboard_view");
