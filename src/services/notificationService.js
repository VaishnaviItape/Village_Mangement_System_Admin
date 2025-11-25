import axiosInstance from "./axiosInstance";
const BASE_URL = "/api/notifications";

export const getNotifications = () => axiosInstance.get(BASE_URL);
export const addNotification = (data) => axiosInstance.post(BASE_URL, data);
export const updateNotification = (id, data) => axiosInstance.patch(`${BASE_URL}/${id}`, data);
export const deleteNotification = (id) => axiosInstance.delete(`${BASE_URL}/${id}`);
