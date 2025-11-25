import axiosInstance from "./axiosInstance";

export const getTaxes = () => axiosInstance.get("/api/taxes");
export const addTax = (data) => axiosInstance.post("/api/taxes", data);
export const updateTax = (id, data) => axiosInstance.put(`/api/taxes/${id}`, data);
export const deleteTax = (id) => axiosInstance.delete(`/api/taxes/${id}`);
