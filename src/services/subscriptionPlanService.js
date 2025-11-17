import axiosInstance from "./axiosInstance";

export const getSubscriptionPlans = async () => {
  try {
    const response = await axiosInstance.get("/SubscriptionPlans");
    // API response data एरे है या नहीं चेक करना जरूरी है
    if (Array.isArray(response.data)) return response.data;
    if (response.data && typeof response.data === "object") return Object.values(response.data);
    return [];
  } catch (err) {
    console.error("getSubscriptionPlans error:", err);
    return [];
  }
};
export const addSubscriptionPlan = (data) => axiosInstance.post("/SubscriptionPlans", data);
export const updateSubscriptionPlan = (id, data) => axiosInstance.put(`/SubscriptionPlans/${id}`, data);
export const deleteSubscriptionPlan = (id) => axiosInstance.delete(`/SubscriptionPlans/${id}`);
