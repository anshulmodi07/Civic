import api from "./axios";

export const getMyProfile = async () => {
  const res = await api.get("/workers/me");
  return res.data;
};

export const getWorkerStats = async () => {
  const res = await api.get("/workers/stats");
  return res.data;
};

export const getTodayShift = async () => {
  const res = await api.get("/workers/today-shift");
  return res.data;
};
