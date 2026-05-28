import axiosInstance from "./axiosInstance";

export const getSchemeApplications = () =>
    axiosInstance.get("/api/scheme-applications");

export const addSchemeApplication = (data) =>
    axiosInstance.post("/api/scheme-applications", data);

export const updateSchemeApplication = (id, data) =>
    axiosInstance.put(`/api/scheme-applications/${id}`, data);

export const deleteSchemeApplication = (id) =>
    axiosInstance.delete(`/api/scheme-applications/${id}`);
