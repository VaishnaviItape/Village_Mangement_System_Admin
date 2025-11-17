import axiosInstance from "./axiosInstance";

export const getAttendanceByDate = (date) =>
  axiosInstance.get(`/Attendance/day?date=${date}`);

export const getAttendanceImage = (attendanceId) =>
  axiosInstance.get(`/Attachments/${attendanceId}/Attendance`);
