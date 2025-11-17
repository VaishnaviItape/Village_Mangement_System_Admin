import axiosInstance from "./axiosInstance";

// 📦 Expenses API Service
export const getExpenses = () => axiosInstance.get("/Expense");

export const addExpense = (data) => axiosInstance.post("/Expense", data);

export const updateExpense = (id, data) => axiosInstance.put(`/Expense/${id}`, data);

export const deleteExpense = (id) => axiosInstance.delete(`/Expense/${id}`);
export const getExpenseDocuments = async (expenseId) => {
    const res = await axiosInstance.get(`/Attachments/${expenseId}/Expense`);
    return res.data; // directly return array
};
