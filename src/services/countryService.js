import axiosInstance from "./axiosInstance";

export const getCountries = () => axiosInstance.get("/Countries");
export const addCountry = (data) => axiosInstance.post("/Countries", data);
export const updateCountry = (id, data) => axiosInstance.put(`/Countries/${id}`, data);
export const deleteCountry = (id) => axiosInstance.delete(`/Countries/${id}`);
