import axiosInstance from "./axiosInstance";

export const getStates = () => axiosInstance.get("/States");
export const addState = (data) => axiosInstance.post("/States", data);
export const updateState = (id, data) => axiosInstance.put(`/States/${id}`, data);
export const deleteState = (id) => axiosInstance.delete(`/States/${id}`);
