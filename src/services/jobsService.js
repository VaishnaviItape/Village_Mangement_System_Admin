import axiosInstance from "./axiosInstance";

export const getJobLogById = async (id) => {
    try {
        const res = await axiosInstance.get(`/Jobs/logs/${id}`);
        return res.data;
    } catch (err) {
        console.error("getJobLogById error:", err);
        return null;
    }
};

// ✅ Get latest 50 logs
export const getJobLogs = async () => {
    try {
        const res = await axiosInstance.get("/Jobs/logs?count=50");
        return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
        console.error("getJobLogs error:", err);
        return [];
    }
};

// ✅ Get filtered logs (success/fail)
export const getFilteredJobLogs = async (isSuccess) => {
    try {
        const res = await axiosInstance.get(`/Jobs/logs/filter?isSuccess=${isSuccess}`);
        return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
        console.error("getFilteredJobLogs error:", err);
        return [];
    }
};

// ✅ Get job list
export const getJobsList = async () => {
    try {
        const res = await axiosInstance.get("/Jobs/list");
        return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
        console.error("getJobsList error:", err);
        return [];
    }
};
