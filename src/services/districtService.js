import axiosInstance from "./axiosInstance";

export const getDistricts = () => axiosInstance.get("/api/districts");
export const addDistrict = (data) => axiosInstance.post("/api/districts", data);
export const updateDistrict = (id, data) => axiosInstance.put(`/api/districts/${id}`, data);
export const deleteDistrict = (id) => axiosInstance.delete(`/api/districts/${id}`);
