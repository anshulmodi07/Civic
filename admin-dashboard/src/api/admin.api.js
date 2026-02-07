import api from "./axios";

export const getDashboardStats = () => {
  return api.get("/admin/dashboard/stats");
};

export const getAuditLogs = () => {
  return api.get("/admin/audit/logs");
};
