import axiosInstance from "./axiosInstance";

export const getProducts = () => axiosInstance.get("/Products");
export const addProduct = (data) => axiosInstance.post("/Products", data);
export const updateProduct = (id, data) => axiosInstance.put(`/Products/${id}`, data);
export const deleteProduct = (id) => axiosInstance.delete(`/Products/${id}`);
