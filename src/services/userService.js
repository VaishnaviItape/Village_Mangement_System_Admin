import axiosInstance from "./axiosInstance";

export const getUsers = () => axiosInstance.get("/api/users");

export const addUser = (data) =>
    axiosInstance.post("/api/users", data, {
        headers: { "Content-Type": "multipart/form-data" }
    });

export const updateUser = (id, data) =>
    axiosInstance.put(`/api/users/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
    });

export const deleteUser = (id) => axiosInstance.delete(`/api/users/${id}`);

export const uploadUserImage = (id, file) =>
    axiosInstance.post(`/api/users/upload-image/${id}`, file, {
        headers: { "Content-Type": "multipart/form-data" }
    });

export const uploadUsersBulk = (file) =>
    axiosInstance.post("/api/users/upload-bulk", file, {
        headers: { "Content-Type": "multipart/form-data" }
    });
