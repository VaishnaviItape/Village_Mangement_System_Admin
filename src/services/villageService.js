import axiosInstance from "./axiosInstance";

export const getVillages = () => axiosInstance.get("/api/villages");
export const getVillageById = (id) => axiosInstance.get(`/api/villages/${id}`);
export const addVillage = (data) => axiosInstance.post(`/api/villages`, data);
export const updateVillage = (id, data) => axiosInstance.put(`/api/villages/${id}`, data);
export const deleteVillage = (id) => axiosInstance.delete(`/api/villages/${id}`);
