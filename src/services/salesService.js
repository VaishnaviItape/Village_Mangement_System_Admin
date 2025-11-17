import axiosInstance from "./axiosInstance";

export const getSalesByMonth = (month, year) =>
  axiosInstance.get(`/Sales/monthly?month=${month}&year=${year}`);
