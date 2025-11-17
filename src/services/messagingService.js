// services/messagingService.js
import axiosInstance from "./axiosInstance";

// === Conversations ===
export const getMyConversations = () => axiosInstance.get("/Messaging/my-conversations");

export const getConversationMessages = (conversationId) =>
  axiosInstance.get(`/messaging/conversations/${conversationId}/messages`);

export const sendMessageApi = (conversationId, body) =>
  axiosInstance.post(`/messaging/conversations/${conversationId}/messages`, body);

export const answerQuestionApi  = (questionId, answerBody) =>
  axiosInstance.post(`/messaging/questions/${questionId}/answers`, answerBody);

export const markMessageAsReadApi = (messageId) =>
  axiosInstance.patch(`/Messaging/${messageId}/read`, {});

// === Create Conversation ===
export const createConversationApi = (payload) =>
  axiosInstance.post("/messaging/conversations", payload);

// === Users / Teams ===
export const getAllUsers = () => axiosInstance.get("/users");
export const getMyTeam = () => axiosInstance.get("/auth/my-team?includeSubTeams=true");
