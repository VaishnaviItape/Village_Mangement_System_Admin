import axiosInstance from "./axiosInstance";

export const getComplaints = async () => {
    return await axiosInstance.get("/api/complaints");
};
