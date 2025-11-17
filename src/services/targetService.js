import axiosInstance from "./axiosInstance";

export const getTargets = (month, year, includeSales = false) => {
  return axiosInstance.get(`/Targets?month=${month}&year=${year}&includeSales=${includeSales}`);
};