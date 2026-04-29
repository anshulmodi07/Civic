import api from "./axios";

export const getCitizenDashboard = async () => {
  const res = await api.get("/complaints/my");
  return res.data;
};

