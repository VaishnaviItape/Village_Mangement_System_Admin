import axiosInstance from "./axiosInstance";

export const getProperty = () => axiosInstance.get("/api/properties");

export const addProperty = (data) => axiosInstance.post("/api/properties", data);

export const updateProperty = (id, data) =>
    axiosInstance.put(`/api/properties/${id}`, data);

export const deleteProperty = (id) =>
    axiosInstance.delete(`/api/properties/${id}`);

export const bulkUploadProperty = (formData) =>
    axiosInstance.post("/api/property/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
