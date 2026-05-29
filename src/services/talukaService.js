import axiosInstance from "./axiosInstance";

export const getTalukas = () => axiosInstance.get("/api/taluka");
export const createTaluka = (data) => axiosInstance.post("/api/taluka", data);
export const updateTaluka = (id, data) => axiosInstance.put(`/api/taluka/${id}`, data);
export const deleteTaluka = (id) => axiosInstance.delete(`/api/taluka/${id}`);
