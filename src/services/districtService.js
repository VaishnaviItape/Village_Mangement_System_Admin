import axiosInstance from "./axiosInstance";

export const getDistricts = () => axiosInstance.get("/Districts");
export const addDistrict = (data) => axiosInstance.post("/Districts", data);
export const updateDistrict = (id, data) => axiosInstance.put(`/Districts/${id}`, data);
export const deleteDistrict = (id) => axiosInstance.delete(`/Districts/${id}`);
