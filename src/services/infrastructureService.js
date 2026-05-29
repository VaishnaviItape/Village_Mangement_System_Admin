import axiosInstance from "./axiosInstance";

export const getInfrastructure = () => axiosInstance.get("/api/infrastructure");
export const createInfrastructure = (data) => axiosInstance.post("/api/infrastructure", data);
export const updateInfrastructure = (id, data) => axiosInstance.put(`/api/infrastructure/${id}`, data);
export const deleteInfrastructure = (id) => axiosInstance.delete(`/api/infrastructure/${id}`);
