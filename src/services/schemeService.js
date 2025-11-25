import axiosInstance from "./axiosInstance";

export const getSchemes = () => axiosInstance.get("/api/schemes");

export const addScheme = (data) => axiosInstance.post("/api/schemes", data);

export const updateScheme = (id, data) =>
    axiosInstance.put(`/api/schemes/${id}`, data);

export const deleteScheme = (id) =>
    axiosInstance.delete(`/api/schemes/${id}`);
