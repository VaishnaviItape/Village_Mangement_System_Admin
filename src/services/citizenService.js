import axiosInstance from "./axiosInstance";

const BASE_URL = "/api/citizens";

export const getCitizens = () => axiosInstance.get(BASE_URL);
export const addCitizen = (data) => axiosInstance.post(BASE_URL, data);
export const updateCitizen = (id, data) => axiosInstance.put(`${BASE_URL}/${id}`, data);
export const deleteCitizen = (id) => axiosInstance.delete(`${BASE_URL}/${id}`);
