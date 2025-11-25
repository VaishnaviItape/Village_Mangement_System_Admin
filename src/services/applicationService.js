import axiosInstance from "./axiosInstance";

export const getApplications = async () => {
    return await axiosInstance.get("/api/applications");
};
