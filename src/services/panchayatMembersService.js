import axiosInstance from "./axiosInstance";

export const getPanchayatMembers = () => axiosInstance.get("/api/panchayat-members");
export const createPanchayatMember = (data) => axiosInstance.post("/api/panchayat-members", data);
export const updatePanchayatMember = (id, data) => axiosInstance.put(`/api/panchayat-members/${id}`, data);
export const deletePanchayatMember = (id) => axiosInstance.delete(`/api/panchayat-members/${id}`);
