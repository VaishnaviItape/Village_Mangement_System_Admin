// import axiosInstance from "./axiosInstance";

// export const getClients = () => axiosInstance.get("/Clients");
// export const getClientById = (id) => axiosInstance.get(`/Clients/${id}`);
// export const addClient = (data) => axiosInstance.post("/Clients", data);
// export const updateClient = (id, data) => axiosInstance.put(`/Clients/${id}`, data);
// export const deleteClient = (id) => axiosInstance.delete(`/Clients/${id}`);
// export const toggleClientStatus = (id, currentStatus) =>
//   updateClient(id, { isActive: !currentStatus });


import axiosInstance from "./axiosInstance";

// ✅ Safe getClients
export const getClients = async () => {
  try {
    const response = await axiosInstance.get("/Users");
    if (Array.isArray(response.data)) return response.data;
    if (response.data && typeof response.data === "object") return Object.values(response.data);
    return [];
  } catch (err) {
    console.error("getClients error:", err);
    return [];
  }
};

export const getRoles = async () => {
  try {
    const response = await axiosInstance.get("/Roles");

    // If API returns an array
    if (Array.isArray(response.data)) return response.data;

    // If API returns an object → convert to array
    if (response.data && typeof response.data === "object")
      return Object.values(response.data);

    return [];
  } catch (err) {
    console.error("getRoles error:", err);
    return [];
  }
};
export const getClientById = async (id) => {
  const response = await axiosInstance.get(`/Users/${id}`);
  return response.data; // single object
};

export const addClient = async (data) => {
  const response = await axiosInstance.post("/Users", data);
  return response.data;
};

export const updateClient = async (id, data) => {
  const response = await axiosInstance.put(`/Users/${id}`, data);
  return response.data;
};

export const deleteClient = async (id) => {
  const response = await axiosInstance.delete(`/Users/${id}`);
  return response.data;
};

export const toggleClientStatus = async (id, currentStatus) =>
  updateClient(id, { isActive: !currentStatus });
