import axiosInstance from "./axiosInstance";

// Get all leave requests
export const getLeaveRequests = () => axiosInstance.get("/LeaveRequests");

// Update leave request status
export const updateLeaveStatus = (id, data) =>
  axiosInstance.put(`/LeaveRequests/${id}/status`, data);
