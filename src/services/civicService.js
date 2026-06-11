import axiosInstance from "./axiosInstance";

export const getCivicRegistrations = () => axiosInstance.get("/api/civic");
export const getMyCivicRegistrations = () => axiosInstance.get("/api/civic/my");
export const createCivicRegistration = (data) => axiosInstance.post("/api/civic", data, { headers: { "Content-Type": "multipart/form-data" } });
export const updateCivicRegistration = (id, data) => axiosInstance.put(`/api/civic/${id}`, data);
export const deleteCivicRegistration = (id) => axiosInstance.delete(`/api/civic/${id}`);
