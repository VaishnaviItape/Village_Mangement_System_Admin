import axiosInstance from "./axiosInstance";

export const getState = () => axiosInstance.get("/api/states");
export const getStateById = (id) => axiosInstance.get(`/api/states/${id}`);
export const addState = (data) => axiosInstance.post(`/api/states`, data);
export const updateState = (id, data) => axiosInstance.put(`/api/states/${id}`, data);
export const deleteState = (id) => axiosInstance.delete(`/api/states/${id}`);
