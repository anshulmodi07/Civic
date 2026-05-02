import api from "./axios";

export const getAvailableTasks = async () => {
  const res = await api.get("/tasks/available");
  return res.data;
};

export const getMyTasks = async () => {
  const res = await api.get("/tasks/my");
  return res.data;
};

export const acceptTask = async (complaintId) => {
  const res = await api.post(`/tasks/${complaintId}/accept`);
  return res.data;
};

export const startTask = async (taskId) => {
  const res = await api.post(`/tasks/${taskId}/start`);
  return res.data;
};

export const completeTask = async (taskId, proofImages) => {
  const res = await api.post(`/tasks/${taskId}/complete`, { proofImages });
  return res.data;
};

export const markIncomplete = async (taskId, comment) => {
  const res = await api.post(`/tasks/${taskId}/incomplete`, { comment });
  return res.data;
};

export const reviveTask = async (taskId) => {
  const res = await api.post(`/tasks/${taskId}/revive`);
  return res.data;
};