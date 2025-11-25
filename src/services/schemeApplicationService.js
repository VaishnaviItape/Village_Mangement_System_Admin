import axiosInstance from "./axiosInstance";

export const getSchemeApplications = () =>
    axiosInstance.get("/api/scheme-applications");
