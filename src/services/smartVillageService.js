import axiosInstance from "./axiosInstance";

// Trade Licenses
export const getTradeLicenses = () => axiosInstance.get("/api/sv/trade");
export const createTradeLicense = (data) => axiosInstance.post("/api/sv/trade", data, { headers: { "Content-Type": "multipart/form-data" } });
export const updateTradeLicense = (id, data) => axiosInstance.put(`/api/sv/trade/${id}`, data);
export const deleteTradeLicense = (id) => axiosInstance.delete(`/api/sv/trade/${id}`);

// Land Registrations
export const getLandRegistrations = () => axiosInstance.get("/api/sv/land");
export const createLandRegistration = (data) => axiosInstance.post("/api/sv/land", data, { headers: { "Content-Type": "multipart/form-data" } });
export const updateLandRegistration = (id, data) => axiosInstance.put(`/api/sv/land/${id}`, data);
export const deleteLandRegistration = (id) => axiosInstance.delete(`/api/sv/land/${id}`);

// Gram Sabha
export const getMeetings = () => axiosInstance.get("/api/sv/sabha");
export const createMeeting = (data) => axiosInstance.post("/api/sv/sabha", data);
export const updateMeeting = (id, data) => axiosInstance.put(`/api/sv/sabha/${id}`, data);
export const deleteMeeting = (id) => axiosInstance.delete(`/api/sv/sabha/${id}`);

// Expenses
export const getExpenses = () => axiosInstance.get("/api/sv/expenses");
export const createExpense = (data) => axiosInstance.post("/api/sv/expenses", data);
export const updateExpense = (id, data) => axiosInstance.put(`/api/sv/expenses/${id}`, data);
export const deleteExpense = (id) => axiosInstance.delete(`/api/sv/expenses/${id}`);

// Vendors
export const getVendors = () => axiosInstance.get("/api/sv/vendors");
export const createVendor = (data) => axiosInstance.post("/api/sv/vendors", data);
export const updateVendor = (id, data) => axiosInstance.put(`/api/sv/vendors/${id}`, data);
export const deleteVendor = (id) => axiosInstance.delete(`/api/sv/vendors/${id}`);

// Asset Maintenance
export const getMaintenance = () => axiosInstance.get("/api/sv/maintenance");
export const createMaintenance = (data) => axiosInstance.post("/api/sv/maintenance", data);
export const updateMaintenance = (id, data) => axiosInstance.put(`/api/sv/maintenance/${id}`, data);
export const deleteMaintenance = (id) => axiosInstance.delete(`/api/sv/maintenance/${id}`);
